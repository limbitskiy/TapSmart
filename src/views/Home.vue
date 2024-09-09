<template>
  <div class="home-page flex-1 flex">
    <RouterView v-slot="{ Component }">
      <template v-if="Component">
        <Transition name="fade" mode="out-in">
          <Suspense suspensible timeout="1000">
            <!-- <div class="home-page-content flex-1 flex flex-col relative"> -->
            <component :is="Component" />
            <template #fallback>
              <Loader />
            </template>
            <!-- </div> -->
          </Suspense>
        </Transition>
      </template>
    </RouterView>
    <Navigation />
  </div>
</template>

<script setup lang="ts">
// components
import Navigation from "@/components/Navigation.vue";
import Loader from "@/components/UI/Loader.vue";
</script>
