<template>
  <div class="battle-body flex-1 flex flex-col">
    <!-- task body -->
    <BackgroundPill
      class="flex-1 !p-4 z-10 rounded-[25px] relative overflow-hidden border border-[#185a8d]"
      style="background: linear-gradient(180deg, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.4) 100%)"
      dark
    >
      <div class="flex-1 grid grid-rows-[60px_auto_150px]">
        <!-- task header -->
        <div class="header flex items-center justify-between mb-4">
          <Button v-if="type !== 'challenge'" class="!p-0 bg-[var(--grey-dark)]" activeColor="#858585" @click="() => emit('changeMech')">
            <BattleHeader icon="mech_2" :gameLocale="locales?.['mechanics_category']" :title="locales?.[`4answers_title`] || 'Four answers'" />
          </Button>

          <!-- take up the space for justify-between to work -->
          <div v-else class="placeholder w-1"></div>
          <div class="right flex items-center gap-3">
            <CircleCountdown v-if="type === 'relax'" :strokeWidth="2" color="grey" :size="20" />
            <VolumeControl />
          </div>
        </div>

        <!-- task body -->
        <div class="task-cnt flex-1 flex flex-col">
          <div class="task-content grid grid-rows-[80px_auto] flex-1 justify-items-center px-2">
            <div class="task-title-cnt flex flex-col justify-center">
              <Pill class="rounded-xl bg-transparent">
                <span v-if="!task?.settings?.isAds" class="question-title text-center text-[var(--accent-color)]">{{
                  locales?.["mechanics_2_task"] || "Is this translation correct??"
                }}</span>
              </Pill>
            </div>

            <div class="slide-cnt flex flex-col justify-center">
              <Transition name="fade" mode="out-in">
                <div v-if="task" :key="task?.task?.question" class="flex flex-col gap-2 items-center text-center break-words">
                  <div class="question-cnt max-w-[calc(100dvw-5rem)] mb-10">
                    <span class="fira-condensed-black line-clamp-2" style="font-size: clamp(28px, 10vw, 42px)" :style="task?.settings?.style?.question"
                      >{{ task?.task?.question }}
                    </span>
                  </div>
                </div>
              </Transition>
            </div>
          </div>
        </div>

        <!-- buttons -->
        <div v-if="buttonValues[0]" class="answer-buttons grid w-full grid-cols-2 grid-rows-2 gap-4 leading-5">
          <Button
            :disabled="type === 'relax' && energy <= 0"
            class="four-answer-btn"
            :class="{
              correct: btnAnimation[0] === 'correct',
              wrong: btnAnimation[0] === 'wrong',
            }"
            style="background: linear-gradient(180deg, rgba(4, 4, 4, 0.6) 0%, rgba(0, 0, 0, 0.4) 100%); transition: 0.2s"
            @click="(event) => handleAnswer(task?.task?.variants[0], event, task, 0)"
          >
            {{ buttonValues[0] }}
          </Button>
          <Button
            :disabled="type === 'relax' && energy <= 0"
            class="four-answer-btn"
            :class="{
              correct: btnAnimation[1] === 'correct',
              wrong: btnAnimation[1] === 'wrong',
            }"
            style="background: linear-gradient(180deg, rgba(4, 4, 4, 0.6) 0%, rgba(0, 0, 0, 0.4) 100%); transition: 0.2s"
            @click="(event) => handleAnswer(task?.task?.variants[1], event, task, 1)"
          >
            {{ buttonValues[1] }}
          </Button>
          <Button
            :disabled="type === 'relax' && energy <= 0"
            class="four-answer-btn"
            :class="{
              correct: btnAnimation[2] === 'correct',
              wrong: btnAnimation[2] === 'wrong',
            }"
            style="background: linear-gradient(180deg, rgba(4, 4, 4, 0.6) 0%, rgba(0, 0, 0, 0.4) 100%); transition: 0.2s"
            @click="(event) => handleAnswer(task?.task?.variants[2], event, task, 2)"
          >
            {{ buttonValues[2] }}
          </Button>
          <Button
            :disabled="type === 'relax' && energy <= 0"
            class="four-answer-btn"
            :class="{
              correct: btnAnimation[3] === 'correct',
              wrong: btnAnimation[3] === 'wrong',
            }"
            style="background: linear-gradient(180deg, rgba(4, 4, 4, 0.6) 0%, rgba(0, 0, 0, 0.4) 100%); transition: 0.2s"
            @click="(event) => handleAnswer(task?.task?.variants[3], event, task, 3)"
          >
            {{ buttonValues[3] }}
          </Button>
        </div>

        <Transition name="correct-text" mode="out-in">
          <div
            v-if="correctAnswer.shown"
            class="wrong-text absolute z-20 left-0 right-0 top-0 bottom-0 grid place-items-center pointer-events-none mb-14 px-4 overflow-x-hidden break-words"
          >
            <div class="flex flex-col gap-2 items-center justify-center text-center mb-5">
              <div class="max-w-[calc(100dvw-5rem)]">
                <span class="fira-condensed-black text-red-500 line-clamp-2" style="font-size: clamp(28px, 10vw, 42px)">{{ correctAnswer.question }}</span>
              </div>
              <div class="max-w-[calc(100dvw-5rem)]">
                <span class="fira-condensed-black text-red-400 line-clamp-2" style="font-size: clamp(26px, 8vw, 42px)">{{ correctAnswer.answer }}</span>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </BackgroundPill>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { getAsset } from "@/utils";
