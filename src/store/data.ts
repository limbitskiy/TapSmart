import { defineStore } from "pinia";
import { computed, ref } from "vue";

// stores
import { useMainStore } from "@/store/main";
import { useBattleStore } from "@/store/battle";
import { useLocaleStore } from "@/store/locale";

// types
import { Settings, DataState, BattleState } from "@/types";

export const useDataStore = defineStore("data", () => {
  const battles = useBattleStore();
  const mainStore = useMainStore();
  const locale = useLocaleStore();

  const state = ref<DataState>({
    settings: {
      sound: false,
      music: false,
      vibro: false,
      subtitles: false,
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
  const loader = computed(() => state.value.loader);

  const set = (section: keyof DataState, data: { locale: {}; store: {}; expand: {} }) => {
    if (data.locale) {
      locale.set(section, data.locale);
    }

    if (data.store) {
      if (section === "battles") {
        battles.set(data.store as BattleState);
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

    state.value.profile.bolts = +(state.value.profile.bolts + amount).toFixed(2);
  };

  const setSettings = (key: keyof Settings, value: boolean) => {
    state.value.settings[key] = value;
  };

  const toggleSetting = (key: keyof Settings) => {
    state.value.settings[key] = !state.value.settings[key];
  };

  return { menu, tutorial, profile, battles, friends, settings, tasks, leaders, market, loader, set, setSettings, addBolts, toggleSetting };
});
