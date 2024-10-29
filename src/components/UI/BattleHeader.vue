<template>
  <div class="battle-header-cnt flex gap-2 items-center px-4 py-2 rounded-xl">
    <!-- <img class="w-[60px] -ml-2" :src="getAsset(icon)" /> -->
    <span class="fira-regular text-lg text-white">{{ gameLocale }}</span>
    <span class="fira-regular text-lg text-[#B7B7B7]">{{ title }}</span>
    <!-- <svg
        width="14"
        height="8"
        viewBox="0 0 14 8"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M7 8L0 0.982456L0.98 0L7 6.03509L13.02 0L14 0.982456L7 8Z"
          fill="white"
        />
      </svg> -->
    <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="8.5" cy="8.5" r="8.5" fill="white" />
      <path d="M7 6L10 9L7 12" stroke="#222222" stroke-linecap="round" />
    </svg>
  </div>
</template>

<script setup lang="ts">
import { getAsset } from "@/utils";

const props = defineProps<{
  icon: string;
  gameLocale: string;
  title: string;
}>();
</script>
