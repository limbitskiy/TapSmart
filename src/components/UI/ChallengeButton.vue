<template>
  <Button ref="challengeBtnRef" activeColor="#fcdcb0" class="flex-1 py-3 px-5 relative" :class="{ 'bg-gray-300 text-gray-400': data.challengeButton?.disabled }" @click="onClick"
    ><div class="flex justify-center gap-1">
      <span v-bind="$attrs" class="text-base leading-4">{{ locale?.["button_challenge"] }}</span>
      <!-- <div
        v-if="data?.questions_left > 0"
        class="counter text-sm bg-[#333] text-white border border-[var(--accent-color)] rounded-md h-4 px-1 grid place-items-center leading-3 exo-bold absolute top-1 right-1"
      >
        {{ data.questions_left }}
      </div>
      <div v-else class="counter bottom-1 text-sm bg-[#222] text-white rounded-md h-4 px-1 grid place-items-center leading-3 exo-bold absolute top-1 right-1">
        {{ data.battle_button_challenge?.badge || 0 }}
      </div> -->
    </div>
  </Button>
</template>

<script setup lang="ts">
import { ref } from "vue";
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
const { data } = storeToRefs(dataStore.battles);
const { battles: locale } = storeToRefs(localeStore);

const challengeBtnRef = ref();

const onClick = () => {
  if (data.value.battle_button_challenge?.disabled) {
    showTooltip({
      element: challengeBtnRef.value.ref,
      text: locale.value["button_challenge_tooltip"],
    });
  } else {
    emit("challenge");
  }
};
</script>
