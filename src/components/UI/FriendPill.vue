<template>
  <Pill class="!py-2" ripple>
    <div class="pill-content flex items-center justify-between">
      <!-- <slot name="start"> -->
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
            <span class="text-sm text-[var(--accent-color)]">{{ data.title }}</span>
            <div class="money flex items-center gap-1">
              <img :src="getAsset('bolt')" />
              <span class="text-[var(--accent-color)]">{{ data.money || 0 }}</span>
            </div>
          </div>
        </div>
      </div>
      <!-- </slot>
      <slot name="end"> -->
      <div v-show="battles" class="battles-played flex items-center gap-2">
        <img class="h-6" src="/swords.png" />
        <span class="text-xl font-bold">{{ data.bolts || 0 }}</span>
      </div>
      <div v-show="!battles" class="money-earned flex items-center gap-2">
        <img :src="getAsset('bolt')" />
        <span class="text-xl font-bold text-[var(--accent-color)]">{{ data.moneyEarned || 0 }}</span>
      </div>
      <!-- </slot> -->
    </div>
  </Pill>
</template>

<script setup lang="ts">
import { getAsset } from "@/utils";

// components
import Pill from "@/components/UI/Pill.vue";

defineProps<{
  data: {
    id: number;
    name: string;
    isOnline: boolean;
    title: string;
    money: string;
    moneyEarned: string;
    bolts: number;
  };
  battles: boolean;
}>();
</script>
