<template>
  <div id="battle-results" class="flex-1 flex flex-col p-4 h-dvh">
    <BackgroundImage type="purple" />
    <Profile />

    <BackgroundPill class="py-8 mt-4 overflow-y-hidden flex-1 z-10">
      <div class="pill-header flex items-center justify-between">
        <span class="bg-pill-title">{{
          locale?.["battle_results_title"] || "Battle results:"
        }}</span>
      </div>

      <div class="scrollable-cnt flex-1 overflow-y-auto mt-2">
        <div class="leaderboard flex flex-col gap-1 pt-4">
          <Pill
            v-for="(player, index) in leaderboardSorted"
            :key="player.id"
            class="py-2 flex items-center justify-between gap-4"
            color="light"
          >
            <div class="player-meta leading-3 flex gap-4 items-center">
              <span class="league exo-black text-xl">{{ index + 1 }}</span>
              <span class="fira-bold text-lg max-w-1/2 text-ellipsis">{{
                player.name
              }}</span>
            </div>
            <span class="bolts exo-black text-[var(--accent-color)]">{{
              player?.score || 0
            }}</span>
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
          class="flex-1 !py-2 px-5 text-white bg-[var(--grey-light)]"
          activeColor="#525252"
          :data="data.battle_results_buttons.left"
        >
          <span class="text-lg inline-block leading-5 mt-1">{{
            data?.["battle_results_buttons"]?.left?.label
          }}</span>
        </Button>
        <Button
          v-if="data?.battle_results_buttons?.right"
          class="flex-1 !py-2 px-5"
          activeColor="#fcdcb0"
          :data="data.battle_results_buttons.right"
        >
          <span class="text-lg inline-block leading-5 mt-1">{{
            data?.["battle_results_buttons"]?.right?.label
          }}</span>
        </Button>
      </div>
    </BackgroundPill>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { getAsset } from "@/utils";
import { storeToRefs } from "pinia";

// stores
import { useLocaleStore } from "@/store/locale";
import { useDataStore } from "@/store/data";
import { useMainStore } from "@/store/main";

const localeStore = useLocaleStore();
const dataStore = useDataStore();
const mainStore = useMainStore();

const { data } = storeToRefs(dataStore.battles);
const { battles: locale } = storeToRefs(localeStore);

const leaderboardSorted = computed(() => {
  if (!data.value.battle_results_leaderboard?.length) return [];

  const clone = [...data.value.battle_results_leaderboard];

  return clone.sort((a, b) => b.score - a.score);
});
</script>
