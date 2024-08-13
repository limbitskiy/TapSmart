<template>
  <div id="required-settings" class="flex-1">
    <div class="top-part p-5 mb-4">
      <div class="page-title mb-4">{{ getLocale("title", "requiredSettings") }}</div>
      <div class="page-subtitle">{{ getLocale("subtitle", "requiredSettings") }}</div>
    </div>

    <Settings @change="onSettingsChange" />

    <div class="bnt-cnt flex justify-between absolute bottom-0 w-full">
      <Button class="w-full py-4" label="Next" @click="onNext">{{ getLocale("button_next", "requiredSettings") }}</Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from "vue";
import { useUserStore } from "@/store/user.ts";
import { storeToRefs } from "pinia";
import Button from "@/components/UI/Button.vue";
import { tg, getUserId } from "@/api/telegram";
import { useRouter } from "vue-router";
import { useStoreHelpers } from "@/composables/useStoreHelpers";
import Settings from "@/components/Settings.vue";

const { getLocale, getStoreData } = useStoreHelpers();

const userStore = useUserStore();

const { setLanguages } = userStore;

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
