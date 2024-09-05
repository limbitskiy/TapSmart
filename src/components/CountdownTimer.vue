<template>
  <div class="timer">
    <span>{{ "00:" + formattedTime }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";

const props = defineProps<{
  initValue: number;
}>();

const emit = defineEmits<{
  completed: [];
}>();

const timer = ref(props.initValue);
let interval = null;

const formattedTime = computed(() => {
  if (timer.value > 9000) {
    return timer.value / 1000;
  } else {
    return "0" + timer.value / 1000;
  }
});

onMounted(() => {
  interval = setInterval(() => {
    if (timer.value === 0) {
      clearInterval(interval);
      emit("completed");
      return;
    }

    timer.value -= 1000;
  }, 1000);
});
</script>
