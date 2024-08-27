<template>
  <div class="yes-no-battle flex-1 flex flex-col mb-20">
    <div class="question flex-1 grid place-items-center font-black text-2xl">
      <div class="question-text flex flex-col gap-2 items-center">
        <span ref="el">{{ currentTask.task.question }}</span>
        <span ref="el">{{ currentTask.task.answer }}</span>
      </div>
    </div>

    <Teleport to="body">
      <div v-for="bonus in bonuses" :key="bonus.id" class="bonus bonus-animate z-20 flex gap-1 items-center absolute" :style="{ left: bonus.x + 'px', top: bonus.y + 'px' }">
        <img class="h-4" :src="getAsset('coin')" />
        <span class="font-bold">+2</span>
      </div>
    </Teleport>

    <div class="answers flex-1 grid place-items-center bg-[var(--grey-dark)] rounded-t-3xl">
      <div class="answer-buttons flex w-full justify-evenly py-4">
        <Ripple class="rounded-2xl">
          <div class="no-btn bg-[var(--red-color)] relative" @click="(event) => handleAnswer('no', event)" ripple>
            <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3.5 3.5L38.5 38.5" stroke="white" stroke-width="7" stroke-linecap="round" />
              <path d="M38.5 3.5L3.5 38.5" stroke="white" stroke-width="7" stroke-linecap="round" />
            </svg>
          </div>
        </Ripple>

        <Ripple class="rounded-2xl">
          <div class="yes-btn bg-[var(--green-color)] relative" @click="(event) => handleAnswer('yes', event)" ripple>
            <svg width="56" height="41" viewBox="0 0 56 41" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 20L19.5294 36L52 4" stroke="white" stroke-width="7" stroke-linecap="round" />
            </svg>
          </div>
        </Ripple>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { useAnimate } from "@vueuse/core";
import { getAsset } from "@/utils";

// stores
import { useBattleStore } from "@/store/battle.ts";

// components
import Ripple from "../UI/Ripple.vue";

const battleStore = useBattleStore();
const { currentTask } = storeToRefs(battleStore);
const { onAnswer } = battleStore;

const bonuses = ref([]);

const el = ref();

const handleAnswer = async (answer, { clientX, clientY }) => {
  const correct =
    (answer === "yes" && currentTask.value.task.answer === currentTask.value.correct) || (answer === "no" && currentTask.value.task.answer !== currentTask.value.correct);

  if (correct) {
    navigator.vibrate(300);
    await createBonus({ x: clientX, y: clientY });
    await animateCorrect();
  } else {
    navigator.vibrate([100, 10, 100, 10, 100]);
    await animateWrong();
  }

  onAnswer(answer);
};

const animateCorrect = async () => {
  const { animate } = await useAnimate(
    el,
    [
      { color: "#21f435", offset: 0.1 },
      { transform: "scale(1.5)", opacity: 0 },
    ],
    300
  );
  await animate.value.finished;
};

const animateWrong = async () => {
  const { animate } = await useAnimate(
    el,
    [
      { color: "red", offset: 0.05 },
      { transform: "translateX(-5px)" },
      { transform: "translateX(5px)" },
      { transform: "translateX(-5px)" },
      { transform: "translateX(5px)" },
      { transform: "translateX(-5px)" },
      { transform: "translateX(5px)" },
      { transform: "translateX(-5px)" },
      { transform: "translateX(5px)" },
    ],
    {
      duration: 500,
      easing: "linear",
    }
  );
  await animate.value.finished;
};

const createBonus = ({ x, y }) => {
  const idx = bonuses.value.push({
    id: Math.random() * 999,
    x,
    y: y - 40,
  });

  setTimeout(() => {
    bonuses.value.splice(idx - 1, 1);
  }, 500);
};
</script>
