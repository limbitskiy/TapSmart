<template>
  <div class="loader wrap flex-1 grid place-items-center">
    <div class="loader flex flex-col gap-2">
      <img class="h-4 scale-[3]" :src="getAsset('loader')" />
      <!-- <span>Loading...</span> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { getAsset } from "@/utils";
</script>
