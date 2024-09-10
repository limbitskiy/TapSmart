<template>
  <div class="main-page flex w-full min-h-[100dvh] relative">
    <RouterView v-slot="{ Component, route }">
      <template v-if="Component">
        <Transition :name="route.meta.transition || 'fade'" mode="out-in">
          <Suspense>
            <component :is="Component" />
            <template #fallback><Loader /></template>
          </Suspense>
        </Transition>
      </template>
    </RouterView>

    <Notification />

    <!-- tooltip -->
    <Teleport to="body">
      <Transition name="tooltip" appear>
        <Tooltip v-if="tooltip.isShown" />
      </Transition>
    </Teleport>

    <!-- backend-controlled modal -->
    <Teleport to="body">
      <Modal v-model:visible="modal.isShown" sticky>
        <div class="modal-content flex flex-col gap-2">
          <span class="text-xl fira-condensed-bold text-gray-100">{{ modal.title }}</span>
          <span class="fira-condensed text-base">{{ modal.subtitle }}</span>
          <div class="btns flex justify-end gap-4 mt-2">
            <button
              v-if="modal.buttons?.left && !modal.buttons?.left?.hidden"
              class="fira-condensed-bold rounded-lg bg-[--red-color] px-6 py-1 text-base"
              @click="() => onModalButton(modal.buttons.left)"
            >
              {{ modal.buttons?.left?.label }}
            </button>
            <button
              v-if="modal.buttons?.right && !modal.buttons?.right?.hidden"
              class="fira-condensed-bold rounded-lg bg-[--green-color] px-6 py-1 text-base"
              @click="() => onModalButton(modal.buttons.right)"
            >
              {{ modal.buttons?.right?.label }}
            </button>
          </div>
        </div>
      </Modal>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { onMounted } from "vue";
import { RouterView } from "vue-router";

// store
import { useMainStore } from "@/store/main";

// components
import Notification from "@/components/Notification.vue";
import Tooltip from "@/components/Tooltip.vue";
import Modal from "@/components/Modal.vue";
import Loader from "@/components/UI/Loader.vue";

const mainStore = useMainStore();
const { tooltip, modal } = storeToRefs(mainStore);
const { hideModal, notificationAction } = mainStore;

const onModalButton = (btn: { api: string; data: string; isClose: boolean }) => {
  console.log(btn);

  if (btn.isClose) {
    hideModal();
    return;
  }

  if (btn.api && btn.data) {
    notificationAction({ api: btn.api, data: btn.data });
    hideModal();
  }
};
</script>
