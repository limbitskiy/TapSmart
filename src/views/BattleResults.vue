<template>
  <div id="battle-results" class="flex-1 px-[2px]">
    <Profile />
    <BackgroundPill class="py-8 mt-4">
      <div class="pill-header flex items-center justify-between">
        <span class="bg-pill-title">{{ locale?.["battle_results_title"] || "Battle results:" }}</span>
      </div>

      <div class="leaderboard">
        <Pill class="mt-4" color="light">
          <div class="content flex gap-2 items-center justify-between">
            <span class="text-xl fira-bold text-gray-300">{{ locale?.["battle_results_place"] || "Place" }}</span>
            <div class="flex gap-2 items-center">
              <img class="h-4" :src="getAsset('cup')" />
              <span class="text-xl exo-black">2/5</span>
            </div>
          </div>
        </Pill>
      </div>

      <div class="ad flex flex-col items-center justify-center mt-8">
        <Ad image="x2" :text="locale?.['battle_results_ad_text']" />
        <!-- <div class="ad-btns w-full flex gap-4 justify-between mt-8">
          <Button class="flex-1 py-3 px-5 text-white bg-[var(--grey-light)]" @click="onBtnClick">
            <div class="flex flex-col gap-1 items-center">
              <div class="flex gap-1">
                <span class="text-base leading-4">{{ locale?.["battle_results_ad_btn_left"] || "Left ad button" }}</span>
                <img class="h-4" :src="getAsset('bolt')" />
              </div>
              <span class="text-sm fira-regular !leading-3">Without TON</span>
            </div>
          </Button>
          <Button class="flex-1 py-3 px-5" @click="onBtnClick">
            <div class="flex flex-col gap-1 items-center">
              <div class="flex gap-1">
                <span class="text-base leading-4">{{ locale?.["battle_results_ad_btn_right"] || "Right ad button" }}</span>
                <img class="h-4" :src="getAsset('bolt')" />
              </div>
              <span class="text-sm fira-regular !leading-3">With TON</span>
            </div>
          </Button>
        </div> -->
        <div class="ad-btns w-full flex gap-4 justify-between mt-8">
          <!-- <Button v-if="data?.battleResultButtons?.left" class="flex-1 py-3 px-5 text-white bg-[var(--grey-light)]" @click="onBtnClick">
            <div class="flex flex-col gap-1 items-center">
              <div class="flex gap-1 items-baseline">
                <span class="text-base leading-4">{{ getBtnTextArr(data?.["battle_results_buttons"]?.left?.label)[0] }}</span>
                <img class="h-4" :src="getAsset('bolt')" />
              </div>
              <span class="text-sm fira-regular !leading-3">{{ getBtnTextArr(data?.["battle_results_buttons"]?.right?.label)[1] }}</span>
            </div>
          </Button> -->
          <!-- <Button class="flex-1 py-3 px-5" @click="onBtnClick">
          <div class="flex flex-col gap-1 items-center">
            <div class="flex gap-1 items-baseline">
              <span class="text-base leading-4">{{ getBtnTextArr(locale?.["button_claim_with_ton"] || "Claim<bolt>With TON")[0]  }}</span>
              <img class="h-4" :src="getAsset('bolt')" />
            </div>
            <span class="text-sm fira-regular !leading-3">{{ getBtnTextArr(locale?.["button_claim_with_ton"] || "Claim<bolt>With TON")[1]}}</span>
          </div>
        </Button> -->
        </div>
      </div>
    </BackgroundPill>
  </div>
</template>

<script setup lang="ts">
import { getAsset } from "@/utils";
import { storeToRefs } from "pinia";

// stores
import { useMainStore } from "@/store/main";
import { useLocaleStore } from "@/store/locale";
import { useDataStore } from "@/store/data";

// components
import Pill from "@/components/UI/Pill.vue";
import Button from "@/components/UI/Button.vue";
import BackgroundPill from "@/components/UI/BackgroundPill.vue";
import Profile from "@/components/Profile.vue";
import Ad from "@/components/UI/Ad.vue";

const mainStore = useMainStore();
const localeStore = useLocaleStore();
const dataStore = useDataStore();

const { battles: data } = storeToRefs(dataStore);
const { battles: locale } = storeToRefs(localeStore);
const { redirectTo } = mainStore;

console.log(data.value);

const getBtnTextArr = (text: string) => text;

const onBtnClick = () => {
  redirectTo("/home/main");
};
</script>
