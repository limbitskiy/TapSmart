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

const { battleStarted, correctStreak, afkCounter, settings: battleSettings } = storeToRefs(store.battleStore);
const { startTaskTimeout, startBreakpoint, resetBattleStats, getNextTask, addEnergy } = store.battleStore;

const settings = {
  maxTasks: 5,
  animationSpeed: 200,
};

const { leftPills, rightPills, addTask, removeTask, getSmallestIdTask } = useMatchPairsLogic(settings);

let selected = ref({
  left: null,
  right: null,
});

const bothPillsAreSelected = computed(() => selected.value.left && selected.value.right);

let isAnimationRunning = false;
let buttonsMissing = 0;

const handleSelection = (pill: Pill) => {
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
};

const onButton = (pill: Pill, event: MouseEvent) => {
  handleSelection(pill);

  if (bothPillsAreSelected.value && !isAnimationRunning) {
    isAnimationRunning = true;

    // make local copy and clear shortcuts
    const selectedLeft = selected.value.left!;
    const selectedRight = selected.value.right!;
    selected.value.left = null;
    selected.value.right = null;

    const isCorrect = selectedLeft?.task?.id === selectedRight?.task?.id;

    if (!isCorrect) {
      afkCounter.value = 0;
      correctStreak.value = 0;
      addEnergy(battleSettings.value.energyOnWrong);
      clearSelected(selectedLeft, selectedRight);
      animateWrong(selectedLeft, selectedRight);
      setTimeout(() => {
        isAnimationRunning = false;
      }, settings.animationSpeed);
      return;
    }

    emitAnswer({ answerString: pill.task.task.answer, isCorrect, task: pill.task, event });

    animateCorrect(selectedLeft, selectedRight);

    setTimeout(() => {
      // remove this task
      removeTask(pill.task.id);

      clearSelected(selectedLeft, selectedRight);

      removeSuccess(selectedLeft, selectedRight);

      isAnimationRunning = false;

      setTimeout(() => {
        if (buttonsMissing >= 2) {
          fillTaskAmount(2);
          buttonsMissing = 0;
        }
      }, settings.animationSpeed);

      if (props.type === "relax") {
        startTaskTimeout(autoAnswer);
      }
    }, settings.animationSpeed);
  }
};

const autoAnswer = () => {
  const smallestIdTask = getSmallestIdTask();

  emitAnswer({
    isCorrect: false,
    answerString: "",
    autoAnswer: true,
    task: smallestIdTask,
  });

  // remove task with smallest ID
  removeTask(smallestIdTask.id);

  // refill tasks if needed
  setTimeout(() => {
    if (buttonsMissing >= 2) {
      fillTaskAmount(2);
      buttonsMissing = 0;
    }
  }, 300);

  startTaskTimeout(autoAnswer);
};

const emitAnswer = ({ answerString, isCorrect, task, event, autoAnswer }: { answerString: string; isCorrect: boolean; task: Task; event?: MouseEvent; autoAnswer: boolean }) => {
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

const clearSelected = (selectedLeft: Pill, selectedRight: Pill) => {
  if (selectedLeft) {
    selectedLeft.selected = false;
  }

  if (selectedRight) {
    selectedRight.selected = false;
  }
};

const removeSuccess = (selectedLeft: Pill, selectedRight: Pill) => {
  selectedLeft.success = false;
  selectedRight.success = false;
};

const animateWrong = (selectedLeft: Pill, selectedRight: Pill) => {
  selectedLeft.wrong = true;
  selectedRight.wrong = true;

  setTimeout(() => {
    selectedLeft.wrong = false;
    selectedRight.wrong = false;
  }, settings.animationSpeed);
};

const animateCorrect = (selectedLeft: Pill, selectedRight: Pill) => {
  selectedLeft.success = true;
  selectedRight.success = true;
};

const startGame = () => {
  console.log(`starting match pairs locally`);

  battleStarted.value = true;
  resetBattleStats();
  startBreakpoint("battle");

  if (props.type === "relax") {
    startTaskTimeout(autoAnswer);
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
