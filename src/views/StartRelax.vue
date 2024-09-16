<template>
  <span>Starting relax mode</span>
</template>

<script setup lang="ts">
// stores
import { useMainStore } from "@/store/main";

const mainStore = useMainStore();

const { fetchRelaxPageData } = mainStore;

await fetchRelaxPageData();
</script>
