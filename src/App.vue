<template>
  <div class="main-page flex w-full h-[100dvh] relative">
    <RouterView v-slot="{ Component, route }">
      <Transition :name="route.meta.T || 'fade'" mode="out-in">
        <component :is="Component" />
      </Transition>
    </RouterView>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from "@/store/user.ts";
import { storeToRefs } from "pinia";
import { onMounted } from "vue";
import { RouterView } from "vue-router";

const userStore = useUserStore();

onMounted(() => {
  const tg = window.Telegram?.WebApp;

  tg?.ready();
});
</script>
