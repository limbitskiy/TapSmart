<template>
  <div id="required-settings" class="flex-1">
    <div class="top-part p-5 mb-4">
      <div class="page-title mb-4">Profile</div>
      <div class="page-subtitle">See your battle stats or change your language!</div>
    </div>

    <Pill class="py-8" color="darker">
      <span class="pill-title">Stats</span>

      <div class="pill-grid grid grid-cols-2 gap-4">
        <Pill class="mt-4" color="dark" ripple>
          <div class="content flex flex-col gap-2 items-center justify-between p-2">
            <span class="text-xl font-semibold text-gray-300">Coins earned</span>
            <div class="price flex gap-2 items-center">
              <img class="h-6" src="/coin.png" />
              <span class="text-xl font-bold text-[var(--accent-color)]">358K</span>
            </div>
          </div>
        </Pill>

        <Pill class="mt-4" color="dark" ripple>
          <div class="content flex flex-col gap-2 items-center justify-between p-2">
            <span class="text-xl font-semibold text-gray-300">Points earned</span>
            <div class="price flex gap-2 items-center">
              <img class="h-6" src="/point.png" />
              <span class="text-xl font-bold text-purple-500">177K</span>
            </div>
          </div>
        </Pill>
      </div>

      <Pill class="mt-4" color="dark" ripple>
        <div class="content flex gap-2 items-center justify-between p-2">
          <span class="text-xl font-semibold text-gray-300">Battles played</span>
          <div class="price flex gap-2 items-center">
            <img class="h-6" src="/swords.png" />
            <span class="text-xl font-bold">79</span>
          </div>
        </div>
      </Pill>

      <Pill class="mt-4" color="dark" ripple>
        <div class="content flex gap-2 items-center justify-between p-2">
          <span class="text-xl font-semibold text-gray-300">Words learned</span>
          <div class="price flex gap-2 items-center">
            <img class="h-6" src="/book.png" />
            <span class="text-xl font-bold">130</span>
          </div>
        </div>
      </Pill>
    </Pill>

    <Pill class="py-8 mt-16" color="darker">
      <span class="pill-title">Settings</span>

      <PillButton class="mt-4" color="dark" ripple>
        <template #name>
          <span class="text-lg font-semibold text-gray-300">Native language</span>
        </template>
        <template #value>{{ modalData.find((item) => item.value === nativeLang).label }}</template>
        <template #modal="{ closeModal }">
          <Pill class="" color="dark">
            <span class="pill-title">Select native language:</span>
            <PillRadioGroup
              class="mt-4"
              color="light"
              :data="modalData"
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
          <span class="text-lg font-semibold text-gray-300">Target language</span>
        </template>
        <template #value>{{ modalData.find((item) => item.value === targetLang).label }}</template>
        <template #modal="{ closeModal }">
          <Pill class="" color="dark">
            <span class="pill-title">Select target language:</span>
            <PillRadioGroup
              class="mt-4"
              color="light"
              :data="modalData"
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
import { useUserStore } from "@/store/user.ts";
import { storeToRefs } from "pinia";
import Button from "@/components/UI/Button.vue";
import Pill from "@/components/UI/Pill.vue";
import PillButton from "@/components/UI/PillButton.vue";
import PillRadioGroup from "@/components/UI/PillRadioGroup.vue";
import { tg, getUserId } from "@/api/telegram";

const nativeLang = ref(1);
const targetLang = ref(0);

const modalData = [
  {
    label: "English",
    value: 0,
  },
  {
    label: "Русский",
    value: 1,
  },
];

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
