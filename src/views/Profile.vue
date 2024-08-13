<template>
  <div id="required-settings" class="flex-1">
    <div class="top-part p-5 mb-4">
      <div class="page-title mb-4">{{ getLocale("profile", "title") }}</div>
      <div class="page-subtitle">{{ getLocale("profile", "subtitle") }}</div>
    </div>

    <Pill class="py-8" color="darker">
      <span class="pill-title">{{ getLocale("profile", "stats_title") }}</span>

      <div class="pill-grid grid grid-cols-2 gap-4">
        <Pill class="mt-4" color="dark" ripple>
          <div class="content flex flex-col gap-2 items-center justify-between text-center">
            <span class="text-xl font-semibold text-gray-300">{{ getLocale("profile", "coins_earned") }}</span>
            <div class="price flex gap-2 items-center">
              <img class="h-6" src="/coin.png" />
              <span class="text-xl font-bold text-[var(--accent-color)]">358K</span>
            </div>
          </div>
        </Pill>

        <Pill class="mt-4" color="dark" ripple>
          <div class="content flex flex-col gap-2 items-center justify-between text-center">
            <span class="text-xl font-semibold text-gray-300">{{ getLocale("profile", "points_earned") }}</span>
            <div class="price flex gap-2 items-center">
              <img class="h-6" src="/point.png" />
              <span class="text-xl font-bold text-purple-500">177K</span>
            </div>
          </div>
        </Pill>
      </div>

      <Pill class="mt-4" color="dark" ripple>
        <div class="content flex gap-2 items-center justify-between">
          <span class="text-xl font-semibold text-gray-300">{{ getLocale("profile", "battles_played") }}</span>
          <div class="price flex gap-2 items-center">
            <img class="h-6" src="/swords.png" />
            <span class="text-xl font-bold">79</span>
          </div>
        </div>
      </Pill>

      <Pill class="mt-4" color="dark" ripple>
        <div class="content flex gap-2 items-center justify-between">
          <span class="text-xl font-semibold text-gray-300">{{ getLocale("profile", "words_learned") }}</span>
          <div class="price flex gap-2 items-center">
            <img class="h-6" src="/book.png" />
            <span class="text-xl font-bold">130</span>
          </div>
        </div>
      </Pill>
    </Pill>

    <Pill class="py-8 mt-16" color="darker">
      <span class="pill-title">{{ getLocale("profile", "settings_title") }}</span>

      <PillButton class="mt-4" color="dark" ripple>
        <template #name>
          <span class="text-lg font-semibold text-gray-300">{{ getLocale("profile", "native_language") }}</span>
        </template>
        <template #value>{{ data.settings.nativeList.find((item) => item.id === nativeLang).label }}</template>
        <template #modal="{ closeModal }">
          <Pill class="" color="dark">
            <span class="pill-title">{{ getLocale("profile", "modal_language_title") }}</span>
            <PillRadioGroup
              class="mt-4"
              color="light"
              :data="data.settings.nativeList"
              :selected="nativeLang"
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
          <span class="text-lg font-semibold text-gray-300">{{ getLocale("profile", "target_language") }}</span>
        </template>
        <template #value>{{ data.settings.targetList.find((item) => item.id === targetLang).label }}</template>
        <template #modal="{ closeModal }">
          <Pill class="" color="dark">
            <span class="pill-title">{{ getLocale("profile", "modal_language_title") }}</span>
            <PillRadioGroup
              class="mt-4"
              color="light"
              :data="data.settings.targetList"
              :selected="targetLang"
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
  </div>
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
import { getLocale } from "../utils";

const router = useRouter();
const dataStore = useDataStore();
const { profile: data } = storeToRefs(dataStore);

tg.BackButton.show();
tg.BackButton.onClick(() => {
  router.push("/home/battles");
});

const nativeLang = ref(data.value.settings.native);
const targetLang = ref(data.value.settings.target);

const onNativeSelect = (lang, cb) => {
  nativeLang.value = lang;
  setTimeout(() => {
    cb();
  }, 100);
};

const onTargetSelect = (lang, cb) => {
  targetLang.value = lang;
  setTimeout(() => {
    cb();
  }, 100);
};
</script>
