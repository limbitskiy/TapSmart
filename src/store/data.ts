import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { useBattleStore } from "@/store/battle.ts";
import { useMainStore } from "@/store/main.ts";
import { useLocaleStore } from "@/store/locale.ts";

export const useDataStore = defineStore("data", () => {
  const battles = useBattleStore();
  const mainStore = useMainStore();
  const locale = useLocaleStore();

  const state = ref({});
  const settings = ref({
    sound: false,
    music: false,
    vibro: true,
  });

  const tutorial = computed(() => state.value.tutorial);
  const profile = computed(() => state.value.profile);
  const menu = computed(() => state.value.menu);
  const friends = computed(() => state.value.friends);

  const set = (section, data) => {
    if (data.locale) {
      locale.set(section, data.locale);
    }

    if (data.store) {
      if (section === "battles") {
        battles.set(data.store);
        return;
      }

      if (!state.value[section]) {
        state.value[section] = data.store;
        return;
      }

      state.value[section] = { ...state.value[section], ...data.store };

      // Object.keys(data.store).forEach((storeKey) => {
      //   state.value[section].store[storeKey] = data.store[storeKey];
      // });
    }

    if (data.expand) {
      if (section === "battles") {
        battles.expand(data.expand);
        return;
      }
    }
  };

  const addBolts = (amount) => {
    state.value.profile.bolts += amount;
  };

  return { menu, tutorial, profile, battles, friends, settings, set, addBolts };
});
