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
      <div style="background: #fff">
        <img src="/assets/songdata/images/about.png" style="width: 100%" />
      </div>

      <br />
      <br />

      <div class="">
        <h3>Vollversion freischalten   >>></h3>
      </div>

      <br />
      <br />

      <div class="">
        <h3>Anzeigeeinstellungen   >>></h3>
      </div>

      <br />
      <br />

      <div class="">
        <h3>Songeinstellungen   >>></h3>
      </div>

      <br />
      <br />

      <div class="">
        <h3>Über das Rondo   >>></h3>
      </div>

      <br />
      <br />
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
  IonToolbar,
} from '@ionic/vue';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'MenuList',
  components: {
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonPage,
    IonToolbar,
  }
})
</script>

<style scoped lang="scss">

</style>
