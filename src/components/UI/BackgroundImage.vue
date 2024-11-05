<template>
  <!-- <div v-if="type === 'blue'" class="bg-image absolute inset-0 pointer-events-none" style="background: linear-gradient(180deg, #3585df 0%, #1758a0 100%); z-index: -1"></div>
  <div v-else-if="type === 'red'" class="bg-image absolute inset-0 pointer-events-none" style="background: linear-gradient(180deg, #ff8983 0%, #e84b43 100%); z-index: -1"></div>
  <div v-else-if="type === 'purple'" class="bg-image absolute inset-0 pointer-events-none" style="background: linear-gradient(180deg, #824ea2 0%, #562475 100%); z-index: -1"></div> -->
  <!-- <div class="bg-image absolute inset-0 pointer-events-none" style="z-index: 0" :style="`background: url(${getAsset('pattern_paws_blue')})`"></div> -->
  <div class="bg-image absolute inset-0 pointer-events-none" :style="{ background: bgColor, 'z-index': -1, transition: 'background 3s ease' }"></div>
</template>

<script setup lang="ts">
import { getAsset } from "@/utils";
import { storeToRefs } from "pinia";

// stores
import { useMainStore } from "@/store/main";

const mainStore = useMainStore();

const { bgColor } = storeToRefs(mainStore);

// defineProps<{
//   type: string;
// }>();
</script>
