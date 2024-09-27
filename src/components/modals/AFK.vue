<template>
  <div id="afk" class="flex-1 px-[2px]">
    <div class="pill-header flex flex-col gap-4">
      <span class="bg-pill-title">{{
        locale?.["no_answers_title"] || "AFK Title"
      }}</span>
      <div
        class="page-subtitle text-gray-200 mb-2"
        v-html="locale?.['no_answers_subtitle'] || 'AFK Subtitle'"
      ></div>

      <Button class="py-4 bg-[var(--grey-light)] text-white" @click="onClose"
        ><span class="text-xl leading-4">{{
          locale?.["button_no_answers"] || "Back Btn"
        }}</span>
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount } from "vue";
import { storeToRefs } from "pinia";

// stores
import { useDataStore } from "@/store/data";
import { useLocaleStore } from "@/store/locale";

const emit = defineEmits<{
  close: [];
}>();

const dataStore = useDataStore();
const localeStore = useLocaleStore();

const { battles: locale } = storeToRefs(localeStore);
const { stopBreakpoint, startBreakpoint } = dataStore.battles;

const onClose = () => {
  emit("close");
};

onMounted(() => {
  stopBreakpoint();
});

onBeforeUnmount(() => {
  startBreakpoint("battle");
});
</script>
