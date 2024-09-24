<template>
  <div id="profile" class="flex-1">
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
          <div class="with-substat flex flex-col">
            <Pill class="!py-2 rounded-xl" :tooltip="locale?.['tooltip_bolts']">
              <div class="content flex items-center justify-between">
                <span class="text-lg text-gray-300">{{ locale?.["bolts"] || "Bolts" }}</span>
                <div class="flex gap-2 items-center">
                  <img class="h-4 scale-150" :src="getAsset('bolt')" />
                  <span class="text-xl exo-black">{{ showFormattedNumber(data?.["bolts"]) || 0 }}</span>
                </div>
              </div>
            </Pill>

            <!-- bolts today -->
            <Pill class="!py-0 mx-2 bg-black rounded-xl rounded-t-none" :tooltip="locale?.['tooltip_bolts_today']">
              <div class="content flex items-center justify-between">
                <span class="text-sm text-gray-300">{{ locale?.["bolts_today"] || "Today" }}</span>
                <div class="flex gap-2 items-center">
                  <!-- <img class="h-4 scale-100" :src="getAsset('bolt')" /> -->
                  <span class="text-lg exo-bold">{{ showFormattedNumber(data?.["bolts_today"]) || 0 }}</span>
                </div>
              </div>
            </Pill>
          </div>

          <div class="with-substat flex flex-col">
            <!-- nuts -->
            <Pill class="!py-2 rounded-xl" :tooltip="locale?.['tooltip_nuts']">
              <div class="content flex items-center justify-between">
                <span class="text-lg text-gray-300">{{ locale?.["nuts"] || "Nuts" }}</span>
                <div class="flex gap-2 items-center">
                  <img class="h-4 scale-150" :src="getAsset('nut')" />
                  <span class="text-xl exo-black">{{ showFormattedNumber(data?.["nuts"]) || 0 }}</span>
                </div>
              </div>
            </Pill>

            <!-- nuts today -->
            <Pill class="!py-0 mx-2 bg-black rounded-xl rounded-t-none" :tooltip="locale?.['tooltip_nuts_today']">
              <div class="content flex items-center justify-between">
                <span class="text-sm text-gray-300">{{ locale?.["nuts_today"] || "Nuts earned today" }}</span>
                <div class="flex gap-2 items-center">
                  <!-- <img class="h-4 scale-100" :src="getAsset('nut')" /> -->
                  <span class="text-lg exo-bold">{{ showFormattedNumber(data?.["nuts_today"]) || 0 }}</span>
                </div>
              </div>
            </Pill>
          </div>

          <!-- league progress -->
          <div class="with-substat flex flex-col">
            <Pill class="rounded-xl" :tooltip="locale?.['tooltip_league']">
              <LeagueProgress grey="bg-gray-500" />
            </Pill>
            <!-- bolts left -->
            <Pill class="!py-0 mx-2 bg-black rounded-xl rounded-t-none">
              <div class="content flex items-center justify-between">
                <span class="text-sm text-gray-300">{{ locale?.["bolts_remain"] || "Bolts left" }}</span>
                <div class="flex gap-2 items-center">
                  <!-- <img class="h-4 scale-100" :src="getAsset('bolt')" /> -->
                  <span class="text-lg exo-bold">{{ showFormattedNumber(data?.["bolts_remain"]) ?? 0 }}</span>
                </div>
              </div>
            </Pill>
          </div>

          <!-- battles played -->
          <div class="with-substat flex flex-col">
            <Pill class="!py-2 rounded-xl" :tooltip="locale?.['tooltip_battles_played']">
              <div class="content flex gap-2 items-center justify-between">
                <span class="text-lg text-gray-300">{{ locale?.["battles_played"] || "Battles" }}</span>
                <div class="flex gap-2 items-center">
                  <img class="h-6" :src="getAsset('swords')" />
                  <span class="text-xl exo-black">{{ data?.["battles_played"] || 0 }}</span>
                </div>
              </div>
            </Pill>

            <!-- battles played today -->
            <Pill class="!py-0 mx-2 bg-black rounded-xl rounded-t-none">
              <div class="content flex items-center justify-between">
                <span class="text-sm text-gray-300">{{ locale?.["battles_played_today"] || "Battles played today" }}</span>
                <div class="flex gap-2 items-center">
                  <!-- <img class="h-4 scale-100" :src="getAsset('swords')" /> -->
                  <span class="text-lg exo-bold">{{ showFormattedNumber(data?.["battles_played_today"]) || 0 }}</span>
                </div>
              </div>
            </Pill>
          </div>
        </div>
      </BackgroundPill>

      <BackgroundPill>
        <span class="bg-pill-title">{{ locale?.["learning_title"] || "Learning stats" }}</span>

        <div class="flex flex-col gap-2 mt-4">
          <!-- words trained -->
          <div class="with-substat flex flex-col">
            <Pill class="!py-2 rounded-xl" :tooltip="locale?.['tooltip_questions_trained']">
              <div class="content flex gap-2 items-center justify-between">
                <span class="text-lg text-gray-300">{{ locale?.["questions_trained"] || "Words trained" }}</span>
                <div class="flex gap-2 items-center">
                  <img class="h-6" :src="getAsset('book')" />
                  <span class="text-xl exo-black">{{ data?.["questions_trained"] || 0 }}</span>
                </div>
              </div>
            </Pill>

            <!-- words trained today -->
            <Pill class="!py-0 mx-2 bg-black rounded-xl rounded-t-none">
              <div class="content flex items-center justify-between">
                <span class="text-sm text-gray-300">{{ locale?.["questions_trained_today"] || "Words trained today" }}</span>
                <div class="flex gap-2 items-center">
                  <span class="text-lg exo-bold">{{ showFormattedNumber(data?.["questions_trained_today"]) || 0 }}</span>
                </div>
              </div>
            </Pill>
          </div>

          <!-- words learned -->
          <div class="with-substat flex flex-col">
            <Pill class="!py-2 rounded-xl" :tooltip="locale?.['tooltip_questions_learned']">
              <div class="content flex gap-2 items-center justify-between">
                <span class="text-lg text-gray-300">{{ locale?.["questions_learned"] || "Words learned" }}</span>
                <div class="flex gap-2 items-center">
                  <img class="h-6" :src="getAsset('book')" />
                  <span class="text-xl exo-black">{{ data?.["questions_learned"] || 0 }}</span>
                </div>
              </div>
            </Pill>

            <!-- words learned today -->
            <Pill class="!py-0 mx-2 bg-black rounded-xl rounded-t-none">
              <div class="content flex items-center justify-between">
                <span class="text-sm text-gray-300">{{ locale?.["questions_learned_today"] || "Words learned today" }}</span>
                <div class="flex gap-2 items-center">
                  <span class="text-lg exo-bold">{{ showFormattedNumber(data?.["questions_learned_today"]) || 0 }}</span>
                </div>
              </div>
            </Pill>
          </div>

          <!-- words learned -->
          <div class="with-substat flex flex-col">
            <Pill class="!py-2 rounded-xl" :tooltip="locale?.['tooltip_questions_repetition']">
              <div class="content flex gap-2 items-center justify-between">
                <span class="text-lg text-gray-300">{{ locale?.["questions_repetition"] || "Repetitions" }}</span>
                <div class="flex gap-2 items-center">
                  <img class="h-6" :src="getAsset('book')" />
                  <span class="text-xl exo-black">{{ data?.["questions_repetition"] || 0 }}</span>
                </div>
              </div>
            </Pill>

            <!-- words learned today -->
            <!-- <Pill class="!py-0 mx-2 bg-black rounded-xl rounded-t-none">
              <div class="content flex items-center justify-between">
                <span class="text-sm text-gray-300">{{ locale?.["questions_repetition"] || "Words repeated today" }}</span>
                <div class="flex gap-2 items-center">
                  <span class="text-lg exo-bold">{{ showFormattedNumber(data?.["questions_repetition"]) || 0 }}</span>
                </div>
              </div>
            </Pill> -->
          </div>

          <!-- learning level -->
          <div class="with-substat flex flex-col">
            <Pill class="rounded-xl" :tooltip="locale?.['tooltip_level']">
              <div class="learning-progress flex flex-col gap-1">
                <div class="top flex items-baseline justify-between">
                  <div class="level">
                    <span class="text-lg text-gray-300">{{ locale?.["level"] }}: </span>
                    <span class="text-base exo-black text-gray-300">{{ data?.["level"] }}</span>
                  </div>
                  <span class="text-[10px] exo-bold text-gray-300">{{ data?.["level_progress"] }}%</span>
                </div>
                <div class="bottom">
                  <div class="progressbar h-[4px] w-full rounded-full relative bg-gray-500">
                    <div v-for="item in 7" class="separator h-[6px] w-[1px] bg-[var(--grey-dark)] absolute" :style="`left: ${item * 12.5}%`"></div>
                    <div class="value h-[4px] bg-gradient-to-r from-[#238a1a] to-[#0fc50f] rounded-l-full relative" :style="`width: ${data?.['level_progress']}%`">
                      <div v-for="item in 7" class="separator h-[4px] w-[1px] bg-[var(--grey-dark)] absolute" :style="`left: ${item * 12.5}%`"></div>

                      <div class="marker w-[2px] h-[6px] bg-[var(--accent-color)] absolute right-0 -top-[1px] rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </Pill>

            <!-- left to get next learning level -->
            <Pill class="!py-0 mx-2 bg-black rounded-xl rounded-t-none" :tooltip="locale?.['tooltip_bolts_remain']">
              <div class="content flex items-center justify-between">
                <span class="text-sm text-gray-300">{{ locale?.["questions_remain"] || "Level remain" }}</span>
                <div class="flex gap-2 items-center">
                  <!-- <img class="h-4 scale-100" :src="getAsset('bolt')" /> -->
                  <span class="text-lg exo-bold">{{ showFormattedNumber(data?.["questions_remain"]) ?? 0 }}</span>
                </div>
              </div>
            </Pill>
          </div>
        </div>
      </BackgroundPill>

      <!-- activity -->
      <BackgroundPill class="flex flex-col">
        <span class="bg-pill-title">{{ locale?.["activity_title"] || "Title" }}</span>
        <span class="bg-pill-subtitle">{{ locale?.["activity_subtitle"] || "Subtitle" }}</span>
      </BackgroundPill>

      <LanguageSettings @change="onSettingsChange" />

      <Button @click="onFeedback">{{ locale?.["feedback"] }}</Button>
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
import Button from "@/components/UI/Button.vue";
import BackgroundPill from "@/components/UI/BackgroundPill.vue";
import LanguageSettings from "@/components/LanguageSettings.vue";
import LeagueProgress from "@/components/LeagueProgress.vue";

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

const onFeedback = () => {
  location.href = data.value?.["feedback_url"];
};
</script>
