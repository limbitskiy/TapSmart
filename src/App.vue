<template>
  <div v-if="debugMessages.length" class="debug-message text-sm fixed top-0 left-0 right-0 z-[10000] bg-purple-800 p-2 flex flex-col">
    <span v-for="(msg, index) in debugMessages" :key="index">{{ msg }}</span>
  </div>
  <div
    class="main-page flex flex-col min-h-dvh"
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
          <Suspense timeout="1000">
            <component :is="Component" />
            <template #fallback><Loader /></template>
          </Suspense>
          <!-- </KeepAlive> -->
        </Transition>
      </template>
    </RouterView>

    <Teleport to="#modals">
      <Transition name="toast-slide">
        <Notification v-if="notification.isShown" :data="notification" :hideNotification="hideNotification" />
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
      <Modal id="backend-modal" v-model:visible="modal.isShown" :sticky="modal.isClosable" :zIndex="60">
        <BackendModal @close="onCloseBackendModal" />
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

const { hideNotification } = store;
const { notification, tooltip, modal, debugMessages } = storeToRefs(store);
const { pauseBattle, resumeBattle } = store.battleStore;

const handleVisibilityChange = () => {
  if (document.hidden) {
    pauseBattle();
  } else {
    resumeBattle();
  }
};

const onCloseBackendModal = () => {
  modal.value.isShown = false;
};

onMounted(() => {
  document.addEventListener("visibilitychange", handleVisibilityChange);

  // post({ message: "hello, worker" });
});
</script>
