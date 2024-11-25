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
          <div v-for="pill in shuffledPills1" :key="pill.buttons.left.id">
            <Transition name="match-pairs-buttons" mode="out-in">
              <Button
                v-if="pill.task"
                :id="`left-${pill.id}`"
                class="match-pairs-btn w-full h-full"
                :class="{ selected: selected.left?.button.id === pill.buttons.left.id, success: pill.buttons.left.success, wrong: pill.buttons.left.wrong }"
                @click="(event: MouseEvent) => onButton(pill, pill.buttons.left, event)"
              >
                <span class="fira-regular text-base inline-block line-clamp-2" style="line-height: 20px">{{ pill?.task?.task?.question }}</span>
              </Button>
            </Transition>
          </div>
        </div>
        <div class="right grid grid-rows-[repeat(5,_minmax(50px,_60px))] gap-2 content-center">
          <div v-for="pill in shuffledPills2" :key="pill.buttons.right.id">
            <Transition name="match-pairs-buttons" mode="out-in">
              <Button
                v-if="pill.task"
                :id="`right-${pill.id}`"
                class="match-pairs-btn w-full h-full"
                :class="{ selected: selected.right?.button.id === pill.buttons.right.id, success: pill.buttons.right.success, wrong: pill.buttons.right.wrong }"
                @click="(event: MouseEvent) => onButton(pill, pill.buttons.right, event)"
              >
                <span class="fira-regular text-base inline-block line-clamp-2" style="line-height: 20px">{{ pill?.task?.task?.answer }}</span>
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
  task: Task;
  buttons: { left: PillButton; right: PillButton };
}

interface PillButton {
  id: 0;
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

const { battleStarted } = storeToRefs(store.battleStore);
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

const pills = ref([
  { task: {}, buttons: { left: { id: 2 }, right: { id: 1 } } },
  { task: {}, buttons: { left: { id: 4 }, right: { id: 3 } } },
  { task: {}, buttons: { left: { id: 6 }, right: { id: 5 } } },
  { task: {}, buttons: { left: { id: 8 }, right: { id: 7 } } },
  { task: {}, buttons: { left: { id: 10 }, right: { id: 9 } } },
]);

const shuffledPills1 = computed(() => shuffle(pills.value));
const shuffledPills2 = computed(() => shuffle(pills.value));

let selected = ref({
  left: null,
  right: null,
});

let buttonsMissing = 0;

const onButton = (pill: Pill, btn: PillButton, event: MouseEvent) => {
  if (btn.id % 2 === 0) {
    selected.value.left = { task: JSON.parse(JSON.stringify(pill)), button: btn };
  } else {
    selected.value.right = { task: JSON.parse(JSON.stringify(pill)), button: btn };
  }

  if (selected.value.left && selected.value.right) {
    const isCorrect = selected.value.left.task.id === selected.value.right.task.id;

    if (!isCorrect) {
      animateButtonsWrong(selected.value.left, selected.value.right);
      setTimeout(() => {
        clearSelected();
      }, 300);
      return;
    }

    handleAnswer({ answerString: pill.task.task.answer, isCorrect, task: pill.task, event });

    // highlight correct answer
    pill.buttons.left.success = true;
    pill.buttons.right.success = true;

    setTimeout(() => {
      // remove this task
      const pillToClear = getPillIdxByTaskID(pill.task.id);
      removeTaskAtPillIdx(pillToClear.index);

      // remove success
      removeSuccess();

      clearSelected();

      setTimeout(() => {
        if (buttonsMissing >= 2) {
          refillTasks();
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

const refillTasks = () => {
  pills.value.forEach((pill) => {
    if (!pill.task) {
      pill.task = getNextTask();
    }
  });
};

const clearSelected = () => {
  selected.value.left = null;
  selected.value.right = null;
};

const removeSuccess = () => {
  pills.value.forEach((pill) => {
    if (pill.buttons.left.success) {
      pill.buttons.left.success = false;
    }

    if (pill.buttons.right.success) {
      pill.buttons.right.success = false;
    }
  });
};

const animateButtonsWrong = (selected1, selected2) => {
  selected1.button.wrong = true;
  selected2.button.wrong = true;

  setTimeout(() => {
    selected1.button.wrong = false;
    selected2.button.wrong = false;
  }, 300);
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
  const pillToClear = getPillIdxByTaskID(taskWithSmallestID.id);
  removeTaskAtPillIdx(pillToClear.index);
  clearSelected();

  // refill tasks if needed
  setTimeout(() => {
    if (buttonsMissing >= 2) {
      refillTasks();
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

  // shuffleButtons();
  pills.value.forEach((pill) => {
    const loadedTask = getNextTask();
    // add task
    pill.task = loadedTask;

    // add id
    pill.id = Math.floor(Math.random() * 999999);

    // add visible field
    pill.visible = true;
  });
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

const getPillIdxByTaskID = (id: number) => {
  let found = {};
  pills.value.forEach((pill, index) => {
    if (pill.task?.id === id) {
      found.pill = pill;
      found.index = index;
    }
  });
  return found;
};

const removeTaskAtPillIdx = (idx: number) => {
  delete pills.value[idx].task;
};

onMounted(() => {
  console.log(`match pairs mounted`);

  applySettings();

  startGame();
});
</script>
