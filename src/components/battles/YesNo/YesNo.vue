<template>
  <div class="battle-body flex-1 flex flex-col">
    <!-- task -->

    <BackgroundPill
      class="flex-1 !p-4 z-10 rounded-[25px] relative overflow-hidden border border-[#185a8d]"
      style="background: linear-gradient(180deg, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.4) 100%)"
      dark
    >
      <div class="flex-1 grid grid-flow-row grid-rows-[auto_2fr_1fr]">
        <!-- task header -->
        <div class="header flex items-center justify-between mb-4">
          <Button v-if="type !== 'challenge'" class="!p-0 bg-[var(--grey-dark)]" activeColor="#858585" @click="() => emit('changeMech')">
            <BattleHeader icon="mech_1" :gameLocale="locales?.['mechanics_category']" :title="locales?.[`yesno_title`] || 'Yes-no'" />
          </Button>

          <!-- take up the space for justify-between to work -->
          <div v-else class="placeholder w-1"></div>
          <div class="right flex items-center gap-3">
            <CircleCountdown v-if="type === 'relax'" :strokeWidth="2" color="grey" :size="20" />
            <VolumeControl />
          </div>
        </div>

        <!-- task body -->
        <div class="task-cnt flex-1 flex flex-col">
          <div class="task-content grid grid-rows-[60px_auto] flex-1 justify-items-center px-2">
            <div class="task-title-cnt flex flex-col justify-center">
              <Pill class="rounded-xl bg-transparent">
                <span v-if="!task.settings?.isAds" class="question-title text-center text-[var(--accent-color)]">{{
                  locales?.["mechanics_1_task"] || "Is this translation correct??"
                }}</span>
              </Pill>
            </div>

            <div class="slide-cnt flex flex-col justify-center">
              <!-- question card -->
              <Transition name="fade" mode="out-in">
                <div v-if="task" :key="task.task?.question" class="flex flex-col gap-2 items-center text-center break-words">
                  <div class="question-cnt max-w-[calc(100dvw-5rem)]">
                    <span class="fira-condensed-black line-clamp-2" style="font-size: clamp(28px, 10vw, 38px)" :style="task.settings?.style?.question"
                      >{{ task?.task?.question }}
                    </span>
                  </div>
                  <div class="arrow">
                    <svg width="16" height="26" viewBox="0 0 16 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M7.29289 25.7071C7.68342 26.0976 8.31658 26.0976 8.70711 25.7071L15.0711 19.3431C15.4616 18.9526 15.4616 18.3195 15.0711 17.9289C14.6805 17.5384 14.0474 17.5384 13.6569 17.9289L8 23.5858L2.34315 17.9289C1.95262 17.5384 1.31946 17.5384 0.928932 17.9289C0.538408 18.3195 0.538408 18.9526 0.928932 19.3431L7.29289 25.7071ZM7 0V25H9V0H7Z"
                        fill="#BCBCBC"
                      />
                    </svg>
                  </div>
                  <div class="question-cnt max-w-[calc(100dvw-5rem)] mb-8">
                    <span class="fira-condensed-black text-gray-400 line-clamp-2" style="font-size: clamp(26px, 8vw, 42px)" :style="task.settings?.style?.answer">{{
                      task?.task?.answer
                    }}</span>
                  </div>
                </div>
              </Transition>
            </div>
          </div>
        </div>

        <!-- buttons -->
        <div class="answer-buttons flex gap-4 justify-evenly mt-4 z-10">
          <Button
            class="yesno-btn flex !p-0 !w-[90px] !h-[90px] !rounded-[25px] justify-center items-center text-white uppercase"
            :class="{
              correct: noBtnAnimation === 'correct',
              wrong: noBtnAnimation === 'wrong',
            }"
            style="background: linear-gradient(180deg, rgba(4, 4, 4, 0.6) 0%, rgba(0, 0, 0, 0.4) 100%); transition: 0.2s"
            @click="(event) => handleAnswer(task?.task?.variants[1], event, task, 'no')"
          >
            <svg width="31" height="31" viewBox="0 0 31 31" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M28 3L3 28" stroke="white" stroke-width="5" stroke-linecap="round" />
              <path d="M3 3L28 28" stroke="white" stroke-width="5" stroke-linecap="round" />
            </svg>
          </Button>

          <Button
            class="yesno-btn flex !p-0 !w-[90px] !h-[90px] !rounded-[25px] justify-center items-center text-white uppercase"
            :class="{
              correct: yesBtnAnimation === 'correct',
              wrong: yesBtnAnimation === 'wrong',
            }"
            style="background: linear-gradient(180deg, rgba(4, 4, 4, 0.6) 0%, rgba(0, 0, 0, 0.4) 100%); transition: 0.2s"
            @click="(event) => handleAnswer(task?.task?.variants[0], event, task, 'yes')"
          >
            <svg width="36" height="29" viewBox="0 0 36 29" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 13.6071L14.6883 25L33 3" stroke="white" stroke-width="5" stroke-linecap="round" />
            </svg>
          </Button>
        </div>

        <!-- correct answer -->
        <Transition name="correct-text" mode="out-in">
          <div v-if="correctAnswer.shown" class="correct-answer absolute z-20 inset-0 grid place-items-center pointer-events-none mb-12">
            <div class="flex flex-col items-center justify-center text-center overflow-x-hidden break-words rounded-[30px] bg-black border-2 border-[#B60502] p-4 min-w-[70vw]">
              <div class="max-w-[calc(100dvw-5rem)]">
                <span class="fira-condensed-black text-white line-clamp-2" style="font-size: clamp(28px, 10vw, 42px)">{{ correctAnswer.question }} </span>
              </div>
              <div class="arrow">
                <svg width="16" height="26" viewBox="0 0 16 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M7.29289 25.7071C7.68342 26.0976 8.31658 26.0976 8.70711 25.7071L15.0711 19.3431C15.4616 18.9526 15.4616 18.3195 15.0711 17.9289C14.6805 17.5384 14.0474 17.5384 13.6569 17.9289L8 23.5858L2.34315 17.9289C1.95262 17.5384 1.31946 17.5384 0.928932 17.9289C0.538408 18.3195 0.538408 18.9526 0.928932 19.3431L7.29289 25.7071ZM7 0V25H9V0H7Z"
                    fill="#BCBCBC"
                  />
                </svg>
              </div>
              <div class="max-w-[calc(100dvw-5rem)]">
                <span class="fira-condensed-black text-gray-400 line-clamp-2" style="font-size: clamp(26px, 8vw, 42px)">{{ correctAnswer.answer }}</span>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </BackgroundPill>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { getAsset } from "@/utils";

