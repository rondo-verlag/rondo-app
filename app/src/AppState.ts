import { reactive } from "vue";
import { GetResult, Preferences } from '@capacitor/preferences';

export const DEFAULT_SCROLL_SPEED = 5;
export const MIN_SCROLL_SPEED = 1;
export const MAX_SCROLL_SPEED = 10;

const state = reactive({
  hasBought: false,
  purchaseLogs: [] as string[],
  scrollSpeed: DEFAULT_SCROLL_SPEED,
  setHasBought: (val: boolean) => {
    state.hasBought = val;
    // save value in persistent storage
    Preferences.set({ key: 'hasBought', value: val ? 'true' : 'false' });
  },
  addPurchaseLog: (log: string) => {
    const timestamp = new Date().toISOString().substring(11, 19);
    state.purchaseLogs.push(`[${timestamp}] ${log}`);
    console.log(`[PurchaseLog] ${log}`);
  },
  setScrollSpeed: (val: number) => {
    const clamped = Math.min(MAX_SCROLL_SPEED, Math.max(MIN_SCROLL_SPEED, val));
    state.scrollSpeed = clamped;
    // save value in persistent storage
    Preferences.set({ key: 'scrollSpeed', value: String(clamped) });
  },
});

// load initial state from persistent storage
Preferences.get({ key: 'hasBought' }).then((result: GetResult) => {
  state.hasBought = result.value == 'true';
});

Preferences.get({ key: 'scrollSpeed' }).then((result: GetResult) => {
  const parsed = parseFloat(result.value ?? '');
  if (!isNaN(parsed)) {
    state.scrollSpeed = Math.min(MAX_SCROLL_SPEED, Math.max(MIN_SCROLL_SPEED, parsed));
  }
});

export default state;
