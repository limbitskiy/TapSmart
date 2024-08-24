import { useBattleStore } from "@/store/battle.ts";
import { storeToRefs } from "pinia";

export const useBattleProcessor = () => {
  const battle = useBattleStore();
  const { processor } = storeToRefs(battle);
};
