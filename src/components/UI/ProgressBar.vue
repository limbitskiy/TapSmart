<template>
  <div class="progress flex w-full">
    <div class="progress-cnt flex-1 h-2 bg-gray-600 rounded-full">
      <div class="progress-value h-2 bg-[var(--accent-color)] rounded-full" :style="{ width: value + '%' }"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  value: number;
}>();
</script>
