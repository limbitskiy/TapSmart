<template>
  <div class="home-page flex-1 flex">
    <RouterView v-slot="{ Component }">
      <template v-if="Component">
        <Transition name="fade" mode="out-in">
          <Suspense suspensible timeout="1000">
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
