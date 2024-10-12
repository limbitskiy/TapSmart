import { Ref, ref } from "vue";
import { storeToRefs } from "pinia";

// stores
// import { useDataStore } from "@/store/data";
import { useMainStore } from "@/store/main";

// types
import { Task, Bonus } from "@/types";
import { waitFor } from "@/utils";

export const useBattle = (type: "relax" | "challenge") => {
  // const dataStore = useDataStore();
  const store = useMainStore();

  // const { data } = storeToRefs(store.battleStore);

  return { bonuses, onAnswer, drawBonus };
};
