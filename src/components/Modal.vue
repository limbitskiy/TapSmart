<template>
  <div class="modal">
    <div v-if="visible" id="modal-backdrop" class="modal-backdrop fixed inset-1 bg-black bg-opacity-50 z-40" @click="onBackdropClick"></div>
    <div v-if="visible" class="close absolute top-4 right-4 z-50" @click="onCloseClick">
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="36" height="36" rx="10" fill="#FEAC3E" />
        <path
          d="M27.241 24.7556L20.864 18.3787L27.241 12.0017C27.9294 11.3132 27.9294 10.2048 27.241 9.51636C26.5525 8.82788 25.4441 8.82788 24.7556 9.51636L18.3787 15.8933L12.0017 9.51636C11.3132 8.82788 10.2048 8.82788 9.51636 9.51636C8.82788 10.2048 8.82788 11.3132 9.51636 12.0017L15.8933 18.3787L9.51636 24.7556C8.82788 25.4441 8.82788 26.5525 9.51636 27.241C10.2048 27.9294 11.3132 27.9294 12.0017 27.241L18.3787 20.864L24.7556 27.241C25.4441 27.9294 26.5525 27.9294 27.241 27.241C27.9246 26.5525 27.9246 25.4392 27.241 24.7556Z"
          fill="#222222"
        />
      </svg>
    </div>
    <Transition name="modal-slide-up">
      <BackgroundPill v-if="visible" class="fixed bottom-0 w-full z-50 flex flex-col max-h-[85dvh] rounded-bl-none rounded-br-none py-4" color="dark">
        <div class="w-8 h-1 bg-gray-500 rounded-full m-auto relative -top-4"></div>
        <div class="modal-scroll overflow-y-scroll">
          <slot></slot>
        </div>
      </BackgroundPill>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { watch } from "vue";

// composables
// components
import BackgroundPill from "@/components/UI/BackgroundPill.vue";

const props = defineProps<{
  visible: boolean;
}>();

const emit = defineEmits<{
  "update:visible": [value: boolean];
}>();

const onBackdropClick = (e) => {
  if (e.target.id === "modal-backdrop") {
    emit("update:visible", false);
  }
};

const onCloseClick = () => {
  emit("update:visible", false);
};
</script>
