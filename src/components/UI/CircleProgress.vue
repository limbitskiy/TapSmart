<template>
  <svg
    ref="svgRef"
    :width="size"
    :height="size"
    :viewBox="`0 0 ${size} ${size}`"
  >
    <circle
      class="bg"
      :cx="size"
      :cy="size"
      :r="(size - (strokeWidth ?? 4)) / 2"
      fill="none"
      stroke="#ddd"
      :stroke-width="strokeWidth"
      stroke-linecap="round"
    ></circle>
    <circle
      fill="none"
      stroke="#5394fd"
      class="fg"
      :cx="size"
      :cy="size"
      :r="(size - (strokeWidth ?? 4)) / 2"
      :stroke-width="strokeWidth"
      stroke-dasharray="10 361.25"
      stroke-linecap="round"
    ></circle>
  </svg>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";

const props = defineProps<{
  size: number;
  strokeWidth?: number;
  progress: number;
}>();

const svgRef = ref();

const radius = computed(() => (props.size - (props.strokeWidth ?? 4)) / 2);
const circumference = computed(() => radius.value * Math.PI * 2);
const dash = computed(() => (props.progress * circumference.value) / 100);

onMounted(() => {
  //   const rect = svgRef.value.getBoundingClientRect();
  //   console.log(rect.height);
  //   state.value.size = rect.height;
});
</script>
