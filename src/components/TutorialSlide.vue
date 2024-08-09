<template>
  <div :class="`tutorial-slide flex-1 flex flex-col gap-2 absolute inset-0 w-full h-full pt-16 px-4`" :style="{ 'background-color': data['bg-color'] }">
    <div class="slide-content z-20">
      <h2 class="page-title mb-3" v-html="data.title" />
      <span class="page-subtitle" v-html="data.subtitle" />
    </div>
    <div class="tutorial-bg absolute inset-0 w-full h-full z-0" :style="{ backgroundImage: `url(/${data['bg-image']})` }"></div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  data: {
    title: string;
    subtitle: string;
  };
}>();
</script>
