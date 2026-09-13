declare module '*.vue' {
  import { defineComponent } from 'vue';
  const component: ReturnType<typeof defineComponent>;
  export default component;
}

// `appVersion` is provided by main.ts via `app.provide('appVersion', ...)`
// and consumed by Options API components via `inject: ['appVersion']`.
import 'vue';
declare module 'vue' {
  interface ComponentCustomProperties {
    appVersion: string;
  }
}
