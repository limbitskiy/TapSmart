<template>
  <div class="battle-body flex-1 flex flex-col">
    <!-- task body -->
    <div class="flex-1 flex flex-col">
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

      <div class="task-title flex flex-col my-4">
        <span class="question-title text-center text-[var(--accent-color)]">{{ locales?.["mechanics_5_task"] || "pick a match:" }}</span>
        <div class="underline h-[1px] w-full bg-[var(--accent-color)]"></div>
      </div>

      <!-- buttons -->
      <div class="answer-buttons grid w-full grid-cols-2 gap-2 leading-5 flex-1">
        <div class="left grid grid-rows-5 gap-2">
          <div v-for="task in shuffledTasks1" :key="task.buttons.left.id">
            <Transition name="match-pairs-buttons" mode="out-in">
              <Button
                v-if="task.task"
                :id="`left-${task.id}`"
                class="match-pairs-btn w-full h-full"
                :class="{ selected: task.buttons.left.selected, success: task.buttons.left.success, wrong: task.buttons.left.wrong }"
                @click="(event) => onButton(task, task.buttons.left, event)"
              >
                <span class="fira-regular text-base">{{ task?.task.task.question }}</span>
              </Button>
            </Transition>
          </div>
        </div>
        <div class="right grid grid-rows-5 gap-2">
          <div v-for="task in shuffledTasks2" :key="task.buttons.right.id">
            <Transition name="match-pairs-buttons" mode="out-in">
              <Button
                v-if="task.task"
                :id="`right-${task.id}`"
                class="match-pairs-btn w-full h-full"
                :class="{ selected: task.buttons.right.selected, success: task.buttons.right.success, wrong: task.buttons.right.wrong }"
                @click="(event) => onButton(task, task.buttons.right, event)"
              >
                <span class="fira-regular text-base">{{ task?.task.task.answer }}</span>
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

const { battleStarted, currentTaskTimeout } = storeToRefs(store.battleStore);
const { startTaskTimeoutPrototype, startBreakpoint, startTaskTimeout, resetBattleStats, giveNextTask } = store.battleStore;

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
  0: { buttons: { left: { id: 0 }, right: { id: 5 } } },
  1: { buttons: { left: { id: 1 }, right: { id: 6 } } },
  2: { buttons: { left: { id: 2 }, right: { id: 7 } } },
  3: { buttons: { left: { id: 3 }, right: { id: 8 } } },
  4: { buttons: { left: { id: 4 }, right: { id: 9 } } },
});

const shuffledTasks1 = computed(() => shuffle(taskArray.value));
const shuffledTasks2 = computed(() => shuffle(taskArray.value));

let selected = {};

let buttonsMissing = 0;

const onButton = (task, btn, event) => {
  // outline a btn
  btn.selected = !btn.selected;
  if (selected[btn.id]) {
    delete selected[btn.id];
  } else {
    selected[btn.id] = { task: JSON.parse(JSON.stringify(task)), button: btn };
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
    console.log(selected2);

    handleAnswer({ answerString: selected2.task.task.task.answer, isCorrect, task: task.task, event });

    const btnId = selected1.button.id;

    // highlight correct answer
    taskArray.value[btnId].buttons.left.success = true;
    taskArray.value[btnId].buttons.right.success = true;

    setTimeout(() => {
      buttonsMissing += 1;

      // remove this task
      delete taskArray.value[btnId].task;

      // remove success
      removeSuccess();

      setTimeout(() => {
        if (buttonsMissing >= 2) {
          refillTasks();
          buttonsMissing = 0;
        }
      }, 300);

      startTaskTimeoutPrototype(timeoutCallback);
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
};

const refillTasks = () => {
  Object.keys(taskArray.value).forEach((task) => {
    if (!taskArray.value[task].task) {
      taskArray.value[task].task = giveNextTask();
    }
  });
};

const removeHightLights = () => {
  Object.keys(taskArray.value).forEach((key) => {
    if (taskArray.value[key].buttons.left.selected) {
      taskArray.value[key].buttons.left.selected = false;
    }

    if (taskArray.value[key].buttons.right.selected) {
      taskArray.value[key].buttons.right.selected = false;
    }
  });
};

const removeSuccess = () => {
  Object.keys(taskArray.value).forEach((key) => {
    if (taskArray.value[key].buttons.left.success) {
      taskArray.value[key].buttons.left.success = false;
    }

    if (taskArray.value[key].buttons.right.success) {
      taskArray.value[key].buttons.right.success = false;
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
  console.log(taskWithSmallestID);

  handleAnswer({
    isCorrect: false,
    answerString: "",
    autoAnswer: true,
    task: taskWithSmallestID,
  });
  startTaskTimeoutPrototype(timeoutCallback);
};

const startGame = () => {
  console.log(`starting relax locally`);

  battleStarted.value = true;
  resetBattleStats();
  startBreakpoint("battle");
  startTaskTimeoutPrototype(timeoutCallback);

  // shuffleButtons();
  Object.keys(taskArray.value).forEach((key) => {
    const loadedTask = giveNextTask();
    // add task
    taskArray.value[key].task = loadedTask;

    // add id
    taskArray.value[key].id = Math.floor(Math.random() * 999999);

    // add visible field
    taskArray.value[key].visible = true;
  });

  console.log(taskArray.value);
};

const findTaskWithSmallestID = () => {
  const idArr = [];
  Object.keys(taskArray.value).forEach((key) => {
    if (taskArray.value[key].task?.id) {
      idArr.push(taskArray.value[key].task?.id);
    }
  });
  idArr.sort((a, b) => a - b);

  let found;
  Object.keys(taskArray.value).forEach((key) => {
    if (taskArray.value[key].task?.id === idArr[0]) {
      found = taskArray.value[key].task;
    }
  });
  return found;
};

onMounted(() => {
  console.log(`match pairs mounted`);

  applySettings();

  startGame();
});
</script>
