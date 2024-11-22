<template>
  <div class="battle-body flex-1 flex flex-col">
    <!-- task body -->
    <div class="flex-1 grid grid-rows-[60px_auto]">
      <!-- task header -->
      <div class="header flex items-center justify-between border border-gray-600 rounded-xl p-2">
        <Button v-if="type !== 'challenge'" class="!p-0 bg-[var(--grey-dark)]" activeColor="#858585" @click="() => emit('changeMech')">
          <BattleHeader :gameLocale="locales?.['mechanics_category']" :title="locales?.[`match_pairs_title`] || 'match pairs'" />
        </Button>

        <!-- take up the space for justify-between to work -->
        <div v-else class="placeholder w-1"></div>
        <div class="right flex items-center gap-3">
          <CircleCountdown v-if="type === 'relax'" :strokeWidth="2" color="grey" :size="20" />
          <VolumeControl />
        </div>
      </div>

      <div class="task-title flex flex-col mt-4">
        <span class="question-title text-center text-[var(--accent-color)]">{{ locales?.["mechanics_5_task"] || "pick a match:" }}</span>
        <div class="underline h-[1px] w-full bg-[var(--accent-color)]"></div>
      </div>

      <!-- buttons -->
      <div class="answer-buttons grid w-full grid-cols-2 gap-4 leading-5 flex-1 mt-4">
        <div class="left grid grid-rows-5 gap-4">
          <div v-for="btn in leftButtons" :key="btn.id">
            <Button
              v-if="btn.task"
              :id="`left-${btn.id}`"
              class="match-pairs-btn w-full"
              :class="{ '!bg-blue-500': selected[0] === btn.id, wrong: btn.wrong }"
              @click="(event) => onButton('question', btn, event)"
            >
              <span class="fira-regular text-base">{{ btn?.task.task.question }}</span>
            </Button>
          </div>
        </div>
        <div class="right grid grid-rows-5 gap-4">
          <div v-for="btn in rightButtons" :key="btn.id">
            <Button
              v-if="btn.task"
              :id="`right-${btn.id}`"
              class="match-pairs-btn w-full"
              :class="{ '!bg-blue-500': selected[1] === btn.id, wrong: btn.wrong }"
              @click="(event) => onButton('answer', btn, event)"
            >
              <span class="fira-regular text-base">{{ btn?.task.task.answer }}</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from "vue";
import { getAsset } from "@/utils";
import { Task } from "@/types";
import { shuffle } from "lodash-es";
import gsap from "gsap";

// store
import { useMainStore } from "@/store/main";
import { storeToRefs } from "pinia";

const store = useMainStore();

const emit = defineEmits<{
  answer: [
    data: {
      isCorrect: boolean;
      answer: string;
      event: MouseEvent;
      task: Task;
      drawBonus: boolean;
      nextTaskDelay: number;
    }
  ];
  changeMech: [];
}>();

const props = defineProps<{
  type: "relax" | "challenge";
  locales: {};
}>();

const { battleStarted } = storeToRefs(store.battleStore);
const { startBreakpoint, startTaskTimeout, resetBattleStats, incrementTask, removeTaskFromBatch, giveNextTask } = store.battleStore;

const settings = {
  correctTaskDelay: 0,
  wrongTaskDelay: 0,
  yesBtnDelay: 0,
  noBtnDelay: 0,
};

const applySettings = () => {
  if (props.type === "relax") {
    settings.correctTaskDelay = 350;
    settings.wrongTaskDelay = 2000;
    settings.yesBtnDelay = 300;
    settings.noBtnDelay = 2000;
  } else if (props.type === "challenge") {
    settings.correctTaskDelay = 350;
    settings.wrongTaskDelay = 350;
    settings.yesBtnDelay = 300;
    settings.noBtnDelay = 300;
  }
};

const taskArray = ref({
  0: {},
  1: {},
  2: {},
  3: {},
  4: {},
});

const selected = ref([null, null]);

const leftButtons = computed(() => shuffle(Object.keys(taskArray.value).map((key) => taskArray.value[key])));
const rightButtons = computed(() => shuffle(Object.keys(taskArray.value).map((key) => taskArray.value[key])));

let buttonsMissing = 0;

const onButton = (type, btn, event) => {
  if (type === "question") {
    if (selected.value[0] === btn.id) {
      selected.value[0] = null;
      return;
    }
    selected.value[0] = btn.id;
  } else if (type === "answer") {
    if (selected.value[1] === btn.id) {
      selected.value[1] = null;
      return;
    }
    selected.value[1] = btn.id;
  }

  if (isNumber(selected.value[0]) && isNumber(selected.value[1])) {
    const isCorrect = selected.value[0] === selected.value[1];

    if (!isCorrect) {
      const _selected = [...selected.value];
      selected.value = [];

      // animateButtonsWrong(_selected);
      return;
    }

    handleAnswer(selected.value[1], isCorrect, btn.task, event);

    setTimeout(() => {
      // remove buttons
      // buttonsLeft.value.find((btn) => btn.id === selected.value[0]).visible = false;
      // buttonsRight.value.find((btn) => btn.id === selected.value[1]).visible = false;
      buttonsMissing += 1;

      selected.value = [];

      // remove this task
      setTimeout(() => {
        delete btn.task;

        if (buttonsMissing >= 2) {
          refillTasks();
          buttonsMissing = 0;
        }
      }, 500);
    }, 500);
  }
};

const animateButtonsWrong = (buttons) => {
  buttonsLeft.value[buttons[0]].wrong = true;
  buttonsRight.value[buttons[1]].wrong = true;

  setTimeout(() => {
    buttonsLeft.value[buttons[0]].wrong = false;
    buttonsRight.value[buttons[1]].wrong = false;
  }, 100);

  setTimeout(() => {
    buttonsLeft.value[buttons[0]].wrong = true;
    buttonsRight.value[buttons[1]].wrong = true;
  }, 200);

  setTimeout(() => {
    buttonsLeft.value[buttons[0]].wrong = false;
    buttonsRight.value[buttons[1]].wrong = false;
  }, 300);
};

const refillTasks = () => {
  Object.keys(taskArray.value).forEach((task) => {
    if (!taskArray.value[task].task) {
      taskArray.value[task].task = giveNextTask();
    }
  });
};

const handleAnswer = (answerString: string, isCorrect: boolean, task: Task, event) => {
  emit("answer", {
    isCorrect,
    answer: answerString,
    event,
    drawBonus: props.type === "challenge" ? false : true,
    task,
    nextTaskDelay: 1000,
  });
};

const shuffleButtons = () => {
  // buttonsLeft.value = shuffle(buttonsLeft.value);
  // buttonsRight.value = shuffle(buttonsRight.value);
};

const isNumber = (variable: any) => {
  return typeof variable === "number";
};

const startGame = () => {
  console.log(`starting relax locally`);

  battleStarted.value = true;
  resetBattleStats();
  startBreakpoint("battle");
  startTaskTimeout();

  // shuffleButtons();
  Object.keys(taskArray.value).forEach((key) => {
    const loadedTask = giveNextTask();
    taskArray.value[key].task = loadedTask;
    taskArray.value[key].id = Math.random() * 999999;
    taskArray.value[key].visible = true;
  });
};

onMounted(() => {
  console.log(`match pairs mounted`);

  applySettings();

  startGame();
});
</script>
