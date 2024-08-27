<template>
  <div id="required-settings" class="flex-1">
    <div class="top-part p-5 mb-4">
      <div class="page-title mb-4">{{ locale["title"] }}</div>
      <div class="page-subtitle">{{ locale["subtitle"] }}</div>
    </div>

    <Settings @change="onSettingsChange" />

    <div class="bnt-cnt flex justify-between absolute bottom-0 w-full">
      <Button class="w-full py-4" label="Next" @click="onNext">{{ locale["button_next"] }}</Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from "vue";
import { useDataStore } from "@/store/data.ts";
import { useMainStore } from "@/store/main.ts";
import { useLocaleStore } from "@/store/locale.ts";
import { storeToRefs } from "pinia";
import Button from "@/components/UI/Button.vue";
import { tg, getUserId } from "@/api/telegram";
import { useRouter } from "vue-router";
import Settings from "@/components/Settings.vue";

const dataStore = useDataStore();
const localeStore = useLocaleStore();
const mainStore = useMainStore();

const { requiredSettings: data } = storeToRefs(dataStore);
const { requiredSettings: locale } = storeToRefs(localeStore);

const { setLanguages } = mainStore;

const router = useRouter();

const languagesChanged = {};

const onSettingsChange = ({ setting, value }) => {
  languagesChanged[setting] = value;
};

const onNext = () => {
  if (Object.keys(languagesChanged)) {
    const { native_language, target_language } = languagesChanged;
    setLanguages({ native_language, target_language });
  }

  router.push("/home/battles");
};
</script>
