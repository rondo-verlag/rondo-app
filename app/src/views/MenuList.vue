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
      <div class="menu-header-banner">
        <img src="/assets/songdata/images/about.png" alt="Rondo" class="menu-header-img" />
      </div>

      <div class="container">
        <div class="menu-list">
          <div class="menu-item" @click="$router.push('/payment')">
            <span class="menu-item__label">Vollversion freischalten</span>
            <span class="menu-item__chevron">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </span>
          </div>
        </div>

        <br />
        <br />

        <div class="menu-list">
          <div class="menu-item" @click="$router.push('/view-settings')">
              <span class="menu-item__label">Anzeigeeinstellungen</span>
              <span class="menu-item__chevron">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </span>
            </div>
        </div>

        <br />
        <br />

        <div class="menu-list">
          <div class="menu-item" @click="$router.push('/song-settings')">
              <span class="menu-item__label">Songeinstellungen</span>
              <span class="menu-item__chevron">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </span>
            </div>
        </div>

        <br />
        <br />

        <div class="menu-list">
          <div class="menu-item" @click="$router.push('/about')">
            <span class="menu-item__label">Über das Rondo</span>
            <span class="menu-item__chevron">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </span>
          </div>
        </div>

        <div class="menu-footer">
          <p class="copyright">&copy; Zürich 1992 - 2024 Verein Rondo Verlag. Alle Rechte vorbehalten.</p>
          <p class="version" v-if="appVersion">APP Version {{ appVersion }}</p>
        </div>
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
  IonToolbar,
} from '@ionic/vue';
import { defineComponent, inject } from 'vue';

export default defineComponent({
  name: 'MenuList',
  components: {
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonPage,
    IonToolbar,
  },
  setup() {
    const appVersion = inject<string>('appVersion', '');
    return {
      appVersion,
    };
  },
});
</script>

<style scoped lang="scss">
.menu-header-banner {
  background: #ffffff;

  .menu-header-img {
    width: 100%;
  }
}

.menu-container {
  padding: 24px 16px;
}

.menu-list {
  background: var(--rondo-menu-card-bg);
  border-radius: 12px;
  border: 1px solid var(--rondo-menu-card-border);
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 16px 20px;
  min-height: 56px;
  cursor: pointer;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
  border-bottom: 1px solid var(--rondo-menu-item-border);
  transition: background-color 0.15s ease;

  &:last-child {
    border-bottom: none;
  }

  &:active {
    background-color: var(--rondo-menu-item-hover);

    .menu-item__chevron svg {
      color: darkorange;
      transform: translateX(2px);
    }
  }

  @media (hover: hover) {
    &:hover {
      background-color: var(--rondo-menu-item-hover);

      .menu-item__chevron svg {
        color: darkorange;
      }
    }
  }

  .menu-item__label {
    font-size: 16px;
    font-weight: 600;
    color: var(--rondo-menu-item-text);
    letter-spacing: 0.5px;
    flex: 1;
    margin: 0;
  }

  .menu-item__chevron {
    display: flex;
    align-items: center;
    color: var(--rondo-menu-chevron);
    margin-left: 12px;

    svg {
      width: 18px;
      height: 18px;
      transition: transform 0.15s ease, color 0.15s ease;
    }
  }
}

.menu-footer {
  margin-top: 36px;
  text-align: center;
  color: var(--rondo-menu-footer-text);
  font-size: 12px;
  line-height: 1.6;
  padding: 0 12px;

  .copyright {
    margin: 0 0 6px 0;
  }

  .version {
    margin: 0;
    color: var(--rondo-menu-version-text);
    font-size: 11px;
    font-family: monospace, sans-serif;
  }
}
</style>
