<template>
  <div class="battle-body flex-1 flex flex-col">
    <!-- task body -->
    <div class="flex-1 flex flex-col">
      <!-- task header -->
      <div class="header flex items-center justify-between">
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

      <div class="task-title flex flex-col my-4">
        <span class="question-title text-center text-[var(--accent-color)]">{{ locales?.["mechanics_5_task"] || "pick a match:" }}</span>
        <div class="underline h-[1px] w-full bg-[var(--accent-color)]"></div>
      </div>

      <!-- buttons -->
      <div class="answer-buttons grid w-full grid-cols-2 gap-2 leading-5 flex-1">
        <div class="left grid grid-rows-[repeat(5,_minmax(50px,_60px))] gap-2 content-center">
          <div v-for="pill in leftPills" :key="pill.id">
            <Transition name="match-pairs-buttons" mode="out-in">
              <Button
                v-if="pill.task"
                class="match-pairs-btn w-full h-full"
                :class="{ selected: pill.selected, success: pill.success, wrong: pill.wrong }"
                @click="(event: MouseEvent) => onButton(pill, event)"
              >
                <span class="fira-regular text-base inline-block line-clamp-2" style="line-height: 20px">{{ pill.task.task?.question }}</span>
              </Button>
            </Transition>
          </div>
        </div>
        <div class="right grid grid-rows-[repeat(5,_minmax(50px,_60px))] gap-2 content-center">
          <div v-for="pill in rightPills" :key="pill.id">
            <Transition name="match-pairs-buttons" mode="out-in">
              <Button
                v-if="pill.task"
                class="match-pairs-btn w-full h-full"
                :class="{ selected: pill.selected, success: pill.success, wrong: pill.wrong }"
                @click="(event: MouseEvent) => onButton(pill, event)"
              >
                <span class="fira-regular text-base inline-block line-clamp-2" style="line-height: 20px">{{ pill.task.task?.answer }}</span>
              </Button>
            </Transition>
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

interface Pill {
  id: number;
  task: Task | {};
  wrong?: boolean;
  success?: boolean;
  selected?: boolean;
}

const store = useMainStore();

const emit = defineEmits<{
  answer: [
    data: {
      isCorrect: boolean;
      answer: string;
      event: MouseEvent;
      task: Task;
      drawBonus: boolean;
      autoAnswer?: boolean;
    }
  ];
  changeMech: [];
}>();

const props = defineProps<{
  type: "relax" | "challenge";
  locales: {};
}>();

const { battleStarted, correctStreak } = storeToRefs(store.battleStore);
const { startTaskTimeout, startBreakpoint, resetBattleStats, getNextTask } = store.battleStore;

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

const leftPills = ref<Pill[]>([
  { id: 2, task: {} },
  { id: 4, task: {} },
  { id: 6, task: {} },
  { id: 8, task: {} },
  { id: 10, task: {} },
]);

const rightPills = ref<Pill[]>([
  { id: 1, task: {} },
  { id: 3, task: {} },
  { id: 5, task: {} },
  { id: 7, task: {} },
  { id: 9, task: {} },
]);

let selected = ref({
  left: null,
  right: null,
});

let buttonsMissing = 0;

const onButton = (pill: Pill, event: MouseEvent) => {
  if (pill.id % 2 === 0) {
    if (selected.value.left?.selected) {
      selected.value.left.selected = false;
    }
    selected.value.left = pill;
    selected.value.left.selected = true;
  } else {
    if (selected.value.right?.selected) {
      selected.value.right.selected = false;
    }
    selected.value.right = pill;
    selected.value.right.selected = true;
  }

  if (selected.value.left && selected.value.right) {
    const isCorrect = selected.value.left.task.id === selected.value.right.task.id;

    if (!isCorrect) {
      correctStreak.value = 0;
      animateWrong();
      setTimeout(() => {
        clearSelected();
      }, 300);
      return;
    }

    handleAnswer({ answerString: pill.task.task.answer, isCorrect, task: pill.task, event });

    animateCorrect();

    setTimeout(() => {
      // remove this task
      selected.value.left.task = null;
      selected.value.right.task = null;

      removeSuccess();

      clearSelected();

      setTimeout(() => {
        if (buttonsMissing >= 2) {
          refillTasks(2);
          buttonsMissing = 0;
        }
      }, 300);

      startTaskTimeout(timeoutCallback);
    }, 300);
  }
};

const handleAnswer = ({ answerString, isCorrect, task, event, autoAnswer }: { answerString: string; isCorrect: boolean; task: Task; event: MouseEvent; autoAnswer: boolean }) => {
  emit("answer", {
    isCorrect,
    answer: answerString,
    event,
    drawBonus: false,
    task,
    autoAnswer,
  });

  buttonsMissing += 1;
};

const refillTasks = (amount) => {
  const emptyLeft = leftPills.value.filter((pill) => !pill.task);
  const emptyRight = shuffle(rightPills.value.filter((pill) => !pill.task));

  for (let i = 0; i < amount; i++) {
    const loadedTask = getNextTask();

    emptyLeft[i].task = loadedTask;
    emptyRight[i].task = loadedTask;
  }
};

const clearSelected = () => {
  selected.value.left.selected = false;
  selected.value.right.selected = false;
  selected.value.left = null;
  selected.value.right = null;
};

const removeSuccess = () => {
  selected.value.left.success = false;
  selected.value.right.success = false;
};

const animateWrong = () => {
  selected.value.left.wrong = true;
  selected.value.right.wrong = true;

  setTimeout(() => {
    selected.value.left.wrong = false;
    selected.value.right.wrong = false;
  }, 300);
};

const animateCorrect = () => {
  selected.value.left.success = true;
  selected.value.right.success = true;
};

const timeoutCallback = () => {
  const taskWithSmallestID = findTaskWithSmallestID();

  handleAnswer({
    isCorrect: false,
    answerString: "",
    autoAnswer: true,
    task: taskWithSmallestID,
  });

  // remove task with smallest ID
  removeTaskWithSmallestId();
  clearSelected();

  // refill tasks if needed
  setTimeout(() => {
    if (buttonsMissing >= 2) {
      refillTasks(2);
      buttonsMissing = 0;
    }
  }, 300);

  startTaskTimeout(timeoutCallback);
};

const startGame = () => {
  console.log(`starting relax locally`);

  battleStarted.value = true;
  resetBattleStats();
  startBreakpoint("battle");
  startTaskTimeout(timeoutCallback);

  for (let i = 0; i < leftPills.value.length; i++) {
    const loadedTask = getNextTask();

    leftPills.value[i].task = loadedTask;
    rightPills.value[i].task = loadedTask;
  }

  rightPills.value = shuffle(rightPills.value);
};

const findTaskWithSmallestID = () => {
  const idArr = [];
  pills.value.forEach((pill) => {
    if (pill.task?.id) {
      idArr.push(pill.task?.id);
    }
  });
  idArr.sort((a, b) => a - b);

  let found;
  pills.value.forEach((pill) => {
    if (pill.task?.id === idArr[0]) {
      found = pill.task;
    }
  });
  return found;
};

const removeTaskWithSmallestId = () => {};

onMounted(() => {
  console.log(`match pairs mounted`);

  applySettings();

  startGame();
});
</script>
