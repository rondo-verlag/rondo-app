// Polyfill for Map.prototype.getOrInsertComputed (used by pdfjs-dist 5.x, not yet in iOS WKWebView)
if (!('getOrInsertComputed' in Map.prototype)) {
  Object.defineProperty(Map.prototype, 'getOrInsertComputed', {
    value: function<K, V>(this: Map<K, V>, key: K, callbackfn: (key: K) => V): V {
      if (this.has(key)) return this.get(key) as V;
      const value = callbackfn(key);
      this.set(key, value);
      return value;
    },
    writable: true,
    configurable: true,
  });
}

import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

import { IonicVue } from '@ionic/vue';

/* Core CSS required for Ionic components to work properly */
import '@ionic/vue/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/vue/css/normalize.css';
import '@ionic/vue/css/structure.css';
import '@ionic/vue/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/vue/css/padding.css';
import '@ionic/vue/css/float-elements.css';
import '@ionic/vue/css/text-alignment.css';
import '@ionic/vue/css/text-transformation.css';
import '@ionic/vue/css/flex-utils.css';
import '@ionic/vue/css/display.css';

/* Theme variables */
import './theme/variables.css';

/* import rondo styles */
import './theme/rondo-icons.css';
import './theme/rondo.css';

/* use package.json to read app version */
import packageJson from '../package.json';
import { StatusBar, Style } from '@capacitor/status-bar';

const app = createApp(App)
  .use(IonicVue)
  .use(router)
  .provide('appVersion', packageJson.version);

router.isReady().then(() => {
  app.mount('#app');
});

StatusBar.setStyle({ style: Style.Dark });
