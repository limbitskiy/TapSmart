import { defineStore } from "pinia";
import { computed, ref } from "vue";

// stores
import { useMainStore } from "@/store/main";
import { useBattleStore } from "@/store/battle";
import { useLocaleStore } from "@/store/locale";

// types
import { SettingsKeys, DataSections, DataState } from "@/types";

export const useDataStore = defineStore("data", () => {
  const battles = useBattleStore();
  const mainStore = useMainStore();
  const locale = useLocaleStore();

  const state = ref<DataState>({
    settings: {
      sound: false,
      music: false,
      vibro: true,
    },
  });

  const tutorial = computed(() => state.value.tutorial);
  const profile = computed(() => state.value.profile);
  const menu = computed(() => state.value.menu);
  const friends = computed(() => state.value.friends);
  const settings = computed(() => state.value.settings);
  const tasks = computed(() => state.value.tasks);
  const leaders = computed(() => state.value.leaders);
  const market = computed(() => state.value.market);

  const set = (section: DataSections, data: { locale: {}; store: {}; expand: {} }) => {
    if (data.locale) {
      locale.set(section, data.locale);
    }

    if (data.store) {
      if (section === "battles") {
        battles.set(data.store);
      }

      if (!state.value[section]) {
        state.value[section] = data.store;
      }

      state.value[section] = { ...state.value[section], ...data.store };
    }

    if (data.expand) {
      if (section === "battles") {
        battles.expand(data.expand);
      }
    }
  };

  const addBolts = (amount: number) => {
    if (!state.value.profile) {
      state.value.profile = {};
    }

    if (!state.value.profile?.bolts) {
      state.value.profile!.bolts = 0;
    }

    console.log(`adding bolts`);
    console.log(`before`, state.value.profile.bolts);
    console.log(`amount`, amount);

    state.value.profile.bolts += amount;

    console.log(`after`, state.value.profile.bolts);
  };

  const setSettings = (key: SettingsKeys, value: boolean) => {
    state.value.settings[key] = value;
  };

  return { menu, tutorial, profile, battles, friends, settings, tasks, leaders, market, set, setSettings, addBolts };
});
