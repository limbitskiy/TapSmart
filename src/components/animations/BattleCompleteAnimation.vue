<template>
  <Vue3Lottie :animationData="Animation" :height="200" :width="200" :loop="false" />
</template>

<script setup lang="ts">
import Animation from "@/assets/animations/battle_complete.json";
</script>
