<template>
  <button ref="buttonRef" :class="black ? 'bg-black' : 'bg-[var(--accent-color)] text-black'" class="rounded-xl font-bold fira-bold" style="font-size: 20px"><slot></slot></button>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

const buttonRef = ref();

defineProps<{
  black?: boolean;
}>();

defineExpose({
  ref: buttonRef,
});
</script>
