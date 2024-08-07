<template>
  <Pill>
    <div class="pill-content flex items-center justify-between gap-4">
      <slot name="start">
        <div class="start flex gap-3">
          <div class="avatar flex">
            <img src="/avatar-placeholder.svg" />
          </div>
          <div class="friend-meta flex flex-col">
            <div class="name flex gap-1">
              <span class="text-lg font-bold">{{ data.name }}</span>
              <span class="status w-2 h-2 rounded-full" :class="data.isOnline ? 'bg-green-600' : 'bg-gray-400'"></span>
            </div>
            <div class="title-money flex items-center gap-2">
              <span class="text-[var(--accent-color)]">{{ data.title }}</span>
              <div class="money flex items-center gap-1">
                <img class="h-4" src="/coin.png" />
                <span class="text-[var(--accent-color)]">{{ data.money }}</span>
              </div>
            </div>
          </div>
        </div>
      </slot>
      <slot name="end">
        <div class="money-earned flex items-center gap-2">
          <img class="h-6" src="/coin.png" />
          <span class="text-xl font-bold text-[var(--accent-color)]">{{ data.moneyEarned }}</span>
        </div>
      </slot>
    </div>
  </Pill>
</template>

<script setup lang="ts">
import Pill from "@/components/UI/Pill.vue";

defineProps<{
  data: {
    id: number;
    name: string;
    isOnline: boolean;
    title: string;
    money: string;
    moneyEarned: string;
  };
}>();
</script>
