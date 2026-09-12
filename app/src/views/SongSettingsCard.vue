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
                min="1"
                max="50"
                step="1"
                :value="autoScrollSpeed"
                @input="onSliderChange"
                class="speed-slider"
                aria-label="Scroll-Geschwindigkeit"
              />
              <input
                type="number"
                min="1"
                max="50"
                step="1"
                :value="autoScrollSpeed"
                @input="onInputChange"
                @blur="onInputBlur"
                class="speed-input"
                aria-label="Scroll-Geschwindigkeit Wert"
              />
            </div>
            <div class="speed-hints">
              <span>Langsam (1)</span>
              <span>Schnell (50)</span>
            </div>
          </div>
        </div>
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
  IonToolbar,
} from '@ionic/vue';
import { defineComponent } from 'vue';
import AppState from '@/AppState';

export default defineComponent({
  name: 'SongSettingsCard',
  components: {
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonPage,
    IonToolbar,
  },
  computed: {
    autoScrollSpeed(): number {
      return AppState.autoScrollSpeed;
    },
  },
  methods: {
    onSliderChange(event: Event) {
      const target = event.target as HTMLInputElement;
      const val = parseInt(target.value, 10);
      if (!isNaN(val)) {
        AppState.setAutoScrollSpeed(val);
      }
    },
    onInputChange(event: Event) {
      const target = event.target as HTMLInputElement;
      const val = parseInt(target.value, 10);
      if (!isNaN(val)) {
        const clamped = Math.min(10, Math.max(1, val));
        AppState.setAutoScrollSpeed(clamped);
      }
    },
    onInputBlur(event: Event) {
      const target = event.target as HTMLInputElement;
      const val = parseInt(target.value, 10);
      if (isNaN(val) || val < 1 || val > 50) {
        target.value = this.autoScrollSpeed.toString();
      } else {
        const clamped = Math.min(50, Math.max(1, val));
        target.value = clamped.toString();
        AppState.setAutoScrollSpeed(clamped);
      }
    }
  }
})
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
