<template>
  <div class="yes-no-battle flex-1 flex flex-col mb-20">
    <div class="question flex-1 grid place-items-center font-black text-2xl">
      <div class="question-text flex flex-col gap-2 items-center">
        <span ref="el">{{ currentTask.task.question }}</span>
        <span ref="el">{{ currentTask.task.answer }}</span>
      </div>
    </div>
    <div class="answers flex-1 grid place-items-center bg-[var(--grey-dark)] rounded-t-3xl">
      <div class="answer-buttons flex w-full justify-evenly">
        <div class="no-btn w-20 h-20 bg-[var(--red-color)] grid place-items-center rounded-2xl" @click="() => handleAnswer('no')">No</div>
        <div class="yes-btn w-20 h-20 bg-[var(--green-color)] grid place-items-center rounded-2xl" @click="() => handleAnswer('yes')">Yes</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useBattleStore } from "@/store/battle.ts";
import { storeToRefs } from "pinia";
import { useAnimate } from "@vueuse/core";

const battleStore = useBattleStore();
const { currentTask } = storeToRefs(battleStore);
const { onAnswer } = battleStore;

const el = ref();

const handleAnswer = async (answer) => {
  const correct =
    (answer === "yes" && currentTask.value.task.answer === currentTask.value.correct) || (answer === "no" && currentTask.value.task.answer !== currentTask.value.correct);

  if (correct) {
    await animateCorrect();
  } else {
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
</script>
