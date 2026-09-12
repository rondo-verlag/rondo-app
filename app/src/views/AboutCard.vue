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
      <div class="about-container">
        <h1>Über das Rondo</h1>

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

        <h4>App & Software:</h4>
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
      </div>
      <div class="ion-padding"></div>
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
import BrowserLink from "@/views/BrowserLink.vue";

export default defineComponent({
  name: 'AboutCard',
  components: {
    IonContent,
    IonHeader,
    IonPage,
    IonToolbar,
    IonButtons,
    IonButton,
    Browserlink: BrowserLink,
  },
  inject: ['appVersion'],
})
</script>

<style scoped lang="scss">
.about-container {
  padding: 20px 10px;
  line-height: 20px;
}

a {
  color: darkorange;
  text-decoration: none;
}
</style>
