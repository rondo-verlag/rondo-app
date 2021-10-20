<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <div class="rondo-bar-search">
          <label class="rondo-bar-search__input">
            <i class="icon rondo-icon-search placeholder-icon"></i>
            <input type="text" v-model="query" placeholder="Suchen..." id="song-search-input" autocorrect="off" autocapitalize="off"/>
            <span class="clear-search" v-if="query" @click="clearSearch()">
              <ion-icon name="close-circle"></ion-icon>
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
        <ion-list class="rondo-list">
          <ion-item v-for="song in filteredAllSongs" :key="song" lines="none">
            <span v-if="!song.alternative" class="main-title">{{song.title}}</span>
            <span v-if="song.alternative" class="alt-title">{{song.title}}</span>
          </ion-item>
        </ion-list>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {IonContent, IonHeader, IonIcon, IonPage, IonToolbar, IonList, IonItem } from '@ionic/vue';
import { defineComponent } from 'vue';

import songdata from '../../public/assets/songdata/songs/song-index.json';
import ISong from "@/interfaces/ISong";

const songFilter = (song: ISong, query: string): boolean => {
  if (query === '') {
    return true
  }
  return (song.title.toLowerCase().includes(query.toLowerCase()) ||
        !song.alternative && (song.interpret.toLowerCase().includes(query.toLowerCase())) ||
        !song.alternative && song.pageRondo2017 == parseInt(query) ||
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
    IonItem
  },
  data() {
    return {
      query: ''
    }
  },
  computed: {
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
      color: #CCC;
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
      padding-left: 30px;
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
    color: #CCC;
    font-size: 140%;
    position: absolute;
    top: 7px;
    right: 52px;
    display: block;
    height: 32px;
    width: 40px;
    text-align: center;
    padding-top: 5px;
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

.rondo-list--not-avaliable {
  .list-header {
    color: white;
    a {
      color: darkorange;
      text-decoration: none;
    }
  }

  .item-block {
    color: #555;
  }
}
</style>
