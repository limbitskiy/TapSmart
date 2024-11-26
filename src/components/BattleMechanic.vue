<template>
  <Transition name="fade" mode="out-in">
    <component
      v-if="mountedMechanic"
      :is="mountedMechanic"
      :type="currentBattleMode"
      :locales="locale"
      :startTaskTimeout="startTaskTimeout"
      :getNextTask="getNextTask"
      :resetBattleProcessor="resetBattleProcessor"
      @answer="onAnswer"
      @changeMech="() => emit('changeMech')"
    />
    <Loader v-else />
  </Transition>

  <!-- bolt bonuses -->
  <div v-for="bonus in bonuses" :key="bonus.id" class="bonus bonus-animate z-20 flex gap-2 items-center absolute" :style="{ left: bonus.x + 'px', top: bonus.y + 'px' }">
    <img class="h-4 scale-150" :src="getAsset('bolt')" />
    <span class="font-bold text-xl">+{{ bonus.amount }}</span>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, shallowRef } from "vue";
import { storeToRefs } from "pinia";
import { getAsset } from "@/utils";

// types
import { Bonus, Task } from "@/types";

// stores
import { useMainStore } from "@/store/main";

// battle mechanics
import YesNo from "@/components/battles/YesNo/YesNo.vue";
import FourAnswers from "@/components/battles/FourAnswers/FourAnswers.vue";
import MatchPairs from "@/components/battles/MatchPairs/MatchPairs.vue";

console.log(`Battle Mech created`);

interface MechanicAnswerProps {
  isCorrect: boolean;
  answerString: string;
  task: Task;
  event?: MouseEvent;
  drawBonus?: boolean;
  autoAnswer?: boolean;
}

const emit = defineEmits<{
  answer: [payload: {}];
  startChallenge: [];
  changeMech: [];
}>();

const store = useMainStore();

const { useFetch } = store;
const { battles: locale } = storeToRefs(store.localeStore);
const { сurrentMechanicName, currentBattleMode } = storeToRefs(store.battleStore);
const { handleAnswer, calculateRelaxMultiplierAmount, getNextTask, startTaskTimeout, resetBattleProcessor } = store.battleStore;

const bonuses = ref<Bonus[]>([]);
const mountedMechanic = shallowRef();

const mechMap = {
  yesno: YesNo,
  "4answers": FourAnswers,
  match_pairs: MatchPairs,
};

watch(
  сurrentMechanicName,
  (val) => {
    if (val) {
      mountedMechanic.value = mechMap[val];
    }
  },
  {
    immediate: true,
  }
);

const onAnswer = async ({ isCorrect, answerString, event, drawBonus = true, task, autoAnswer = false }: MechanicAnswerProps) => {
  if (task.settings?.isAds && task.api) {
    const res = await useFetch({ key: task.api, handleResponse: false });

    if (res?.action === "start-challenge") {
      emit("startChallenge");
    }
    return;
  }

  if (isCorrect && drawBonus) {
    drawBonusAnimation(event);
  }

  handleAnswer({ isCorrect, answerString, task, autoAnswer });

  emit("answer", { isCorrect, answerString, task });
};

const drawBonusAnimation = ({ x, y }: { x: number; y: number }) => {
  const multiplier = calculateRelaxMultiplierAmount();
  const id = Date.now();

  bonuses.value.push({
    id,
    x: x - 20,
    y: y - 60,
    amount: Math.round(multiplier),
  });

  setTimeout(() => {
    const idx = bonuses.value.findIndex((item) => item.id === id);
    bonuses.value.splice(idx, 1);
  }, 700);

  return true;
};

onMounted(() => {
  console.log(`Battle Mech mounted`);
});
</script>
