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
                    width="10"
                    height="10"
                    viewBox="0 0 10 10"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10 8.04714C10 8.27161 9.92144 8.4624 9.76431 8.61953L8.61953 9.76431C8.4624 9.92144 8.27161 10 8.04714 10C7.82267 10 7.63187 9.92144 7.47475 9.76431L5 7.28956L2.52525 9.76431C2.36813 9.92144 2.17733 10 1.95286 10C1.7284 10 1.5376 9.92144 1.38047 9.76431L0.23569 8.61953C0.0785634 8.4624 0 8.27161 0 8.04714C0 7.82267 0.0785634 7.63187 0.23569 7.47475L2.71044 5L0.23569 2.52525C0.0785634 2.36813 0 2.17733 0 1.95286C0 1.7284 0.0785634 1.5376 0.23569 1.38047L1.38047 0.23569C1.5376 0.0785634 1.7284 0 1.95286 0C2.17733 0 2.36813 0.0785634 2.52525 0.23569L5 2.71044L7.47475 0.23569C7.63187 0.0785634 7.82267 0 8.04714 0C8.27161 0 8.4624 0.0785634 8.61953 0.23569L9.76431 1.38047C9.92144 1.5376 10 1.7284 10 1.95286C10 2.17733 9.92144 2.36813 9.76431 2.52525L7.28956 5L9.76431 7.47475C9.92144 7.63187 10 7.82267 10 8.04714Z"
                      fill="white"
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
