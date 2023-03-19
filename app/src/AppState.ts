import { reactive } from "vue";
import { GetResult, Storage } from '@capacitor/storage';

let state = reactive({
  hasBought: false,
  setHasBought: (val: boolean) => {
    state.hasBought = val;
    // save value in persistent storage
    Storage.set({ key: 'hasBought', value: val ? 'true' : 'false' });
  }
});

// load initial state from persistent storage
Storage.get({ key: 'hasBought' }).then((result: GetResult) => {
  state.hasBought = result.value == 'true';
});

export default state;
