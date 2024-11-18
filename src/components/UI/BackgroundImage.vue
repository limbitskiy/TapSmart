<template>
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
