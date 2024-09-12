<template>
  <div id="no-energy" class="flex-1 px-[2px]">
    <div class="pill-header flex flex-col gap-4">
      <span class="bg-pill-title">{{ locale["no_energy_title"] }}</span>
      <div class="page-subtitle text-gray-200 mb-2" v-html="locale['no_energy_subtitle']"></div>

      <Button class="flex-1 py-4 px-5" @click="onClick"
        ><div class="flex justify-center gap-1">
          <span class="text-xl leading-4">{{ locale["no_energy_challenge_button"] }}</span>
        </div>
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";

// components
import Button from "@/components/UI/Button.vue";

// stores
import { useLocaleStore } from "@/store/locale";

const emit = defineEmits<{
  challenge: [];
}>();

const localeStore = useLocaleStore();

const { battles: locale } = storeToRefs(localeStore);

const onClick = () => {
  emit("challenge");
};
</script>
