<template>
  <div id="battle-complete" class="flex-1 flex flex-col h-dvh">
    <Profile />

    <BackgroundPill class="py-8 mt-4 overflow-y-hidden flex-1">
      <div class="pill-header flex items-center justify-between">
        <span class="bg-pill-title">{{
          locale?.["battle_complete_title"] || "Battle complete!"
        }}</span>
      </div>

      <div class="scrollable-cnt flex-1 overflow-y-auto mt-2">
        <div class="battle-rewards flex flex-col gap-1 pt-4">
          <Pill class="!py-2">
            <div
              class="content flex flex-col gap-0 items-center justify-between"
            >
              <div class="place-icon flex gap-2 items-center">
                <span class="fira-bold text-2xl">{{
                  data?.["completed_place"] || "Place:"
                }}</span>
                <img
                  v-if="playerPlace[0] === 1"
                  class="h-12"
                  :src="getAsset('1st_place')"
                />
                <img
                  v-if="playerPlace[0] === 2"
                  class="h-12"
                  :src="getAsset('3rd_place')"
                />
                <img
                  v-if="playerPlace[0] === 3"
                  class="h-12"
                  :src="getAsset('3rd_place')"
                />
              </div>

              <div class="place-text"></div>

              <div class="rewards flex gap-4">
                <div class="bolts flex gap-1 items-baseline">
                  <!-- <img class="h-4 scale-150" :src="getAsset('mult')" /> -->
                  <svg
                    width="11"
                    height="11"
                    viewBox="0 0 11 11"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M11 8.85185C11 9.09877 10.9136 9.30864 10.7407 9.48148L9.48148 10.7407C9.30864 10.9136 9.09877 11 8.85185 11C8.60494 11 8.39506 10.9136 8.22222 10.7407L5.5 8.01852L2.77778 10.7407C2.60494 10.9136 2.39506 11 2.14815 11C1.90123 11 1.69136 10.9136 1.51852 10.7407L0.259259 9.48148C0.0864198 9.30864 0 9.09877 0 8.85185C0 8.60494 0.0864198 8.39506 0.259259 8.22222L2.98148 5.5L0.259259 2.77778C0.0864198 2.60494 0 2.39506 0 2.14815C0 1.90123 0.0864198 1.69136 0.259259 1.51852L1.51852 0.259259C1.69136 0.0864198 1.90123 0 2.14815 0C2.39506 0 2.60494 0.0864198 2.77778 0.259259L5.5 2.98148L8.22222 0.259259C8.39506 0.0864198 8.60494 0 8.85185 0C9.09877 0 9.30864 0.0864198 9.48148 0.259259L10.7407 1.51852C10.9136 1.69136 11 1.90123 11 2.14815C11 2.39506 10.9136 2.60494 10.7407 2.77778L8.01852 5.5L10.7407 8.22222C10.9136 8.39506 11 8.60494 11 8.85185Z"
                      fill="#23DE35"
                    />
                  </svg>

                  <span class="text-xl exo-black">{{
                    data["battle_complete_multiplicator"] || 0
                  }}</span>
                </div>

                <div class="bolts flex gap-2 items-center">
                  <img class="h-4 scale-150" :src="getAsset('bolt')" />
                  <span class="text-xl exo-black">{{
                    data["battle_complete_bolts"] || 0
                  }}</span>
                </div>

                <div class="nuts flex gap-2 items-center">
                  <img class="h-4 scale-150" :src="getAsset('nut')" />
                  <span class="text-xl exo-black">{{
                    data["battle_complete_nuts"] || 0
                  }}</span>
                </div>
              </div>
            </div>
          </Pill>
        </div>

        <!-- ad -->
        <div class="ad flex items-center justify-center mt-8">
          <Ad
            image="x2"
            :text="locale?.['battle_complete_ad_text']"
            :tooltip="locale?.['tooltip_battle_complete_ad']"
          />
        </div>
      </div>

      <div class="ad-btns w-full flex gap-4 mt-8">
        <Button
          class="flex-1 py-3 !px-0 text-white bg-[var(--grey-light)]"
          activeColor="#525252"
          :data="data?.['button_claim']"
        >
          <div class="flex flex-col gap-1 items-center">
            <div class="flex gap-1 items-baseline">
              <span class="text-base leading-4">{{
                getBtnTextArr(locale?.["button_claim"])[0]
              }}</span>
              <img class="h-4" :src="getAsset('bolt')" />
            </div>
            <span class="text-sm fira-regular !leading-3">{{
              getBtnTextArr(locale?.["button_claim"])[1]
            }}</span>
          </div>
        </Button>
        <Button
          class="flex-1 py-3 !px-0"
          activeColor="#fcdcb0"
          :data="data?.['button_claim_with_ton']"
        >
          <div class="flex flex-col gap-1 items-center">
            <div class="flex gap-1 items-baseline">
              <span class="text-base leading-4">{{
                getBtnTextArr(locale?.["button_claim_with_ton"])[0]
              }}</span>
              <img class="h-4" :src="getAsset('bolt-dark')" />
            </div>
            <span class="text-sm fira-regular !leading-3">{{
              getBtnTextArr(locale?.["button_claim_with_ton"])[1]
            }}</span>
          </div>
        </Button>
      </div>
    </BackgroundPill>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { getAsset } from "@/utils";
import { storeToRefs } from "pinia";
import { setThemeColor } from "@/api/telegram";

// stores
import { useDataStore } from "@/store/data";
import { useLocaleStore } from "@/store/locale";
import { useMainStore } from "@/store/main";

setThemeColor("#222");

const localeStore = useLocaleStore();
const mainStore = useMainStore();
const dataStore = useDataStore();

const { data } = storeToRefs(dataStore.battles);
const { battles: locale } = storeToRefs(localeStore);
const { fetchBattleCompleteData } = mainStore;

await fetchBattleCompleteData();

const getBtnTextArr = (text: string) => text.split("<separate>");

const playerPlace = computed(() => {
  if (!data.value.battle_results_leaderboard) return 0;

  const leaderboard = [...data.value.battle_results_leaderboard];

  const sorted = leaderboard.sort((a, b) => b.score - a.score);

  const playerIdx = sorted.findIndex((player) => player.isPlayer);

  return [playerIdx + 1, leaderboard.length];
});
</script>
