<template>
  <Button ref="challengeBtnRef" class="flex-1 py-3 px-5" :class="{ 'bg-gray-300 text-gray-400': data.challengeButton?.disabled }" @click="onClick"
    ><div class="flex justify-center gap-1">
      <span class="text-base leading-4">{{ locale["button_challenge"] }}</span>
      <div v-if="data.questions_left > 0" class="counter text-sm bg-green-500 rounded-md h-4 px-1 grid place-items-center leading-3 exo-bold">
        {{ data.questions_left }}
      </div>
      <div v-else class="counter relative bottom-1 text-sm bg-[#222] text-white rounded-md h-4 px-1 grid place-items-center leading-3 exo-bold">
        {{ data.challengeButton?.badge || 0 }}
      </div>
    </div>
  </Button>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { storeToRefs } from "pinia";

// components
import Button from "@/components/UI/Button.vue";

// stores
import { useDataStore } from "@/store/data";
import { useLocaleStore } from "@/store/locale";
import { useMainStore } from "@/store/main";

const emit = defineEmits<{
  challenge: [];
}>();

const dataStore = useDataStore();
const mainStore = useMainStore();
const localeStore = useLocaleStore();

const { showTooltip } = mainStore;
const { battles: data } = storeToRefs(dataStore);
const { battles: locale } = storeToRefs(localeStore);

const challengeBtnRef = ref();

const onClick = () => {
  if (data.value.challengeButton?.disabled) {
    showTooltip({
      element: challengeBtnRef.value.ref,
      text: locale.value["button_challenge_tooltip"],
    });
  } else {
    emit("challenge");
  }
};
</script>
