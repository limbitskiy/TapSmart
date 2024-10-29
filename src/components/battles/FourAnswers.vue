<template>
  <div class="battle-body flex-1 flex">
    <BackgroundPill ref="pillRef" class="flex-1 !p-4 z-10 rounded-[15px] relative overflow-hidden" style="background: linear-gradient(180deg, #363636 0%, #272727 100%)" dark>
      <div class="header flex items-center justify-between mb-4">
        <!-- <div class="mech-title flex gap-1 items-center w-[80%]">
          <img class="h-8" :src="getAsset(`mech_2`)" />
          <span class="fira-regular text-lg text-[#B7B7B7]">{{ locales?.[`4answers_title`] || "Four answers" }}</span>
        </div> -->
        <div class="mech-title flex gap-1 items-center" @click="() => emit('changeMech')">
          <img class="h-8" :src="getAsset(`mech_2`)" />
          <div class="text-chevron flex gap-4 items-center">
            <span class="fira-regular text-lg text-[#B7B7B7]">{{ locales?.[`4answers_title`] || "Four answers" }}</span>
            <svg width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 8L0 0.982456L0.98 0L7 6.03509L13.02 0L14 0.982456L7 8Z" fill="white" />
            </svg>
          </div>
        </div>
        <div class="right flex items-center gap-3">
          <CircleCountdown v-if="type === 'relax'" :strokeWidth="2" color="grey" :size="20" />
          <VolumeControl />
        </div>
      </div>

      <div class="yes-no-battle flex-1 flex flex-col">
        <!-- question -->
        <div class="question-cnt flex-1 flex flex-col">
          <div class="question-content grid grid-rows-[40px_auto] flex-1 justify-items-center px-2">
            <div class="title-cnt flex flex-col justify-center">
              <Pill class="!py-2 rounded-xl bg-[#222]">
                <span class="question-title text-center">{{ locales?.["mechanics_2_task"] || "Is this translation correct??" }}</span>
              </Pill>
            </div>

            <div class="slide-cnt flex flex-col justify-center">
              <!-- question card -->
              <Transition name="fade" mode="out-in">
                <div v-if="task" :key="task?.task?.question" class="flex flex-col gap-2 items-center text-center break-words">
                  <div class="question-cnt max-w-[calc(100vw-5rem)]">
                    <span class="fira-condensed-black line-clamp-2" style="font-size: clamp(30px, 9vw, 46px)">{{ task?.task?.question }}</span>
                  </div>
                </div>
              </Transition>
            </div>
          </div>
        </div>

        <!-- button press animations -->
        <!-- <div
          v-if="answerAnimation.shown"
          class="answer-animation absolute rounded-full h-10 w-10 z-[-1] pulse"
          :style="`background-color: ${answerAnimation.color}; left: ${answerAnimation.coords.x}px; top: ${answerAnimation.coords.y}px`"
        ></div> -->

        <!-- buttons -->
        <div v-if="buttonValues[0]" class="answer-buttons grid w-full grid-cols-2 grid-rows-2 gap-4 leading-5">
          <Button
            :disabled="type === 'relax' && energy <= 0"
            class="four-answer-btn"
            :class="{ correct: btnAnimation[0] === 'correct', wrong: btnAnimation[0] === 'wrong' }"
            @click="(event) => handleAnswer(task?.task?.variants[0], event, 0)"
          >
            {{ buttonValues[0] }}
          </Button>
          <Button
            :disabled="type === 'relax' && energy <= 0"
            class="four-answer-btn"
            :class="{ correct: btnAnimation[1] === 'correct', wrong: btnAnimation[1] === 'wrong' }"
            @click="(event) => handleAnswer(task?.task?.variants[1], event, 1)"
          >
            {{ buttonValues[1] }}
          </Button>
          <Button
            :disabled="type === 'relax' && energy <= 0"
            class="four-answer-btn"
            :class="{ correct: btnAnimation[2] === 'correct', wrong: btnAnimation[2] === 'wrong' }"
            @click="(event) => handleAnswer(task?.task?.variants[2], event, 2)"
          >
            {{ buttonValues[2] }}
          </Button>
          <Button
            :disabled="type === 'relax' && energy <= 0"
            class="four-answer-btn"
            :class="{ correct: btnAnimation[3] === 'correct', wrong: btnAnimation[3] === 'wrong' }"
            @click="(event) => handleAnswer(task?.task?.variants[3], event, 3)"
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

const emit = defineEmits<{
  answer: [
    data: {
      isCorrect: boolean;
      answer: string;
      event: MouseEvent;
      drawBonus: boolean;
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

const answerAnimation = ref({
  shown: false,
  color: null,
  coords: { x: null, y: null },
});

const buttonValues = ref({
  0: props.task?.task?.variants[0],
  1: props.task?.task?.variants[1],
  2: props.task?.task?.variants[2],
  3: props.task?.task?.variants[3],
});

const pillRef = ref();
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

const handleAnswer = (answer: string, event, btnId: number) => {
  if ((props.type === "relax" && props.energy <= 0) || !props.task) return;

  const isCorrect = answer === props.task.correct;

  let taskDelay = settings.correctTaskDelay;

  if (isCorrect) {
    btnAnimation.value[btnId] = "correct";
    setTimeout(() => {
      btnAnimation.value[btnId] = null;
    }, settings.yesBtnDelay);
  } else {
    btnAnimation.value[btnId] = "wrong";
    setTimeout(() => {
      btnAnimation.value[btnId] = null;
    }, settings.noBtnDelay);
  }

  // const pillTop = pillRef.value.el.getBoundingClientRect().top;
  // const pillLeft = pillRef.value.el.getBoundingClientRect().left;

  // answerAnimation.value.coords.x = event.clientX - pillLeft;
  // answerAnimation.value.coords.y = event.clientY - pillTop;
  // answerAnimation.value.shown = true;

  if (props.type === "relax" && !isCorrect) {
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

  emit("answer", { isCorrect, answer, event, drawBonus: true, nextTaskDelay: taskDelay });
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
