<template>
  <Pill class="py-8 mt-16" color="darker">
    <span class="pill-title">{{ getLocale("settings_title") }}</span>

    <PillButton class="mt-4" color="dark" ripple>
      <template #name>
        <span class="text-lg font-semibold text-gray-300">{{ getLocale("native_language") }}</span>
      </template>
      <template #value>{{ getStoreData("native_languge_list").find((item) => item.id === nativeLang).label }}</template>
      <template #modal="{ closeModal }">
        <Pill class="" color="dark">
          <span class="pill-title">{{ getLocale("modal_language_title") }}</span>
          <PillRadioGroup
            class="mt-4"
            color="light"
            :data="getStoreData('native_languge_list')"
            :selected="getStoreData('native_language')"
            ripple
            @select="
              (lang) => {
                onNativeSelect(lang, closeModal);
              }
            "
          />
        </Pill>
      </template>
    </PillButton>

    <PillButton class="mt-4" color="dark" ripple>
      <template #name>
        <span class="text-lg font-semibold text-gray-300">{{ getLocale("target_language") }}</span>
      </template>
      <template #value>{{ getStoreData("target_languge_list").find((item) => item.id === targetLang).label }}</template>
      <template #modal="{ closeModal }">
        <Pill class="" color="dark">
          <span class="pill-title">{{ getLocale("modal_language_title") }}</span>
          <PillRadioGroup
            class="mt-4"
            color="light"
            :data="getStoreData('native_languge_list')"
            :selected="getStoreData('target_language')"
            ripple
            @select="
              (lang) => {
                onTargetSelect(lang, closeModal);
              }
            "
          />
        </Pill>
      </template>
    </PillButton>
  </Pill>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from "vue";
import { useDataStore } from "@/store/data.ts";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import Button from "@/components/UI/Button.vue";
import Pill from "@/components/UI/Pill.vue";
import PillButton from "@/components/UI/PillButton.vue";
import PillRadioGroup from "@/components/UI/PillRadioGroup.vue";
import { tg } from "@/api/telegram";
import { useStoreHelpers } from "@/composables/useStoreHelpers";

const emit = defineEmits<{
  change: [data: { setting: string; value: number }];
}>();

const { getLocale, getStoreData } = useStoreHelpers("profile");

const nativeLang = ref(getStoreData("native_language"));
const targetLang = ref(getStoreData("target_language"));

const onNativeSelect = (lang, cb) => {
  emit("change", { setting: "native_language", value: lang });
  nativeLang.value = lang;
  setTimeout(() => {
    cb();
  }, 100);
};

const onTargetSelect = (lang, cb) => {
  emit("change", { setting: "target_language", value: lang });
  targetLang.value = lang;
  setTimeout(() => {
    cb();
  }, 100);
};
</script>
