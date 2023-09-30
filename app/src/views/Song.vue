<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button @click="goBack()" class="rondo-back-button">
            <i class="icon rondo-icon-arrow"></i>
          </ion-button>
        </ion-buttons>
        <ion-buttons slot="end" class="rondo-header-buttons-right" v-if="section === 'text'">
          <ion-button ion-button :href="currentSong.links.youtube" v-if="currentSong.links.youtube">
            <i>YT</i>
          </ion-button>
          <ion-button ion-button @click="toggleChords()">
            <i class="icon rondo-icon-show-chord"></i>
          </ion-button>
          <ion-button ion-button @click="startAutoScroll()" v-if="!isScrolling">
            <i class="icon rondo-icon-scroll"></i>
          </ion-button>
          <ion-button ion-button @click="stopAutoScroll()" v-if="isScrolling">
            <i class="icon rondo-icon-scroll icon--active"></i>
          </ion-button>
        </ion-buttons>
        <ion-buttons slot="end" class="rondo-header-buttons-right" v-if="section === 'notes'">
          <ion-button ion-button @click="startSong()" v-if="!isPlaying">
            <i class="icon rondo-icon-listen"></i>
          </ion-button>
          <ion-button ion-button @click="stopSong()" v-if="isPlaying">
            <i class="icon rondo-icon-listen icon--active"></i>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" v-show="section === 'text'">
      <div class="content-wrapper" :class="'orientation--' + orientation">
        <swiper
          :slides-per-view="1"
          :space-between="0"
          :initial-slide="initialIndex"
          @slideChange="slideChanged"
          @swiper="setSwiperInstance"
          :width="windowWidth"
          :virtual="true"
        >
          <swiper-slide v-for="(song, index) in songs" :key="song" :virtualIndex="index">
            <ScrollableContent @click="exitFullscreen()" :class="{'scrolling': isScrolling}" @onScrollUp="scrollUp()" @onScrollDown="scrollDown()">
              <Songtext :song="song"></Songtext>
              <br>
            </ScrollableContent>
          </swiper-slide>
        </swiper>
      </div>
    </ion-content>

    <ion-content :fullscreen="true" v-if="section === 'chords'" :class="'orientation--' + orientation">
      <div class="chord-list">
        <template v-for="chord in currentSong.chords" :key="chord">
          <i :class="'rondo-icon-chord-' + chord.replace('+','plus')" @click="playChord(chord)"></i>
        </template>
      </div>
    </ion-content>

    <ion-content :fullscreen="true" v-if="section === 'notes'" class="notes-page" :class="'orientation--' + orientation">
      <img id="page" :src="require('../../public/assets/songdata/songs/notes/'+currentSong.id+'.jpg')" />
    </ion-content>

    <ion-footer>
      <ion-toolbar>
        <div class="rondo-tabs">
          <span @click="section='text'" :class="{'rondo-tab--selected': section === 'text'}"><i class="rondo-icon-text"></i></span>
          <span @click="section='chords'" :class="{'rondo-tab--selected': section === 'chords'}"><i class="rondo-icon-chords"></i></span>
          <span @click="section='notes'" :class="{'rondo-tab--selected': section === 'notes'}"><i class="rondo-icon-notes"></i></span>
        </div>
      </ion-toolbar>
    </ion-footer>
  </ion-page>
</template>

<script lang="ts">
import {
  IonContent,
  IonHeader,
  IonIcon,
  IonPage,
  IonToolbar,
  IonList,
  IonItem,
  IonListHeader,
  IonButton,
  IonButtons,
  IonFooter,
  useBackButton
} from '@ionic/vue';
import { defineComponent } from 'vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import songdata from '../../public/assets/songdata/songs/song-index.json';
import { Insomnia } from '@ionic-native/insomnia';
import { isPlatform } from '@ionic/vue';

import 'swiper/swiper-bundle.min.css';
import 'swiper/swiper.scss';
import ISong from '@/interfaces/ISong';

import SwiperCore, { Virtual, Swiper as SwiperInstance } from 'swiper';
import AppState from "@/AppState";
import Songtext from "@/views/Songtext.vue";
import ScrollableContent from "@/views/ScrollableContent.vue";
import { StatusBar } from '@capacitor/status-bar';

import MidiPlayer from 'web-midi-player';
import { App } from "@capacitor/app";

