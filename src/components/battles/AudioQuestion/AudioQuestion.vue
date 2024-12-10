<template>
  <div class="battle-body flex-1 flex flex-col">
    <!-- task body -->
    <div class="task-content grid grid-rows-[1fr_2fr_2fr] items-center flex-1">
      <div class="task-title flex flex-col my-4">
        <span class="question-title text-center text-[var(--accent-color)]">{{ locales?.["mechanics_4_task"] || "pick a match:" }}</span>
        <div class="underline h-[1px] w-full bg-[var(--accent-color)]"></div>
      </div>

      <!-- question -->
      <div class="slide-cnt flex flex-col justify-center relative">
        <img class="w-full h-[15dvh] object-contain" :src="getAsset('loudspeaker')" />
        <!-- <Transition v-if="type === 'relax'" name="fade" mode="out-in">
          <div v-if="currentTask" :key="currentTask.task?.question" class="flex flex-col gap-2 items-center text-center break-words">
            <div class="question-cnt w-full max-w-[90vw]">
              <span v-show="showQuestion" class="fira-bold line-clamp-2" style="font-size: clamp(28px, 10vw, 42px)" :style="currentTask.settings?.style?.question"
                >{{ currentTask?.task?.question }}
              </span>
            </div>
          </div>
        </Transition>

        <template v-else>
          <div v-if="currentTask" :key="currentTask.task?.question" class="flex flex-col gap-2 items-center text-center break-words">
            <div class="question-cnt w-full max-w-[90vw]">
              <span v-show="showQuestion" class="fira-bold line-clamp-2" style="font-size: clamp(28px, 10vw, 42px)" :style="currentTask.settings?.style?.question"
                >{{ currentTask?.task?.question }}
              </span>
            </div>
          </div>
        </template> -->

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
      <div class="answer-buttons grid w-full grid-cols-2 grid-rows-2 gap-4 leading-5">
        <Button
          v-for="button in buttons"
          class="four-answer-btn break-words fira"
          :class="{
            correct: button.success,
            wrong: button.danger,
          }"
          style="background: linear-gradient(180deg, rgba(4, 4, 4, 0.6) 0%, rgba(0, 0, 0, 0.4) 100%); transition: 0.2s"
          @click="(event: MouseEvent) => onButton(button, event)"
        >
          <span class="font-normal lowercase text-lg line-clamp-2" style="line-height: 20px">{{ button.label }}</span>
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch, Ref } from "vue";
import { getAsset, waitFor } from "@/utils";
import { Howl, Howler } from "howler";
import gsap from "gsap";

// types
import { AnswerProps, Task } from "@/types";

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
      task?: Task;
      drawBonus?: boolean;
      autoAnswer?: boolean;
    }
  ];
  changeMech: [];
}>();

const props = defineProps<{
  type: "relax" | "challenge";
  getNextTask: () => Task;
  locales: {};
  energy: Ref<number>;
  relaxModalOpen: Ref<boolean>;
  taskTimeoutStatus: { timeout: number | null; status: string };
  startTaskTimeout: (customTimeout?: number) => void;
  pauseTaskTimeout: () => void;
}>();

const settings = {};

let gsapCtx;
let interval;

const buttonsBlocked = ref(true);
const showQuestion = ref(false);
const cachedTasks = ref([]);
const buttons = ref([
  { id: 0, success: false, danger: false, label: "" },
  { id: 1, success: false, danger: false, label: "" },
  { id: 2, success: false, danger: false, label: "" },
  { id: 3, success: false, danger: false, label: "" },
]);
const currentTask = ref();
const correctAnswer = ref({
  visible: false,
  question: "",
  answer: "",
  timeout: null,
});
const isModalOpen = ref(false);

// watch opened modals
watch(
  () => props.relaxModalOpen,
  (val) => {
    if (val) {
      console.log(`stopping`);

      isModalOpen.value = true;
    } else {
      console.log(`resuming`);
      isModalOpen.value = false;
      playCurrentTask();
    }
  }
);

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

const onButton = async (button: Button, event: MouseEvent) => {
  if (correctAnswer.value.visible || buttonsBlocked.value) return;

  buttonsBlocked.value = true;
  currentTask.value.sound.stop();

  clearInterval(interval);

  if (props.pauseTaskTimeout) {
    props.pauseTaskTimeout();
  }
  const isCorrect = currentTask.value.correct === button.label;
  // animate buttons
  if (isCorrect) {
    button.success = true;
  } else {
    button.danger = true;
    if (props.type === "relax" && !currentTask.value.action?.api) {
      animateCorrectAnswer();
      await waitFor(2000);
    }
  }
  setTimeout(() => {
    button.success = false;
    button.danger = false;
  }, 300);
  await submitTask({ answerString: button.label, isCorrect, task: currentTask.value, event });
  nextTask();
};

const nextTask = async () => {
  await waitFor(200);

  preloadTask();

  currentTask.value = cachedTasks.value.shift();

  playCurrentTask();

  startTaskTimeout();

  for (let i = 0; i < buttons.value.length; i++) {
    buttons.value[i].label = currentTask.value.task.variants[i];
  }

  setTimeout(() => {
    buttonsBlocked.value = false;
  }, 500);
};

const submitTask = async (answerProps: AnswerProps) => {
  emit("answer", answerProps);
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

const preloadTask = () => {
  const task = props.getNextTask();

  const sound = new Howl({
    src: task.task.url,
    volume: 0.3,
    onload: () => {
      //   task.loaded = true;
    },
    onloaderror: () => {
      new Error(`Couldn't load sound: '${task.task.url}'`);
      // showQuestion.value = true;
    },
  });

  task.sound = sound;

  cachedTasks.value.push(task);
};

const autoAnswer = () => {
  emitAnswer({
    isCorrect: false,
    answerString: "",
    autoAnswer: true,
    task: currentTask.value,
  });

  nextTask();
};

const emitAnswer = (props: AnswerProps) => {
  emit("answer", props);
};

const startGame = () => {
  preloadTask();
  preloadTask();
  preloadTask();

  currentTask.value = cachedTasks.value.shift();

  for (let i = 0; i < buttons.value.length; i++) {
    buttons.value[i].label = currentTask.value.task.variants[i];
  }

  setTimeout(() => {
    playCurrentTask();
    startTaskTimeout();
  }, 1000);
};

const startTaskTimeout = () => {
  if (props.startTaskTimeout) {
    props.startTaskTimeout(currentTask.value.settings?.timeout);
  }
};

const playCurrentTask = () => {
  if (!isModalOpen.value && props.energy) {
    currentTask.value.sound.play();
    currentTask.value.sound.on("end", () => {
      buttonsBlocked.value = false;
    });
  }

  if (interval) {
    clearInterval(interval);
  }

  interval = setInterval(() => {
    if (!isModalOpen.value && props.energy) {
      currentTask.value.sound.play();
      currentTask.value.sound.on("end", () => {
        buttonsBlocked.value = false;
      });
    }
  }, 5000);
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

onMounted(() => {
  console.log(`audio question mounted`);

  setup();

  startGame();
});

onUnmounted(() => {
  gsapCtx?.revert();
  clearInterval(interval);
});
</script>
