<template>
  <div class="4-answers-battle flex-1 flex flex-col mb-[72px]">
    <div class="question flex-1 grid place-items-center font-black text-2xl">
      <div class="question-text flex flex-col gap-2 items-center">
        <span class="fira-condensed-black text-[26px]" ref="el">{{ currentTask.task.question }}</span>
      </div>
    </div>

    <Teleport to="body">
      <div v-for="bonus in bonuses" :key="bonus.id" class="bonus bonus-animate z-20 flex gap-1 items-center absolute" :style="{ left: bonus.x + 'px', top: bonus.y + 'px' }">
        <img class="h-4" :src="getAsset('bolt')" />
        <span class="exo-bold">+2</span>
      </div>
    </Teleport>

    <div class="answers flex-1 grid place-items-center bg-[var(--grey-dark)] rounded-t-3xl">
      <div class="answer-buttons grid w-full grid-cols-2 grid-rows-2 gap-4 px-4 leading-5 py-4">
        <Button class="four-answer-btn" @click="(event) => handleAnswer(currentTask.task.variants[0], event)">{{ currentTask.task.variants[0] }}</Button>
        <Button class="four-answer-btn" @click="(event) => handleAnswer(currentTask.task.variants[1], event)">{{ currentTask.task.variants[1] }}</Button>
        <Button class="four-answer-btn" @click="(event) => handleAnswer(currentTask.task.variants[2], event)">{{ currentTask.task.variants[2] }}</Button>
        <Button class="four-answer-btn" @click="(event) => handleAnswer(currentTask.task.variants[3], event)">{{ currentTask.task.variants[3] }}</Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { getAsset } from "@/utils";
import { useAnimate } from "@vueuse/core";

// stores
import { useDataStore } from "@/store/data.ts";

// components
import Button from "@/components/UI/Button.vue";

const dataStore = useDataStore();

const { currentTask } = storeToRefs(dataStore.battles);
const { onAnswer } = dataStore.battles;

const el = ref();
const bonuses = ref([]);

const handleAnswer = async (answer, { clientX, clientY }) => {
  const correct = answer === currentTask.value.correct;

  if (correct) {
    await drawBonus({ x: clientX, y: clientY });
    await animateCorrect();
  } else {
    await animateWrong();
  }

  onAnswer({ isCorrect: correct, answerString: answer });
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

const drawBonus = ({ x, y }) => {
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
</script>
