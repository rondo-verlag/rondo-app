<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button @click="$router.back()" class="rondo-back-button">
            <i class="icon rondo-icon-arrow"></i>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <swiper
      :slides-per-view="1"
      :space-between="0"
      :initial-slide="2"
      @slideChange="slideChanged"
      @swiper="setSwiperInstance"
      :width="windowWidth"
      :virtual="true"
    >
      <swiper-slide v-for="(song, index) in songs" :key="song" :virtualIndex="index">
        <img :src="require('@/assets/songdata/songs/images/'+song.id+'.gif')">
        Slide {{index}}<br> {{song.title}}
      </swiper-slide>
    </swiper>
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
  IonButtons
} from '@ionic/vue';
import { defineComponent } from 'vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import songdata from '../assets/songdata/songs/song-index.json';

import 'swiper/swiper-bundle.min.css';
import 'swiper/swiper.scss';
import ISong from '@/interfaces/ISong';

import SwiperCore, { Virtual } from 'swiper';
import AppState from "@/AppState";

SwiperCore.use([Virtual]);

export default defineComponent({
  name: 'Song',
  components: {
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
    Swiper,
    SwiperSlide,
  },
  data() {
    return {
      swiperInstance: null
    }
  },
  computed: {
    hasBought(): boolean {
      return AppState.hasBought;
    },
    windowWidth() {
      return window.innerWidth;
    },
    songs(): ISong[] {
      if (this.hasBought) {
        return (songdata.list || []).filter((song) => !song.alternative);
      } else {
        return (songdata.list || []).filter((song) => !song.alternative && song.free);
      }
    },
  },
  methods: {
    slideChanged: function() {
      if (this.swiperInstance) {
        //this.stopAutoScroll();
        //this.midiPlayer.stopSong();
      }
    },
    setSwiperInstance: function (swiper: any) {
      this.swiperInstance = swiper;
    }
  }
});
</script>

<style lang="scss">
.swiper-container {
  height: 100%;
}
.swiper-slide {
  background: #000;
  text-align: center;
  font-size: 30px;
  color: #999;
}
</style>
