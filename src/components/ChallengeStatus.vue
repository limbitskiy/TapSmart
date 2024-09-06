<template>
  <div class="challenge-statusbar flex items-center justify-center exo-black">
    <div class="bolts flex items-center gap-2 px-4 bg-[var(--grey-light)] rounded-l-full py-1 relative -right-2 z-[2]">
      <img class="h-4" :src="getAsset('bolt')" />
      <span class="text-lg">{{ boltsEarned || 203 }}</span>
    </div>
    <div class="timer w-[125px] flex justify-center px-4 py-1 bg-[var(--accent-color)] text-[#444] text-[32px] rounded-full z-[5]">
      <CountdownTimer class="" :initValue="60000" />
    </div>
    <div class="place flex items-center gap-2 px-4 bg-[var(--grey-light)] rounded-r-full py-1 relative -left-2 z-[2]">
      <img class="h-4 scale-150" :src="getAsset('cup')" />
      <span class="text-lg">{{ place }}/5</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { getAsset } from "@/utils";

// components
import CountdownTimer from "@/components/CountdownTimer.vue";

const boltsEarned = ref(0);
const place = ref(2);
</script>
