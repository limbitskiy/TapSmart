<template>
  <div class="battle-body flex-1 flex">
    <BackgroundPill class="flex-1 !p-4 z-10 rounded-[15px] relative overflow-hidden" style="background: linear-gradient(180deg, #363636 0%, #272727 100%)" dark>
      <div class="header flex items-center justify-between mb-4">
        <div class="mech-title flex gap-1 items-center">
          <img class="h-8" :src="getAsset(`mech_1`)" />
          <span class="fira-regular text-lg text-[#B7B7B7]">{{ locale?.[`yesno_title`] || "Yes-no" }} battle</span>
        </div>
        <div class="right flex items-center gap-3">
          <CircleCountdown v-if="type === 'relax'" :strokeWidth="2" color="grey" :size="20" />
          <VolumeControl />
        </div>
      </div>

      <div class="flex-1 flex flex-col">
        <!-- task -->
        <div class="task-cnt flex-1 flex flex-col">
          <div class="task-content grid grid-rows-[40px_auto_56px] flex-1 justify-items-center">
            <div class="task-title-cnt flex flex-col justify-center">
              <Pill class="!py-2 rounded-xl bg-[#222]">
                <span class="question-title text-center">{{ locales?.["mechanics_1_task"] || "Is this translation correct??" }}</span>
              </Pill>
            </div>

            <div class="slide-cnt flex flex-col justify-center">
              <!-- question card -->
              <Transition name="question-slide" mode="out-in">
                <div v-if="task" :key="task?.task?.question" class="max-w-[calc(100vw-4rem)] flex flex-col gap-2 items-center text-center">
                  <div class="question-cnt">
                    <span class="fira-condensed-black leading-[3rem] line-clamp-2" style="font-size: clamp(28px, 10vw, 42px)">{{ task?.task?.question }}</span>
                  </div>
                  <div class="arrow">
                    <svg width="16" height="26" viewBox="0 0 16 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M7.29289 25.7071C7.68342 26.0976 8.31658 26.0976 8.70711 25.7071L15.0711 19.3431C15.4616 18.9526 15.4616 18.3195 15.0711 17.9289C14.6805 17.5384 14.0474 17.5384 13.6569 17.9289L8 23.5858L2.34315 17.9289C1.95262 17.5384 1.31946 17.5384 0.928932 17.9289C0.538408 18.3195 0.538408 18.9526 0.928932 19.3431L7.29289 25.7071ZM7 0V25H9V0H7Z"
                        fill="#BCBCBC"
                      />
                    </svg>
                  </div>
                  <div class="question-cnt">
                    <span class="fira-condensed-black text-gray-400 line-clamp-2 leading-8" style="font-size: clamp(26px, 8vw, 42px)">{{ task?.task?.answer }}</span>
                  </div>
                </div>
              </Transition>
            </div>
          </div>
        </div>

        <!-- button press animations -->
        <div
          class="no-btn-pulse absolute bottom-5 rounded-full left-10 h-10 w-10 z-[-1]"
          :class="{ pulse: noBtnAnimation.shown }"
          :style="noBtnAnimation.color === 'red' ? 'background-color: rgb(239 68 68)' : noBtnAnimation.color === 'green' ? 'background-color: rgb(34 197 94)' : ''"
        ></div>
        <div
          class="yes-btn-pulse absolute bottom-5 rounded-full right-10 h-10 w-10 z-[-1]"
          :class="{ pulse: yesBtnAnimation.shown }"
          :style="yesBtnAnimation.color === 'red' ? 'background-color: rgb(239 68 68)' : yesBtnAnimation.color === 'green' ? 'background-color: rgb(34 197 94)' : ''"
        ></div>

        <!-- buttons -->
        <div class="answer-buttons flex gap-4 justify-evenly mt-4 z-10">
          <Button
            activeColor="#97482f"
            :disabled="(type === 'relax' && energy <= 0) || buttonsBlocked || !task"
            class="flex-1 flex justify-center bg-[var(--red-color)]"
            @click="(event) => handleAnswer(task?.task?.variants[1], event, 'no')"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 3L21 21" stroke="white" stroke-width="5" stroke-linecap="round" />
              <path d="M21 3L3 21" stroke="white" stroke-width="5" stroke-linecap="round" />
            </svg>
          </Button>
          <Button
            activeColor="#38703d"
            :disabled="(type === 'relax' && energy <= 0) || buttonsBlocked || !task"
            class="flex-1 flex justify-center bg-[var(--green-color)]"
            @click="(event) => handleAnswer(task?.task?.variants[0], event, 'yes')"
          >
            <svg width="29" height="23" viewBox="0 0 29 23" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 11L10.5922 19L26.4667 3" stroke="white" stroke-width="5" stroke-linecap="round" />
            </svg>
          </Button>
        </div>

        <Transition name="correct-text" mode="out-in">
          <div v-if="correctAnswer.shown" class="correct-answer absolute z-20 inset-0 grid place-items-center pointer-events-none mb-8">
            <div class="text flex flex-col items-center justify-center text-center">
              <span class="fira-condensed-black text-red-500 line-clamp-2 leading-10" style="font-size: clamp(28px, 10vw, 42px)">{{ correctAnswer.question }}</span>
              <span class="fira-condensed-black text-red-400 line-clamp-2 leading-8" style="font-size: clamp(26px, 8vw, 42px)">{{ correctAnswer.answer }}</span>
            </div>
          </div>
        </Transition>
      </div>
    </BackgroundPill>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { getAsset } from "@/utils";