// types
import { Task } from "@/types";

const emit = defineEmits<{
  answer: [
    data: {
      isCorrect: boolean;
      answer: string;
      event: MouseEvent;
      task: Task;
      drawBonus: boolean;
    }
  ];
  changeMech: [];
}>();

const props = defineProps<{
  type: "relax" | "challenge";
  task: Task;
  locales: {};
}>();

const correctAnswer = ref({
  shown: false,
  question: "",
  answer: "",
  timeout: null,
});

const noBtnAnimation = ref(null);
const yesBtnAnimation = ref(null);

const settings = {
  correctTaskDelay: 0,
  wrongTaskDelay: 0,
  yesBtnDelay: 0,
  noBtnDelay: 0,
};

console.log(`yes-no created`);

const handleAnswer = (answer: string, event: MouseEvent, task: Task, type: "yes" | "no") => {
  const isCorrect = answer === props.task.correct;

  let taskDelay = settings.correctTaskDelay;

  if (type === "yes" && !task.settings?.isAds) {
    yesBtnAnimation.value = isCorrect ? "correct" : "wrong";
    setTimeout(
      () => {
        yesBtnAnimation.value = null;
      },
      isCorrect ? settings.yesBtnDelay : settings.noBtnDelay
    );
  } else if (type === "no" && !task.settings?.isAds) {
    noBtnAnimation.value = isCorrect ? "correct" : "wrong";
    setTimeout(
      () => {
        noBtnAnimation.value = null;
      },
      isCorrect ? settings.yesBtnDelay : settings.noBtnDelay
    );
  }

  if (props.type === "relax" && !isCorrect && !task.settings?.isAds) {
    // wrong answer in relax mode creates a 2s delay
    taskDelay = settings.wrongTaskDelay;

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

  emit("answer", {
    isCorrect,
    answer,
    event,
    drawBonus: task.settings?.isAds || props.type === "challenge" ? false : true,
    task,
    nextTaskDelay: taskDelay,
  });
};

onMounted(() => {
  console.log(`yes-no mounted`);

  if (props.type === "relax") {
    settings.correctTaskDelay = 350;
    settings.wrongTaskDelay = 2000;
    settings.yesBtnDelay = 300;
    settings.noBtnDelay = 2000;
  } else if (props.type === "challenge") {
    settings.correctTaskDelay = 0;
    settings.wrongTaskDelay = 0;
    settings.yesBtnDelay = 300;
    settings.noBtnDelay = 300;
  }
});
</script>
