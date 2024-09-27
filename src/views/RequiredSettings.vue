<template>
  <div id="required-settings" class="flex-1">
    <div class="top-part p-5 mb-4">
      <div class="page-title mb-2">{{ locale?.["title"] }}</div>
      <div class="page-subtitle">{{ locale?.["subtitle"] }}</div>
    </div>

    <LanguageSettings @change="onSettingsChange" />

    <div class="bnt-cnt flex justify-between absolute bottom-0 w-full">
      <Button
        class="w-full py-3"
        activeColor="#fcdcb0"
        label="Next"
        @click="onNext"
      >
        <span class="text-xl leading-4">{{
          locale?.["button_next"] || "Next"
        }}</span>
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { tg, getUserId } from "@/api/telegram";

// stores
import { useDataStore } from "@/store/data";
import { useMainStore } from "@/store/main";
import { useLocaleStore } from "@/store/locale";

// components
import Button from "@/components/UI/Button.vue";
import LanguageSettings from "@/components/LanguageSettings.vue";

const dataStore = useDataStore();
const localeStore = useLocaleStore();
const mainStore = useMainStore();

const { requiredSettings: data } = storeToRefs(dataStore);
const { requiredSettings: locale } = storeToRefs(localeStore);

const { setLanguages, redirectTo } = mainStore;

const onSettingsChange = ({
  setting,
  value,
}: {
  setting: string;
  value: number;
}) => {
  setLanguages({ [setting]: value });
};

const onNext = () => {
  redirectTo("/home/relax");
};
</script>
