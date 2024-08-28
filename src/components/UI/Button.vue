<template>
  <button :class="black ? 'bg-black' : 'bg-[var(--accent-color)] text-black'" class="rounded-2xl font-bold fira-bold" style="font-size: 20px"><slot></slot></button>
</template>

<script setup lang="ts">
import { computed } from "vue";

defineProps<{
  black?: boolean;
}>();
</script>
