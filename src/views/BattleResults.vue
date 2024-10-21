<template>
  <div id="battle-results" class="flex-1 flex flex-col p-4 h-dvh">
    <BackgroundImage type="purple" />
    <Profile />

    <BackgroundPill class="py-8 mt-4 overflow-y-hidden flex-1 z-10">
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

        <div class="ad flex flex-col items-center justify-center mt-8">
          <Ad
            :image="data?.['battle_results_ad_image']"
            :title="locale?.['battle_results_ad_title']"
            :text="locale?.['battle_results_ad_text']"
            :tooltip="locale?.['tooltip_battle_results_ad']"
          />
        </div>
      </div>

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
</template>

<script setup lang="ts">
import { computed, onUnmounted } from "vue";
import { getAsset } from "@/utils";
import { storeToRefs } from "pinia";
import { useRoute } from "vue-router";

// stores
import { useMainStore } from "@/store/main";

const route = useRoute();

const store = useMainStore();

const { fetchBattleResultsData } = store;
const { data } = storeToRefs(store.battleStore);
const { battles: locale } = storeToRefs(store.localeStore);

if (!route.query.nofetch) {
  await fetchBattleResultsData(route.query);
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

const getPlayerColor = (player: {}) => {
  if (player.isPlayer) {
    return "#26df26";
  } else {
    return "#" + colors[+player.id];
  }
};
</script>
