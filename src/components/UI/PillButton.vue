<template>
  <Pill v-bind="$attrs" color="light" @click="handleClick">
    <div class="pill-content flex items-center justify-between gap-2">
      <div class="pill-start">
        <slot name="name"></slot>
      </div>
      <div class="pill-end flex items-center gap-4">
        <slot name="value"></slot>
        <img src="@/assets/icons/chevron-right.svg" />
      </div>
    </div>
  </Pill>
  <Teleport to="body">
    <Modal v-model:visible="isModalVisible">
      <slot name="modal" :closeModal="closeModal"></slot>
    </Modal>
  </Teleport>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Pill from "@/components/UI/Pill.vue";
import Modal from "@/components/Modal.vue";

const isModalVisible = ref(false);

const handleClick = () => {
  isModalVisible.value = true;
};

const closeModal = () => {
  isModalVisible.value = false;
};
</script>
