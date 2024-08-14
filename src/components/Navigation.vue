<template>
  <nav class="fixed bottom-0 w-full z-10">
    <ul class="flex items-center justify-around bg-[var(--grey-dark)] text-white py-1">
      <!-- <span>{{ Object.keys(route) }}</span>
      <span>{{ route.path }}</span> -->
      <RouterLink v-for="menuItem in data.store.items" :to="menuItem.link" class="w-16 h-16 rounded-xl grayscale">
        <div class="nav-item flex flex-col items-center justify-center gap-1 p-2">
          <img :src="'/' + menuItem.icon + '.png'" class="h-6 object-contain" />
          <span class="text-sm font-bold">{{ menuItem.title }}</span>
        </div>
      </RouterLink>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { useDataStore } from "@/store/data.ts";
import { storeToRefs } from "pinia";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();

const dataStore = useDataStore();
const { menu: data } = storeToRefs(dataStore);
</script>
