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
      <div class="container">
        <h1>Songeinstellungen</h1>

        <div class="settings-section">
          <div class="section-title">Automatische Scroll-Geschwindigkeit</div>

          <div class="scroll-speed-container">
            <div class="scroll-speed-control">
              <input
                type="range"
                class="speed-slider"
                :min="minSpeed"
                :max="maxSpeed"
                step="1"
                v-model.number="scrollSpeed"
              />
              <input
                type="number"
                class="speed-input"
                :min="minSpeed"
                :max="maxSpeed"
                step="1"
                v-model.number="scrollSpeed"
              />
            </div>
            <div class="speed-hints">
              <span>Langsam</span>
              <span>Schnell</span>
            </div>
          </div>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonToolbar,
  IonButton,
  IonButtons,
} from '@ionic/vue';
import AppState, { MIN_SCROLL_SPEED, MAX_SCROLL_SPEED } from '@/AppState';

const minSpeed = MIN_SCROLL_SPEED;
const maxSpeed = MAX_SCROLL_SPEED;

const scrollSpeed = computed({
  get: () => AppState.scrollSpeed,
  set: (val: number) => AppState.setScrollSpeed(val),
});
</script>

<style scoped lang="scss">
.container h1 {
  font-size: 24px;
  margin-top: 0;
  margin-bottom: 24px;
}

.settings-section {
  margin-bottom: 24px;

  .section-title {
    font-size: 14px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    color: var(--rondo-menu-footer-text, #888888);
    margin-bottom: 12px;
  }
}


.scroll-speed-container {
  display: flex;
  flex-direction: column;
}

.scroll-speed-control {
  display: flex;
  align-items: center;
  gap: 16px;
  background: var(--rondo-menu-card-bg, #1c1c1e);
  border: 1px solid var(--rondo-menu-card-border, #2c2c2e);
  border-radius: 12px;
  padding: 10px 16px;
}

.speed-slider {
  flex: 1;
  accent-color: darkorange;
  cursor: pointer;
  height: 6px;
}

.speed-input {
  width: 52px;
  padding: 8px 4px;
  font-size: 16px;
  font-weight: 600;
  text-align: center;
  border-radius: 8px;
  border: 1px solid var(--rondo-menu-card-border, #2c2c2e);
  background: var(--rondo-card-bg, #2c2c2e);
  color: var(--rondo-menu-item-text, #ffffff);
  outline: none;
  -moz-appearance: textfield;

  &:focus {
    border-color: darkorange;
  }

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
}

.speed-hints {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: var(--rondo-menu-footer-text, #888888);
  margin-top: 6px;
  padding: 0 4px;
}
</style>
