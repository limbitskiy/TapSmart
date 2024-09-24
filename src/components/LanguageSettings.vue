<template>
  <BackgroundPill color="dark">
    <span class="bg-pill-title">{{ locale["settings_title"] }}</span>

    <div class="flex flex-col gap-2 mt-4">
      <PillButton color="light">
        <template #name>
          <span class="text-lg font-semibold text-gray-300">{{ locale["target_language"] }}</span>
        </template>
        <template #value>{{ data["target_language_list"].find((item) => item.id === targetLang).label }}</template>
        <template #modal="{ closeModal }">
          <div>
            <span class="pill-title">{{ locale["modal_language_title"] }}</span>
            <PillRadioGroup
              class="mt-2"
              color="light"
              :data="data['target_language_list']"
              :selected="data['target_language']"
              ripple
              @select="
                (lang) => {
                  onTargetSelect(lang, closeModal);
                }
              "
            />
          </div>
        </template>
      </PillButton>

      <PillButton color="light">
        <template #name>
          <span class="text-lg font-semibold text-gray-300">{{ locale["native_language"] }}</span>
        </template>
        <template #value>{{ data["native_language_list"].find((item) => item.id === nativeLang).label }}</template>
        <template #modal="{ closeModal }">
          <div>
            <span class="pill-title">{{ locale["modal_language_title"] }}</span>
            <PillRadioGroup
              class="mt-2"
              color="light"
              :data="data['native_language_list']"
              :selected="data['native_language']"
              ripple
              @select="
                (lang) => {
                  onNativeSelect(lang, closeModal);
                }
              "
            />
          </div>
        </template>
      </PillButton>
    </div>
  </BackgroundPill>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { tg } from "@/api/telegram";

// stores
import { useDataStore } from "@/store/data.ts";
import { useLocaleStore } from "@/store/locale.ts";

// components
import BackgroundPill from "@/components/UI/BackgroundPill.vue";
import PillButton from "@/components/UI/PillButton.vue";
import PillRadioGroup from "@/components/UI/PillRadioGroup.vue";

const emit = defineEmits<{
  change: [data: { setting: string; value: number }];
}>();

const dataStore = useDataStore();
const localeStore = useLocaleStore();

const { profile: data } = storeToRefs(dataStore);
const { profile: locale } = storeToRefs(localeStore);

const nativeLang = ref(data.value["native_language"]);
const targetLang = ref(data.value["target_language"]);

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
