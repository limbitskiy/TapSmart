<template>
  <nav
    id="navigation"
    class="fixed bottom-0 left-0 right-0 w-full z-10 flex flex-col"
    style="background: linear-gradient(92.34deg, #1d1d1d 3.3%, #0c0c0c 97.43%)"
    :style="`padding-bottom: ${bottom ?? 0}px`"
  >
    <!-- active indicator -->
    <div ref="stripeRef" class="active-stripe h-[2px] w-full rounded">
      <div
        v-if="isHome"
        class="indicator h-full bg-[var(--accent-color)]"
        style="transition: 0.6s ease; box-shadow: 0px 8px 29px 2px #feac3e"
        :style="`width: ${indicatorWidth}px; transform: translateX(${indicatorWidth * currentRoute}px)`"
      ></div>
    </div>

    <ul class="flex items-center justify-around text-[#939393] h-[70px]">
      <RouterLink v-for="menuItem in data?.items" :to="menuItem.link" class="flex flex-1 items-center justify-center h-full pt-[4px] transition-all">
        <div class="nav-item flex flex-col items-center justify-center gap-1 relative">
          <img :src="getAsset(menuItem.icon)" class="nav-icon h-7 object-contain grayscale" />
          <div
            v-if="getBadge(menuItem.id)?.value"
            class="badge absolute px-[5px] py-1 h-4 rounded-full bg-[var(--accent-color)] text-[10px] text-black top-0 right-0"
            style="line-height: 8px"
          >
            {{ getBadge(menuItem.id)?.value }}
          </div>

          <span class="nav-text text-sm">{{ menuItem.title }}</span>
        </div>
      </RouterLink>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue";
import { storeToRefs } from "pinia";
import { getAsset } from "@/utils";
import { useScreenSafeArea } from "@vueuse/core";
import { useRoute } from "vue-router";

// stores
import { useMainStore } from "@/store/main";

const store = useMainStore();
const route = useRoute();

const { menu: data } = storeToRefs(store.dataStore);
const { bottom } = useScreenSafeArea();

const stripeRef = ref();

const elementWidth = ref(0);

const indicatorWidth = computed(() => elementWidth.value / data.value?.items?.length ?? 0);
const currentRoute = computed(() => data.value?.items?.findIndex((item) => item.link === route.path));
const isHome = computed(() => route.path.includes("home"));

const getBadge = (menuItemId: number) => {
  return data.value?.badges?.find((badge) => badge.id == menuItemId);
};

const setActiveSelectorWidth = () => {
  elementWidth.value = stripeRef.value?.getBoundingClientRect()?.width;
};

onMounted(() => {
  setActiveSelectorWidth();

  addEventListener("resize", setActiveSelectorWidth);
});

onUnmounted(() => {
  removeEventListener("resize", setActiveSelectorWidth);
});
</script>
