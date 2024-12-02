<template>
  <div class="tutorial-slide flex-1 flex flex-col gap-4 p-4" style="background: linear-gradient(180deg, #000000 0%, #dc6c31 100%)">
    <div class="slide-content">
      <h2 class="fira-bold mb-3 text-[34px]">
        {{ locale?.slides[4]?.["title"] ?? "Title" }}
      </h2>
      <span class="page-subtitle">{{ locale?.slides[4]?.["subtitle"] ?? "subtitle" }}</span>
    </div>
    <div class="goodluck">
      <span class="fira-bold text-[20px]">{{ locale?.slides[4]?.["good_luck"] }}</span>
    </div>
    <div class="flex-1 contain -mr-4 -mb-4">
      <img class="h-full object-cover" :src="getAsset('tutorial-2')" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from "vue";
import { getAsset } from "@/utils";
import { storeToRefs } from "pinia";

// stores
import { useMainStore } from "@/store/main";

const store = useMainStore();

const { tutorial: locale } = storeToRefs(store.localeStore);
</script>
