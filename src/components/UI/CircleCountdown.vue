<template>
  <Transition name="fade" mode="out-in">
    <svg v-show="currentTaskTimeout" :width="size" :height="size" :viewBox="`0 0 ${size} ${size}`">
      <circle class="bg" :cx="size / 2" :cy="size / 2" :r="radius" fill="none" stroke="#222" :stroke-width="strokeWidth ?? 6" stroke-linecap="round"></circle>
      <circle
        ref="circleRef"
        fill="none"
        :stroke="color ?? '#feac3e'"
        class="fg"
        :cx="size / 2"
        :cy="size / 2"
        :r="radius"
        :stroke-width="strokeWidth ?? 6"
        stroke-dasharray="0 360"
        stroke-linecap="round"
        :style="`transform: rotate(-90deg); transform-origin: ${size / 2}px ${size / 2}px; transition: stroke-dasharray 0.3s linear 0s;`"
      ></circle>
    </svg>
  </Transition>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { storeToRefs } from "pinia";

// stores
import { useDataStore } from "@/store/data";
import { watch } from "vue";

const props = defineProps<{
  size: number;
  strokeWidth?: number;
  color?: string;
}>();

const dataStore = useDataStore();

const { currentTaskTimeout } = storeToRefs(dataStore.battles);

const circleRef = ref();
let animation = null;

const radius = computed(() => (props.size - (props.strokeWidth ?? 6)) / 2);
const circumference = computed(() => radius.value * Math.PI * 2);

const startAnimation = (duration: number) => {
  animation = circleRef.value?.animate([{ strokeDasharray: `${circumference.value} 0` }, { strokeDasharray: `0 ${circumference.value}` }], duration);
};

const stopAnimation = () => {
  animation?.cancel();
  animation = null;
};

watch(currentTaskTimeout, (val) => {
  if (!val?.interval) {
    stopAnimation();
    return;
  }

  startAnimation(val.interval);
});

onMounted(() => {
  if (currentTaskTimeout.value?.interval) {
    startAnimation(currentTaskTimeout.value?.interval);
  }
});
</script>
