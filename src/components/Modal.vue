<template>
  <div class="modal relative">
    <div v-if="visible" id="modal-backdrop" class="modal-backdrop fixed inset-0 bg-black bg-opacity-50 z-40" @click="onBackdropClick"></div>

    <Transition name="modal-slide-up">
      <BackgroundPill
        v-if="visible"
        class="fixed bottom-0 w-full z-50 flex flex-col rounded-bl-none rounded-br-none py-4"
        color="dark"
        :style="{ maxHeight: height ?? sticky ? '85dvh' : 'calc(100dvh - 67px)' }"
      >
        <div class="w-8 h-1 bg-gray-600 rounded-full m-auto relative -top-2"></div>
        <div class="modal-scroll flex overflow-y-scroll">
          <slot></slot>
        </div>

        <Button
          v-if="visible && !sticky"
          activeColor="#fcdcb0"
          class="close absolute top-4 right-4 z-50 !p-2 !rounded-lg"
          :class="{ animate__heartBeat: visible && !sticky && animateBtn }"
          @click="onCloseClick"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M13.6146 11.7596L8.855 7L13.6146 2.2404C14.1285 1.72654 14.1285 0.899258 13.6146 0.385396C13.1007 -0.128465 12.2735 -0.128465 11.7596 0.385396L7 5.145L2.2404 0.385396C1.72654 -0.128465 0.899258 -0.128465 0.385396 0.385396C-0.128465 0.899258 -0.128465 1.72654 0.385396 2.2404L5.145 7L0.385396 11.7596C-0.128465 12.2735 -0.128465 13.1007 0.385396 13.6146C0.899258 14.1285 1.72654 14.1285 2.2404 13.6146L7 8.855L11.7596 13.6146C12.2735 14.1285 13.1007 14.1285 13.6146 13.6146C14.1248 13.1007 14.1248 12.2698 13.6146 11.7596Z"
              fill="#222222"
            />
          </svg>
        </Button>
      </BackgroundPill>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

const props = defineProps<{
  visible: boolean;
  sticky?: boolean;
  height?: string;
}>();

const emit = defineEmits<{
  "update:visible": [value: boolean];
}>();

const animateBtn = ref(false);

const onBackdropClick = (event: MouseEvent) => {
  if (event.target?.id === "modal-backdrop" && !props.sticky) {
    emit("update:visible", false);
  }
};

const onCloseClick = () => {
  emit("update:visible", false);
};

watch(props, (val) => {
  if (val?.visible) {
    setTimeout(() => {
      animateBtn.value = true;
    }, 500);
  } else {
    animateBtn.value = false;
  }
});
</script>
