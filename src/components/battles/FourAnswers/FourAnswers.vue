<template>
  <div class="battle-body flex-1 flex flex-col">
    <div class="task-content grid grid-rows-[1fr_2fr_2fr] items-center flex-1">
      <!-- task title -->
      <div class="task-title flex flex-col w-full">
        <span v-if="!currentTask?.settings?.isAds" class="question-title text-center text-[var(--accent-color)]">{{
          locales?.["mechanics_2_task"] || "Is this translation correct??"
        }}</span>
        <div class="underline h-[1px] w-full bg-[var(--accent-color)]"></div>
      </div>

      <!-- question -->
      <div class="slide-cnt flex flex-col justify-center relative">
        <Transition name="fade" mode="out-in">
          <div v-if="currentTask" :key="currentTask.task?.question" class="flex flex-col gap-2 items-center text-center break-words">
            <div class="question-cnt max-w-[calc(100dvw-5rem)]">
              <span class="fira-condensed-black line-clamp-2" style="font-size: clamp(28px, 10vw, 42px)" :style="currentTask.settings?.style?.question"
                >{{ currentTask?.task?.question }}
              </span>
            </div>
          </div>
        </Transition>

        <!-- correct answer -->
        <Transition name="correct-text">
          <div v-if="correctAnswer.visible" class="correct-answer absolute z-20 inset-0 grid place-items-center">
            <div class="flex flex-col items-center justify-center text-center overflow-x-hidden break-words rounded-[15px] bg-black border border-[#850303] p-4 min-w-[70vw]">
              <div class="max-w-[calc(100dvw-5rem)]">
                <span class="fira-condensed-black text-white line-clamp-2" style="font-size: clamp(26px, 8vw, 36px)">{{ correctAnswer.question }} </span>
              </div>
              <div class="correct-answer-arrow translate-y-[-10px] opacity-0">
                <svg width="16" height="26" viewBox="0 0 16 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M7.29289 25.7071C7.68342 26.0976 8.31658 26.0976 8.70711 25.7071L15.0711 19.3431C15.4616 18.9526 15.4616 18.3195 15.0711 17.9289C14.6805 17.5384 14.0474 17.5384 13.6569 17.9289L8 23.5858L2.34315 17.9289C1.95262 17.5384 1.31946 17.5384 0.928932 17.9289C0.538408 18.3195 0.538408 18.9526 0.928932 19.3431L7.29289 25.7071ZM7 0V25H9V0H7Z"
                    fill="#BCBCBC"
                  />
                </svg>
              </div>
              <div class="correct-answer-answer max-w-[calc(100dvw-5rem)] translate-y-[-10px] opacity-0">
                <span class="fira-condensed-black text-green-500 line-clamp-2" style="font-size: clamp(32px, 10vw, 46px)">{{ correctAnswer.answer }}</span>
              </div>
            </div>
          </div>
        </Transition>
      </div>

      <!-- buttons -->
      <div class="answer-buttons grid w-full grid-cols-2 grid-rows-2 gap-4 leading-5">
        <Button
          v-for="button in buttons"
          class="four-answer-btn"
          :class="{
            correct: button.success,
            wrong: button.danger,
          }"
          style="background: linear-gradient(180deg, rgba(4, 4, 4, 0.6) 0%, rgba(0, 0, 0, 0.4) 100%); transition: 0.2s"
          @click="(event: MouseEvent) => onButton(button, event)"
        >
          {{ button.label }}
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue";
import { getAsset } from "@/utils";
import gsap from "gsap";

// types
import { Task } from "@/types";

interface Button {
  id: number;
  success: boolean;
  danger: boolean;
  label: string;
}

const emit = defineEmits<{
  answer: [
    data: {
      isCorrect: boolean;
      answerString: string;
      event?: MouseEvent;
      task: Task;
      drawBonus?: boolean;
      autoAnswer?: boolean;
    }
  ];
  changeMech: [];
}>();

const props = defineProps<{
  type: "relax" | "challenge";
  getNextTask: () => Task;
  resetBattleProcessor: () => void;
  startTaskTimeout: (callback: () => void) => void;
  locales: {};
}>();

const currentTask = ref();

const settings = {};
let gsapCtx;

const buttons = ref([
  { id: 0, success: false, danger: false, label: "" },
  { id: 1, success: false, danger: false, label: "" },
  { id: 2, success: false, danger: false, label: "" },
  { id: 3, success: false, danger: false, label: "" },
]);

const correctAnswer = ref({
  visible: false,
  question: "",
  answer: "",
  timeout: null,
});

const loadNewTask = () => {
  const newTask = props.getNextTask();
  currentTask.value = newTask;

  for (let i = 0; i < buttons.value.length; i++) {
    buttons.value[i].label = newTask.task.variants[i];
  }
};

const onButton = (button: Button, event: MouseEvent) => {
  if (correctAnswer.value.visible) return;

  const isCorrect = currentTask.value.correct === button.label;

  emitAnswer({ answerString: button.label, isCorrect, task: currentTask.value, event });

  // animate buttons
  if (isCorrect) {
    button.success = true;
  } else {
    button.danger = true;

    if (props.type === "relax") {
      animateCorrectAnswer();
    }
  }

  setTimeout(() => {
    button.success = false;
    button.danger = false;
  }, 300);

  loadNewTask();
};

const emitAnswer = ({
  answerString,
  isCorrect,
  task,
  autoAnswer,
  drawBonus,
  event,
}: {
  answerString: string;
  isCorrect: boolean;
  task: Task;
  event?: MouseEvent;
  autoAnswer?: boolean;
  drawBonus?: boolean;
}) => {
  emit("answer", {
    isCorrect,
    answerString,
    task,
    autoAnswer,
    drawBonus,
    event,
  });
};

const animateCorrectAnswer = () => {
  clearTimeout(correctAnswer.value.timeout);

  correctAnswer.value.visible = true;
  correctAnswer.value.question = currentTask.value.task.question;
  correctAnswer.value.answer = currentTask.value.correct;

  setTimeout(() => {
    gsapCtx.animateArrow();
  }, 300);

  setTimeout(() => {
    gsapCtx.animateAnswer();
  }, 600);

  correctAnswer.value.timeout = setTimeout(() => {
    correctAnswer.value.visible = false;
    correctAnswer.value.question = "";
    correctAnswer.value.answer = "";
  }, 1500);
};

const autoAnswer = () => {
  emitAnswer({
    isCorrect: false,
    answerString: "",
    autoAnswer: true,
    task: currentTask.value,
  });

  if (props.type === "relax") {
    props.startTaskTimeout(autoAnswer);
  }
};

const setup = () => {
  props.resetBattleProcessor();

  gsapCtx = gsap.context(() => {});

  gsapCtx.add("animateArrow", () => {
    gsap.to(".correct-answer-arrow", { opacity: 1, y: 0, duration: 0.5 });
  });
  gsapCtx.add("animateAnswer", () => {
    gsap.to(".correct-answer-answer", { opacity: 1, y: 0, duration: 0.5 });
  });
};

const startGame = () => {
  console.log(`starting four answers locally`);

  if (props.type === "relax") {
    // props.startTaskTimeout(autoAnswer);
  }

  loadNewTask();
};

onMounted(() => {
  console.log(`4answers mounted`);

  setup();

  startGame();
});

onUnmounted(() => {
  gsapCtx.revert();
});
</script>