import { Task } from "@/types";

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
  task: {};
  locales: {};
  energy: number;
  buttonsBlocked: boolean;
}>();

const buttonValues = ref({
  0: props.task?.task?.variants[0],
  1: props.task?.task?.variants[1],
  2: props.task?.task?.variants[2],
  3: props.task?.task?.variants[3],
});

const correctAnswer = ref({
  shown: false,
  question: "",
  answer: "",
  timeout: null,
});

const btnAnimation = ref({
  0: null,
  1: null,
  2: null,
  3: null,
});

const settings = {
  correctTaskDelay: 0,
  wrongTaskDelay: 0,
  yesBtnDelay: 0,
  noBtnDelay: 0,
};

console.log(`4answers created`);

const handleAnswer = (answer: string, event, task: Task, btnId: number) => {
  if ((props.type === "relax" && props.energy <= 0) || !props.task) return;

  const isCorrect = answer === props.task.correct;

  let taskDelay = settings.correctTaskDelay;

  if (isCorrect && !task.settings?.isAds) {
    btnAnimation.value[btnId] = "correct";
    setTimeout(() => {
      btnAnimation.value[btnId] = null;
    }, settings.yesBtnDelay);
  } else if (!isCorrect && !task.settings?.isAds) {
    btnAnimation.value[btnId] = "wrong";
    setTimeout(() => {
      btnAnimation.value[btnId] = null;
    }, settings.noBtnDelay);
  }

  if (props.type === "relax" && !isCorrect && !task.settings?.isAds) {
    // wrong answer in relax mode creates a 2s delay
    taskDelay = settings.wrongTaskDelay;

    // wrong answer in relax mode creates correct answer popup
    clearTimeout(correctAnswer.value.timeout);

    correctAnswer.value.shown = true;
    correctAnswer.value.question = props.task.task.question;
    correctAnswer.value.answer = props.task.correct;

    correctAnswer.value.timeout = setTimeout(() => {
      correctAnswer.value.shown = false;
      correctAnswer.value.question = "";
      correctAnswer.value.answer = "";
    }, 1500);
  }

  emit("answer", {
    isCorrect,
    answer,
    event,
    drawBonus: task.settings?.isAds || props.type === "challenge" ? false : true,
    task,
    nextTaskDelay: taskDelay,
  });
};

watch(
  () => props.task,
  (val) => {
    if (val) {
      buttonValues.value[0] = val.task.variants[0];
      buttonValues.value[1] = val.task.variants[1];
      buttonValues.value[2] = val.task.variants[2];
      buttonValues.value[3] = val.task.variants[3];
    }
  }
);

onMounted(() => {
  console.log(`4answers mounted`);

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
});
</script>
