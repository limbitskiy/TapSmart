<template>
  <svg
    ref="svgRef"
    :width="size"
    :height="size"
    :viewBox="`0 0 ${size} ${size}`"
  >
    <circle
      class="bg"
      :cx="size / 2"
      :cy="size / 2"
      :r="radius"
      fill="none"
      stroke="#222"
      :stroke-width="strokeWidth ?? 6"
      stroke-linecap="round"
    ></circle>
    <circle
      fill="none"
      stroke="#feac3e"
      class="fg"
      :cx="size / 2"
      :cy="size / 2"
      :r="radius"
      :stroke-width="strokeWidth ?? 6"
      :stroke-dasharray="`${dash} ${circumference - dash}`"
      stroke-linecap="round"
      :style="`transform: rotate(-90deg); transform-origin: ${size / 2}px ${
        size / 2
      }px; transition: stroke-dasharray 0.3s linear 0s;`"
    ></circle>
    <text
      x="50%"
      y="50%"
      font-size="20px"
      text-anchor="middle"
      fill="#feac3e"
      font-family="Exo2Black"
      dy=".3em"
    >
      {{ progress }}%
    </text>
  </svg>
</template>

<script setup lang="ts">
// stroke-dasharray="10 361.25"
import { computed, onMounted, ref } from "vue";

const props = defineProps<{
  size: number;
  strokeWidth?: number;
  progress: number;
}>();

const svgRef = ref();

const radius = computed(() => (props.size - (props.strokeWidth ?? 6)) / 2);
const circumference = computed(() => radius.value * Math.PI * 2);
const dash = computed(() => (props.progress * circumference.value) / 100);

onMounted(() => {
  //   const rect = svgRef.value.getBoundingClientRect();
  //   console.log(rect.height);
  //   state.value.size = rect.height;
});
</script>
