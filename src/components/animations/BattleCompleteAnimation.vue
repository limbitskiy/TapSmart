<template>
  <div class="animation-cnt">
    <Vue3Lottie :animationData="Animation" :height="200" :width="200" :loop="false" />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";

import Animation from "@/assets/animations/battle_complete.json";
</script>
