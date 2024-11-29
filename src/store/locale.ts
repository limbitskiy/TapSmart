import { computed, ref } from "vue";
import { defineStore } from "pinia";

// stores
import { useMainStore } from "@/store/main";

// types
import { LocaleSections, LocaleState } from "@/types";

export const useLocaleStore = defineStore("locale", () => {
  const mainStore = useMainStore();

  const state = ref<LocaleState>({});

  const tutorial = computed(() => state.value.tutorial);
  const profile = computed(() => state.value.profile);
  const requiredSettings = computed(() => state.value["required-settings"]);
  const friends = computed(() => state.value.friends);
  const battles = computed(() => state.value.battles);
  const tasks = computed(() => state.value.tasks);
  const leaders = computed(() => state.value.leaders);
  const market = computed(() => state.value.market);
  const intro = computed(() => state.value.intro);

  const set = (section: LocaleSections, data: {}) => {
    if (!state.value[section]) {
      state.value[section] = data;
      return;
    }

    state.value[section] = { ...state.value[section], ...data };
  };

  return { tutorial, requiredSettings, profile, friends, battles, tasks, leaders, market, intro, set };
});
