<template>
  <Pill>
    <div class="pill-content flex items-center justify-between gap-2">
      <div class="pill-start">
        <slot name="name"></slot>
      </div>
      <div class="pill-end flex items-center gap-4">
        <slot name="value"></slot>
        <img src="@/assets/icons/chevron-right.svg" />
      </div>
    </div>
  </Pill>
</template>

<script setup lang="ts">
import Pill from "@/components/UI/Pill.vue";
</script>
