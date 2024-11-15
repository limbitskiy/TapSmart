<template>
  <div id="init" class="h-dvh flex flex-col gap-4 justify-between bg-gradient-to-b from-[#FEAC3E] to-[#E46C02] overflow-hidden relative">
    <!-- bg pattern -->
    <div class="bg-pattern absolute inset-0"></div>

    <!-- main image -->
    <div class="main-image flex-1 flex flex-col gap-4 justify-between p-4">
      <!-- tiger 1 cutout -->
      <img class="w-[45vw]" src="/loader/tiger-cutout1.png" />

      <div class="title-progress mx-auto w-[70vw] flex flex-col gap-4">
        <!-- title -->
        <img src="/loader/title.png" />

        <!-- progress pill -->
        <!-- <Pill class="rounded-lg">
          <div class="progress-bar"></div>

          <div class="present-image">
            <img class="w-[10vw]" src="/loader/present.png" />
          </div>
        </Pill> -->
      </div>

      <!-- tiger 2 cutout -->
      <img class="ml-auto w-[55vw]" src="/loader/tiger-cutout2.png" />
    </div>

    <!-- service info -->
    <div class="service-cnt flex items-center justify-between px-4 py-2">
      <!-- loading text -->
      <div class="loading-text text-black exo-bold">Loading...</div>

      <!-- version number -->
      <div class="build-no text-[12px] text-black fira-bold leading-4">build: {{ version }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { waitFor } from "@/utils";
import { tg, setThemeColor } from "@/api/telegram";
import constants from "@/constants";
import { version } from "@/../package.json";

// composables
import preloadAssets from "@/utils/preloadAssets";

// stores
import { useMainStore } from "@/store/main";

const { botName } = constants;

const store = useMainStore();

const { startApp, initialFetch } = store;
const { addSound, playSound } = store.soundStore;

const loading = ref(true);
const errors = ref([]);

// const onClick = () => {
//   if (!loading.value && !errors.value.length) {
//     startApp();
//   }
// };

tg?.ready();

tg?.disableVerticalSwipes();

tg?.expand();

setThemeColor("#222");

console.log("tg:", tg);

// console.log(`location:`, location);

Promise.allSettled([
  initialFetch({
    botName,
    host: location?.href?.slice(0, -5),
    tg: {
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      rawInitData: tg?.initData,
      initData: tg?.initDataUnsafe,
      version: tg?.version,
      platform: tg?.platform,
    },
  }),
  preloadAssets({ addSound }),
  waitFor(2000),
]).then((data) => {
  const preloadErrors = [data[0], ...data[1].value].filter((p) => p.status === "rejected");

  if (preloadErrors.length) {
    errors.value = preloadErrors.map((err) => err.reason);
    return;
  }

  loading.value = false;

  startApp();
  // playSound("soundtrack");
});
</script>
