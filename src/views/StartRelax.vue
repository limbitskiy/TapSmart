<template>
  <span>Starting relax mode</span>
</template>

<script setup lang="ts">
import { onMounted } from "vue";

// stores
import { useMainStore } from "@/store/main";

const mainStore = useMainStore();

const { fetchRelaxPageData } = mainStore;

await fetchRelaxPageData();

onMounted(() => {});
</script>
