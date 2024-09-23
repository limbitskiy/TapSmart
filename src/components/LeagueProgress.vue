<template>
  <div class="league-progress flex flex-col gap-1">
    <div class="top flex items-baseline justify-between">
      <span class="exo-black text-sm text-nowrap">Gold League</span>
      <span class="text-[10px] exo-black text-gray-400">{{ value }}%</span>
    </div>
    <div class="bottom">
      <div class="progressbar h-[4px] w-full bg-[var(--grey-light)] rounded-full relative">
        <div v-for="item in 7" class="separator h-[6px] w-[1px] bg-[var(--grey-dark)] absolute" :style="`left: ${item * 12.5}%`"></div>
        <div class="value h-[4px] bg-gradient-to-r from-[#408CFF] to-[#894899] rounded-l-full relative" :style="`width: ${value}%`">
          <div v-for="item in 7" class="separator h-[4px] w-[1px] bg-[var(--grey-dark)] absolute" :style="`left: ${item * 12.5}%`"></div>

          <div class="marker w-[2px] h-[6px] bg-[var(--accent-color)] absolute right-0 -top-[1px] rounded-full"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const value = ref(85.1);
</script>
