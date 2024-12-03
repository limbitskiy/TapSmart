<template>
  <div id="required-settings" class="flex-1 p-4">
    <div class="top-part mb-4">
      <div class="page-title mb-2">{{ locale?.["title"] }}</div>
      <RouteSubtitle :text="locale?.['subtitle']" />
    </div>

    <LanguageSettings @change="onSettingsChange" />

    <div class="bnt-cnt flex justify-between absolute bottom-4 left-4 right-4">
      <Button class="w-full py-3" activeColor="#fcdcb0" label="Next" @click="onNext">
        <span class="text-xl leading-4">{{ locale?.["button_next"] || "Next" }}</span>
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from "vue";
import { storeToRefs } from "pinia";

// stores
import { useMainStore } from "@/store/main";

const store = useMainStore();

const { setLanguages, redirectTo } = store;
const { requiredSettings: data } = storeToRefs(store.dataStore);
const { requiredSettings: locale } = storeToRefs(store.localeStore);

const onSettingsChange = ({ setting, value }: { setting: string; value: number }) => {
  setLanguages({ [setting]: value });
};

const onNext = () => {
  redirectTo("/home/relax");
};
</script>
