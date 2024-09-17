<template>
  <div class="animation-cnt">
    <LottieAnimation :animation-data="Animation" :auto-play="true" :loop="false" :speed="1" />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { LottieAnimation } from "lottie-web-vue";

import Animation from "@/assets/animations/battle_complete.json";
</script>
