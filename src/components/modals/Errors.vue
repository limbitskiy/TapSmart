<template>
  <div id="errors" class="flex-1 flex flex-col gap-4 min-h-[60dvh] overflow-hidden">
    <span class="bg-pill-title">{{ locale?.["error_title"] || "Error Title" }}</span>

    <div class="error-list flex flex-col gap-2 flex-1 mt-2 overflow-scroll">
      <Pill v-for="error in data?.['error_data']">
        <div class="error-content grid grid-cols-[1fr_24px_1fr] items-center">
          <span>{{ error.question }}</span>
          <!-- <span class="scale-150">→</span> -->
          <img class="" :src="getAsset('arrow_right')" />
          <span class="text-end">{{ error.answer }}</span>
        </div>
      </Pill>
    </div>

    <Button @click="onClose">OK</Button>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount } from "vue";
import { storeToRefs } from "pinia";
import { getAsset } from "@/utils";

// stores
import { useDataStore } from "@/store/data";
import { useLocaleStore } from "@/store/locale";

const emit = defineEmits<{
  close: [];
}>();

const dataStore = useDataStore();
const localeStore = useLocaleStore();

const { battles: locale } = storeToRefs(localeStore);
const { data } = storeToRefs(dataStore.battles);

const onClose = () => {
  emit("close");
};
</script>
