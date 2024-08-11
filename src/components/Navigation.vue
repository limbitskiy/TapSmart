<template>
  <nav class="fixed bottom-0 w-full p-4 z-10">
    <ul class="flex items-center justify-around bg-black text-white rounded-2xl py-2">
      <!-- <span>{{ Object.keys(route) }}</span>
      <span>{{ route.path }}</span> -->
      <RouterLink v-for="menuItem in data" :to="menuItem.link" class="w-16 h-16 rounded-xl grayscale">
        <div class="nav-item flex flex-col items-center justify-center gap-1 p-2">
          <img :src="'/' + menuItem.icon + '.png'" class="h-6 object-contain" />
          <span class="text-sm font-bold">{{ menuItem.title }}</span>
        </div>
      </RouterLink>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { useUserStore } from "@/store/user.ts";
import { storeToRefs } from "pinia";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();

const userStore = useUserStore();
const { menu: data } = storeToRefs(userStore);
</script>
