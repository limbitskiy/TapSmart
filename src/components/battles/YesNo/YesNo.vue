<template>
  <div class="battle-body flex-1 flex flex-col">
    <div class="task-content grid grid-rows-[1fr_4fr_2fr] items-center flex-1">
      <!-- task title -->
      <div class="task-title flex flex-col w-full">
        <span v-if="!currentTask?.settings?.isAds" class="question-title text-center text-[var(--accent-color)]">{{
          locales?.["mechanics_1_task"] || "Is this translation correct??"
        }}</span>
        <div class="underline h-[1px] w-full bg-[var(--accent-color)]"></div>
      </div>

      <!-- question -->
      <div class="slide-cnt flex flex-col justify-center relative">
        <Transition v-if="type === 'relax'" name="fade" mode="out-in">
          <div v-if="currentTask" :key="currentTask.task?.question" class="flex flex-col gap-2 items-center text-center break-words">
            <div class="question-cnt max-w-[calc(100dvw-5rem)]">
              <span class="line-clamp-2" style="font-size: clamp(28px, 10vw, 38px)" :style="currentTask.settings?.style?.question">{{ currentTask?.task?.question }} </span>
            </div>
            <div class="arrow">
              <svg width="16" height="26" viewBox="0 0 16 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M7.29289 25.7071C7.68342 26.0976 8.31658 26.0976 8.70711 25.7071L15.0711 19.3431C15.4616 18.9526 15.4616 18.3195 15.0711 17.9289C14.6805 17.5384 14.0474 17.5384 13.6569 17.9289L8 23.5858L2.34315 17.9289C1.95262 17.5384 1.31946 17.5384 0.928932 17.9289C0.538408 18.3195 0.538408 18.9526 0.928932 19.3431L7.29289 25.7071ZM7 0V25H9V0H7Z"
                  fill="#BCBCBC"
                />
              </svg>
            </div>
            <div class="question-cnt max-w-[calc(100dvw-5rem)]">
              <span class="text-gray-400 line-clamp-2" style="font-size: clamp(26px, 8vw, 42px)" :style="currentTask.settings?.style?.answer">{{ currentTask?.task?.answer }}</span>
            </div>
          </div>
        </Transition>

        <template v-else>
          <div v-if="currentTask" :key="currentTask.task?.question" class="flex flex-col gap-2 items-center text-center break-words">
            <div class="question-cnt max-w-[calc(100dvw-5rem)]">
              <span class="line-clamp-2" style="font-size: clamp(28px, 10vw, 38px)" :style="currentTask.settings?.style?.question">{{ currentTask?.task?.question }} </span>
            </div>
            <div class="arrow">
              <svg width="16" height="26" viewBox="0 0 16 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M7.29289 25.7071C7.68342 26.0976 8.31658 26.0976 8.70711 25.7071L15.0711 19.3431C15.4616 18.9526 15.4616 18.3195 15.0711 17.9289C14.6805 17.5384 14.0474 17.5384 13.6569 17.9289L8 23.5858L2.34315 17.9289C1.95262 17.5384 1.31946 17.5384 0.928932 17.9289C0.538408 18.3195 0.538408 18.9526 0.928932 19.3431L7.29289 25.7071ZM7 0V25H9V0H7Z"
                  fill="#BCBCBC"
                />
              </svg>
            </div>
            <div class="question-cnt max-w-[calc(100dvw-5rem)]">
              <span class="text-gray-400 line-clamp-2" style="font-size: clamp(26px, 8vw, 42px)" :style="currentTask.settings?.style?.answer">{{ currentTask?.task?.answer }}</span>
            </div>
          </div>
        </template>

        <!-- correct answer -->
        <Transition name="correct-text">
          <div v-if="correctAnswer.visible" class="correct-answer absolute z-20 inset-0 grid place-items-center">
            <div class="flex flex-col items-center justify-center text-center overflow-x-hidden break-words rounded-[15px] bg-black border border-[#850303] p-4 min-w-[70vw]">
              <div class="max-w-[calc(100dvw-5rem)]">
                <span class="text-white line-clamp-2" style="font-size: clamp(26px, 8vw, 36px)">{{ correctAnswer.question }} </span>
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
                <span class="text-green-500 line-clamp-2" style="font-size: clamp(32px, 10vw, 46px)">{{ correctAnswer.answer }}</span>
              </div>
            </div>
          </div>
        </Transition>
      </div>

      <!-- buttons -->
      <div class="answer-buttons flex gap-4 justify-evenly z-10">
        <Button
          v-for="button in buttons"
          :key="button.type"
          class="yesno-btn flex !p-0 !w-[90px] !h-[90px] !rounded-[25px] justify-center items-center text-white uppercase"
          :class="{
            correct: button.success,
            wrong: button.danger,
          }"
          style="background: linear-gradient(180deg, rgba(4, 4, 4, 0.6) 0%, rgba(0, 0, 0, 0.4) 100%); transition: 0.2s"
          @click="(event: MouseEvent) => onButton(button, event)"
        >
          <svg v-if="button.type === 'no'" width="31" height="31" viewBox="0 0 31 31" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M28 3L3 28" stroke="white" stroke-width="5" stroke-linecap="round" />
            <path d="M3 3L28 28" stroke="white" stroke-width="5" stroke-linecap="round" />
          </svg>
          <svg v-else width="36" height="29" viewBox="0 0 36 29" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 13.6071L14.6883 25L33 3" stroke="white" stroke-width="5" stroke-linecap="round" />
          </svg>
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import { getAsset, waitFor } from "@/utils";
import gsap from "gsap";

