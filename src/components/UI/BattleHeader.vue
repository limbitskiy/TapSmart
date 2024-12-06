<template>
  <!-- task header -->
  <div class="header flex items-center justify-between">
    <Button
      class="!p-0 bg-[var(--grey-dark)]"
      style="background: linear-gradient(180deg, rgba(4, 4, 4, 0.6) 0%, rgba(0, 0, 0, 0.4) 100%)"
      activeColor="#858585"
      @click="() => emit('changeMech')"
    >
      <div class="battle-header-cnt flex gap-4 items-center px-4 py-1 rounded-xl border border-gray-700">
        <div class="text flex gap-2">
          <span class="fira-regular text-base text-white">{{ locale?.["mechanics_category"] }}</span>
          <span class="fira-regular capitalize text-base text-[#B7B7B7]">{{ title }}</span>
        </div>

        <svg class="mb-[1px] scale-75" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="10" cy="10" r="10" fill="white" />
          <path d="M8.23535 5.88281L12.9412 10.0005L8.23535 14.1181" stroke="#222222" stroke-width="2" stroke-linecap="round" />
        </svg>
      </div>
    </Button>

    <div class="right flex items-center gap-3">
      <CircleCountdown :taskTimeoutStatus="taskTimeoutStatus" :strokeWidth="2" color="grey" :size="20" />
      <VolumeControl />
    </div>
  </div>
</template>

<script setup lang="ts">
import { getAsset } from "@/utils";

const emit = defineEmits<{
  changeMech: [];
}>();

const props = defineProps<{
  locale: {};
  title: string;
  taskTimeoutStatus: { timeout: number | null; status: string };
}>();
</script>
