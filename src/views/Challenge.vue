<template>
  <div class="challenge-main flex-1 overflow-y-auto overflow-x-hidden flex flex-col gap-2 relative">
    <Backlight color="red" />

    <div class="challenge-stats relative z-10 flex flex-col gap-4 mt-2">
      <!-- <button class="absolute z-[9999]" @click="onBonusUsed">get bonus</button> -->
      <ChallengeStatus :time="timer || 0" :score="score" :multiplier="currentCalcPoint" :place="playerPosition" />

      <div class="wrap px-8">
        <ProgressBar :timer="timer || 0" />
      </div>
    </div>

    <RouterView v-slot="{ Component }" type="challenge">
      <!-- <Transition name="fade" mode="out-in"> -->
      <component :is="Component" />
      <!-- </Transition> -->
    </RouterView>

    <!-- onscreen bonuses -->
    <Transition name="challenge-bonus-1">
      <div v-if="bonusState.isShown" class="bonuses-cnt absolute top-[20dvh] left-0 right-0 grid place-items-center">
        <div class="bonus">
          <span class="text-[6vw] exo-black text-[#edaa38]">{{ bonusState.text }}</span>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from "vue";
import { storeToRefs } from "pinia";
import { getAsset } from "@/utils";
import { tg, setThemeColor } from "@/api/telegram";
import { useRoute } from "vue-router";

// stores
import { useDataStore } from "@/store/data";
import { useMainStore } from "@/store/main";
import { useLocaleStore } from "@/store/locale";

const route = useRoute();

const dataStore = useDataStore();
const mainStore = useMainStore();
const localeStore = useLocaleStore();

const { data, challengeScore: score, bonusesUsed, currentCalcPoint, currentBattleMode } = storeToRefs(dataStore.battles);
const { startChallenge, stopChallenge } = dataStore.battles;
const { battles: locale } = storeToRefs(localeStore);
const { backgroundColor } = storeToRefs(mainStore);

const { fetchChallengePageData, callApi, redirectTo } = mainStore;

setThemeColor("#D26542");
backgroundColor.value = "red";

const bonusState = ref({
  text: "",
  isShown: false,
  used: {},
});

await fetchChallengePageData();

// watch bonuses
watch(
  bonusesUsed,
  (newVal, oldVal) => {
    if (Object.keys(newVal).length) {
      Object.keys(newVal).forEach((bonus) => {
        if (!bonusState.value.used[bonus]) {
          onBonusUsed(bonus);
        }
      });
    }
  },
  {
    deep: true,
  }
);

let interval = null;
const timer = ref(0);

const playerPosition = computed(() => {
  if (!data.value?.["player_progress"]?.length) return [0, 0];

  const clone = [...data.value["player_progress"]];

  const playersSorted = clone?.sort((a, b) => b.score - a.score);

  return [playersSorted?.findIndex((player) => player.isPlayer) + 1 || data.value["player_progress"].length, data.value["player_progress"].length];
});

const onStartChallenge = () => {
  timer.value = data.value.battle_duration ? +data.value.battle_duration : 0;
  startChallenge();

  interval = setInterval(() => {
    if (timer.value === 0) {
      clearInterval(interval);
      onEndChallenge();
      return;
    }
    timer.value -= 1000;
  }, 1000);
};

onStartChallenge();

const onEndChallenge = async () => {
  callApi({ api: "battle_breakpoint", data: { final: 1 } });
  redirectTo("/battle-complete-animation");
};

const onBonusUsed = (bonusName: string) => {
  const bonusLocale = locale.value[`${bonusName}_title`];
  console.log(bonusLocale);

  bonusState.value.text = bonusLocale;
  bonusState.value.isShown = true;

  setTimeout(() => {
    bonusState.value.text = "";
    bonusState.value.isShown = false;

    bonusState.value.used[bonusName] = true;
  }, 1000);
};

onMounted(() => {
  startChallenge();
});

onBeforeUnmount(() => {
  stopChallenge();
});
</script>
