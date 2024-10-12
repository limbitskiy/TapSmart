<template>
  <Transition name="fade" mode="out-in">
    <component
      :is="mountedMechanic"
      :type="currentBattleMode"
      :task="currentTask"
      :locales="locale"
      :energy="energy"
      @answer="onAnswer"
      @mounted="onMechanicMounted"
      @unmounted="onMechanicUnmounted"
    />
  </Transition>

  <Teleport to="#modals">
    <div v-for="bonus in bonuses" :key="bonus.id" class="bonus bonus-animate z-20 flex gap-1 items-center absolute" :style="{ left: bonus.x + 'px', top: bonus.y + 'px' }">
      <img class="h-4" :src="getAsset('bolt')" />
      <span class="font-bold">+2</span>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { storeToRefs } from "pinia";
import { getAsset } from "@/utils";

// types
import { Bonus } from "@/types";

// stores
import { useMainStore } from "@/store/main";

// battle mechanics
import YesNo from "@/components/battles/YesNo.vue";
import FourAnswers from "@/components/battles/FourAnswers.vue";

interface AnswerProps {
  isCorrect: boolean;
  answer: string;
  event: MouseEvent;
  drawBonus?: boolean;
}

const store = useMainStore();

const { battles: locale } = storeToRefs(store.localeStore);
const { energy, сurrentMechanicName, currentTask, currentBattleMode } = storeToRefs(store.battleStore);
const { handleBattleAnswer, startRelax, stopRelax } = store.battleStore;

const bonuses = ref<Bonus[]>([]);
let answerInProgress = false;

const mechMap = {
  yesno: YesNo,
  "4answers": FourAnswers,
};

const mountedMechanic = computed(() => mechMap[сurrentMechanicName.value]);

const onAnswer = async ({ isCorrect, answer, event, drawBonus = true }: AnswerProps) => {
  if (answerInProgress) return;

  answerInProgress = true;

  if (isCorrect && drawBonus) {
    drawBonusAnimation(event);
  }
  handleBattleAnswer({ isCorrect, answerString: answer });

  answerInProgress = false;
};

const drawBonusAnimation = ({ x, y }: { x: number; y: number }) => {
  const id = Date.now();

  bonuses.value.push({
    id,
    x: x - 20,
    y: y - 60,
  });

  setTimeout(() => {
    const idx = bonuses.value.findIndex((item) => item.id === id);
    bonuses.value.splice(idx, 1);
  }, 700);

  return true;
};

const onMechanicMounted = () => {
  setTimeout(() => {
    startRelax();
  }, 1000);
};

const onMechanicUnmounted = () => {
  stopRelax();
};
</script>
