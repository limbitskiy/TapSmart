<template>
  <div class="tutorial-slide flex-1 flex flex-col gap-4 p-4" style="background: linear-gradient(180deg, #000000 0%, #dc6c31 100%)">
    <div class="slide-content">
      <h2 class="fira-semibold mb-3 text-[34px]">
        {{ locale?.["title"] ?? "Title" }}
      </h2>
      <span class="page-subtitle">{{ locale?.["subtitle"] ?? "subtitle" }}</span>
    </div>
    <div class="goodluck">
      <span class="text-[20px]">{{ locale?.["good_luck"] }}</span>
    </div>
    <div class="flex-1 contain -mr-4 -mb-4">
      <img class="h-full object-cover" :src="getAsset('tutorial-2')" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from "vue";
import { getAsset } from "@/utils";

defineProps<{
  locale: {};
}>();
</script>
