<template>
  <div class="modal">
    <div v-if="visible" id="modal-backdrop" class="modal-backdrop fixed inset-1 bg-black bg-opacity-50" @click="onBackdropClick"></div>
    <Transition name="modal-slide-up">
      <div v-if="visible" class="fixed bottom-0 w-full" color="darker">
        <slot></slot>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
defineProps<{
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
</script>
