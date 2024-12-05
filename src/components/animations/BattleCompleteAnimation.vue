<template>
  <div class="battle-complete-animation-cnt flex-1 flex items-center justify-center" style="background: linear-gradient(174.16deg, #333333 3.4%, #222222 97.3%)">
    <div class="center flex flex-col gap-4 items-center justify-center">
      <div class="image">
        <img class="h-[10dvh]" :src="getAsset('check')" />
      </div>
      <div class="text flex flex-col items-center">
        <span class="font-semibold text-[10vw] text-white">Battle</span>
        <span class="font-semibold text-[14vw] text-[var(--accent-color)] leading-10">complete</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getAsset } from "@/utils";
</script>
