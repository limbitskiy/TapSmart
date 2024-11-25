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

      <!-- debug -->
      <!-- <div class="btnc flex gap-2">
        <Button class="!py-0 !text-sm" @click="removeT">remove</Button>
        <Button class="!py-0 !text-sm" @click="addT">add</Button>
      </div> -->

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
import gsap from "gsap";

// types
import { Task } from "@/types";

// store
import { useMainStore } from "@/store/main";
import { storeToRefs } from "pinia";

// logic
import { useMatchPairsLogic } from "./useMatchPairsLogic";

interface Pill {
  id: number;
  task?: Task;
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
  maxTasks: 5,
  animationSpeed: 200,
};

const { leftPills, rightPills, addTask, removeTask, getSmallestIdTask } = useMatchPairsLogic(settings);

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
      }, settings.animationSpeed);
      return;
    }

    handleAnswer({ answerString: pill.task.task.answer, isCorrect, task: pill.task, event });

    animateCorrect();

    setTimeout(() => {
      // remove this task
      removeTask(pill.task.id);

      removeSuccess();

      clearSelected();

      setTimeout(() => {
        if (buttonsMissing >= 2) {
          fillTaskAmount(2);
          buttonsMissing = 0;
        }
      }, settings.animationSpeed);

      if (props.type === "relax") {
        startTaskTimeout(timeoutCallback);
      }
    }, settings.animationSpeed);
  }
};

const handleAnswer = ({ answerString, isCorrect, task, event, autoAnswer }: { answerString: string; isCorrect: boolean; task: Task; event?: MouseEvent; autoAnswer: boolean }) => {
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

const fillTaskAmount = (amount: number) => {
  for (let i = 0; i < amount; i++) {
    const newTask = getNextTask();
    addTask(newTask);
  }
};

const clearSelected = () => {
  if (selected.value.left) {
    selected.value.left.selected = false;
  }

  if (selected.value.right) {
    selected.value.right.selected = false;
  }

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
  }, settings.animationSpeed);
};

const animateCorrect = () => {
  selected.value.left.success = true;
  selected.value.right.success = true;
};

const timeoutCallback = () => {
  const smallestIdTask = getSmallestIdTask();

  handleAnswer({
    isCorrect: false,
    answerString: "",
    autoAnswer: true,
    task: smallestIdTask,
  });

  // remove task with smallest ID
  removeTask(smallestIdTask.id);

  clearSelected();

  // refill tasks if needed
  setTimeout(() => {
    if (buttonsMissing >= 2) {
      fillTaskAmount(2);
      buttonsMissing = 0;
    }
  }, 300);

  startTaskTimeout(timeoutCallback);
};

const startGame = () => {
  console.log(`starting match pairs locally`);

  battleStarted.value = true;
  resetBattleStats();
  startBreakpoint("battle");

  if (props.type === "relax") {
    startTaskTimeout(timeoutCallback);
  }

  for (let i = 0; i < settings.maxTasks; i++) {
    const newTask = getNextTask();
    addTask(newTask);
  }
};

const applySettings = () => {
  if (props.type === "relax") {
  } else if (props.type === "challenge") {
  }
};

onMounted(() => {
  console.log(`match pairs mounted`);

  applySettings();

  startGame();
});
</script>
