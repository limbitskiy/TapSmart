<template>
  <div class="results-cnt relative">
    <Transition name="fade">
      <div v-if="generatingStory" class="story-generator-loader absolute inset-0 flex-1 grid h-dvh z-[99] bg-[#222] place-items-center">
        <div class="spinner max-w-[50vw] text-center flex flex-col gap-4">
          <!-- <div class="progressbar-wrap flex flex-col">
            <div class="percent-text text-[12px] text-gray-300">
              <span>{{ percent }}%</span>
            </div>
            <div class="progressbar h-[3px] w-full bg-gray-400 rounded-full">
              <div class="value h-[3px] rounded-full bg-[var(--accent-color)]" :style="{ width: percent + '%' }"></div>
            </div>
          </div> -->
          <div class="debug-messages flex flex-col items-center gap-1">
            <!-- <span class="text-lg z-50">{{ locale?.["tg_story_loader"] ?? "Создаем историю вашего успеха..." }}</span> -->
            <div class="debug-message bg-gray-600 flex flex-col gap-1 border border-gray-400 rounded-xl min-w-[70vw]">
              <span v-for="msg in dMessages" :key="msg" class="z-50" :class="{ 'text-red-600': msg.type === 'error', 'text-green-600': msg.type === 'success' }">{{
                msg.msg
              }}</span>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- <div v-for="item in HTMLSnapshots" ref="htmlEl" class="screenshot-stage flex-1 flex flex-col h-dvh bg-transparent" v-html="item"></div> -->
    <div v-if="generatingStory" ref="htmlEl" class="screenshot-stage flex-1 flex flex-col h-dvh bg-transparent" v-html="html"></div>

    <div id="battle-results" class="flex-1 flex flex-col p-4 h-dvh">
      <BackgroundImage type="purple" />
      <Profile />

      <BackgroundPill class="py-8 mt-4 flex-1 z-10 overflow-hidden">
        <div class="scrollable-cnt flex-1 flex flex-col gap-8 overflow-y-auto">
          <!-- leaderboard -->
          <div ref="leaderboardRef" class="final-screenshot bg-[var(--grey-dark)] w-full">
            <div class="pill-header flex items-center justify-between">
              <span class="bg-pill-title">{{ locale?.["battle_results_title"] || "Battle results:" }}</span>
            </div>

            <div class="flex-1 mt-2">
              <div v-if="generatingStory" class="leaderboard-capped flex flex-col gap-1 pt-4">
                <Pill v-for="player in leaderboardSortedCapped" :key="player.id" class="py-2 flex items-center justify-between gap-4" color="light">
                  <div class="player-meta leading-3 flex gap-4 items-center">
                    <div class="rounded-full bg-[var(--grey-dark)] w-[30px] h-[30px] grid place-items-center">
                      <span class="league exo-black text-lg mb-[1px]" :style="`color: ${getPlayerColor(player)}`">{{ player.position }}</span>
                    </div>
                    <span class="fira-bold text-lg max-w-1/2 text-ellipsis">{{ player.name }}</span>
                  </div>
                  <span class="bolts exo-black text-[var(--accent-color)]">{{ player?.score || 0 }}</span>
                </Pill>
              </div>

              <div v-else class="leaderboard flex flex-col gap-1 pt-4">
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
          </div>

          <!-- ad -->
          <div class="ad flex flex-col flex-1 items-center justify-center">
            <Ad
              :image="data?.['battle_results_ad_image']"
              :title="locale?.['battle_results_ad_title']"
              :text="locale?.['battle_results_ad_text']"
              :tooltip="locale?.['tooltip_battle_results_ad']"
            />
          </div>
        </div>

        <!-- buttons -->
        <div class="ad-btns w-full flex gap-4 justify-between mt-6">
          <Button
            v-if="data?.battle_results_buttons?.left"
            class="flex-1 !py-3 !px-2 text-white bg-[var(--grey-light)] !text-lg !inline-block !leading-5"
            activeColor="#525252"
            :data="data.battle_results_buttons.left"
          >
          </Button>
          <Button
            v-if="data?.battle_results_buttons?.right"
            class="flex-1 !py-3 !px-2 !text-lg !inline-block !leading-5"
            activeColor="#fcdcb0"
            :data="data.battle_results_buttons.right"
          >
          </Button>
        </div>
      </BackgroundPill>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, nextTick } from "vue";
import { tg } from "@/api/telegram";
import { getAsset, waitFor } from "@/utils";
import { storeToRefs } from "pinia";
import { useRoute } from "vue-router";
import * as htmlToImage from "html-to-image";

// stores
import { useMainStore } from "@/store/main";

const route = useRoute();

const store = useMainStore();

const { fetchBattleResultsData, sendScreeshots, takeHTMLSnapshot, useFetch, createFinalImage, postTestStory, makeSingleRequest } = store;
const { HTMLSnapshots } = storeToRefs(store);
const { data } = storeToRefs(store.battleStore);
const { battles: locale } = storeToRefs(store.localeStore);

const generatingStory = ref(true);
const leaderboardRef = ref();

const html = ref();
const htmlEl = ref();

const percent = ref(0);
let interval;

