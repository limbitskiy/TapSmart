<template>
  <div :class="`tutorial-slide flex-1 flex flex-col gap-2 pt-16 px-4`" style="background: linear-gradient(180deg, #000000 0%, #91338f 100%)">
    <div class="slide-content z-20">
      <h2 class="fira-bold mb-3 text-[34px]">Title</h2>
      <span class="page-subtitle">Subtitle</span>
    </div>
    <div class="tutorial-bg absolute inset-0 w-full h-full z-0" :style="{ background: getAsset('tutorial-0') }"></div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from "vue";
import { getAsset, showFormattedNumber } from "@/utils";
import { storeToRefs } from "pinia";
</script>
