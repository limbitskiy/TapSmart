<template>
  <Teleport to="body">
    <Transition name="toast-slide">
      <div
        v-if="notificationData.isShown"
        class="notification glass flex flex-col text-lg fixed top-1 left-1 right-1 bg-[--grey-light] p-4 rounded-2xl text-white transition-transform z-50 border border-gray-600"
      >
        <span class="text-xl fira-condensed-bold text-gray-100">{{ notificationData.title }}</span>
        <span class="fira-condensed text-base">{{ notificationData.subtitle }}</span>
        <div class="btns flex justify-end gap-4 mt-2">
          <button
            v-if="!notificationData.buttons.left.hidden"
            class="fira-condensed-bold rounded-lg bg-[--red-color] px-6 py-1 text-base"
            @click="() => onBtn(notificationData.buttons.left)"
          >
            {{ notificationData.buttons.left.label }}
          </button>
          <button
            v-if="!notificationData.buttons.right.hidden"
            class="fira-condensed-bold rounded-lg bg-[--green-color] px-6 py-1 text-base"
            @click="() => onBtn(notificationData.buttons.right)"
          >
            {{ notificationData.buttons.right.label }}
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { useMainStore } from "@/store/main.ts";
import { storeToRefs } from "pinia";

const userStore = useMainStore();
const { notificationData } = storeToRefs(userStore);
const { hideNotification, notificationAction } = userStore;

const onBtn = (btn) => {
  if (btn.isClose) {
    hideNotification();
    return;
  }

  if (btn.api && btn.data) {
    notificationAction({ api: btn.api, data: btn.data });
    hideNotification();
  }
};

console.log(notificationData);
</script>
