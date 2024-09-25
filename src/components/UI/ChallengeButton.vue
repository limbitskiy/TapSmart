<template>
  <Button ref="challengeBtnRef" activeColor="#fcdcb0" class="flex-1 py-3 px-5 relative" :class="{ 'bg-gray-300 text-gray-400': data.button_challenge?.disabled }" @click="onClick"
    ><div class="flex justify-center gap-2">
      <span v-bind="$attrs" class="text-base leading-4">{{ locale?.["button_challenge"] }}</span>
      <Badge v-if="data?.questions_left > 0" :data="data?.questions_left" grey />
    </div>
  </Button>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { storeToRefs } from "pinia";

// stores
import { useDataStore } from "@/store/data";
import { useLocaleStore } from "@/store/locale";
import { useMainStore } from "@/store/main";

// components
import Button from "@/components/UI/Button.vue";
import Badge from "@/components/UI/Badge.vue";

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
  if (data.value.button_challenge?.disabled) {
    showTooltip({
      element: challengeBtnRef.value.btnRef,
      text: locale.value["button_challenge_tooltip"],
    });
  } else {
    emit("challenge");
  }
};
</script>
