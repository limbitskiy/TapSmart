<template>
  <div id="required-settings" class="flex-1">
    <div class="top-part p-5 mb-4">
      <div class="page-title mb-4">Confirm languages</div>
      <div class="page-subtitle">To provide the best experience, we must confirm your native and target languages.</div>
    </div>

    <Pill class="py-8 mt-8" color="darker">
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

    <div class="bnt-cnt flex justify-between absolute bottom-2 w-full">
      <Button class="w-full" label="Next" @click="onNext">Next</Button>
    </div>
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
import Modal from "../components/Modal.vue";
import { useRouter } from "vue-router";

const userStore = useUserStore();
// const { startApp } = userStore;

const router = useRouter();

const nativeLang = ref(1);
const targetLang = ref(0);

const modalData = ref([
  {
    label: "English",
    value: 0,
  },
  {
    label: "Русский",
    value: 1,
  },
]);

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

const onNext = () => {
  router.push("/home/main");
};
</script>
