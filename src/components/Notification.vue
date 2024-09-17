<template>
  <Teleport to="body">
    <Transition name="toast-slide">
      <div
        v-if="notification.isShown"
        class="notification glass flex flex-col text-lg fixed top-1 left-1 right-1 bg-[--grey-light] p-4 rounded-2xl text-white transition-transform z-50 border border-gray-600"
      >
        <span class="text-xl fira-condensed-bold text-gray-100">{{ notification.title }}</span>
        <span class="fira-condensed text-base">{{ notification.subtitle }}</span>
        <div class="btns flex justify-end gap-4 mt-2">
          <Button
            v-if="!notification.buttons?.left?.hidden"
            class="!py-1 text-white bg-[var(--red-color)]"
            :data="notification.buttons.left"
            :defaultAction="hideNotification"
          ></Button>
          <Button
            v-if="!notification.buttons?.right?.hidden"
            class="!py-1 text-white bg-[var(--green-color)]"
            :data="notification.buttons.right"
            :defaultAction="hideNotification"
          ></Button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";

// store
import { useMainStore } from "@/store/main";

// components
import Button from "@/components/UI/Button.vue";

const userStore = useMainStore();
const { notification } = storeToRefs(userStore);
const { hideNotification } = userStore;
</script>
