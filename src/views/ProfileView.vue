<template>
  <div id="profile" class="flex flex-col flex-1 gap-4 p-4 relative">
    <div class="header">
      <div class="page-title mb-2">{{ locale?.["title"] || "Title" }}</div>
      <div class="page-subtitle" v-html="locale?.['subtitle']"></div>
    </div>

    <!-- stats -->
    <BackgroundPill>
      <span class="bg-pill-title">{{ locale?.["stats_title"] || "Pill title" }}</span>

      <div class="flex flex-col gap-2 mt-4">
        <!-- bolts restyle -->
        <!-- <Pill class="flex flex-col gap-2" :tooltip="locale?.['tooltip_bolts']">
          <div class="title flex items-center gap-3 pl-2">
            <img class="h-4 scale-150" :src="getAsset('bolt')" />
            <span class="text-lg text-gray-300">{{ locale?.["bolts"] || "Bolts" }}</span>
          </div>

          <Pill class="!py-2 rounded-lg flex items-center justify-between" light>
            <span>Total:</span>
            <span class="fira-semibold">{{ showFormattedNumber(data?.["bolts"]) || 0 }}</span>
          </Pill>

          <Pill class="!py-2 rounded-lg flex items-center justify-between" light>
            <span>{{ locale?.["bolts_today"] || "Today" }}</span>
            <span class="fira-semibold">{{ showFormattedNumber(data?.["bolts_today"]) || 0 }}</span>
          </Pill>
        </Pill> -->

        <!-- bolts -->
        <div class="with-substat flex flex-col">
          <Pill class="!py-2 rounded-xl" :tooltip="locale?.['tooltip_bolts']">
            <div class="content flex items-center justify-between">
              <span class="text-lg text-gray-300">{{ locale?.["bolts"] || "Bolts" }}</span>
              <div class="flex gap-2 items-center">
                <img class="h-4 scale-150" :src="getAsset('bolt')" />
                <span class="text-xl fira-semibold">{{ showFormattedNumber(data?.["bolts"]) || 0 }}</span>
              </div>
            </div>
          </Pill>

          <!-- bolts today -->
          <Pill class="!py-0 mx-2 !bg-[#202020] rounded-lg rounded-t-none" :tooltip="locale?.['tooltip_bolts_today']">
            <div class="content flex items-center justify-between">
              <span class="text-sm text-gray-300">{{ locale?.["bolts_today"] || "Today" }}</span>
              <div class="flex gap-2 items-center">
                <img class="h-4 scale-100" :src="getAsset('bolt')" />
                <span class="fira-semibold text-gray-300">{{ showFormattedNumber(data?.["bolts_today"]) || 0 }}</span>
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
                <span class="text-xl fira-semibold">{{ showFormattedNumber(data?.["nuts"]) || 0 }}</span>
              </div>
            </div>
          </Pill>

          <!-- nuts today -->
          <Pill class="!py-0 mx-2 !bg-[#202020] rounded-lg rounded-t-none" :tooltip="locale?.['tooltip_nuts_today']">
            <div class="content flex items-center justify-between">
              <span class="text-sm text-gray-300">{{ locale?.["nuts_today"] || "Nuts earned today" }}</span>
              <div class="flex gap-2 items-center">
                <!-- <img class="h-4 scale-100" :src="getAsset('nut')" /> -->
                <span class="fira-semibold text-gray-300">{{ showFormattedNumber(data?.["nuts_today"]) || 0 }}</span>
              </div>
            </div>
          </Pill>
        </div>

        <!-- league progress -->
        <div class="with-substat flex flex-col">
          <Pill class="rounded-xl" :tooltip="locale?.['tooltip_league']">
            <LeagueProgress grey="bg-gray-500">
              <template #leagueName>
                <span class="text-lg text-nowrap">{{ data?.["league_name"] }}</span>
              </template>
            </LeagueProgress>
          </Pill>

          <!-- bolts left -->
          <Pill class="!py-0 mx-2 !bg-[#202020] rounded-lg rounded-t-none">
            <div class="content flex items-center justify-between">
              <span class="text-sm text-gray-300">{{ locale?.["bolts_remain"] || "Bolts left" }}</span>
              <div class="flex gap-2 items-center">
                <!-- <img class="h-4 scale-100" :src="getAsset('bolt')" /> -->
                <span class="fira-semibold text-gray-300">{{ showFormattedNumber(data?.["bolts_remain"]) ?? 0 }}</span>
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
                <span class="text-xl fira-semibold">{{ data?.["battles_played"] || 0 }}</span>
              </div>
            </div>
          </Pill>

          <!-- battles played today -->
          <Pill class="!py-0 mx-2 !bg-[#202020] rounded-lg rounded-t-none">
            <div class="content flex items-center justify-between">
              <span class="text-sm text-gray-300">{{ locale?.["battles_played_today"] || "Battles played today" }}</span>
              <div class="flex gap-2 items-center">
                <!-- <img class="h-4 scale-100" :src="getAsset('swords')" /> -->
                <span class="fira-semibold text-gray-300">{{ showFormattedNumber(data?.["battles_played_today"]) || 0 }}</span>
              </div>
            </div>
          </Pill>
        </div>

        <!-- winner token played -->
        <div class="with-substat flex flex-col">
          <Pill class="!py-2 rounded-xl" :tooltip="locale?.['tooltip_winner_token']">
            <div class="content flex gap-2 items-center justify-between">
              <span class="text-lg text-gray-300">{{ locale?.["winner_token"] || "Winner token" }}</span>
              <div class="flex gap-2 items-center">
                <img class="h-6" :src="getAsset('winner_token')" />
                <span class="text-xl fira-semibold">{{ data?.["winner_token"] || 0 }}</span>
              </div>
            </div>
          </Pill>

          <!-- winner token today -->
          <Pill class="!py-0 mx-2 !bg-[#202020] rounded-lg rounded-t-none">
            <div class="content flex items-center justify-between">
              <span class="text-sm text-gray-300">{{ locale?.["winner_token_today"] || "Winner token today" }}</span>
              <div class="flex gap-2 items-center">
                <span class="fira-semibold text-gray-300">{{ showFormattedNumber(data?.["winner_token_today"]) || 0 }}</span>
              </div>
            </div>
          </Pill>
        </div>

        <!-- winner token invested -->
        <div class="with-substat flex flex-col">
          <Pill class="!py-2 rounded-xl" :tooltip="locale?.['tooltip_winner_token_invest']">
            <div class="content flex gap-2 items-center justify-between">
              <span class="text-lg text-gray-300">{{ locale?.["winner_token_invest"] || "Winner token invest" }}</span>
              <div class="flex gap-2 items-center">
                <img class="h-6" :src="getAsset('winner_token')" />
                <span class="text-xl fira-semibold">{{ data?.["winner_token_invest"] || 0 }}</span>
              </div>
            </div>
          </Pill>

          <!-- winner token invested today -->
          <Pill class="!py-0 mx-2 !bg-[#202020] rounded-lg rounded-t-none">
            <div class="content flex items-center justify-between">
              <span class="text-sm text-gray-300">{{ locale?.["winner_token_invest_today"] || "Winner token invest today" }}</span>
              <div class="flex gap-2 items-center">
                <span class="fira-semibold text-gray-300">{{ showFormattedNumber(data?.["winner_token_invest_today"]) || 0 }}</span>
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
                <span class="text-xl fira-semibold">{{ data?.["questions_trained"] || 0 }}</span>
              </div>
            </div>
          </Pill>

          <!-- words trained today -->
          <Pill class="!py-0 mx-2 !bg-[#202020] rounded-lg rounded-t-none">
            <div class="content flex items-center justify-between">
              <span class="text-sm text-gray-300">{{ locale?.["questions_trained_today"] || "Words trained today" }}</span>
              <div class="flex gap-2 items-center">
                <span class="fira-semibold text-gray-300">{{ showFormattedNumber(data?.["questions_trained_today"]) || 0 }}</span>
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
                <span class="text-xl fira-semibold">{{ data?.["questions_learned"] || 0 }}</span>
              </div>
            </div>
          </Pill>

          <!-- words learned today -->
          <Pill class="!py-0 mx-2 !bg-[#202020] rounded-lg rounded-t-none">
            <div class="content flex items-center justify-between">
              <span class="text-sm text-gray-300">{{ locale?.["questions_learned_today"] || "Words learned today" }}</span>
              <div class="flex gap-2 items-center">
                <span class="fira-semibold text-gray-300">{{ showFormattedNumber(data?.["questions_learned_today"]) || 0 }}</span>
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
                <span class="text-xl fira-semibold">{{ data?.["questions_repetition"] || 0 }}</span>
              </div>
            </div>
          </Pill>

          <!-- words learned today -->
          <Pill class="!py-0 mx-2 !bg-[#202020] rounded-xl rounded-t-none">
            <div class="content flex items-center justify-between">
              <span class="text-sm text-gray-300">{{ locale?.["questions_repetition_today"] || "Words repeated today" }}</span>
              <div class="flex gap-2 items-center">
                <span class="text-lg fira-semibold">{{ showFormattedNumber(data?.["questions_repetition_today"]) || 0 }}</span>
              </div>
            </div>
          </Pill>
        </div>

        <!-- learning level -->
        <div class="with-substat flex flex-col">
          <Pill class="rounded-xl" :tooltip="locale?.['tooltip_level']">
            <div class="learning-progress flex flex-col gap-1">
              <div class="top flex items-baseline justify-between">
                <div class="level">
                  <span class="text-lg text-gray-300">{{ locale?.["level"] }}: </span>
                  <span class="text-base fira-semibold text-gray-300">{{ data?.["level"] }}</span>
                </div>
                <span class="text-[10px] fira-semibold text-gray-300">{{ data?.["level_progress"] }}%</span>
              </div>
              <div class="bottom">
                <div class="progressbar h-[7px] w-full rounded-full bg-gray-500 relative">
                  <div class="value h-[7px] bg-gradient-to-r from-[#238a1a] to-[#0fc50f] rounded-l-full" :style="`width: ${data?.['level_progress']}%`">
                    <div v-for="item in 7" class="separator h-[7px] w-[2px] bg-[var(--grey-dark)] absolute" :style="`left: ${item * 12.5}%`"></div>

                    <div :class="`marker w-[4px] h-[11px] bg-[var(--accent-color)] absolute -top-[2px] rounded-full`" :style="`left: ${data?.['level_progress']}%`"></div>
                  </div>
                </div>
              </div>
            </div>
          </Pill>

          <!-- left to get next learning level -->
          <Pill class="!py-0 mx-2 !bg-[#202020] rounded-lg rounded-t-none" :tooltip="locale?.['tooltip_bolts_remain']">
            <div class="content flex items-center justify-between">
              <span class="text-sm text-gray-300">{{ locale?.["questions_remain"] || "Level remain" }}</span>
              <div class="flex gap-2 items-center">
                <!-- <img class="h-4 scale-100" :src="getAsset('bolt')" /> -->
                <span class="fira-semibold text-gray-300">{{ showFormattedNumber(data?.["questions_remain"]) ?? 0 }}</span>
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

    <Button @click="onFeedback">
      <span>{{ locale?.["feedback"] }}</span>
    </Button>

    <div class="build-no absolute bottom-0 right-4 text-[12px] text-gray-300 leading-4">build: {{ version }}</div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { tg, followExternalLink } from "@/api/telegram";
import { storeToRefs } from "pinia";
import { getAsset, showFormattedNumber } from "@/utils";
import { version } from "../../package.json";

// store
import { useMainStore } from "@/store/main";

const store = useMainStore();

const { fetchProfilePageData, setLanguages } = store;
const { profile: data } = storeToRefs(store.dataStore);
const { profile: locale } = storeToRefs(store.localeStore);

const router = useRouter();
const route = useRoute();

// useBackButton();

tg.BackButton.show();

tg.BackButton.onClick(() => {
  tg.BackButton.hide();

  const from = route.query.from;

  if (from === "/battle-complete") {
    router.push("/battle-complete?nofetch=true");
  } else if (from === "/battle-results") {
    router.push("/battle-results?nofetch=true");
  } else {
    router.push(route.query.from);
  }
});

await fetchProfilePageData();

const onSettingsChange = ({ setting, value }) => {
  setLanguages({ [setting]: value });
};

const onFeedback = () => {
  followExternalLink(data.value?.["feedback_url"]);
};
</script>
