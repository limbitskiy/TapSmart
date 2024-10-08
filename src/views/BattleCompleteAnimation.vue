<template>
  <div class="animation-cnt w-full grid place-items-center">
    <Vue3Lottie :animationData="Animation" :height="200" :width="200" :loop="false" />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import Animation from "@/assets/animations/battle_complete.json";

// stores
import { useMainStore } from "@/store/main";

const mainStore = useMainStore();

const { redirectTo } = mainStore;

setTimeout(() => {
  redirectTo("/battle-complete");
}, 3000);
</script>
