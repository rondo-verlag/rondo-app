import { reactive } from "vue";
import { GetResult, Preferences } from '@capacitor/preferences';

let state = reactive({
  hasBought: false,
  setHasBought: (val: boolean) => {
    state.hasBought = val;
    // save value in persistent storage
    Preferences.set({ key: 'hasBought', value: val ? 'true' : 'false' });
  }
});

// load initial state from persistent storage
Preferences.get({ key: 'hasBought' }).then((result: GetResult) => {
  state.hasBought = result.value == 'true';
});

export default state;
