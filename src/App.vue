<template>
  <UseScreenSafeArea top right bottom left>
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
          <BackendModal />
        </Modal>
      </Teleport>
    </div>
    <!-- <ProgressBar /> -->
  </UseScreenSafeArea>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { onMounted } from "vue";
import { RouterView } from "vue-router";
import { UseScreenSafeArea } from "@vueuse/components";

// store
import { useMainStore } from "@/store/main";
import { useDataStore } from "@/store/data";

// components
import Notification from "@/components/Notification.vue";
import Tooltip from "@/components/Tooltip.vue";
import Modal from "@/components/Modal.vue";
import Loader from "@/components/UI/Loader.vue";
import BackendModal from "@/components/UI/BackendModal.vue";
import ProgressBar from "./components/ProgressBar.vue";

const mainStore = useMainStore();
const dataStore = useDataStore();

const { pauseBattle, resumeBattle } = dataStore.battles;
const { tooltip, modal } = storeToRefs(mainStore);

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
