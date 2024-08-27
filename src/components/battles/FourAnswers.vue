<template>
  <div class="4-answers-battle flex-1 flex flex-col mb-[72px]">
    <div class="question flex-1 grid place-items-center font-black text-2xl">
      <div class="question-text flex flex-col gap-2 items-center">
        <span ref="el">{{ currentTask.task.question }}</span>
      </div>
    </div>
    <div class="answers flex-1 grid place-items-center bg-[var(--grey-dark)] rounded-t-3xl">
      <div class="answer-buttons grid w-full grid-cols-2 grid-rows-2 gap-4 px-4 leading-5 py-4">
        <Button class="w-full bg-[var(--dark-blue-color)] text-white min-h-[64px] overflow-hidden text-ellipsis" @click="() => handleAnswer(currentTask.task.variants[0])">{{
          currentTask.task.variants[0]
        }}</Button>
        <Button class="w-full bg-[var(--dark-blue-color)] text-white min-h-[64px] overflow-hidden text-ellipsis" @click="() => handleAnswer(currentTask.task.variants[1])">{{
          currentTask.task.variants[1]
        }}</Button>
        <Button class="w-full bg-[var(--dark-blue-color)] text-white min-h-[64px] overflow-hidden text-ellipsis" @click="() => handleAnswer(currentTask.task.variants[2])">{{
          currentTask.task.variants[2]
        }}</Button>
        <Button class="w-full bg-[var(--dark-blue-color)] text-white min-h-[64px] overflow-hidden text-ellipsis" @click="() => handleAnswer(currentTask.task.variants[3])">{{
          currentTask.task.variants[3]
        }}</Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useBattleStore } from "@/store/battle.ts";
import { storeToRefs } from "pinia";
import Button from "@/components/UI/Button.vue";
import { useAnimate } from "@vueuse/core";

const battleStore = useBattleStore();
const { currentTask } = storeToRefs(battleStore);
const { onAnswer } = battleStore;

const el = ref();

const handleAnswer = async (answer) => {
  const correct = answer === currentTask.value.correct;

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
