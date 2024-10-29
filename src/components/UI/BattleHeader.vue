<template>
  <div class="battle-header-cnt flex gap-4 items-center px-4 py-2 rounded-xl">
    <!-- <img class="w-[60px] -ml-2" :src="getAsset(icon)" /> -->
    <div class="text flex gap-2">
      <span class="fira-regular text-lg text-white">{{ gameLocale }}</span>
      <span class="fira-regular text-lg text-[#B7B7B7]">{{ title }}</span>
    </div>
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
    <svg class="mb-[1px]" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="10" cy="10" r="10" fill="white" />
      <path d="M8.23535 5.88281L12.9412 10.0005L8.23535 14.1181" stroke="#222222" stroke-width="2" stroke-linecap="round" />
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
