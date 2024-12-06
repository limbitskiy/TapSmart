<template>
  <div class="countdown bg-[var(--grey-light)] rounded-2xl flex items-center justify-center gap-1 px-4 py-[2px] monospace">
    <svg class="scale-75" width="25" height="25" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12.5 25a12.5 12.5 0 1 1 0-25 12.5 12.5 0 0 1 0 25Zm0-23.214a10.714 10.714 0 1 0 0 21.428 10.714 10.714 0 0 0 0-21.428Z" fill="silver" />
      <path d="m16.598 17.856-4.99-4.991V4.463h1.785v7.66l4.464 4.474-1.259 1.259Z" fill="silver" />
    </svg>
    <div class="timer leading-4">{{ formattedTime(timer) }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";

const props = defineProps<{
  timeout: number;
}>();

const emit = defineEmits<{
  complete: [];
}>();

const timer = ref(props.timeout);
let interval: ReturnType<typeof setInterval> | null = null;

// combine with one in utils
const formattedTime = (time: number, options?: { hours?: boolean }) => {
  const timeArr = [];

  timeArr.push(Math.trunc(time / 3600000));
  let minutes = time % 3600000;
  timeArr.push(Math.trunc(minutes / 60000));
  let seconds = minutes % 60000;
  timeArr.push(Math.trunc(seconds / 1000));

  timeArr.forEach((item, index, array) => {
    if (item.toString().length === 1) {
      array[index] = 0 + item.toString();
    }
  });

  return timeArr[0] + ":" + timeArr[1] + ":" + timeArr[2];
};

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
