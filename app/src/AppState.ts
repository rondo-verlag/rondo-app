import { reactive } from "vue";
import { GetResult, Preferences } from '@capacitor/preferences';
import ThemeService, { AppTheme } from "@/services/theme.service";

const DEFAULT_AUTO_SCROLL_SPEED = 25;

const state = reactive({
  hasBought: false,
  purchaseLogs: [] as string[],
  theme: ThemeService.getTheme(),
  autoScrollSpeed: DEFAULT_AUTO_SCROLL_SPEED,
  setHasBought: (val: boolean) => {
    state.hasBought = val;
    // save value in persistent storage
    Preferences.set({ key: 'hasBought', value: val ? 'true' : 'false' });
  },
  setTheme: (theme: AppTheme) => {
    state.theme = theme;
    ThemeService.setTheme(theme);
  },
  setAutoScrollSpeed: (speed: number) => {
    const validSpeed = Math.min(50, Math.max(1, isNaN(speed) ? DEFAULT_AUTO_SCROLL_SPEED : Math.round(speed)));
    state.autoScrollSpeed = validSpeed;
    Preferences.set({ key: 'autoScrollSpeed', value: validSpeed.toString() });
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

Preferences.get({ key: 'autoScrollSpeed' }).then((result: GetResult) => {
  if (result.value) {
    const parsed = parseInt(result.value, 10);
    if (!isNaN(parsed) && parsed >= 1 && parsed <= 10) {
      state.autoScrollSpeed = parsed;
    }
  }
});

ThemeService.init().then((theme) => {
  state.theme = theme;
});

export default state;
