import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { useBattleStore } from "./battle.ts";
import { useMainStore } from "./main.ts";
import { useLocaleStore } from "./locale.ts";
import { SettingsKeys, DataSections } from "../types";

export const useDataStore = defineStore("data", () => {
  const battles = useBattleStore();
  const mainStore = useMainStore();
  const locale = useLocaleStore();

  const state = ref({
    tutorial: {},
    profile: <{ bolts?: number }>{},
    menu: {},
    friends: {},
    tasks: {},
    leaders: {},
    market: {},
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
    if (!state.value.profile.bolts) {
      state.value.profile.bolts = 0;
    }
    state.value.profile.bolts += amount;
  };

  const setSettings = (key: SettingsKeys, value: boolean) => {
    state.value.settings[key] = value;
  };

  return { menu, tutorial, profile, battles, friends, settings, tasks, leaders, market, set, setSettings, addBolts };
});
