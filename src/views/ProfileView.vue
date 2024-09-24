<template>
  <div id="profile">
    <div class="header p-5">
      <div class="page-title mb-2">{{ locale?.["title"] || "Title" }}</div>
      <div class="page-subtitle" v-html="locale?.['subtitle']"></div>
    </div>

    <div class="flex-1 flex flex-col gap-12">
      <!-- stats -->
      <BackgroundPill>
        <span class="bg-pill-title">{{ locale?.["stats_title"] || "Pill title" }}</span>

        <div class="flex flex-col gap-2 mt-4">
          <!-- bolts -->
          <Pill color="light" :tooltip="locale?.['tooltip_bolts']">
            <div class="content flex items-center justify-between">
              <span class="text-lg text-gray-300">{{ locale?.["bolts"] || "Bolts" }}</span>
              <div class="flex gap-2 items-center">
                <img class="h-4 scale-150" :src="getAsset('bolt')" />
                <span class="text-xl exo-black">{{ showFormattedNumber(data?.["bolts"]) || 0 }}</span>
              </div>
            </div>
          </Pill>

          <!-- nuts -->
          <Pill color="light" :tooltip="locale?.['tooltip_nuts']">
            <div class="content flex items-center justify-between">
              <span class="text-lg text-gray-300">{{ locale?.["nuts"] || "Nuts" }}</span>
              <div class="flex gap-2 items-center">
                <img class="h-4 scale-150" :src="getAsset('nut')" />
                <span class="text-xl exo-black">{{ showFormattedNumber(data?.["nuts"]) || 0 }}</span>
              </div>
            </div>
          </Pill>

          <!-- level -->
          <Pill color="light" :tooltip="locale?.['tooltip_level']">
            <div class="content flex gap-2 flex-col">
              <div class="level flex gap-2 items-center justify-between">
                <span class="text-lg text-gray-300">{{ locale?.["level"] || "Level" }}</span>
                <div class="flex gap-2 items-center">
                  <img class="h-5" src="/level-arrow.png" />
                  <span class="text-xl exo-black">{{ data?.["level"] || 0 }}</span>
                </div>
              </div>
              <div class="progressbar-cnt">
                <div class="progress h-2 bg-gray-500 rounded-full">
                  <div :class="`value rounded-full h-2 bg-green-500`" :style="{ width: Math.max(data.progress, 1) + '%' }"></div>
                </div>
              </div>
            </div>
          </Pill>

          <!-- battles -->
          <Pill color="light" :tooltip="locale?.['tooltip_battles_played']">
            <div class="content flex gap-2 items-center justify-between">
              <span class="text-lg text-gray-300">{{ locale?.["battles_played"] || "Battles" }}</span>
              <div class="flex gap-2 items-center">
                <img class="h-6" src="/swords.png" />
                <span class="text-xl exo-black">{{ data?.["battles"] || 0 }}</span>
              </div>
            </div>
          </Pill>

          <!-- words learned -->
          <Pill color="light" :tooltip="locale?.['tooltip_words_learned']">
            <div class="content flex gap-2 items-center justify-between">
              <span class="text-lg text-gray-300">{{ locale?.["words_learned"] || "Words learned" }}</span>
              <div class="flex gap-2 items-center">
                <img class="h-6" src="/book.png" />
                <span class="text-xl exo-black">{{ data?.["learned"] || 0 }}</span>
              </div>
            </div>
          </Pill>
        </div>
      </BackgroundPill>

      <!-- activity -->
      <BackgroundPill class="flex flex-col">
        <span class="bg-pill-title">{{ locale?.["activity_title"] || "Title" }}</span>
        <span class="bg-pill-subtitle">{{ locale?.["activity_subtitle"] || "Subtitle" }}</span>
      </BackgroundPill>

      <LanguageSettings @change="onSettingsChange" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { tg } from "@/api/telegram";
import { storeToRefs } from "pinia";
import { getAsset, showFormattedNumber } from "@/utils";

// store
import { useMainStore } from "@/store/main";
import { useDataStore } from "@/store/data";
import { useLocaleStore } from "@/store/locale";

// components
import Pill from "@/components/UI/Pill.vue";
import BackgroundPill from "@/components/UI/BackgroundPill.vue";
import LanguageSettings from "@/components/LanguageSettings.vue";

const mainStore = useMainStore();
const dataStore = useDataStore();
const localeStore = useLocaleStore();

const { profile: data } = storeToRefs(dataStore);
const { profile: locale } = storeToRefs(localeStore);

const { fetchProfilePageData, setLanguages } = mainStore;

await fetchProfilePageData();

const router = useRouter();

tg.BackButton.show();
tg.BackButton.onClick(() => {
  tg.BackButton.hide();
  router.back();
});

const onSettingsChange = ({ setting, value }) => {
  setLanguages({ [setting]: value });
};
</script>
