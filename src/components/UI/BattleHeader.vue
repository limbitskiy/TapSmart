<template>
  <div class="battle-header-cnt flex gap-1 border px-4 py-1 border-gray-500 rounded-xl">
    <img class="w-[60px] -ml-2" :src="getAsset(icon)" />
    <div class="text-chevron flex gap-4 items-center">
      <span class="fira-regular text-lg text-[#B7B7B7]">{{ title }}</span>
      <svg width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M7 8L0 0.982456L0.98 0L7 6.03509L13.02 0L14 0.982456L7 8Z" fill="white" />
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getAsset } from "@/utils";

const props = defineProps<{
  icon: string;
  title: string;
}>();
</script>
