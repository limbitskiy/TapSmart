<template>
  <div id="tasks" class="flex-1">
    <div class="top-part p-5 mb-4">
      <div class="page-title mb-4">{{ locale["title"] }}</div>
      <div class="page-subtitle" v-html="locale['subtitle']"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from "vue";
import { tg, getUserId } from "@/api/telegram";
import { getAsset } from "@/utils";
import { storeToRefs } from "pinia";

// store
import { useMainStore } from "@/store/main.ts";
import { useDataStore } from "@/store/data.ts";
import { useLocaleStore } from "@/store/locale.ts";

// components
import Button from "@/components/UI/Button.vue";
import IconPill from "@/components/UI/IconPill.vue";
import Pill from "@/components/UI/Pill.vue";
import BackgroundPill from "@/components/UI/BackgroundPill.vue";

const mainStore = useMainStore();
const dataStore = useDataStore();
const localeStore = useLocaleStore();

const { tasks: data } = storeToRefs(dataStore);
const { tasks: locale } = storeToRefs(localeStore);
</script>
