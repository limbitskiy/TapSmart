<template>
  <div class="main-page flex w-full h-[100dvh] relative">
    <RouterView v-slot="{ Component, route }">
      <Suspense>
        <Transition :name="route.meta.transition || 'fade'" mode="out-in">
          <component :is="Component" />
        </Transition>
      </Suspense>
    </RouterView>

    <Notification />

    <Teleport to="body">
      <Transition name="tooltip" appear>
        <Tooltip v-if="tooltip.isShown" />
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { onMounted } from "vue";
import { RouterView } from "vue-router";

// store
import { useMainStore } from "@/store/main.ts";

// components
import Notification from "@/components/Notification.vue";
import Tooltip from "@/components/Tooltip.vue";

const mainStore = useMainStore();
const { tooltip } = storeToRefs(mainStore);
</script>
