<template>
  <Pill>
    <div class="pill-content flex items-center gap-4">
      <slot name="start"></slot>
      <slot name="end"></slot>
    </div>
  </Pill>
</template>

<script setup lang="ts">
import Pill from "@/components/UI/Pill.vue";
</script>
