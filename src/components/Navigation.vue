<template>
  <nav class="fixed bottom-0 w-full z-10">
    <ul class="flex items-center justify-around bg-black text-white py-1">
      <!-- <span>{{ Object.keys(route) }}</span>
      <span>{{ route.path }}</span> -->
      <RouterLink v-for="menuItem in data.items" :to="menuItem.link" class="w-16 h-16 rounded-xl grayscale">
        <div class="nav-item flex flex-col items-center justify-center gap-1 p-2">
          <img :src="'/' + menuItem.icon + '.png'" class="h-6 object-contain" />
          <span class="fira-condensed-bold text-sm">{{ menuItem.title }}</span>
        </div>
      </RouterLink>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from "vue-router";
import { storeToRefs } from "pinia";

// stores
import { useDataStore } from "@/store/data.ts";

const router = useRouter();
const route = useRoute();

const dataStore = useDataStore();

const { menu: data } = storeToRefs(dataStore);
</script>
