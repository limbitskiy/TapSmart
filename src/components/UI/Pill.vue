<template>
  <div :class="`pill p-5 rounded-3xl select-none bg-[var(--grey-${color})] ${outlined ? 'border' : ''}`">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  color: "light" | "dark" | "darker";
  outlined?: boolean;
}>();
</script>
