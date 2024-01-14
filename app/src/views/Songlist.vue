<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <div class="rondo-bar-search">
          <label class="rondo-bar-search__input">
            <i class="icon rondo-icon-search placeholder-icon"></i>
            <input type="text" v-model="query" placeholder="Suchen..." id="song-search-input" autocorrect="off" autocapitalize="off" />
            <span class="clear-search" v-if="query" @click="clearSearch()">
              <i class="icon rondo-icon-close-circle"></i>
            </span>
          </label>
          <div class="rondo-bar-search__logo">
            <span class="about-icon" @click="$router.push('/about')">
              <i class="rondo-icon-logo"></i>
            </span>
          </div>
        </div>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <div id="container">
        <ion-list class="rondo-list" v-if="hasBought">
          <ion-item v-for="song in filteredAllSongs" :key="song" lines="none" @click="$router.push('/song/' + song.id)">
            <span v-if="!song.alternative" class="main-title">{{song.title}}</span>
            <span v-if="song.alternative" class="alt-title">{{song.title}}</span>
          </ion-item>
        </ion-list>
        <div v-else>
          <ion-list class="rondo-list">
            <ion-item v-for="song in filteredFreeSongs" :key="song" lines="none" @click="$router.push('/song/' + song.id)">
              <span v-if="!song.alternative" class="main-title">{{song.title}}</span>
              <span v-if="song.alternative" class="alt-title">{{song.title}}</span>
            </ion-item>
          </ion-list>
          <ion-list class="rondo-list rondo-list--not-available" v-if="filteredPaidSongs.length > 0">
            <ion-list-header @click="$router.push('/about')">
              In der&nbsp;<a>Vollversion</a>&nbsp;enthalten:
            </ion-list-header>
            <ion-item v-for="song in filteredPaidSongs" :key="song" lines="none">
              <span v-if="!song.alternative" class="main-title">{{song.title}}</span>
              <span v-if="song.alternative" class="alt-title">{{song.title}}</span>
            </ion-item>
          </ion-list>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonList,
  IonListHeader,
  IonPage,
  IonToolbar
} from '@ionic/vue';
import { defineComponent } from 'vue';
import { App } from "@capacitor/app";

import songdata from '../../public/assets/songdata/songs/song-index.json';
import ISong from "@/interfaces/ISong";
import AppState from "@/AppState";

const songFilter = (song: ISong, query: string): boolean => {
  if (query === '') {
    return true
  }

  return (song.title.toLowerCase().includes(query.toLowerCase()) ||
    !song.alternative && (song.interpret.toLowerCase().includes(query.toLowerCase())) ||
    !song.alternative && song.pageRondo2017 == parseInt(query) ||
    !song.alternative && song.pageRondo2021 == parseInt(query) ||
    !song.alternative && song.pageRondoRed == parseInt(query) ||
    !song.alternative && song.pageRondoBlue == parseInt(query) ||
    !song.alternative && song.pageRondoGreen == parseInt(query));
}

export default defineComponent({
  name: 'Home',
  components: {
    IonContent,
    IonHeader,
    IonPage,
    IonToolbar,
    IonIcon,
    IonList,
    IonItem,
    IonListHeader
  },
  data() {
    return {
      query: '',
    }
  },
  computed: {
    hasBought(): boolean {
      return AppState.hasBought;
    },
    allSongs(): ISong[] {
      return songdata.list || [];
    },
    freeSongs(): ISong[] {
      return this.allSongs.filter((song) => song.free);
    },
    paidSongs(): ISong[] {
      return this.allSongs.filter((song) => !song.free);
    },
    filteredAllSongs(): ISong[] {
      return this.allSongs.filter(song => songFilter(song, this.query));
    },
    filteredFreeSongs(): ISong[] {
      return this.freeSongs.filter(song => songFilter(song, this.query));
    },
    filteredPaidSongs(): ISong[] {
      return this.paidSongs.filter(song => songFilter(song, this.query));
    },
  },
  ionViewDidEnter() {
    App.addListener('backButton', () => {
      this.query = '';
      document.getElementById('song-search-input').blur();
    });
  },
  methods: {
    clearSearch() {
      this.query = '';
      setTimeout(() => {
        document.getElementById('song-search-input')!.focus();
      }, 500);
    }
  }
});
</script>

<style scoped lang="scss">
.rondo-bar-search {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .rondo-bar-search__input {
    flex: 1;
    margin-left: 10px;
  }

  .rondo-bar-search__logo {
    width: 50px;
  }

  label {
    background: #4A4A4A;
    border: 0;
    height: 32px;
    display: inline-block;
    border-radius: 5px;

    .placeholder-icon {
      color: #CCC !important;
      font-size: 140%;
      position: absolute;
      margin-top: 5px;
      margin-left: 6px;
    }

    .placeholder-icon:first-child {
      padding-right: 0;
    }

    input {
      color: #FFF;
      letter-spacing: initial;
      width: 100%;
      padding: 5px;
      padding-left: 34px;
      padding-right: 30px;
      font-size: 16px;
      line-height: 22px;
      border: none;
      background: transparent;
      // vectora has a bad baseline, so we use another font for inputs
      font-family: -apple-system, system-ui, Roboto, sans-serif;
    }

    input::-webkit-input-placeholder {
      color: #CCC;
      font-size: 16px;
    }
  }

  .clear-search {
    font-size: 140%;
    position: absolute;
    top: 7px;
    right: 52px;
    display: block;
    height: 32px;
    width: 40px;
    text-align: center;
    padding-top: 5px;
    padding-left: 10px;

    i {
      color: #CCC !important;
    }
  }

  .about-icon {
    display: inline-block;
    padding-left: 10px;
    padding-right: 12px;
    margin-right: -12px;
    color: white;
    position: relative;
    top: 2px;

    i {
      font-size: 220%;
    }
  }
}

.md {
  .rondo-bar-search {
    .clear-search {
      top: 12px;
    }
  }
}

.rondo-list {
  .item {
    border: none;
    font-size: 16px;

    .item-content {
      padding: 8px 16px;
    }
  }

  .alt-title,
  .main-title {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 30px;
  }

  .main-title {
    font-weight: bold;
    letter-spacing: 2px;
  }

  .alt-title {
    letter-spacing: 1px;
  }
}

.rondo-list--not-available {
  ion-list-header {
    color: white;

    a {
      color: darkorange;
      text-decoration: none;
    }
  }

  .alt-title,
  .main-title {
    color: #555;
  }
}
</style>
