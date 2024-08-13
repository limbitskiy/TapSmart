<template>
  <div class="home-page flex-1 flex flex-col">
    <RouterView v-slot="{ Component }">
      <Transition name="fade" mode="out-in">
        <component :is="Component" />
      </Transition>
    </RouterView>
    <Navigation />
  </div>
</template>

<script setup lang="ts">
import Navigation from "@/components/Navigation.vue";
</script>
