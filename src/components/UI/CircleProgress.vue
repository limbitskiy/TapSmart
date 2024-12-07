<template>
  <svg ref="svgRef" :width="size" :height="size" :viewBox="`0 0 ${size} ${size}`">
    <linearGradient id="linear" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#408CFF" />
      <stop offset="100%" stop-color="#894899" />
    </linearGradient>
    <circle class="bg" :cx="size / 2" :cy="size / 2" :r="radius" fill="none" stroke="#222" :stroke-width="strokeWidth ?? 6" stroke-linecap="round"></circle>
    <circle
      fill="none"
      :stroke="color ?? 'url(#linear)'"
      class="fg"
      :cx="size / 2"
      :cy="size / 2"
      :r="radius"
      :stroke-width="strokeWidth ?? 6"
      :stroke-dasharray="`${dash} ${circumference - dash}`"
      stroke-linecap="round"
      :style="`transform: rotate(-90deg); transform-origin: ${size / 2}px ${size / 2}px; transition: stroke-dasharray 0.8s linear 0s;`"
    ></circle>
    <text v-if="progress" x="50%" y="50%" font-size="20px" text-anchor="middle" fill="#feac3e" font-family="FiraSansRegular" dy=".3em">{{ progress }}%</text>
  </svg>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";

const props = defineProps<{
  size: number;
  strokeWidth?: number;
  progress: number;
  color?: string;
}>();

const svgRef = ref();

const radius = computed(() => (props.size - (props.strokeWidth ?? 6)) / 2);
const circumference = computed(() => radius.value * Math.PI * 2);
const dash = computed(() => (props.progress * circumference.value) / 100);
</script>
