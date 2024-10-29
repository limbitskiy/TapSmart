<template>
  <div class="battle-body flex-1 flex flex-col">
    <!-- task header -->
    <div
      class="header flex items-center justify-between py-3 px-4 rounded-t-[15px] bg-[#363636] z-10"
    >
      <Button
        class="!p-0 bg-[var(--grey-light)]"
        activeColor="#858585"
        @click="() => emit('changeMech')"
      >
        <BattleHeader
          icon="mech_1"
          :gameLocale="locales?.['mechanics_category']"
          :title="locales?.[`yesno_title`] || 'Yes-no'"
        />
      </Button>
      <div class="right flex items-center gap-3">
        <CircleCountdown
          v-if="type === 'relax'"
          :strokeWidth="2"
          color="grey"
          :size="20"
        />
        <VolumeControl />
      </div>
    </div>

    <!-- task body -->
    <BackgroundPill
      class="flex-1 !p-4 z-10 rounded-[15px] rounded-t-none relative overflow-hidden"
      style="background: linear-gradient(180deg, #363636 0%, #272727 100%)"
      dark
    >
      <div class="flex-1 grid grid-flow-row grid-rows-[2fr_1fr]">
        <!-- task -->
        <div class="task-cnt flex-1 flex flex-col">
          <div
            class="task-content grid grid-rows-[40px_auto] flex-1 justify-items-center px-2"
          >
            <div class="task-title-cnt flex flex-col justify-center">
              <Pill class="!py-2 rounded-xl bg-[var(--grey-light)]">
                <span class="question-title text-center">{{
                  locales?.["mechanics_1_task"] ||
                  "Is this translation correct??"
                }}</span>
              </Pill>
            </div>

            <div class="slide-cnt flex flex-col justify-center">
              <!-- question card -->
              <Transition name="fade" mode="out-in">
                <div
                  v-if="task"
                  :key="task?.task?.question"
                  class="flex flex-col gap-2 items-center text-center break-words"
                >
                  <div class="question-cnt max-w-[calc(100dvw-5rem)]">
                    <span
                      class="fira-condensed-black line-clamp-2"
                      style="font-size: clamp(28px, 10vw, 42px)"
                      >{{ task?.task?.question }}
                    </span>
                  </div>
                  <div class="arrow">
                    <svg
                      width="16"
                      height="26"
                      viewBox="0 0 16 26"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M7.29289 25.7071C7.68342 26.0976 8.31658 26.0976 8.70711 25.7071L15.0711 19.3431C15.4616 18.9526 15.4616 18.3195 15.0711 17.9289C14.6805 17.5384 14.0474 17.5384 13.6569 17.9289L8 23.5858L2.34315 17.9289C1.95262 17.5384 1.31946 17.5384 0.928932 17.9289C0.538408 18.3195 0.538408 18.9526 0.928932 19.3431L7.29289 25.7071ZM7 0V25H9V0H7Z"
                        fill="#BCBCBC"
                      />
                    </svg>
                  </div>
                  <div class="question-cnt max-w-[calc(100dvw-5rem)]">
                    <span
                      class="fira-condensed-black text-gray-400 line-clamp-2"
                      style="font-size: clamp(26px, 8vw, 42px)"
                      >{{ task?.task?.answer }}</span
                    >
                  </div>
                </div>
              </Transition>
            </div>
          </div>
        </div>

        <!-- button press animations -->
        <!-- <div
          class="no-btn-pulse absolute bottom-5 rounded-full left-[75px] h-10 w-10 z-[10]"
          :class="{ pulse: noBtnAnimation.shown }"
          :style="noBtnAnimation.color === 'red' ? 'background-color: rgb(239 68 68)' : noBtnAnimation.color === 'green' ? 'background-color: rgb(34 197 94)' : ''"
        ></div>
        <div
          class="yes-btn-pulse absolute bottom-5 rounded-full right-10 h-10 w-10 z-[-1]"
          :class="{ pulse: yesBtnAnimation.shown }"
          :style="yesBtnAnimation.color === 'red' ? 'background-color: rgb(239 68 68)' : yesBtnAnimation.color === 'green' ? 'background-color: rgb(34 197 94)' : ''"
        ></div> -->

        <!-- buttons -->
        <div class="answer-buttons flex gap-4 justify-evenly mt-4 z-10">
          <Button
            :disabled="type === 'relax' && energy <= 0"
            class="yesno-btn flex !p-0 !w-[90px] !h-[90px] justify-center bg-[var(--grey-light)] items-center text-white uppercase"
            :class="{
              correct: noBtnAnimation === 'correct',
              wrong: noBtnAnimation === 'wrong',
            }"
            @click="
              (event) => handleAnswer(task?.task?.variants[1], event, 'no')
            "
          >
            <svg
              width="37"
              height="37"
              viewBox="0 0 37 37"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3 3L34 34"
                stroke="white"
                stroke-width="5"
                stroke-linecap="round"
              />
              <path
                d="M34 3L3 34"
                stroke="white"
                stroke-width="5"
                stroke-linecap="round"
              />
            </svg>
          </Button>
          <Button
            :disabled="type === 'relax' && energy <= 0"
            class="yesno-btn flex !p-0 !w-[90px] !h-[90px] justify-center bg-[var(--grey-light)] items-center text-white uppercase"
            :class="{
              correct: yesBtnAnimation === 'correct',
              wrong: yesBtnAnimation === 'wrong',
            }"
            @click="
              (event) => handleAnswer(task?.task?.variants[0], event, 'yes')
            "
          >
            <svg
              width="41"
              height="31"
              viewBox="0 0 41 31"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3 15L14.3235 27L38 3"
                stroke="white"
                stroke-width="5"
                stroke-linecap="round"
              />
            </svg>
          </Button>
        </div>

        <!-- correct answer -->
        <Transition name="correct-text" mode="out-in">
          <div
            v-if="correctAnswer.shown"
            class="correct-answer absolute z-20 inset-0 grid place-items-center pointer-events-none mb-8"
          >
            <div
              class="flex flex-col items-center justify-center text-center overflow-x-hidden break-words"
            >
              <div class="max-w-[calc(100dvw-5rem)]">
                <span
                  class="fira-condensed-black text-red-500 line-clamp-2"
                  style="font-size: clamp(28px, 10vw, 42px)"
                  >{{ correctAnswer.question }}
                </span>
              </div>
              <div class="max-w-[calc(100dvw-5rem)]">
                <span
                  class="fira-condensed-black text-red-400 line-clamp-2"
                  style="font-size: clamp(26px, 8vw, 42px)"
                  >{{ correctAnswer.answer }}</span
                >
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

const emit = defineEmits<{
  answer: [
    data: {
      isCorrect: boolean;
      answer: string;
      event: MouseEvent;
      drawBonus: boolean;
    }
  ];
  changeMech: [];
}>();

const props = defineProps<{
  type: "relax" | "challenge";
  task: {};
  locales: {};
  energy: number;
  buttonsBlocked: boolean;
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

const handleAnswer = (answer: string, event, type) => {
  if ((props.type === "relax" && props.energy <= 0) || !props.task) return;

  const isCorrect = answer === props.task.correct;

  let taskDelay = settings.correctTaskDelay;

  if (type === "yes") {
    yesBtnAnimation.value = isCorrect ? "correct" : "wrong";
    setTimeout(
      () => {
        yesBtnAnimation.value = null;
      },
      isCorrect ? settings.yesBtnDelay : settings.noBtnDelay
    );
  } else if (type === "no") {
    noBtnAnimation.value = isCorrect ? "correct" : "wrong";
    setTimeout(
      () => {
        noBtnAnimation.value = null;
      },
      isCorrect ? settings.yesBtnDelay : settings.noBtnDelay
    );
  }

  if (props.type === "relax" && !isCorrect) {
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
    drawBonus: true,
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
