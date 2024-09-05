<template>
  <div class="home-page flex-1 flex">
    <RouterView v-slot="{ Component }">
      <Suspense>
        <Transition name="fade" mode="out-in">
          <div class="home-page-content flex-1 flex flex-col relative">
            <component :is="Component" />
          </div>
        </Transition>
      </Suspense>
    </RouterView>
    <Navigation />
  </div>
</template>

<script setup lang="ts">
// components
import Navigation from "@/components/Navigation.vue";
</script>
