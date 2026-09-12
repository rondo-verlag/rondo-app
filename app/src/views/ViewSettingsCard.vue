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
        <h1>Anzeigeeinstellungen</h1>

        <div class="settings-section">
          <div class="section-title">Erscheinungsbild</div>

          <div class="theme-button-group">
            <button
              type="button"
              class="theme-btn"
              :class="{ 'theme-btn--active': theme === 'system' }"
              @click="setTheme('system')"
            >
              System
            </button>
            <button
              type="button"
              class="theme-btn"
              :class="{ 'theme-btn--active': theme === 'light' }"
              @click="setTheme('light')"
            >
              Hell
            </button>
            <button
              type="button"
              class="theme-btn"
              :class="{ 'theme-btn--active': theme === 'dark' }"
              @click="setTheme('dark')"
            >
              Dunkel
            </button>
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
import { AppTheme } from '@/services/theme.service';

export default defineComponent({
  name: 'ViewSettingsCard',
  components: {
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonPage,
    IonToolbar,
  },
  computed: {
    theme(): AppTheme {
      return AppState.theme;
    },
    autoScrollSpeed(): number {
      return AppState.autoScrollSpeed;
    },
  },
  methods: {
    setTheme(theme: AppTheme) {
      AppState.setTheme(theme);
    },
  },
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

.theme-button-group {
  display: flex;
  background: var(--rondo-menu-card-bg, #1c1c1e);
  border: 1px solid var(--rondo-menu-card-border, #2c2c2e);
  border-radius: 12px;
  padding: 4px;
}

.theme-btn {
  flex: 1;
  padding: 12px 16px;
  font-size: 15px;
  font-weight: 500;
  border-radius: 8px;
  border: none;
  outline: none;
  background: transparent;
  color: var(--rondo-menu-item-text, #ffffff);
  cursor: pointer;
  text-align: center;
  transition: background-color 0.15s ease, color 0.15s ease, box-shadow 0.15s ease;
  user-select: none;
  -webkit-tap-highlight-color: transparent;

  &--active {
    background: darkorange;
    color: #ffffff;
    font-weight: 600;
  }

  &:not(&--active):active {
    background: var(--rondo-menu-item-hover, rgba(128, 128, 128, 0.15));
  }

  @media (hover: hover) {
    &:not(&--active):hover {
      background: var(--rondo-menu-item-hover, rgba(128, 128, 128, 0.15));
    }
  }
}
</style>
