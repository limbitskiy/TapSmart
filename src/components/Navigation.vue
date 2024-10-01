<template>
  <nav class="fixed bottom-0 left-0 right-0 w-full z-10">
    <ul
      class="flex items-center justify-around bg-black text-white py-1"
      :style="`padding-bottom: ${bottom ?? 0}px`"
    >
      <RouterLink
        v-for="menuItem in data?.items"
        :to="menuItem.link"
        class="w-16 h-16 rounded-xl"
      >
        <div
          class="nav-item flex flex-col items-center justify-center gap-1 p-1 relative"
        >
          <div
            v-if="getBadge(menuItem.id)?.value"
            class="badge absolute px-[5px] py-1 h-4 rounded-full bg-[var(--accent-color)] text-[10px] text-black exo-black top-1 right-1"
            style="line-height: 8px"
          >
            {{ getBadge(menuItem.id)?.value }}
          </div>
          <img :src="'/' + menuItem.icon + '.png'" class="h-8 object-contain" />
          <span class="fira-condensed-bold text-sm">{{ menuItem.title }}</span>
        </div>
      </RouterLink>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useScreenSafeArea } from "@vueuse/core";

// stores
import { useDataStore } from "@/store/data";

const dataStore = useDataStore();

const { bottom } = useScreenSafeArea();
const { menu: data } = storeToRefs(dataStore);

const getBadge = (menuItemId: number) => {
  return data.value?.badges?.find((badge) => badge.id == menuItemId);
};
</script>