const emit = defineEmits<{
  answer: [
    data: {
      isCorrect: boolean;
      answer: string;
      event: MouseEvent;
      drawBonus: boolean;
    }
  ];
  mounted: [];
  unmounted: [];
}>();

const props = defineProps<{
  type: "relax" | "challenge";
  task: {};
  locales: {};
  energy: number;
  buttonsBlocked: boolean;
}>();

const noBtnAnimation = ref({
  shown: false,
  color: null,
});

const yesBtnAnimation = ref({
  shown: false,
  color: null,
});

const correctAnswer = ref({
  shown: false,
  question: "",
  answer: "",
  timeout: null,
});

const handleAnswer = (answer: string, event, type) => {
  if (props.type === "relax" && props.energy <= 0) return;

  const isCorrect = answer === props.task.correct;

  let taskDelay;

  // custom correct/wrong animation
  if (type === "no") {
    noBtnAnimation.value.color = isCorrect ? "green" : "red";
    noBtnAnimation.value.shown = true;
    setTimeout(() => {
      noBtnAnimation.value.shown = false;
      noBtnAnimation.value.color = null;
    }, 500);
  } else if (type === "yes") {
    yesBtnAnimation.value.color = isCorrect ? "green" : "red";
    yesBtnAnimation.value.shown = true;
    setTimeout(() => {
      yesBtnAnimation.value.shown = false;
      yesBtnAnimation.value.color = null;
    }, 500);
  }

  if (props.type === "relax" && !isCorrect) {
    // wrong answer in relax mode creates a 2s delay
    taskDelay = 2000;

    // wrong answer in relax mode creates correct answer popup
    clearTimeout(correctAnswer.value.timeout);

    correctAnswer.value.shown = true;
    correctAnswer.value.question = props.task.task.question;
    correctAnswer.value.answer = props.task.correct;

    correctAnswer.value.timeout = setTimeout(() => {
      correctAnswer.value.shown = false;
      correctAnswer.value.question = "";
      correctAnswer.value.answer = "";
    }, 1500);
  }

  emit("answer", { isCorrect, answer, event, drawBonus: true, nextTaskDelay: taskDelay });
};

onMounted(() => {
  emit("mounted");
});

onBeforeUnmount(() => {
  emit("unmounted");
});
</script>
