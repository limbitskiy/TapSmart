<template>
  <div id="market" class="flex-1">
    <div class="top-part p-5 mb-4">
      <div class="page-title mb-4">{{ locale?.["title"] }}</div>
      <div class="page-subtitle" v-html="locale?.['subtitle']"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from "vue";
import { getAsset } from "@/utils";
import { storeToRefs } from "pinia";

// store
import { useMainStore } from "@/store/main";

const store = useMainStore();

const { market: data } = storeToRefs(store.dataStore);
const { market: locale } = storeToRefs(store.localeStore);
</script>
