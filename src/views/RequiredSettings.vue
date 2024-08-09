<template>
  <div id="required-settings" class="flex-1">
    <div class="top-part p-5 mb-4">
      <div class="page-title mb-4">Confirm languages</div>
      <div class="page-subtitle">To provide the best experience, we must confirm your native and target languages.</div>
    </div>

    <Pill class="py-8" color="darker">
      <span class="pill-title">Settings</span>

      <PillButton class="mt-4" color="dark" @click="onNativeLangClick">
        <template #name>
          <span class="text-lg font-semibold">Native language</span>
        </template>
        <template #value>{{ nativeLang }}</template>
      </PillButton>

      <PillButton class="mt-4" color="dark" @click="onTargetLangClick">
        <template #name>
          <span class="text-lg font-semibold">Target language</span>
        </template>
        <template #value>{{ targetLang }}</template>
      </PillButton>
    </Pill>

    <div class="bnt-cnt flex justify-between absolute bottom-2 w-full">
      <Button class="w-full" label="Next" @click="$router.push('/home/friends')">Next</Button>
    </div>

    <Modal v-model:visible="modal.visible">
      <Pill class="" color="dark">
        <span class="pill-title">Select language</span>
        <PillRadioGroup class="mt-4" color="light" :data="modalData" :picked="modal.picked" @pick="onLanguagePick" />
      </Pill>
    </Modal>
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

const nativeLang = ref("English");
const targetLang = ref("Русский");

const modal = ref({
  type: null,
  visible: false,
  picked: null,
});

const modalData = [
  {
    id: 0,
    text: "English",
  },
  {
    id: 1,
    text: "Русский",
  },
];

const onNativeLangClick = () => {
  modal.value.visible = true;
  modal.value.type = "nativeLang";
  modal.value.picked = nativeLang.value;
};

const onTargetLangClick = () => {
  modal.value.visible = true;
  modal.value.type = "targetLang";
  modal.value.picked = targetLang.value;
};

const onLanguagePick = (langId) => {
  modal.value.visible = false;
  const lang = modalData.find((item) => item.id === langId);

  if (modal.value.type === "nativeLang") {
    nativeLang.value = lang.text;
  } else {
    targetLang.value = lang.text;
  }
};
</script>
