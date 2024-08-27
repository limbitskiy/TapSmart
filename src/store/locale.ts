import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { useBattleStore } from "@/store/battle.ts";
import { useMainStore } from "@/store/main.ts";

export const useLocaleStore = defineStore("locale", () => {
  const battleStore = useBattleStore();
  const userStore = useMainStore();

  const state = ref({});

  const tutorial = computed(() => state.value.tutorial);
  const profile = computed(() => state.value.profile);
  const requiredSettings = computed(() => state.value["required-settings"]);
  const friends = computed(() => state.value.friends);

  const set = (section, data) => {
    if (!state.value[section]) {
      state.value[section] = data;
      return;
    }

    state.value[section] = { ...state.value[section], ...data };
  };

  return { tutorial, requiredSettings, profile, friends, set };
});
