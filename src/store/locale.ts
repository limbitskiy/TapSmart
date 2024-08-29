import { computed, ref } from "vue";
import { defineStore } from "pinia";
import { useMainStore } from "./main.ts";
import { LocaleSections } from "../types";

export const useLocaleStore = defineStore("locale", () => {
  const mainStore = useMainStore();

  const state = ref({
    tutorial: {},
    profile: {},
    menu: {},
    friends: {},
    battles: {},
    "required-settings": {},
  });

  const tutorial = computed(() => state.value.tutorial);
  const profile = computed(() => state.value.profile);
  const requiredSettings = computed(() => state.value["required-settings"]);
  const friends = computed(() => state.value.friends);
  const battles = computed(() => state.value.battles);

  const set = (section: LocaleSections, data: {}) => {
    if (!state.value[section]) {
      state.value[section] = data;
      return;
    }

    state.value[section] = { ...state.value[section], ...data };
  };

  return { tutorial, requiredSettings, profile, friends, battles, set };
});
