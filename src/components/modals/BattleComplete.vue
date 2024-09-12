<template>
  <div id="battle-complete" class="flex-1 px-[2px]">
    <div class="pill-header flex items-center justify-between">
      <span class="bg-pill-title">{{ locale?.["battle_complete_title"] || "Battle complete!" }}</span>
    </div>

    <div class="battle-stats">
      <Pill class="mt-4" color="light">
        <div class="content flex gap-2 items-center justify-between">
          <span class="text-xl fira-bold text-gray-300">{{ locale?.["battle_complete_place"] || "Place" }}</span>
          <div class="flex gap-2 items-center">
            <img class="h-4" :src="getAsset('cup')" />
            <span class="text-xl exo-black">2/5</span>
          </div>
        </div>
      </Pill>

      <Pill class="mt-4" color="light">
        <div class="content flex gap-2 items-center justify-between">
          <span class="text-xl fira-bold text-gray-300">{{ locale?.["battle_complete_bolts"] || "Bolts" }}</span>
          <div class="flex gap-2 items-center">
            <img class="h-4" :src="getAsset('bolt')" />
            <span class="text-xl exo-black">3500</span>
          </div>
        </div>
      </Pill>

      <Pill class="mt-4" color="light">
        <div class="content flex gap-2 items-center justify-between">
          <span class="text-xl fira-bold text-gray-300">{{ locale?.["battle_complete_nuts"] || "Nuts" }}</span>
          <div class="flex gap-2 items-center">
            <img class="h-4" :src="getAsset('nut')" />
            <span class="text-xl exo-black">300</span>
          </div>
        </div>
      </Pill>
    </div>

    <div class="ad flex flex-col items-center justify-center mt-8">
      <Ad image="x2" :text="locale?.['battle_complete_ad_text']" />
      <div class="ad-btns w-full flex gap-4 justify-between mt-8">
        <Button class="flex-1 py-3 px-5 text-white bg-[var(--grey-light)]" @click="onBtnClick">
          <div class="flex flex-col gap-1 items-center">
            <div class="flex gap-1 items-baseline">
              <span class="text-base leading-4">{{ getBtnTextArr(locale?.["button_claim"] || "Claim<bolt>Without TON")[0]  }}</span>
              <img class="h-4" :src="getAsset('bolt')" />
            </div>
            <span class="text-sm fira-regular !leading-3">{{ getBtnTextArr(locale?.["button_claim"] || "Claim<bolt>Without TON")[1]}}</span>
          </div>
        </Button>
        <Button class="flex-1 py-3 px-5" @click="onBtnClick">
          <div class="flex flex-col gap-1 items-center">
            <div class="flex gap-1 items-baseline">
              <span class="text-base leading-4">{{ getBtnTextArr(locale?.["button_claim_with_ton"] || "Claim<bolt>With TON")[0]  }}</span>
              <img class="h-4" :src="getAsset('bolt')" />
            </div>
            <span class="text-sm fira-regular !leading-3">{{ getBtnTextArr(locale?.["button_claim_with_ton"] || "Claim<bolt>With TON")[1]}}</span>
          </div>
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getAsset } from "@/utils";
import { storeToRefs } from "pinia";

// stores
import { useMainStore } from "@/store/main";
import { useLocaleStore } from "@/store/locale";

// components
import Pill from "@/components/UI/Pill.vue";
import Button from "@/components/UI/Button.vue";
import Ad from "@/components/UI/Ad.vue";

const mainStore = useMainStore();
const localeStore = useLocaleStore();

const { battles: locale } = storeToRefs(localeStore);
const { redirectTo } = mainStore;

const getBtnTextArr = (text: string) => text.split("<bolt>");

const onBtnClick = () => {
  redirectTo("/battle-results");
};
</script>

<!-- >locales:

battle_complete_title
battle_complete_place
battle_complete_bolts
battle_complete_nuts
battle_complete_ad_text_1
button_claim
button_claim_with_ton
battle_results_ad_text
battle_results_ad_btn_left
battle_results_ad_btn_right

---

battle_results_title

>data:
battle_complete_bolts
battle_complete_nuts

---

battle_results_ad_image
battle_results_leaderboard
battle_results_buttons -->
