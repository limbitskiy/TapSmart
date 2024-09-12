<template>
  <Teleport to="body">
    <Transition name="toast-slide">
      <div
        v-if="notificationData.isShown"
        class="notification glass flex flex-col text-lg fixed top-1 left-1 right-1 bg-[--grey-light] p-4 rounded-2xl text-white transition-transform z-50 border border-gray-600"
      >
        <span class="text-xl fira-condensed-bold text-gray-100">{{
          notificationData.title
        }}</span>
        <span class="fira-condensed text-base">{{
          notificationData.subtitle
        }}</span>
        <div class="btns flex justify-end gap-4 mt-2">
          <Button
            v-if="!notificationData.buttons?.left?.hidden"
            class="!py-1 bg-[var(--red-color)]"
            :data="notificationData.buttons.left"
            :defaultAction="hideNotification"
          ></Button>
          <Button
            v-if="!notificationData.buttons?.right?.hidden"
            class="!py-1 bg-[var(--green-color)]"
            :data="notificationData.buttons.right"
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
const { notificationData } = storeToRefs(userStore);
const { hideNotification } = userStore;
</script>
