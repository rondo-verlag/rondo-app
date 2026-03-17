import { reactive } from "vue";
import { GetResult, Preferences } from '@capacitor/preferences';

let state = reactive({
  hasBought: false,
  purchaseLogs: [] as string[],
  setHasBought: (val: boolean) => {
    state.hasBought = val;
    // save value in persistent storage
    Preferences.set({ key: 'hasBought', value: val ? 'true' : 'false' });
  },
  addPurchaseLog: (log: string) => {
    const timestamp = new Date().toISOString().substring(11, 19);
    state.purchaseLogs.push(`[${timestamp}] ${log}`);
    console.log(`[PurchaseLog] ${log}`);
  }
});

// load initial state from persistent storage
Preferences.get({ key: 'hasBought' }).then((result: GetResult) => {
  state.hasBought = result.value == 'true';
});

export default state;
