<template>
  <div class="prize-countdown bg-[var(--grey-light)] rounded-2xl flex items-center gap-2 px-4 py-[2px]">
    <svg class="scale-75" width="25" height="25" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12.5 25a12.5 12.5 0 1 1 0-25 12.5 12.5 0 0 1 0 25Zm0-23.214a10.714 10.714 0 1 0 0 21.428 10.714 10.714 0 0 0 0-21.428Z" fill="silver" />
      <path d="m16.598 17.856-4.99-4.991V4.463h1.785v7.66l4.464 4.474-1.259 1.259Z" fill="silver" />
    </svg>
    <div class="timer">{{ formattedTime(timer) }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { formattedTime } from "@/utils";

const props = defineProps<{
  timeout: number;
}>();

const emit = defineEmits<{
  complete: [];
}>();

const timer = ref(props.timeout);
let interval: ReturnType<typeof setInterval> | null = null;

onMounted(() => {
  interval = setInterval(() => {
    timer.value -= 1000;
  }, 1000);
});

onUnmounted(() => {
  if (interval) {
    clearTimeout(interval);
  }
});
</script>
