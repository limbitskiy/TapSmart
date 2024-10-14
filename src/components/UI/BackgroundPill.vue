<template>
  <div ref="el" :class="`pill flex flex-col px-4 pb-4 pt-6 rounded-3xl bg-[var(--grey-dark)] select-none ${outlined ? 'border' : ''}`">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

defineProps<{
  outlined?: boolean;
}>();

const el = ref();

defineExpose({
  el,
});
</script>
