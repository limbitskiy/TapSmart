<template>
  <div :class="`pill px-4 pb-4 pt-8 rounded-2xl bg-[var(--grey-dark)] select-none ${outlined ? 'border' : ''}`">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  outlined?: boolean;
}>();
</script>
