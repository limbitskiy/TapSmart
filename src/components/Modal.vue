<template>
  <div class="modal">
    <div v-if="visible" id="modal-backdrop" class="modal-backdrop fixed inset-1 bg-black bg-opacity-50 z-40" @click="onBackdropClick"></div>
    <Transition name="modal-slide-up">
      <BackgroundPill v-if="visible" class="fixed bottom-0 w-full z-50 max-h-[90dvh] overflow-scroll rounded-bl-none rounded-br-none" color="dark">
        <div class="w-8 h-1 bg-gray-500 rounded-full m-auto relative -top-4"></div>
        <slot></slot>
      </BackgroundPill>
    </Transition>
  </div>
</template>

<script setup lang="ts">
// composables
import { useBackButton } from "@/composables/useBackButton";

// components
import BackgroundPill from "@/components/UI/BackgroundPill.vue";

defineProps<{
  visible: boolean;
}>();

const emit = defineEmits<{
  "update:visible": [value: boolean];
}>();

useBackButton();

const onBackdropClick = (e) => {
  if (e.target.id === "modal-backdrop") {
    emit("update:visible", false);
  }
};
</script>
