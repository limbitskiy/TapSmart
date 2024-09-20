<template>
  <div class="4-answers-battle flex-1 flex flex-col">
    <div class="question flex-1 grid place-items-center font-black text-2xl overflow-hidden">
      <div ref="el" class="question-text flex flex-col gap-2 items-center text-center w-full px-8 py-4 overflow-x-hidden text-ellipsis">
        <span class="fira-condensed-black" style="font-size: clamp(30px, 9vw, 46px)">{{ currentTask?.task?.question || "Question not found" }}</span>
      </div>
    </div>

    <Teleport to="#modals">
      <div v-for="bonus in bonuses" :key="bonus.id" class="bonus bonus-animate z-20 flex gap-1 items-center absolute" :style="{ left: bonus.x + 'px', top: bonus.y + 'px' }">
        <img class="h-4" :src="getAsset('bolt')" />
        <span class="exo-bold">+2</span>
      </div>
    </Teleport>

    <div class="answers flex-1 grid place-items-center bg-[var(--grey-dark)] rounded-t-3xl">
      <div class="answer-buttons grid w-full grid-cols-2 grid-rows-2 gap-4 px-4 leading-5">
        <Button class="four-answer-btn" @touchstart="btnTouchstart" @touchend="btnTouchend" @click="(event) => handleAnswer(currentTask.task.variants[0], currentTask, event)">{{
          currentTask.task.variants[0]
        }}</Button>
        <Button class="four-answer-btn" @touchstart="btnTouchstart" @touchend="btnTouchend" @click="(event) => handleAnswer(currentTask.task.variants[1], currentTask, event)">{{
          currentTask.task.variants[1]
        }}</Button>
        <Button class="four-answer-btn" @touchstart="btnTouchstart" @touchend="btnTouchend" @click="(event) => handleAnswer(currentTask.task.variants[2], currentTask, event)">{{
          currentTask.task.variants[2]
        }}</Button>
        <Button class="four-answer-btn" @touchstart="btnTouchstart" @touchend="btnTouchend" @click="(event) => handleAnswer(currentTask.task.variants[3], currentTask, event)">{{
          currentTask.task.variants[3]
        }}</Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { getAsset } from "@/utils";

//composables
import { useBattle } from "@/composables/useBattle";

// stores
import { useDataStore } from "@/store/data";

// components
import Button from "@/components/UI/Button.vue";

const emit = defineEmits<{
  answer: [data: { correct: boolean; answer: string }];
}>();

const props = defineProps<{
  type: "relax" | "challenge";
}>();

const dataStore = useDataStore();

const { currentTask } = storeToRefs(dataStore.battles);

const el = ref();

const defineCorrect = (answer: string, currentTask: { correct: string }) => {
  return answer === currentTask.correct;
};

const { bonuses, onAnswer } = useBattle(props.type, el);

const handleAnswer = (answer, currentTask, event) => {
  const correct = defineCorrect(answer, currentTask);

  emit("answer", { correct, answer });
  onAnswer(correct, event, answer);
};

const btnTouchstart = (event: TouchEvent) => {
  const { target } = event;
  const btn = target.closest("button");

  btn?.classList.add("active");
};

const btnTouchend = (event: TouchEvent) => {
  const { target } = event;
  const btn = target.closest("button");

  btn?.classList.remove("active");
};
</script>