SwiperCore.use([Virtual]);

export default defineComponent({
  name: 'Song',
  components: {
    ScrollableContent,
    Songtext,
    IonContent,
    IonHeader,
    IonPage,
    IonToolbar,
    IonIcon,
    IonList,
    IonItem,
    IonListHeader,
    IonButtons,
    IonButton,
    IonFooter,
    Swiper,
    SwiperSlide,
  },
  data(): {
    swiperInstance: SwiperInstance;
    section: string;
    isPlaying: boolean;
    scrollElement: Element | null;
    isScrolling: boolean;
    scrollTimer: number | null;
    lastScrollPosition: number;
    sameLastScrollPositionCounter: number;
    autoScrollInQueue: boolean;
    currentSongId: number;
    initialIndex: number;
    playingChord: HTMLAudioElement | null;
    midiPlayer: any;
    windowWidth: number;
    orientation: 'portrait' | 'landscape';
  } {
    return {
      swiperInstance: null,
      section: 'text',
      isPlaying: false,
      scrollElement: null,
      isScrolling: false,
      scrollTimer: null,
      lastScrollPosition: -1,
      sameLastScrollPositionCounter: 0,
      autoScrollInQueue: false,
      currentSongId: 0,
      initialIndex: 0,
      playingChord: null,
      midiPlayer: null,
      windowWidth: 0,
      orientation: 'portrait',
    }
  },
  setup() {
    useBackButton(10, () => {
      console.log('Suppress default back button event');
    });
  },
  computed: {
    hasBought(): boolean {
      return AppState.hasBought;
    },
    songs(): ISong[] {
      if (this.hasBought) {
        return (songdata.list || []).filter((song) => !song.alternative);
      } else {
        return (songdata.list || []).filter((song) => !song.alternative && song.free);
      }
    },
    currentSong(): ISong {
      return this.songs.find((song: ISong) => song.id == this.currentSongId);
    },
  },
  mounted() {
    this.section = 'text';
    this.windowWidth = window.innerWidth;
    this.currentSongId = parseInt(this.$route.params.id as string);
    this.initialIndex = this.songs.findIndex((song: ISong) => song.id == this.currentSongId);
    if (this.swiperInstance) {
      this.swiperInstance.slideTo(this.initialIndex, 0);
    }

    App.addListener('backButton', async () => {
      this.goBack();
    })

    // stop song if user closes app
    App.addListener('appStateChange', ({ isActive }) => {
      if (!isActive) {
        this.stopSong();
        this.stopChords();
        App.removeAllListeners();
      }
    });

    // handle screen rotations
    window.addEventListener('orientationchange', this.orientationChanged);
    this.orientationChanged();
  },
  unmounted() {
    if (this.playingChord) {
      this.playingChord.pause();
      this.playingChord = null;
    }
    if (this.isScrolling) {
        Insomnia.allowSleepAgain();
        this.exitFullscreen();
    }
    this.stopSong();
    this.stopChords();
    this.exitFullscreen();
    window.removeEventListener('orientationchange', this.orientationChanged);
  },
  methods: {
    orientationChanged: function() {
      if (screen.orientation.type === 'landscape-primary' || screen.orientation.type === 'landscape-secondary') {
        this.orientation = 'landscape';
      } else {
        this.orientation = 'portrait';
      }
      this.windowWidth = window.innerWidth;
      setTimeout(() => {
        this.windowWidth = window.innerWidth;
      }, 10)
      setTimeout(() => {
        this.windowWidth = window.innerWidth;
      }, 500)
    },
    slideChanged: function() {
      if (this.swiperInstance) {
        if (this.songs[this.swiperInstance.realIndex]) {
          this.currentSongId = this.songs[this.swiperInstance.realIndex].id;
        }
        this.stopAutoScroll();
        this.stopSong();
      }
    },
    setSwiperInstance: function (swiper: any) {
      this.swiperInstance = swiper;
    },
    toggleChords: function() {
        if (this.section == 'text') {
            document.body.classList.toggle('rondo-show-chords');
        }
    },
    goBack: async function () {
        if (this.section === 'text') {
            await App.removeAllListeners();
            this.$router.back();
        } else {
            this.section = 'text'
        }
    },

    // Scrolling
    scrollUp: function() {
        this.exitFullscreen();
    },
    scrollDown: function() {
        this.enterFullscreen();
    },
    getScrollPosition: function() {
        if (this.scrollElement) {
            return this.scrollElement.scrollTop;
        } else {
            return 0;
        }
    },
    scrollBy: function(y: number) {
        if (this.scrollElement) {
            this.scrollElement.scrollTop = this.getScrollPosition() + y;
        }
    },
    getScrollTimeout: function() {
        if (document.body.classList.contains('rondo-show-chords')) {
            return 40
        } else {
            return 80;
        }
    },
    startAutoScroll: function() {
        if (this.section != 'text') {
            return;
        }
        Insomnia.keepAwake();
        this.enterFullscreen();
        this.isScrolling = true;
        this.sameLastScrollPositionCounter = 10;
        this.scrollElement = document.querySelector('.swiper-slide-active .scrollable');
        this.scrollTimer = setInterval(() => {
            if (this.sameLastScrollPositionCounter <= 0) {
                this.stopAutoScroll();
            } else {
                if (this.lastScrollPosition == this.getScrollPosition()) {
                    this.sameLastScrollPositionCounter--;
                } else {
                    this.sameLastScrollPositionCounter = 10;
                }
                this.lastScrollPosition = this.getScrollPosition();
                this.autoScrollInQueue = true;
                this.scrollBy(1);
            }
        }, this.getScrollTimeout());
    },
    stopAutoScroll: function() {
        Insomnia.allowSleepAgain();
        this.isScrolling = false;
        clearInterval(this.scrollTimer);
        this.lastScrollPosition = -1;
        this.exitFullscreen();
    },
    exitFullscreen: function() {
        document.body.classList.remove('rondo-fullscreen');
        if (isPlatform('ios')) {
          // only for ios, there is a bug in android
          StatusBar.show();
        }
    },
    enterFullscreen: function() {
        document.body.classList.add('rondo-fullscreen');
        if (isPlatform('ios')) {
          // only for ios, there is a bug in android
          StatusBar.hide();
        }
    },

    // Playback
    playChord: function(chord: string) {
      this.stopChords();
      this.playingChord = new Audio('assets/songdata/mp3-chords/' + chord + '.mp3');
      this.playingChord.play();
    },
    stopChords: function () {
      if (this.playingChord) {
        this.playingChord.pause();
      }
    },
    startSong: function() {
      this.stopSong();
      this.midiPlayer = new MidiPlayer({ patchUrl: '/assets/midi-patches/' });
      this.midiPlayer.play({ url: '/assets/songdata/songs/midi/' + this.currentSongId + '.mid' });
      this.isPlaying = true;
      const eventLogger = (payload: any) => {
        if (payload.event === 'MIDI_END') {
          this.stopSong();
        }
      }
      this.midiPlayer.setLogger({ eventLogger });
    },
    stopSong: function() {
      if (this.midiPlayer !== null) {
        this.midiPlayer.stop();
        this.midiPlayer = null;
      }
      this.isPlaying = false;
    },
  }
});
</script>