if (!route.query.nofetch) {
  console.log(`fetching results data`);

  await fetchBattleResultsData(route.query);

  console.log(`finished fetching results data`);
}

const colors = {
  0: "F01515",
  1: "519A58",
  2: "FEEB3E",
  3: "A142EC",
  4: "3C4FF9",
  5: "FFFFFF",
  6: "24CAFF",
};

const leaderboardSorted = computed(() => {
  if (!data.value.battle_results_leaderboard?.length) return [];

  const clone = [...data.value.battle_results_leaderboard];

  return clone.sort((a, b) => b.score - a.score);
});

const leaderboardSortedCapped = computed(() => {
  if (!data.value.battle_results_leaderboard?.length) return [];

  const clone = [...data.value.battle_results_leaderboard];

  return clone.sort((a, b) => b.score - a.score).slice(0, 4);
});

const getPlayerColor = (player: {}) => {
  if (player.isPlayer) {
    return "#26df26";
  } else {
    return "#" + colors[+player.id];
  }
};

const createImagesFromSnapshots = async () => {
  const screenshots = [];

  // console.log(`snapshots:`, HTMLSnapshots.value?.length);

  for (const snapshot of HTMLSnapshots.value) {
    // console.log(`qurrent snapshot:`);
    // console.log(snapshot);

    html.value = snapshot;
    await nextTick();
    const url = await htmlToImage.toJpeg(htmlEl.value, { quality: 0.85 });
    screenshots.push(url);
  }

  HTMLSnapshots.value = screenshots;

  // console.log(`converted snapshots:`, JSON.stringify(HTMLSnapshots.value, null, 2));
  return true;
};

const dMessages = ref<{}[]>([]);

onMounted(async () => {
  generatingStory.value = true;

  try {
    const url = await htmlToImage.toJpeg(leaderboardRef.value, { quality: 0.85 });

    await createImagesFromSnapshots();
    HTMLSnapshots.value.push(url);
    await createFinalImage();
    // await fetch("https://jsonplaceholder.typicode.com/todos/1");

    dMessages.value.push({ msg: `ping...` });
    await makeSingleRequest({ key: "ping", data: { images: HTMLSnapshots.value } });
    dMessages.value.push({ msg: `opening story editor...` });
    postTestStory();
    dMessages.value.push({ msg: `after opening story editor...` });
  } catch (error) {
    console.error("Error in story generation sequence:", error);
    dMessages.value.push({ msg: error, type: "error" });
  } finally {
    dMessages.value.push({ msg: `final 5s timer` });
    await waitFor(5000);
    generatingStory.value = false;
    HTMLSnapshots.value = [];
    dMessages.value.push({ msg: "finished" });
  }

  // if (route.query.tg_story) {
  //   generatingStory.value = true;

  //   interval = setInterval(() => {
  //     if (percent.value >= 100) {
  //       percent.value = 100;
  //       clearInterval(interval);
  //       return;
  //     }
  //     percent.value += 1;
  //   }, 100);

  //   try {
  //     console.log(`creating final image`);
  //     dMessages.value.push({ msg: `creating final image...` });

  //     const url = await htmlToImage.toJpeg(leaderboardRef.value, {
  //       quality: 0.85,
  //     });

  //     console.log(`converting HTML to screenshots`);

  //     dMessages.value.push({ msg: `converting HTML to screenshots...` });
  //     await createImagesFromSnapshots();

  //     HTMLSnapshots.value.push(url);

  //     console.log(`starting story generation`);
  //     dMessages.value.push({ msg: `starting story generation...` });

  //     // console.log(HTMLSnapshots.value);

  //     // creating final image
  //     await createFinalImage();

  //     let storyParams = {};

  //     console.log(`starting usefetch`);
  //     dMessages.value.push({ msg: `starting usefetch...` });

  //     // sending screenshot data
  //     // const res = await useFetch({ key: "tg_story", data: { images: HTMLSnapshots.value } });
  //     const res = await makeSingleRequest({ key: "tg_story", data: { images: HTMLSnapshots.value } });
  //     console.log(res);

  //     console.log(`got usefetch response. sharing to story`);
  //     dMessages.value.push({ msg: `recieved url: ${res.data.url}` });

  //     // storyParams.url = res.data.url;

  //     // storyParams.widgetParams = null;

  //     // if (data.value?.["story_link"]) {
  //     //   storyParams.widgetParams = {};
  //     //   storyParams.widgetParams = { url: data.value?.["story_link"], name: data.value?.["story_link_text"] };
  //     // }

  //     // sharing story
  //     dMessages.value.push({ msg: `tg version: ${tg.version}`, type: "success" });
  //   } catch (error) {
  //     console.error(error);
  //     dMessages.value.push({ msg: error, type: "error" });
  //   } finally {
  //     dMessages.value.push({ msg: `sharing to story...` });
  //     postTestStory();

  //     console.log(`cleaning snapshots`);
  //     dMessages.value.push({ msg: `cleaning snapshots...` });
  //     HTMLSnapshots.value = [];

  //     await waitFor(10000);

  //     generatingStory.value = false;
  //   }

  //   // console.log(`sending screenshot data`);
  //   // await sendScreeshots();
  // }
});

onUnmounted(() => {
  // clearInterval(interval);
});
</script>
