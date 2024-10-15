<template>
  <div
    class="main-page flex flex-col min-h-[100dvh]"
    :style="{
      'padding-left': left,
      'padding-right': right,
      'padding-top': top,
      'padding-bottom': bottom,
    }"
  >
    <RouterView v-slot="{ Component, route }">
      <template v-if="Component">
        <Transition :name="route.meta.transition || 'fade'" mode="out-in">
          <!-- <KeepAlive> -->
          <Suspense>
            <component :is="Component" />
            <template #fallback><Loader /></template>
          </Suspense>
          <!-- </KeepAlive> -->
        </Transition>
      </template>
    </RouterView>

    <Teleport to="#modals">
      <Transition name="toast-slide">
        <Notification v-if="notification.isShown" />
      </Transition>
    </Teleport>

    <!-- tooltip -->
    <Teleport to="#tooltip">
      <Transition name="tooltip" appear>
        <Tooltip v-if="tooltip.isShown" />
      </Transition>
    </Teleport>

    <!-- backend-controlled modal -->
    <Teleport to="#backend-modal">
      <Modal id="backend-modal" v-model:visible="modal.isShown" sticky>
        <BackendModal />
      </Modal>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { onMounted } from "vue";
import { useScreenSafeArea } from "@vueuse/core";

// store
import { useMainStore } from "@/store/main";

const { top, right, bottom, left } = useScreenSafeArea();

const store = useMainStore();

const { notification, tooltip, modal } = storeToRefs(store);
const { pauseBattle, resumeBattle } = store.battleStore;

const handleVisibilityChange = () => {
  if (document.hidden) {
    pauseBattle();
  } else {
    resumeBattle();
  }
};

onMounted(() => {
  document.addEventListener("visibilitychange", handleVisibilityChange);
});
</script>
