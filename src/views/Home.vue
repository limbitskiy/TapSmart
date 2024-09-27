<template>
  <div class="home-page flex-1 flex">
    <RouterView v-slot="{ Component }">
      <template v-if="Component">
        <Transition name="fade" mode="out-in">
          <Suspense suspensible timeout="1000">
            <!-- <div class="home-page-content flex-1 flex flex-col relative"> -->
            <component :is="Component" :key="getPageKey('homeChild')" />
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
// stores
import { useMainStore } from "@/store/main";

const mainStore = useMainStore();

const { getPageKey } = mainStore;
</script>
