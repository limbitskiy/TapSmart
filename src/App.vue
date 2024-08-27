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
  </div>
</template>

<script setup lang="ts">
import Notification from "@/components/Notification.vue";
import { useMainStore } from "@/store/main.ts";
import { storeToRefs } from "pinia";
import { onMounted } from "vue";
import { RouterView } from "vue-router";

const userStore = useMainStore();
</script>
