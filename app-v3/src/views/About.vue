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
        <img src="assets/songdata/images/about.png" style="width: 100%">
      </div>
      <div class="about-container">
        <b>Das Rondo immer und überall dabei</b><br>
        <div v-if="!hasBought">
          <br>
          In der kostenlosen Version sind nur lizenzfreie Lieder enthalten. Lizenzpflichtige Lieder können via In-App-Kauf dazugekauft werden.<br>
          <span @click="buyFullversion()" class="rondo-buy-button">Vollversion kaufen 5.00</span><br>
          oder <a @click="restorePurchases()">Kauf wiederherstellen</a><br><br>
        </div>
        <div v-else>
          <br>
          Vielen Dank, dass du die Vollversion gekauft hast. Wir wünschen dir viel Spass beim Singen!<br><br>
        </div>

        &mdash;<br>
        Der Rondo Verlag gibt seit den 1980er-Jahren das Schweizer Pfadi-Liederbuch &laquo;Rondo&raquo; heraus, das inzwischen in mehreren Auflagen und nun als App vorliegt. Daneben unterstützt der Verein Projekte, die Musik von und mit Jugendlichen fördern, eine Breitenwirkung entfalten und den Grundsätzen der Pfadi entsprechen.

        <br>
        <br>
        <!--<browserlink url="https://www.facebook.com/rondoverlag">facebook.com/rondoverlag</browserlink><br>
        <br>
        <browserlink url="https://www.hajk.ch/de/catalogsearch/result/?q=Rondo%20Liederbuch">Rondo Liederbuch kaufen (Hajk)</browserlink><br>
        <br>
        -->

        Fragen, Wünsche, Lob oder Kritik zur App sind unter
        <!--<browserlink url="mailto:app@rondo-verlag.ch?subject=Rondo App {{app_version}} Feedback">app@rondo-verlag.ch</browserlink>-->
        allzeit willkommen.

        <br>
        <br>
        &mdash;<br>
        Team Rondo:<br>
        <br>
        Chicco/Fiona Zellweger<br>
        Fabienne Klaas<br>
        Fäger/Demian Holderegger<br>
        Google/Lars Fischer<br>
        Jojo/Alexandra Wyss<br>
        Krokus/Claudia Leuch<br>
        Lemi/Alfred Trechslin<br>
        Lennon/Tobias Tschopp<br>
        Lichee/Nina Boogen<br>
        Marabu/Irene Stutz<br>
        Sancho/Claudio Pietra<br>
        Stitch/Robin Keller<br>
        Tarka/Marie-Janka Stankowski<br>
        <br>
        Gestaltung: Marabu, Signito GmbH<br>
        Produktion: Fäger, uSystems GmbH<br>
        <br>

        Akkorde Sounds mit freundlicher Genehmigung von Burkhard Mikolai<br>
        <!--<browserlink url="http://www.bunte-noten.de">www.bunte-noten.de</browserlink>-->

        <br>
        <br>
        &mdash;<br>
        &copy; 2018 Verein Rondo Verlag. Alle Rechte vorbehalten. Version {{appVersion}}
        <br>

        <!--
        <div>
          <br>
          <b>DEBUG:</b><br>
          <a @click="hasBought = !hasBought">gekauft: {{hasBought}}</a>
          <br><br>
        </div>
        -->
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { IonContent, IonHeader, IonPage, IonToolbar, IonButtons } from '@ionic/vue';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'About',
  components: {
    IonContent,
    IonHeader,
    IonPage,
    IonToolbar,
    IonButtons
  },
  data() {
    return {
      hasBought: false,
      appVersion: 'dev' // TODO
    }
  },
  methods: {
    buyFullversion() {
      // TODO
      this.hasBought = true;
    },
    restorePurchases() {
      // TODO
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
