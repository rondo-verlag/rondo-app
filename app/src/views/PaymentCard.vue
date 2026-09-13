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
        <h1>Das Rondo immer und überall dabei</h1>
        <br />
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

        <div class="purchase-info">
          <h4>Dein Kaufstatus</h4>
          <div class="localState">
            <b>Lokaler Kaufstatus: </b> {{ hasBought ? "Gekauft" : "Nicht Gekauft" }}
          </div>
          <div class="localState">
            <b>APP Store Kaufstatus: </b> {{ hasBought ? "Gekauft" : "Nicht Gekauft" }}
          </div>

          <div v-if="purchaseLogs.length > 0" class="purchase-logs-container">
            <div @click="logsExpanded = !logsExpanded" class="logs-header">
              <b>Logs:</b>
              <span class="expand-icon">{{ logsExpanded ? '▼' : '◀' }}</span>
            </div>
            <div v-if="logsExpanded" class="purchase-logs">
              <div v-for="(log, index) in purchaseLogs" :key="index" class="log-entry">
                {{ log }}
              </div>
            </div>
          </div>
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
  IonToolbar
} from "@ionic/vue";
import { defineComponent } from "vue";
import AppState from "@/AppState";
import PurchaseService from "@/services/purchase.service";
import BrowserLink from "@/views/BrowserLink.vue";

export default defineComponent({
  name: "PaymentCard",
  components: {
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonPage,
    IonToolbar,
  },
  data() {
    return {
      logsExpanded: false
    };
  },
  computed: {
    hasBought: {
      get(): boolean {
        return AppState.hasBought;
      },
      set(val: boolean): void {
        AppState.setHasBought(val);
      }
    },
    purchaseLogs(): string[] {
      return AppState.purchaseLogs;
    }
  },
  methods: {
    buyFullversion() {
      PurchaseService.buy();
    },
    restorePurchases() {
      PurchaseService.restore();
    }
  }
});
</script>

<style scoped lang="scss">
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

.purchase-info {
  margin-top: 20px;
  margin-bottom: 20px;
  padding-left: 10px;
  padding-bottom: 10px;
  border: 1px solid darkorange;
}

.purchase-logs-container {
  margin-top: 15px;
  border-top: 1px dashed #ccc;
}

.logs-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 0;
  cursor: pointer;
}

.purchase-logs {
  font-family: monospace;
  overflow-y: auto;
  padding-top: 5px;
}

.log-entry {
  white-space: pre-wrap;
  margin-bottom: 2px;
}
</style>
