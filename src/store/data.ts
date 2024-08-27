import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { useBattleStore } from "@/store/battle.ts";
import { useMainStore } from "@/store/main.ts";
import { useLocaleStore } from "@/store/locale.ts";

export const useDataStore = defineStore("data", () => {
  const battleStore = useBattleStore();
  const mainStore = useMainStore();
  const locale = useLocaleStore();

  const state = ref({});

  const tutorial = computed(() => state.value.tutorial);
  const profile = computed(() => state.value.profile);
  const menu = computed(() => state.value.menu);
  const friends = computed(() => state.value.friends);
  const battle = computed(() => battleStore);

  const set = (section, data) => {
    if (data.locale) {
      locale.set(section, data.locale);
    }

    if (data.store) {
      if (!state.value[section]) {
        state.value[section] = data.store;
        return;
      }

      state.value[section] = { ...state.value[section], ...data.store };

      // Object.keys(data.store).forEach((storeKey) => {
      //   state.value[section].store[storeKey] = data.store[storeKey];
      // });
    }
  };

  const addBolts = (amount) => {
    state.value.profile.store.bolts += amount;
  };

  return { menu, tutorial, profile, battle, friends, set, addBolts };
});
