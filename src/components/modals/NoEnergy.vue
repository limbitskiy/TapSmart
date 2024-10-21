<template>
  <div id="no-energy" class="flex-1 px-[2px]">
    <div class="pill-header flex flex-col gap-4">
      <span class="bg-pill-title">{{ locale["no_energy_title"] }}</span>
      <div class="page-subtitle text-gray-200 mb-2" v-html="locale['no_energy_subtitle']"></div>

      <div class="btns flex-1 flex gap-4">
        <Button class="flex-1 bg-[var(--grey-light)] text-white" @click="onClose"
          ><div class="flex justify-center gap-1">
            <span class="text-xl leading-4">{{ locale["no_energy_back_button"] || "Back" }}</span>
          </div>
        </Button>

        <Button class="flex-1" @click="onChallengeClick"
          ><div class="flex justify-center gap-1">
            <span class="text-xl leading-4">{{ locale["no_energy_challenge_button"] }}</span>
          </div>
        </Button>
      </div>
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
  close: [];
}>();

const localeStore = useLocaleStore();

const { battles: locale } = storeToRefs(localeStore);

const onChallengeClick = () => {
  emit("challenge");
};

const onClose = () => {
  emit("close");
};
</script>
