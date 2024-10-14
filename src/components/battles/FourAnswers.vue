<template>
  <div class="battle-body flex-1 flex">
    <BackgroundPill ref="pillRef" class="flex-1 !p-4 z-10 rounded-[15px] relative overflow-hidden" style="background: linear-gradient(180deg, #363636 0%, #272727 100%)" dark>
      <div class="header flex items-center justify-between mb-4">
        <span class="fira-regular text-lg text-[#B7B7B7]">{{ locale?.[`yesno_title`] || "Yes-no" }} battle</span>
        <div class="right flex items-center gap-3">
          <CircleCountdown v-if="type === 'relax'" :strokeWidth="2" color="grey" :size="20" />
          <VolumeControl />
        </div>
      </div>

      <div class="yes-no-battle flex-1 flex flex-col">
        <!-- question -->
        <div class="question-cnt flex-1 flex flex-col">
          <div class="question-content grid grid-rows-[40px_auto] flex-1 justify-items-center">
            <div class="title-cnt flex flex-col justify-center">
              <Pill class="!py-2 rounded-xl bg-[#222]">
                <span class="question-title text-center">{{ locales?.["mechanics_1_task"] || "Is this translation correct??" }}</span>
              </Pill>
            </div>

            <div class="slide-cnt flex flex-col justify-center">
              <!-- question card -->
              <Transition name="question-slide" mode="out-in">
                <div v-if="task" :key="task?.task?.question" class="max-w-[calc(100vw-4rem)] flex flex-col gap-2 items-center text-center">
                  <div class="question-cnt overflow-x-hidden text-ellipsis whitespace-nowrap w-full">
                    <span class="fira-condensed-black" style="font-size: clamp(30px, 9vw, 46px)">{{ task?.task?.question || "Question not found" }}</span>
                  </div>
                </div>
              </Transition>
            </div>
          </div>
        </div>

        <!-- button press animations -->
        <div
          v-if="answerAnimation.shown"
          class="answer-animation absolute rounded-full h-10 w-10 z-[-1] pulse"
          :style="`background-color: ${answerAnimation.color}; left: ${answerAnimation.coords.x}px; top: ${answerAnimation.coords.y}px`"
        ></div>

        <!-- buttons -->
        <div class="answer-buttons grid w-full grid-cols-2 grid-rows-2 gap-4 leading-5">
          <Button
            activeColor="#2c3382"
            :disabled="(type === 'relax' && energy <= 0) || buttonsBlocked || !task"
            class="four-answer-btn"
            @click="(event) => handleAnswer(task?.task?.variants[0], event)"
          >
            {{ task?.task?.variants[0] }}
          </Button>
          <Button
            activeColor="#2c3382"
            :disabled="(type === 'relax' && energy <= 0) || buttonsBlocked || !task"
            class="four-answer-btn"
            @click="(event) => handleAnswer(task?.task?.variants[1], event)"
          >
            {{ task?.task?.variants[1] }}
          </Button>
          <Button
            activeColor="#2c3382"
            :disabled="(type === 'relax' && energy <= 0) || buttonsBlocked || !task"
            class="four-answer-btn"
            @click="(event) => handleAnswer(task?.task?.variants[2], event)"
          >
            {{ task?.task?.variants[2] }}
          </Button>
          <Button
            activeColor="#2c3382"
            :disabled="(type === 'relax' && energy <= 0) || buttonsBlocked || !task"
            class="four-answer-btn"
            @click="(event) => handleAnswer(task?.task?.variants[3], event)"
          >
            {{ task?.task?.variants[3] }}
          </Button>
        </div>

        <Transition name="correct-text" mode="out-in">
          <div v-if="correctAnswer.shown" class="wrong-text absolute z-20 inset-0 grid place-items-center pointer-events-none mb-14">
            <div class="text flex flex-col items-center mb-5">
              <span class="fira-condensed-black text-red-500" style="font-size: clamp(28px, 10vw, 42px)">{{ correctAnswer.question }}</span>
              <span class="fira-condensed-black text-red-400" style="font-size: clamp(26px, 8vw, 42px)">{{ correctAnswer.answer }}</span>
            </div>
          </div>
        </Transition>
      </div>
    </BackgroundPill>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { storeToRefs } from "pinia";
import { getAsset } from "@/utils";

// stores
import { useMainStore } from "@/store/main";

const emit = defineEmits<{
  answer: [
    data: {
      isCorrect: boolean;
      answer: string;
      event: MouseEvent;
      drawBonus: boolean;
    }
  ];
  mounted: [];
  unmounted: [];
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

const pillRef = ref();
const correctAnswer = ref({
  shown: false,
  question: "",
  answer: "",
  timeout: null,
});

const handleAnswer = (answer: string, event) => {
  if (props.type === "relax" && props.energy <= 0) return;

  const isCorrect = answer === props.task.correct;

  let taskDelay;

  if (isCorrect) {
    answerAnimation.value.color = "green";
  } else {
    answerAnimation.value.color = "red";
  }

  const pillTop = pillRef.value.el.getBoundingClientRect().top;
  const pillLeft = pillRef.value.el.getBoundingClientRect().left;

  answerAnimation.value.coords.x = event.clientX - pillLeft;
  answerAnimation.value.coords.y = event.clientY - pillTop;
  answerAnimation.value.shown = true;

  setTimeout(() => {
    answerAnimation.value.shown = false;
  }, 1000);

  if (props.type === "relax" && !isCorrect) {
    // wrong answer in relax mode creates a 2s delay
    taskDelay = 2000;

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

onMounted(() => {
  emit("mounted");
});

onBeforeUnmount(() => {
  emit("unmounted");
});
</script>
