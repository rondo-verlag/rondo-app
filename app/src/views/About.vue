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

    <ion-content :fullscreen="true">
      <div style="background: #ffffff">
        <img src="assets/songdata/images/about.png" style="width: 100%" />
      </div>
      <div class="about-container">
        <b>Das Rondo immer und überall dabei</b><br />
        <div v-if="!hasBought">
          <br />
          In der kostenlosen Version sind nur lizenzfreie Lieder enthalten. Lizenzpflichtige Lieder können via In-App-Kauf dazugekauft werden.<br />
          <br />
          <span @click="buyFullversion()" class="rondo-buy-button">Vollversion kaufen für 5.-</span><br>
          oder <a @click="restorePurchases()">Kauf wiederherstellen</a><br><br>
        </div>
        <div v-else>
          <br />
          Vielen Dank, dass du die Vollversion gekauft hast. Wir wünschen dir viel Spass beim Singen!<br />
          <br />
        </div>

        &mdash;<br />
        Der Rondo Verlag gibt seit den 1980er-Jahren das Schweizer Pfadi-Liederbuch &laquo;Rondo&raquo; heraus, das inzwischen in mehreren Auflagen und nun als App vorliegt. Daneben unterstützt der Verein Projekte, die Musik von und mit Jugendlichen fördern, eine Breitenwirkung entfalten und den Grundsätzen der Pfadi entsprechen.

        <br />
        <br />
        <browserlink url="https://www.rondo-verlag.ch/">rondo-verlag.ch</browserlink><br />
        <br />
        <browserlink url="https://www.facebook.com/rondoverlag">facebook.com/rondoverlag</browserlink><br />
        <br />
        <browserlink url="https://www.instagram.com/rondoverlag">instagram.com/rondoverlag</browserlink><br />
        <br />
        <browserlink url="https://www.hajk.ch/de/catalogsearch/result/?q=Rondo%20Liederbuch">Rondo Liederbuch kaufen (Hajk)</browserlink><br />
        <br />

        Fragen, Wünsche, Lob oder Kritik zur App sind unter
        <browserlink :url="'mailto:app@rondo-verlag.ch?subject=Rondo App ' + appVersion + ' Feedback'">app@rondo-verlag.ch</browserlink>
        allzeit willkommen.

        <br />
        <br />
        &mdash;<br />
        <h2>Team Rondo:</h2>
        <h4>Projektleitung:</h4>
        <b>Tristan / Raymond Wiedmer</b><br />
        <br />

        <h4>Musikalisches:</h4>
        <b>Linus / Roland Brunschweiler</b><br />
        Tschaggon / Gabriel Jetter<br />
        Google / Lars Fischer<br />
        Neura / Laura Münst<br />
        Gaia / Sophie Reist<br />
        <br />

        <h4>Texte:</h4>
        <b>Zazu / Timon Mötteli</b><br />
        <br />

        <h4>Copyrights:</h4>
        <b>Tristan / Raymond Wiedmer</b><br />
        Tetris / Martin Eliasson<br />
        <br />

        <h4>Gestaltung:</h4>
        <b>Neytiri / Tamara Heger</b><br />
        Alupa / Eva Brunschweiler<br />
        <br />

        <h4>Layout:</h4>
        <b>Marabu / Irene Stutz</b><br />
        Aramis / Liam Wirz<br />
        <br />

        <h4>App:</h4>
        <b>Fäger / Demian Holderegger</b><br />
        Vento / Caspar Brenneisen<br />
        Rondo / Valerio Thrier<br />

        <br />
        Gestaltung: Marabu, Signito GmbH<br />
        Produktion: Fäger, uSystems GmbH<br />
        <br />

        Den Gestalterinnen und Gestaltern der einzelnen Seiten danken wir herzlich! <br />
        <br />

        Akkorde Sounds mit freundlicher Genehmigung von Burkhard Mikolai<br />
        <browserlink url="http://www.bunte-noten.de">www.bunte-noten.de</browserlink>

        <br />
        <br />
        &mdash;<br />
        &copy; Zürich 1992 - 2024 Verein Rondo Verlag. Alle Rechte vorbehalten. <br />
        APP Version {{appVersion}}
        <br />

<!--        <div>-->
<!--          <br>-->
<!--          <b>DEBUG:</b><br>-->
<!--          <a @click="hasBought = !hasBought">gekauft: {{hasBought}}</a>-->
<!--          <br><br>-->
<!--        </div>-->
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonToolbar
} from '@ionic/vue';
import { defineComponent } from 'vue';
import AppState from "@/AppState";
import Browserlink from "@/views/Browserlink.vue";
import { App } from "@capacitor/app";
import PurchaseService from "@/services/purchase.service";

export default defineComponent({
  name: 'About',
  components: {
    IonContent,
    IonHeader,
    IonPage,
    IonToolbar,
    IonButtons,
    IonButton,
    Browserlink,
  },
  inject: ['appVersion'],
  computed: {
    hasBought: {
      get(): boolean {
        return AppState.hasBought;
      },
      set(val: boolean): void {
        AppState.setHasBought(val);
      }
    }
  },
  mounted() {
    App.addListener('backButton', async () => {
      await App.removeAllListeners();
      this.$router.back();
    })
  },
  methods: {
    buyFullversion() {
      PurchaseService.buy()
    },
    restorePurchases() {
      PurchaseService.restore()
    }
  }
});
</script>

<style scoped>
.about-container {
  padding: 20px 10px;
  line-height: 20px;
}

.rondo-buy-button {
  background: darkorange;
  color: white;
  padding: 12px;
  border-radius: 5px;
  display: inline-block;
  margin: 12px 0;
  font-weight: bold;
}

a {
  color: darkorange;
  text-decoration: none;
}
</style>
