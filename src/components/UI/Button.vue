<template>
  <button :class="black ? 'bg-black' : 'bg-[var(--accent-color)] text-black'" class="py-3 px-5 rounded-2xl font-bold"><slot></slot></button>
</template>

<script setup lang="ts">
import { computed } from "vue";

defineProps<{
  black?: boolean;
}>();
</script>
