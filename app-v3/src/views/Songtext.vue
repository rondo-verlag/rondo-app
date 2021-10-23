<template>
  <div class="songtext">
    <img :src="require('@/assets/songdata/songs/images/'+song.id+'.gif')" class="song-image">
    <div class="ion-padding">
      <h3 class="song-title">{{song.title}}</h3>
      <div class="page-numbers">
        <span v-html="pageNumbers"></span>
      </div>
      <div class="song-html">
        <div v-html="html"></div>
        <br>
        <div class="copyright" v-if="song.license">{{song.license}}</div>
        <div class="report-error-link">
          &mdash;<br>
          <browserlink url="mailto:app@rondo-verlag.ch?subject=Feedback zum Lied {{song.title}} (Rondo App {{appVersion}})">
            Fehler gefunden?
          </browserlink>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Browserlink from "@/views/Browserlink.vue";

export default defineComponent({
  name: 'Songtext',
  components: { Browserlink },
  props: {
    song: Object
  },
  data() {
    return {
      html: null,
      appVersion: 'dev' // TODO
    }
  },
  computed: {
    pageNumbers(): string {
      let pages = [];
      if (this.song.pageRondo2017) {
          pages.push('<span class="rondo-orange">' + this.song.pageRondo2017 + '</span>');
      }
      if (this.song.pageRondoGreen) {
          pages.push('<span class="rondo-green">' + this.song.pageRondoGreen + '</span>');
      }
      if (this.song.pageRondoBlue) {
          pages.push('<span class="rondo-blue">' + this.song.pageRondoBlue + '</span>');
      }
      if (this.song.pageRondoRed) {
          pages.push('<span class="rondo-red">' + this.song.pageRondoRed + '</span>');
      }
      return pages.join('&nbsp;|&nbsp;')
    }
  },
  mounted: function() {
    fetch('/assets/songdata/songs/html/' + this.song.id + '.html')
      .then(response => response.text())
      .then(data => this.html = data);
  }
});
</script>

<style lang="scss">

.songtext {
  .page-numbers {
    line-height: 32px;
    font-size: 110%;
    color: white;
    span {
      margin: 0 !important;
    }
    .rondo-red {
      color: red;
    }
    .rondo-blue {
      color: #0099ff;
    }
    .rondo-green {
      color: #99FF99;
    }
    .rondo-orange {
      color: darkorange;
    }
  }

  .rondo-play-button {
    text-align: right;
    margin-top: -6px;
    i {
      font-size: 28px;
    }
  }

  .song-html {
    margin-top: 16px;
    font-size: 1.3em;
    letter-spacing: 1px;
    .line {
      line-height: 2.2em;
      .word {
        float: left;
        height: 1.5em;
      }
      .bl {
        float: left;
        height: 1.5em;
      }
    }
    .chord,
    .empty-chord {
      height: 0;
      overflow: hidden;
      display: block;
      width: 0;
      white-space: nowrap;
    }
    .chord ~ .empty-chord {
      display: none;
    }
    .paragraph {
      padding-bottom: 2.5em;
      overflow: hidden;
    }
    .p_chorus {
      font-style: italic;
    }
    .comment {
      white-space: pre;
      color: #BBB
    }
  }

  .copyright {
    font-size: 60%;
    color: #444;
    white-space: pre-wrap;
  }

  .report-error-link {
    color: #444;
    a {
      color: #444;
      text-decoration: none;
      font-size: 60%;
    }
  }
}

.rondo-show-chords {
  .songtext {
    .chord,
    .empty-chord {
      height: 1.2em;
      overflow: visible;
      width: auto;
    }

    .song-html {
      color: #999;

      .line {
      .word,
      .bl {
          height: 2.5em;
        }
      }

      .chord {
        color: #FFF;
      }

      .paragraph {
        padding-bottom: 3.5em;
      }
    }
  }
}
</style>
