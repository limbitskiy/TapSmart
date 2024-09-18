<template>
  <div id="battle-complete" class="flex-1 flex flex-col h-screen">
    <Profile />

    <BackgroundPill class="py-8 mt-4 overflow-y-hidden flex-1">
      <div class="pill-header flex items-center justify-between">
        <span class="bg-pill-title">{{ locale?.["battle_complete_title"] || "Battle complete!" }}</span>
      </div>

      <div class="scrollable-cnt flex-1 overflow-y-auto mt-2">
        <div class="battle-stats flex flex-col gap-1 pt-4">
        <Pill class="py-2" color="light">
          <div class="content flex gap-2 items-center justify-between">
            <span class="text-xl fira-bold text-gray-300">{{ locale?.["battle_complete_place"] || "Place" }}</span>
            <div class="flex gap-2 items-center">
              <img class="h-4 scale-150" :src="getAsset('cup')" />
              <span class="text-xl exo-black">{{calculatePlayerPlace}}</span>
            </div>
          </div>
        </Pill>

        <!-- bolts -->
        <Pill class="py-2" color="light">
          <div class="content flex gap-2 items-center justify-between">
            <span class="text-xl fira-bold text-gray-300">{{ locale?.["battle_complete_bolts"] || "Bolts" }}</span>
            <div class="flex gap-2 items-center">
              <img class="h-4 scale-150" :src="getAsset('bolt')" />
              <span class="text-xl exo-black">{{ data['battle_complete_bolts'] || 0 }}</span>
            </div>
          </div>
        </Pill>

        <!-- nuts -->
        <Pill class="py-2" color="light">
          <div class="content flex gap-2 items-center justify-between">
            <span class="text-xl fira-bold text-gray-300">{{ locale?.["battle_complete_nuts"] || "Nuts" }}</span>
            <div class="flex gap-2 items-center">
              <img class="h-4 scale-150" :src="getAsset('nut')" />
              <span class="text-xl exo-black">{{ data['battle_complete_nuts'] || 0 }}</span>
            </div>
          </div>
        </Pill>
      </div>

      <!-- ad -->
      <div class="ad flex flex-col items-center justify-center mt-8">
        <Ad image="x2" :text="locale?.['battle_complete_ad_text']" :tooltip="locale?.['tooltip_battle_complete_ad']" />
      </div>
      </div>

      <div class="ad-btns w-full flex gap-4 mt-8">
          <Button class="flex-1 py-3 !px-0 text-white bg-[var(--grey-light)]" :data="data?.['button_claim']">
            <div class="flex flex-col gap-1 items-center">
              <div class="flex gap-1 items-baseline">
                <span class="text-base leading-4">{{ getBtnTextArr(locale?.["button_claim"] || "Claim<bolt>Without TON")[0]  }}</span>
                <img class="h-4" :src="getAsset('bolt')" />
              </div>
              <span class="text-sm fira-regular !leading-3">{{ getBtnTextArr(locale?.["button_claim"] || "Claim<bolt>Without TON")[1]}}</span>
            </div>
          </Button>
          <Button class="flex-1 py-3 !px-0" :data="data?.['button_claim_with_ton']">
            <div class="flex flex-col gap-1 items-center">
              <div class="flex gap-1 items-baseline">
                <span class="text-base leading-4">{{ getBtnTextArr(locale?.["button_claim_with_ton"] || "Claim<bolt>With TON")[0]  }}</span>
                <img class="h-4" :src="getAsset('bolt-dark')" />
              </div>
              <span class="text-sm fira-regular !leading-3">{{ getBtnTextArr(locale?.["button_claim_with_ton"] || "Claim<bolt>With TON")[1]}}</span>
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

// stores
import { useDataStore } from "@/store/data";
import { useLocaleStore } from "@/store/locale";

// components
import Profile from "@/components/Profile.vue";
import Pill from "@/components/UI/Pill.vue";
import Button from "@/components/UI/Button.vue";
import Ad from "@/components/UI/Ad.vue";
import BackgroundPill from "@/components/UI/BackgroundPill.vue";

const localeStore = useLocaleStore();
const dataStore = useDataStore();

const { data } = storeToRefs(dataStore.battles);
const { battles: locale } = storeToRefs(localeStore);

const getBtnTextArr = (text: string) => text.split("<separate>");

const calculatePlayerPlace = computed(() => {
  if (!data.value.battle_results_leaderboard) return '0/0'

  const leaderboard = [...data.value.battle_results_leaderboard]

  const sorted = leaderboard.sort((a, b) => b.score - a.score)

  const playerIdx = sorted.findIndex(player => player.isPlayer)

  return `${playerIdx + 1}/${leaderboard.length}`
})

</script>
