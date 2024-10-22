<template>
  <div ref="el" class="scene absolute inset-0 bg-black grid place-items-center">
    <!-- vs container -->
    <div v-if="scenes[currentScene] === 'vs'" class="vs-container w-full grid gap-8 place-items-center">
      <div class="first-player exo-black text-[10vw]" :style="`color: ${getPlayerColor(leaderboardSorted[0])}`">
        <span>{{ leaderboardSorted[0].name }}</span>
      </div>
      <div class="vs">
        <img class="w-[40vw] contain" :src="getAsset('vs')" />
      </div>
      <div class="second-player exo-black text-[10vw]" :style="`color: ${getPlayerColor(leaderboardSorted[1])}`">
        <span>{{ leaderboardSorted[1].name }}</span>
      </div>
    </div>

    <!-- leaderboard -->
    <BackgroundPill v-if="scenes[currentScene] === 'leaderboard'" class="py-8 mt-12 overflow-y-hidden flex-1 z-10 w-full">
      <div class="pill-header flex items-center justify-between">
        <span class="bg-pill-title">{{ locale?.["battle_results_title"] || "Battle results:" }}</span>
      </div>

      <div class="scrollable-cnt flex-1 overflow-y-auto mt-2">
        <div class="leaderboard flex flex-col gap-1 pt-4">
          <Pill v-for="player in leaderboardSorted" :key="player.id" class="py-2 flex items-center justify-between gap-4" color="light">
            <div class="player-meta leading-3 flex gap-4 items-center">
              <div class="rounded-full bg-[var(--grey-dark)] w-[30px] h-[30px] grid place-items-center">
                <span class="league exo-black text-lg mb-[1px]" :style="`color: ${getPlayerColor(player)}`">{{ player.position }}</span>
              </div>
              <span class="fira-bold text-lg max-w-1/2 text-ellipsis">{{ player.name }}</span>
            </div>
            <span class="bolts exo-black text-[var(--accent-color)]">{{ player?.score || 0 }}</span>
          </Pill>
        </div>
      </div>
    </BackgroundPill>
  </div>
  <div v-if="!gifUrl" class="loader absolute inset-0 bg-[#222] grid place-items-center z-[999]">Creating GIF</div>
  <div v-if="gifUrl" class="link-cnt absolute inset-0 bg-[#222] grid place-items-center z-[999]">
    <Button class="z-10">
      <a class="" :href="gifUrl" download="screenshot.gif">Скачать GIF</a>
    </Button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted, onMounted } from "vue";
import { getAsset } from "@/utils";
import { storeToRefs } from "pinia";
import { useRoute } from "vue-router";
import html2canvas from "html2canvas";
import GIF from "gif.js";
import { tg } from "@/api/telegram";
import constants from "@/constants";
import { makeRequest } from "@/api/server";

// stores
import { useMainStore } from "@/store/main";

const route = useRoute();
const { apiUrl } = constants;

const store = useMainStore();

const { uploadGif } = store;
const { data } = storeToRefs(store.battleStore);
const { battles: locale } = storeToRefs(store.localeStore);

const colors = {
  0: "F01515",
  1: "519A58",
  2: "FEEB3E",
  3: "A142EC",
  4: "3C4FF9",
  5: "FFFFFF",
  6: "24CAFF",
};

const scenes = ["vs", "leaderboard"];

const gifUrl = ref(null);
const currentScene = ref(0);
const leaderBoard = ref([
  {
    id: 2,
    isPlayer: false,
    name: "Zinov",
    position: 2,
    score: 164,
  },
  {
    id: 1,
    isPlayer: true,
    name: "Eugeny",
    position: 1,
    score: 208,
  },
]);
const el = ref();

const leaderboardSorted = computed(() => {
  if (!leaderBoard.value?.length) return [];

  const clone = [...leaderBoard.value];

  return clone.sort((a, b) => b.score - a.score);
});

const getPlayerColor = (player: {}) => {
  if (player.isPlayer) {
    return "#26df26";
  } else {
    return "#" + colors[+player.id];
  }
};

const generateGIF = async () => {
  let interval = null;

  const gif = new GIF({
    workers: 2,
    quality: 10,
  });

  interval = setInterval(async () => {
    if (currentScene.value < scenes.length) {
      console.log(`capturing scene ${currentScene.value}`);

      const canvas = await html2canvas(el.value);
      gif.addFrame(canvas, { delay: 2000 });

      //   const newIdx = (currentScene.value + 1) % scenes.length;
      currentScene.value += 1;
    } else {
      console.log(`clearing interval, rendering`);

      clearInterval(interval);
      gif.render();
    }
  }, 500);

  gif.on("finished", (blob) => {
    uploadGif(blob);

    gifUrl.value = URL.createObjectURL(blob);
    tg.shareToStory(URL.createObjectURL(blob));
  });
};

onMounted(() => {
  setTimeout(() => {
    generateGIF();
  }, 1000);
});
</script>
