<template>
  <div class="modal relative">
    <div v-if="visible" id="modal-backdrop" class="modal-backdrop fixed inset-0 bg-black bg-opacity-50 z-40" @click="onBackdropClick"></div>
    <!-- <Transition name="toast-slide" appear> -->
    <Button
      v-if="visible && !sticky"
      activeColor="#fcdcb0"
      class="close fixed top-4 right-4 z-50 !p-2 !rounded-lg"
      :class="{ animate__heartBeat: visible && !sticky }"
      @click="onCloseClick"
    >
      <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M18.241 15.7556L11.864 9.37866L18.241 3.00171C18.9294 2.31323 18.9294 1.20483 18.241 0.516357C17.5525 -0.172119 16.4441 -0.172119 15.7556 0.516357L9.37866 6.89331L3.00171 0.516357C2.31323 -0.172119 1.20483 -0.172119 0.516357 0.516357C-0.172119 1.20483 -0.172119 2.31323 0.516357 3.00171L6.89331 9.37866L0.516357 15.7556C-0.172119 16.4441 -0.172119 17.5525 0.516357 18.241C1.20483 18.9294 2.31323 18.9294 3.00171 18.241L9.37866 11.864L15.7556 18.241C16.4441 18.9294 17.5525 18.9294 18.241 18.241C18.9246 17.5525 18.9246 16.4392 18.241 15.7556Z"
          fill="#222222"
        />
      </svg>
    </Button>
    <!-- </Transition> -->
    <Transition name="modal-slide-up">
      <BackgroundPill
        v-if="visible"
        class="fixed bottom-0 w-full z-50 flex flex-col rounded-bl-none rounded-br-none py-4"
        color="dark"
        :style="{ maxHeight: height ?? sticky ? '85dvh' : 'calc(100dvh - 67px)' }"
      >
        <div class="w-8 h-1 bg-gray-500 rounded-full m-auto relative -top-4"></div>
        <div class="modal-scroll flex overflow-y-scroll">
          <slot></slot>
        </div>
      </BackgroundPill>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { onMounted, watch } from "vue";

// components
import BackgroundPill from "@/components/UI/BackgroundPill.vue";
import Button from "@/components/UI/Button.vue";

const props = defineProps<{
  visible: boolean;
  sticky?: boolean;
  height?: string;
}>();

const emit = defineEmits<{
  "update:visible": [value: boolean];
}>();

const onBackdropClick = (event: MouseEvent) => {
  if (event.target?.id === "modal-backdrop" && !props.sticky) {
    emit("update:visible", false);
  }
};

const onCloseClick = () => {
  emit("update:visible", false);
};
</script>
