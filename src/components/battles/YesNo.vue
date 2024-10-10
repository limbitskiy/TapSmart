<template>
  <div class="yes-no-battle flex-1 flex flex-col">
    <!-- question -->
    <div class="question-cnt flex flex-col flex-1 justify-center relative">
      <div class="question-content flex flex-col gap-4 items-center mb-[6dvh]">
        <Pill class="py-2">
          <span class="question-title text-center">{{ locale?.["mechanics_1_task"] || "Is this translation correct??" }}</span>
        </Pill>

        <!-- question card -->
        <Transition name="question-slide" mode="out-in">
          <Pill
            :key="currentTask?.task.question"
            class="question min-w-[60vw] w-fit flex flex-col flex-1 gap-2 items-center text-center py-4 px-8 overflow-x-hidden text-ellipsis !bg-[transparent]"
          >
            <span class="fira-condensed-black" style="font-size: clamp(28px, 10vw, 42px)">{{ currentTask?.task.question }}</span>
            <div class="arrow">
              <svg width="16" height="41" viewBox="0 0 16 41" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M7.29289 40.7071C7.68342 41.0976 8.31658 41.0976 8.70711 40.7071L15.0711 34.3431C15.4616 33.9526 15.4616 33.3195 15.0711 32.9289C14.6805 32.5384 14.0474 32.5384 13.6569 32.9289L8 38.5858L2.34315 32.9289C1.95262 32.5384 1.31946 32.5384 0.928932 32.9289C0.538408 33.3195 0.538408 33.9526 0.928932 34.3431L7.29289 40.7071ZM7 0V40H9V0H7Z"
                  fill="#BCBCBC"
                />
              </svg>
            </div>
            <span ref="el" class="fira-condensed-black text-gray-400" style="font-size: clamp(26px, 8vw, 42px)">{{ currentTask?.task.answer }}</span>
          </Pill>
        </Transition>
      </div>
    </div>

    <!-- buttons -->
    <div class="answer-buttons flex gap-4 justify-evenly">
      <Button
        activeColor="#d26542"
        :disabled="!buttonsActive"
        class="yesNoBtn border flex-1 flex justify-center border-[var(--red-color)] bg-transparent py-4"
        @click="(event) => handleAnswer(currentTask?.task.variants[1]!, currentTask, event, 'no')"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 3L21 21" stroke="#D26542" stroke-width="5" stroke-linecap="round" />
          <path d="M21 3L3 21" stroke="#D26542" stroke-width="5" stroke-linecap="round" />
        </svg>
      </Button>
      <Button
        activeColor="#519a58"
        :disabled="!buttonsActive"
        class="yesNoBtn border flex-1 flex justify-center border-[var(--green-color)] bg-transparent py-4"
        @click="(event) => handleAnswer(currentTask?.task.variants[0]!, currentTask, event, 'yes')"
      >
        <svg width="29" height="23" viewBox="0 0 29 23" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 11L10.5922 19L26.4667 3" stroke="#519A58" stroke-width="5" stroke-linecap="round" />
        </svg>
      </Button>
    </div>

    <Teleport to="#modals">
      <div v-for="bonus in bonuses" :key="bonus.id" class="bonus bonus-animate z-20 flex gap-1 items-center absolute" :style="{ left: bonus.x + 'px', top: bonus.y + 'px' }">
        <img class="h-4" :src="getAsset('bolt')" />
        <span class="font-bold">+2</span>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, Ref } from "vue";
import { storeToRefs } from "pinia";
import { getAsset } from "@/utils";

//composables
import { useBattle } from "@/composables/useBattle";

// stores
import { useDataStore } from "@/store/data";
import { useLocaleStore } from "@/store/locale";

// types
import { Task } from "@/types";
import { watch } from "vue";

const emit = defineEmits<{
  answer: [data: { correct: boolean; answer: string }];
}>();

const props = defineProps<{
  type: "relax" | "challenge";
}>();

const localeStore = useLocaleStore();
const dataStore = useDataStore();

const { battles: locale } = storeToRefs(localeStore);
const { data, currentTask } = storeToRefs(dataStore.battles);
const buttonsActive = ref(false);

const el = ref();

watch(
  currentTask,
  () => {
    buttonsActive.value = false;

    if (data.value?.energy > 0) {
      setTimeout(() => {
        buttonsActive.value = true;
      }, 1000);
    }
  },
  {
    immediate: true,
  }
);

const defineCorrect = (currentTask: Task, button: string) => {
  return (button === "yes" && currentTask.task.answer === currentTask.correct) || (button === "no" && currentTask.task.answer !== currentTask.correct);
};

const { bonuses, onAnswer } = useBattle(props.type, el);

const handleAnswer = (answer, currentTask, event, button) => {
  const correct = defineCorrect(currentTask, button);

  emit("answer", { correct, answer });
  onAnswer(correct, event, answer);
};
</script>
