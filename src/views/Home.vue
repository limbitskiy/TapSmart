<template>
  <div class="home-page flex-1 flex mb-[70px]">
    <RouterView v-slot="{ Component }">
      <template v-if="Component">
        <Transition name="fade" mode="out-in">
          <!-- makes relax render twice -->
          <!-- <Suspense suspensible timeout="1000"> -->
          <Suspense timeout="1000">
            <component :is="Component" />
            <template #fallback>
              <Loader />
            </template>
          </Suspense>
        </Transition>
      </template>
    </RouterView>
    <Navigation />
  </div>
</template>

<script setup lang="ts"></script>
