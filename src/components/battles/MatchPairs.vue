<template>
  <div class="battle-body flex-1 flex flex-col">
    <!-- task body -->
    <div class="flex-1 grid grid-rows-[60px_auto]">
      <!-- task header -->
      <div class="header flex items-center justify-between border border-gray-600 rounded-xl p-2">
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

      <!-- buttons -->
      <div class="answer-buttons grid w-full grid-cols-2 gap-4 leading-5">
        <Button :disabled="type === 'relax' && energy <= 0" class="match-pairs-btn">
          {{ 0 }}
        </Button>
        <Button :disabled="type === 'relax' && energy <= 0" class="match-pairs-btn">
          {{ 0 }}
        </Button>
        <Button :disabled="type === 'relax' && energy <= 0" class="match-pairs-btn">
          {{ 0 }}
        </Button>
        <Button :disabled="type === 'relax' && energy <= 0" class="match-pairs-btn">
          {{ 0 }}
        </Button>
      </div>
    </div>
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

  emit("answer", {
    isCorrect,
    answer,
    event,
    drawBonus: task.settings?.isAds || props.type === "challenge" ? false : true,
    task,
    nextTaskDelay: taskDelay,
  });
};

onMounted(() => {
  console.log(`math pairs mounted`);

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
