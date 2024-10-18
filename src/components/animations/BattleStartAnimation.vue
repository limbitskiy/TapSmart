<template>
  <div class="battle-start-animation-cnt absolute inset-0 grid place-items-center">
    <div class="battle-start-animation-backdrop absolute inset-0 bg-black bg-opacity-80 z-20"></div>
    <TransitionGroup name="scale-in-out">
      <div v-if="animationCounter === 4" class="battle-start-animation-text z-30 absolute">
        <span class="text-[30vw] exo-bold">3</span>
      </div>
      <div v-else-if="animationCounter === 3" class="battle-start-animation-text z-30 absolute">
        <span class="text-[30vw] exo-bold">2</span>
      </div>
      <div v-else-if="animationCounter === 2" class="battle-start-animation-text z-30 absolute">
        <span class="text-[30vw] exo-bold">1</span>
      </div>
      <div v-else-if="animationCounter === 1" class="battle-start-animation-text z-30 absolute">
        <span class="text-[40vw] exo-bold text-[var(--green-color)]">GO!</span>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

const animationCounter = ref(null);

onMounted(() => {
  animationCounter.value = 4;

  setTimeout(() => {
    animationCounter.value = 3;
  }, 1000);
  setTimeout(() => {
    animationCounter.value = 2;
  }, 2000);
  setTimeout(() => {
    animationCounter.value = 1;
  }, 3000);
  setTimeout(() => {
    animationCounter.value = null;
  }, 4000);
});
</script>
