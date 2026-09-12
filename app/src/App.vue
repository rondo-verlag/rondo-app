<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
</template>

<script setup lang="ts">
import { IonApp, IonRouterOutlet, toastController, useBackButton, useIonRouter } from '@ionic/vue';
import { App } from '@capacitor/app';

const ionRouter = useIonRouter();
let lastBackPress = 0;

useBackButton(-1, async () => {
  if (!ionRouter.canGoBack()) {
    const now = Date.now();
    if (now - lastBackPress < 2000) {
      await App.exitApp();
    } else {
      lastBackPress = now;
      const toast = await toastController.create({
        message: 'Zum Beenden noch einmal tippen',
        duration: 2000,
        position: 'bottom',
      });
      await toast.present();
    }
  }
});
</script>
