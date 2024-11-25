<template>
  <div id="afk" class="flex-1 py-1">
    <div class="pill-header flex flex-col gap-4">
      <span class="bg-pill-title">{{ locale?.["no_answers_title"] || "AFK Title" }}</span>
      <div class="page-subtitle text-gray-200 mb-2" v-html="locale?.['no_answers_subtitle'] || 'AFK Subtitle'"></div>

      <Button grey @click="onClose"
        ><span class="text-xl leading-4">{{ locale?.["button_no_answers"] || "Back Btn" }}</span>
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";

// stores
import { useLocaleStore } from "@/store/locale";

const emit = defineEmits<{
  close: [];
}>();

const localeStore = useLocaleStore();

const { battles: locale } = storeToRefs(localeStore);

const onClose = () => {
  emit("close");
};
</script>