// composables
import { useActions } from "@/composables/useActions";

// types
import { AnswerProps, Task } from "@/types";

interface Button {
  success: boolean;
  danger: boolean;
  type: "yes" | "no";
}

const emit = defineEmits<{
  answer: [
    data: {
      isCorrect: boolean;
      answerString: string;
      event?: MouseEvent;
      task?: Task;
      drawBonus?: boolean;
      autoAnswer?: boolean;
    }
  ];
  changeMech: [];
  startChallenge: [];
}>();

const props = defineProps<{
  type: "relax" | "challenge";
  getNextTask: () => Task;
  locales: {};
  taskTimeoutStatus: { timeout: number | null; status: string };
  startTaskTimeout: (customTimeout?: number) => void;
  pauseTaskTimeout: () => void;
}>();

const currentTask = ref();
const settings = {};
let gsapCtx;

const { useAction } = useActions(emit);

const buttons = ref({
  no: { success: false, danger: false, type: "no" },
  yes: { success: false, danger: false, type: "yes" },
});

const correctAnswer = ref({
  visible: false,
  question: "",
  answer: "",
  timeout: null,
});

// watching task timeout
if (props.taskTimeoutStatus) {
  watch(
    props.taskTimeoutStatus,
    (val) => {
      if (val.status === "stopped") {
        autoAnswer();
      }
    },
    {
      deep: true,
    }
  );
}

const submitTask = async (answerProps: AnswerProps) => {
  emit("answer", answerProps);
  await useAction(answerProps.task);
};

const autoAnswer = async () => {
  await submitTask({
    isCorrect: false,
    answerString: "",
    autoAnswer: true,
    task: currentTask.value,
  });

  nextTask();
};

const onButton = async (button: Button, event: MouseEvent) => {
  if (correctAnswer.value.visible) return;

  if (props.pauseTaskTimeout) {
    props.pauseTaskTimeout();
  }

  const buttonMap = {
    yes: 0,
    no: 1,
  };

  const variant = buttonMap[button.type];

  const isCorrect = currentTask.value.correct === currentTask.value.task.variants[variant];

  // animate buttons
  if (isCorrect) {
    button.success = true;
  } else {
    button.danger = true;

    if (props.type === "relax" && !currentTask.value.action?.api) {
      animateCorrectAnswer();
      await waitFor(1800);
    }
  }

  setTimeout(() => {
    button.success = false;
    button.danger = false;
  }, 300);

  await submitTask({ answerString: currentTask.value.task.variants[variant], isCorrect, task: currentTask.value, event });

  nextTask();
};

const animateCorrectAnswer = async () => {
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

const setup = () => {
  gsapCtx = gsap.context(() => {});

  gsapCtx.add("animateArrow", () => {
    gsap.to(".correct-answer-arrow", { opacity: 1, y: 0, duration: 0.5 });
  });
  gsapCtx.add("animateAnswer", () => {
    gsap.to(".correct-answer-answer", { opacity: 1, y: 0, duration: 0.5 });
  });
};

const startGame = () => {
  nextTask();
};

const nextTask = async () => {
  await waitFor(200);
  const newTask = props.getNextTask();
  if (props.startTaskTimeout) {
    props.startTaskTimeout(newTask.settings?.timeout);
  }
  currentTask.value = newTask;
};

onMounted(() => {
  console.log(`yes-no mounted`);

  setup();

  startGame();
});

onUnmounted(() => {
  gsapCtx.revert();
});
</script>

<!-- // debug
  // currentTask.value = {
  //   api: "relax_action",
  //   bonus_score: null,
  //   correct: "Да, конечно",
  //   id: 5,
  //   key: "-1",
  //   settings: {
  //     isAds: true,
  //     style: {
  //       answer: {
  //         color: "orange",
  //       },
  //       background: "red",
  //       question: {
  //         "font-size": "22px",
  //       },
  //     },
  //     timeout: 8000,
  //     wait: true,
  //   },
  //   task: {
  //     answer: "Да, конечно",
  //     question: "Запустить баттл с другими игроками ?",
  //     variants: ["Да, конечно", "Да, прямо сейчас"],
  //     variantsData: null,
  //   },
  // }; -->
