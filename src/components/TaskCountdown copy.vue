<template>
  <div ref="counterRef" class="task-countdown">
    <span v-if="timer" class="exo-bold text-lg">{{ timer }}</span>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, ref } from "vue";
import { storeToRefs } from "pinia";

// stores
import { useDataStore } from "@/store/data";
import { watch } from "vue";

const dataStore = useDataStore();

const { currentTaskTimeout } = storeToRefs(dataStore.battles);

const timer = ref(0);
const timerFunc = ref(null);
const counterRef = ref();

const playAnimation = () => {
  if (counterRef.value) {
    counterRef.value.animate([{ transform: "scale(1.5)" }, { transform: "scale(1)" }], 500);
  }
};

const startTimer = (timerData) => {
  if (timerFunc.value) {
    clearInterval(timerFunc.value);
  }

  if (!timerData) return;

  timer.value = timerData.interval / 1000;

  timerFunc.value = setInterval(() => {
    if (timer.value <= 0) {
      clearInterval(timerFunc.value);
    } else {
      playAnimation();
      timer.value -= 1;
    }
  }, 1000);
};

watch(currentTaskTimeout, (val) => {
  if (!val) return;

  startTimer(val);

  if (counterRef.value) {
    counterRef.value.animate([{ transform: "scale(2)", color: "orange" }, { transform: "scale(1)" }], 500);
  }
});

onBeforeUnmount(() => {
  if (timerFunc.value) {
    clearInterval(timerFunc.value);
  }
});
</script>