<style lang="scss">

ion-header {
  top: 0;
  -webkit-transition: top 0.5s;
  transition: top 0.5s;
}

ion-footer {
  bottom: 0;
  -webkit-transition: bottom 0.5s;
  transition: bottom 0.5s;
}

.rondo-header-buttons-right i.icon {
  font-size: 28px;
}

.rondo-tabs {
  color: white;
  display: -webkit-box;
  display: flex;
  justify-content: space-evenly;
  -webkit-justify-content: space-around;

  i {
    font-size: 28px;
  }
}

.rondo-tab--selected {
  i {
    color: darkorange;
  }
}

.content-wrapper {
  height: 100%;
  top: 0;
  position: absolute;
}

.swiper-container {
  height: 100%;
}
.swiper-slide {
  background: #000;
  color: white;
}

.notes-page {
  --background: white;
}

// -- classes outside of page

.rondo-fullscreen {
  ion-header {
    top: -100px;
  }

  ion-footer {
    bottom: -100px;
  }
}

.rondo-show-chords .rondo-header-buttons-right .icon.rondo-icon-show-chord {
  color: darkorange !important;
}

.chord-list {
  font-size: 35vw;
  padding-top: 20px;

  i {
    width: 33%;
    display: inline-block;
    text-align: center;
  }
}

.orientation--landscape .chord-list {
  font-size: 24vw;
  i {
    width: 20%;
  }
}

</style>
