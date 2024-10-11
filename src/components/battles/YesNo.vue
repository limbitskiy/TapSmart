<template>
  <div class="yes-no-battle flex-1 flex flex-col">
    <!-- question -->
    <div class="question-cnt flex flex-col flex-1 relative">
      <div class="question-content grid grid-rows-[1fr_4fr] flex-1 justify-items-center">
        <div class="title-cnt flex-1 flex flex-col justify-center">
          <Pill class="!py-2 rounded-xl">
            <span class="question-title text-center">{{ locales?.["mechanics_1_task"] || "Is this translation correct??" }}</span>
          </Pill>
        </div>

        <div class="slide-cnt flex-1 flex flex-col justify-center mb-[3dvh]">
          <!-- question card -->
          <Transition name="question-slide" mode="out-in">
            <Pill
              :key="task?.task?.question"
              class="question min-w-[60vw] w-fit flex flex-col gap-2 items-center text-center py-0 px-8 overflow-x-hidden text-ellipsis !bg-[transparent]"
            >
              <span class="fira-condensed-black" style="font-size: clamp(28px, 10vw, 42px)">{{ task?.task?.question }}</span>
              <div class="arrow">
                <svg width="16" height="26" viewBox="0 0 16 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M7.29289 25.7071C7.68342 26.0976 8.31658 26.0976 8.70711 25.7071L15.0711 19.3431C15.4616 18.9526 15.4616 18.3195 15.0711 17.9289C14.6805 17.5384 14.0474 17.5384 13.6569 17.9289L8 23.5858L2.34315 17.9289C1.95262 17.5384 1.31946 17.5384 0.928932 17.9289C0.538408 18.3195 0.538408 18.9526 0.928932 19.3431L7.29289 25.7071ZM7 0V25H9V0H7Z"
                    fill="#BCBCBC"
                  />
                </svg>
              </div>
              <span ref="el" class="fira-condensed-black text-gray-400" style="font-size: clamp(26px, 8vw, 42px)">{{ task?.task?.answer }}</span>
            </Pill>
          </Transition>
        </div>
      </div>
    </div>

    <!-- buttons -->
    <div class="answer-buttons flex gap-4 justify-evenly mt-4">
      <Button activeColor="#d26542" :disabled="!buttonsActive" class="yesNoBtn border flex-1 flex justify-center border-[var(--red-color)] bg-transparent py-4">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 3L21 21" stroke="#D26542" stroke-width="5" stroke-linecap="round" />
          <path d="M21 3L3 21" stroke="#D26542" stroke-width="5" stroke-linecap="round" />
        </svg>
      </Button>
      <Button activeColor="#519a58" :disabled="!buttonsActive" class="yesNoBtn border flex-1 flex justify-center border-[var(--green-color)] bg-transparent py-4">
        <svg width="29" height="23" viewBox="0 0 29 23" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 11L10.5922 19L26.4667 3" stroke="#519A58" stroke-width="5" stroke-linecap="round" />
        </svg>
      </Button>
      <!-- <Button
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
      </Button> -->
    </div>

    <!-- <Teleport to="#modals">
      <div v-for="bonus in bonuses" :key="bonus.id" class="bonus bonus-animate z-20 flex gap-1 items-center absolute" :style="{ left: bonus.x + 'px', top: bonus.y + 'px' }">
        <img class="h-4" :src="getAsset('bolt')" />
        <span class="font-bold">+2</span>
      </div>
    </Teleport> -->

    <!-- <Transition name="correct-text" mode="out-in">
      <div v-if="isCorrectTextShown" class="correct-text absolute z-20 inset-0 grid place-items-center pointer-events-none">
        <span class="block text-[12vw] exo-black text-[#1fe525] mb-8">{{ locale?.["is_correct_answer"] || "Yes!" }}</span>
      </div>
      <div v-else-if="isWrongTextShown" class="correct-text absolute z-20 inset-0 grid place-items-center pointer-events-none">
        <span class="block text-[12vw] exo-black text-[red] mb-8">{{ locale?.["is_wrong_answer"] || "No!" }}</span>
      </div>
    </Transition> -->
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import { getAsset } from "@/utils";

//composables
import { useBattle } from "@/composables/useBattle";

// types
import { Task } from "@/types";
import { watch } from "vue";

const emit = defineEmits<{
  answer: [data: { correct: boolean; answer: string }];
  mounted: [];
  unmounted: [];
}>();

const props = defineProps<{
  type: "relax" | "challenge";
  task: {};
  locales: {};
}>();

const buttonsActive = ref(false);

const el = ref();
const isCorrectTextShown = ref(false);
const isWrongTextShown = ref(false);

// watch(
//   currentTask,
//   () => {
//     buttonsActive.value = false;

//     if ((props.type === "relax" && data.value?.energy > 0) || props.type === "challenge") {
//       setTimeout(() => {
//         buttonsActive.value = true;
//       }, 1000);
//     }
//   },
//   {
//     immediate: true,
//   }
// );

// const defineCorrect = (currentTask: Task, button: string) => {
//   return (button === "yes" && currentTask.task.answer === currentTask.correct) || (button === "no" && currentTask.task.answer !== currentTask.correct);
// };

// const { bonuses, onAnswer } = useBattle(props.type, el);

const handleAnswer = (answer, currentTask, event, button) => {
  // const correct = defineCorrect(currentTask, button);
  // emit("answer", { correct, answer });
  // onAnswer(correct, event, answer);
};

onMounted(() => {
  emit("mounted");
});

onBeforeUnmount(() => {
  emit("unmounted");
});
</script>
