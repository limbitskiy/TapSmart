<template>
  <div class="task-countdown w-full">
    <div class="wrap h-[2px] w-full rounded-full">
      <div ref="progressRef" class="bg-[var(--red-color)] h-[2px] transition-all ease-linear" :style="`background-color: ${color}!important`"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { storeToRefs } from "pinia";

// stores
import { useDataStore } from "@/store/data";
import { watch } from "vue";

defineProps<{
  color: string;
}>();

const dataStore = useDataStore();
let currentAnimation = null;

const { currentTaskTimeout } = storeToRefs(dataStore.battles);

const progressRef = ref();

const startAnimation = (duration: number) => {
  currentAnimation = progressRef.value?.animate([{ transform: "scaleX(0)" }], duration);
};

watch(currentTaskTimeout, (val) => {
  if (!val?.interval) return;

  startAnimation(val.interval);
});

onMounted(() => {
  if (currentTaskTimeout.value?.interval) {
    startAnimation(currentTaskTimeout.value?.interval);
  }
});
</script>
