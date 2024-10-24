<template>
  <div ref="screenshotEl" class="challenge-main flex-1 overflow-y-auto overflow-x-hidden flex flex-col gap-2 relative p-4">
    <!-- bg pattern & color -->
    <BackgroundImage type="red" />

    <BattleStartAnimation v-if="showStartChallengeAnimation" />

    <!-- battle stats -->
    <div class="challenge-stats z-10 flex flex-col gap-2 min-h-[136px]">
      <Transition name="fade">
        <ChallengeStatus :timer="challengeTimer" :score="challengeScore" :position="playerPosition" />
      </Transition>
      <Transition name="fade">
        <ChallengeProgressBar
          :timer="challengeTimer"
          :progressBarValue="progressBarValue"
          :battleDuration="data?.['battle_duration']"
          :playersProgress="data?.['player_progress']"
        />
      </Transition>
    </div>

    <!-- battle mechanic -->
    <BattleMechanic @mechMounted="onMechMounted" @mechUnmounted="onMechUnmounted" />

    <!-- end challenge animation -->
    <Transition name="fade-800">
      <div v-if="showEndChallengeAnimation" class="animation-cnt absolute inset-0 grid place-items-center z-[30] bg-black">
        <BattleCompleteAnimation />
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { getAsset } from "@/utils";
import { tg, setThemeColor } from "@/api/telegram";
import html2canvas from "html2canvas";

// stores
import { useMainStore } from "@/store/main";

console.log(`challenge created`);

const store = useMainStore();

const { fetchChallengePageData, redirectTo } = store;
const { startChallenge, stopChallenge } = store.battleStore;
const { data, challengeScore, screenshotArray } = storeToRefs(store.battleStore);

// animation flags
const showEndChallengeAnimation = ref(false);
const showStartChallengeAnimation = ref(false);

const screenshotEl = ref();

// challenge interval
const challengeTimer = ref();
let challengeTimerInterval = null;

const playerPosition = computed(() => {
  if (!data.value?.["player_progress"]?.length) return [0, 0];

  const clone = [...data.value["player_progress"]];

  const playersSorted = clone?.sort((a, b) => b.score - a.score);

  return [playersSorted?.findIndex((player) => player.isPlayer) + 1 || data.value?.["player_progress"].length, data.value?.["player_progress"].length];
});

const progressBarValue = computed(() => ((data.value?.["battle_duration"] - challengeTimer.value) * 100) / data.value?.["battle_duration"]);

await fetchChallengePageData();

const onMechMounted = () => {};

const onMechUnmounted = () => {
  // optional
  stopChallenge();
};

const takeScreenshot = () => {
  console.log(`taking screenshot`);
  html2canvas(screenshotEl.value).then((canvas) => {
    const dataURL = canvas.toDataURL("image/png");
    screenshotArray.value.push(dataURL);
  });
};

onMounted(() => {
  console.log(`challenge mounted`);

  // reset previous battle players progress
  data.value["player_progress"] = null;

  showStartChallengeAnimation.value = true;

  setTimeout(() => {
    showStartChallengeAnimation.value = false;
    startChallenge();

    challengeTimer.value = data.value?.battle_duration;
    const screenshotInterval = data.value?.battle_duration / 10;

    challengeTimerInterval = setInterval(() => {
      if ((data.value?.battle_duration - challengeTimer.value) % screenshotInterval === 0 && challengeTimer.value !== 0 && data.value?.battle_duration !== challengeTimer.value) {
        takeScreenshot();
      }

      if (challengeTimer.value === 0) {
        clearInterval(challengeTimerInterval);
        challengeTimerInterval = null;
        challengeTimer.value = undefined;
        showEndChallengeAnimation.value = true;
        stopChallenge();

        setTimeout(() => {
          redirectTo("/battle-complete");
        }, 3000);

        setTimeout(() => {
          showEndChallengeAnimation.value = false;
        }, 4000);
        return;
      }
      challengeTimer.value -= 1000;
    }, 1000);
  }, 4000);
});
</script>
