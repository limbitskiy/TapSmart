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
        <div class="left grid grid-rows-5 gap-2">
          <div v-for="pill in shuffledPills1" :key="pill.buttons.left.id">
            <Transition name="match-pairs-buttons" mode="out-in">
              <Button
                v-if="pill.task"
                :id="`left-${pill.id}`"
                class="match-pairs-btn w-full h-full"
                :class="{ selected: pill.buttons.left.selected, success: pill.buttons.left.success, wrong: pill.buttons.left.wrong }"
                @click="(event) => onButton(pill, pill.buttons.left, event)"
              >
                <span class="fira-regular text-base">{{ pill?.task?.task?.question }}</span>
              </Button>
            </Transition>
          </div>
        </div>
        <div class="right grid grid-rows-5 gap-2">
          <div v-for="pill in shuffledPills2" :key="pill.buttons.right.id">
            <Transition name="match-pairs-buttons" mode="out-in">
              <Button
                v-if="pill.task"
                :id="`right-${pill.id}`"
                class="match-pairs-btn w-full h-full"
                :class="{ selected: pill.buttons.right.selected, success: pill.buttons.right.success, wrong: pill.buttons.right.wrong }"
                @click="(event) => onButton(pill, pill.buttons.right, event)"
              >
                <span class="fira-regular text-base">{{ pill?.task?.task?.answer }}</span>
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
  { task: {}, buttons: { left: { id: 0 }, right: { id: 5 } } },
  { task: {}, buttons: { left: { id: 1 }, right: { id: 6 } } },
  { task: {}, buttons: { left: { id: 2 }, right: { id: 7 } } },
  { task: {}, buttons: { left: { id: 3 }, right: { id: 8 } } },
  { task: {}, buttons: { left: { id: 4 }, right: { id: 9 } } },
]);

const shuffledPills1 = computed(() => shuffle(pills.value));
const shuffledPills2 = computed(() => shuffle(pills.value));

let selected = {};

let buttonsMissing = 0;

const onButton = (pill, btn, event) => {
  // outline a btn
  btn.selected = !btn.selected;
  if (selected[btn.id]) {
    delete selected[btn.id];
  } else {
    selected[btn.id] = { task: JSON.parse(JSON.stringify(pill)), button: btn };
  }

  if (Object.keys(selected).length >= 2) {
    const selected1 = selected[Object.keys(selected)[0]];
    const selected2 = selected[Object.keys(selected)[1]];

    // remove outline
    removeHightLights();

    // remove selected shortcuts

    selected = {};

    const isCorrect = selected1.task.id === selected2.task.id;

    if (!isCorrect) {
      animateButtonsWrong(selected1, selected2);
      return;
    }

    handleAnswer({ answerString: selected2.task.task.task.answer, isCorrect, task: pill.task, event });

    const btnId = selected1.button.id;

    // highlight correct answer
    pills.value[btnId].buttons.left.success = true;
    pills.value[btnId].buttons.right.success = true;

    setTimeout(() => {
      // remove this task
      const pillToClear = getPillIdxByTaskID(pill.task.id);
      removeTaskAtPillIdx(pillToClear.index);

      // remove success
      removeSuccess();

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

const handleAnswer = ({ answerString, isCorrect, task, event, autoAnswer }: { answerString: string; isCorrect: boolean; task: Task; event: MouseEvent }) => {
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
  Object.keys(pills.value).forEach((task) => {
    if (!pills.value[task].task) {
      pills.value[task].task = getNextTask();
    }
  });
};

const removeHightLights = () => {
  Object.keys(pills.value).forEach((key) => {
    if (pills.value[key].buttons.left.selected) {
      pills.value[key].buttons.left.selected = false;
    }

    if (pills.value[key].buttons.right.selected) {
      pills.value[key].buttons.right.selected = false;
    }
  });
};

const removeSuccess = () => {
  Object.keys(pills.value).forEach((key) => {
    if (pills.value[key].buttons.left.success) {
      pills.value[key].buttons.left.success = false;
    }

    if (pills.value[key].buttons.right.success) {
      pills.value[key].buttons.right.success = false;
    }
  });
};

const animateButtonsWrong = (selected1, selected2) => {
  setTimeout(() => {
    removeHightLights();
  }, 200);

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
  Object.keys(pills.value).forEach((key) => {
    const loadedTask = getNextTask();
    // add task
    pills.value[key].task = loadedTask;

    // add id
    pills.value[key].id = Math.floor(Math.random() * 999999);

    // add visible field
    pills.value[key].visible = true;
  });
};

const findTaskWithSmallestID = () => {
  const idArr = [];
  Object.keys(pills.value).forEach((key) => {
    if (pills.value[key].task?.id) {
      idArr.push(pills.value[key].task?.id);
    }
  });
  idArr.sort((a, b) => a - b);

  let found;
  Object.keys(pills.value).forEach((key) => {
    if (pills.value[key].task?.id === idArr[0]) {
      found = pills.value[key].task;
    }
  });
  return found;
};

const getPillIdxByTaskID = (id) => {
  let found = {};
  pills.value.forEach((pill, index) => {
    if (pill.task?.id === id) {
      found.pill = pill;
      found.index = index;
    }
  });
  return found;
};

const removeTaskAtPillIdx = (idx) => {
  delete pills.value[idx].task;
};

onMounted(() => {
  console.log(`match pairs mounted`);

  applySettings();

  startGame();
});
</script>
