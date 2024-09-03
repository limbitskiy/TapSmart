<template>
  <div class="yes-no-battle flex-1 flex flex-col mb-[72px]">
    <div class="question flex-1 grid place-items-center font-black text-2xl">
      <div class="question-text flex flex-col items-center text-center">
        <span class="fira-condensed-black" style="font-size: clamp(26px, 8vw, 42px)">{{ currentTask.task.question }}</span>
        <span ref="el" class="fira-condensed-black text-gray-400" style="font-size: clamp(26px, 8vw, 42px)">{{ currentTask.task.answer }}</span>
      </div>
    </div>

    <Teleport to="body">
      <div v-for="bonus in bonuses" :key="bonus.id" class="bonus bonus-animate z-20 flex gap-1 items-center absolute" :style="{ left: bonus.x + 'px', top: bonus.y + 'px' }">
        <img class="h-4" :src="getAsset('bolt')" />
        <span class="font-bold">+2</span>
      </div>
    </Teleport>

    <div class="answers flex-1 grid place-items-center bg-[var(--grey-dark)] rounded-t-3xl">
      <div class="answer-buttons flex w-full justify-evenly py-4">
        <!-- <Ripple class="rounded-2xl"> -->
        <div class="no-btn bg-[var(--red-color)] border-b-4 border-[#6A3524]" @click="(event) => handleAnswer('no', event)">
          <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3.5 3.5L38.5 38.5" stroke="white" stroke-width="7" stroke-linecap="round" />
            <path d="M38.5 3.5L3.5 38.5" stroke="white" stroke-width="7" stroke-linecap="round" />
          </svg>
        </div>
        <!-- </Ripple> -->

        <!-- <Ripple class="rounded-2xl"> -->
        <div class="yes-btn bg-[var(--green-color)] border-b-4 border-[#034E0A]" @click="(event) => handleAnswer('yes', event)">
          <svg width="56" height="41" viewBox="0 0 56 41" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 20L19.5294 36L52 4" stroke="white" stroke-width="7" stroke-linecap="round" />
          </svg>
        </div>
        <!-- </Ripple> -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { getAsset } from "@/utils";

//composables
import { useBattle } from "@/composables/useBattle";

// stores
import { useDataStore } from "@/store/data.ts";

// components
import Ripple from "../UI/Ripple.vue";

const dataStore = useDataStore();

const { currentTask } = storeToRefs(dataStore.battles);

const el = ref();

const defineCorrect = (answer: string, currentTask: { correct: string; task: { answer: string } }) => {
  return (answer === "yes" && currentTask.task.answer === currentTask.correct) || (answer === "no" && currentTask.task.answer !== currentTask.correct);
};

const { bonuses, handleAnswer } = useBattle(defineCorrect, el);
</script>
