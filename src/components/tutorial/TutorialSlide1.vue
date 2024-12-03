<template>
  <div class="tutorial-slide flex-1 flex flex-col gap-2 p-4" style="background: linear-gradient(180deg, #000000 0%, #91338f 100%)">
    <div class="slide-content">
      <h2 class="fira-bold mb-3 text-[34px]">
        {{ locale?.["title"] ?? "Добро пожаловать в" }}
        <img class="" :src="getAsset('tapsmart_title')" />
      </h2>
      <span class="page-subtitle"
        ><span class="fira-bold text-[var(--accent-color)]">TapSmart</span
        >{{
          locale?.["subtitle"] ?? "- это практика 42-х иностранных языков в соревновании с другими игроками. Здесь можно своими мозгами зарабатывать на реальные товары и услуги"
        }}</span
      >
    </div>
    <div class="flex-1 contain -ml-4 -mb-4">
      <img class="h-full object-cover" :src="getAsset('tutorial-0')" />
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
