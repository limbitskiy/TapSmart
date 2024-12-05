<template>
  <div class="battle-body flex-1 flex flex-col">
    <!-- task body -->
    <div class="flex-1 flex flex-col">
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
          <div v-for="pill in leftPills" :key="pill.id" class="overflow-hidden rounded-xl">
            <Transition name="match-pairs-buttons" mode="out-in">
              <Button
                v-if="pill.task"
                class="match-pairs-btn w-full h-full !px-2 break-words"
                :class="{ selected: pill.selected, success: pill.success, wrong: pill.wrong }"
                @click="(event: MouseEvent) => onButton(pill, event)"
              >
                <span class="fira-regular capitalize text-lg line-clamp-2" style="line-height: 20px">{{ pill.task.task?.question }}</span>
              </Button>
            </Transition>
          </div>
        </div>
        <div class="right grid grid-rows-[repeat(5,_minmax(50px,_60px))] gap-2 content-center">
          <div v-for="pill in rightPills" :key="pill.id" class="overflow-hidden rounded-xl">
            <Transition name="match-pairs-buttons" mode="out-in">
              <Button
                v-if="pill.task"
                class="match-pairs-btn w-full h-full !px-2 break-words"
                :class="{ selected: pill.selected, success: pill.success, wrong: pill.wrong }"
                style="background: linear-gradient(180deg, rgba(4, 4, 4, 0.6) 0%, rgba(0, 0, 0, 0.4) 100%)"
                @click="(event: MouseEvent) => onButton(pill, event)"
              >
                <span class="fira-regular capitalize text-lg line-clamp-2" style="line-height: 20px">{{ pill.task.task?.answer }}</span>
              </Button>
            </Transition>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from "vue";
import { getAsset } from "@/utils";

// types
import { AnswerProps, Task } from "@/types";

// logic
import { useMatchPairsLogic } from "./useMatchPairsLogic";

interface Pill {
  id: number;
  task?: Task;
  wrong?: boolean;
  success?: boolean;
  selected?: boolean;
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
  taskTimeoutStatus: { timeout: number | null; status: string };
  startTaskTimeout: (customTimeout?: number) => void;
  pauseTaskTimeout: () => void;
}>();

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

    emitAnswer({ isCorrect, answerString: pill.task.task.answer, task: selectedLeft.task, event });

    if (!isCorrect) {
      clearSelected(selectedLeft, selectedRight);
      animateWrong(selectedLeft, selectedRight);
      setTimeout(() => {
        isAnimationRunning = false;
      }, settings.animationSpeed);
      return;
    }

    buttonsMissing += 1;

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

      startTaskTimeout();
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

  buttonsMissing += 1;

  // remove task with smallest ID
  removeTask(smallestIdTask.id);

  // refill tasks if needed
  setTimeout(() => {
    if (buttonsMissing >= 2) {
      fillTaskAmount(2);
      buttonsMissing = 0;
    }
  }, 300);

  startTaskTimeout();
};

const emitAnswer = (props: AnswerProps) => {
  emit("answer", props);
};

const fillTaskAmount = (amount: number) => {
  for (let i = 0; i < amount; i++) {
    const newTask = props.getNextTask();
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
  for (let i = 0; i < settings.maxTasks; i++) {
    const newTask = props.getNextTask();
    addTask(newTask);
  }

  startTaskTimeout();
};

const startTaskTimeout = () => {
  if (props.startTaskTimeout) {
    props.startTaskTimeout();
  }
};

const applySettings = () => {};

onMounted(() => {
  console.log(`match pairs mounted`);

  applySettings();

  startGame();
});
</script>
