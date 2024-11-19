<template>
  <div class="challenge-cnt flex-1 flex">
    <div v-if="screenshotSrc" class="screenshot absolute top-0 w-[150px] z-[2222] border">
      <img :src="screenshotSrc" />
    </div>

    <div ref="screenshotEl" class="challenge-main flex-1 overflow-y-auto overflow-x-hidden flex flex-col gap-2 relative z-[20]">
      <!-- bg pattern & color -->
      <BackgroundImage />

      <!-- <BattleStartAnimation v-if="showStartChallengeAnimation" /> -->

      <div class="screenshot-content z-10 flex flex-col gap-2 flex-1 p-4">
        <!-- battle stats -->
        <div class="challenge-stats flex flex-col gap-2 min-h-[136px]">
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
        <BattleMechanic @mechMounted="onMechMounted" @mechUnmounted="onMechUnmounted" @answer="onAnswer" />
      </div>
    </div>

    <!-- end challenge animation -->
    <div class="animation-cnt absolute inset-0 z-[10] flex">
      <BattleCompleteAnimation />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from "vue";
import { storeToRefs } from "pinia";
import { getAsset, takeScreenshot } from "@/utils";
import { tg, setThemeColor } from "@/api/telegram";
import { gsap } from "gsap";

// stores
import { useMainStore } from "@/store/main";

console.log(`challenge created`);

const store = useMainStore();

const { bgColor } = storeToRefs(store);
const { fetchChallengePageData, redirectTo, takeHTMLSnapshot } = store;
const { startChallenge, stopChallenge } = store.battleStore;
const { data, challengeScore } = storeToRefs(store.battleStore);

const screenshotEl = ref();
const screenshotSrc = ref();

const ctx = gsap.context(() => {});

ctx.add("slideScreenUp", () => {
  gsap.to(".challenge-main", {
    yPercent: -100,
    duration: 0.5,
  });
});

// challenge interval
const challengeTimer = ref();
let challengeTimerInterval = null;

const playerPosition = computed(() => {
  if (!data.value?.["player_progress"]?.length) return [0, 0];

  const clone = [...data.value["player_progress"]];

  const playersSorted = clone?.sort((a, b) => b.score - a.score);

  return [playersSorted?.findIndex((player) => player.isPlayer) + 1 || data.value?.["player_progress"].length, data.value?.["player_progress"].length];
});
let needToMakeScreenshot = false;

const progressBarValue = computed(() => ((data.value?.["battle_duration"] - challengeTimer.value) * 100) / data.value?.["battle_duration"]);

bgColor.value = "linear-gradient(180deg, #000B14 17.5%, #A90306 100%)";

await fetchChallengePageData();

const onMechMounted = () => {};

const onMechUnmounted = () => {
  // optional
  stopChallenge();
};

const onAnswer = async () => {
  if (needToMakeScreenshot) {
    setTimeout(() => {
      takeHTMLSnapshot(screenshotEl.value);
    }, 10);
  }
  needToMakeScreenshot = false;
};

const showEndChallengeScreen = () => {
  ctx.slideScreenUp();
};

onMounted(() => {
  console.log(`challenge mounted`);

  // reset previous battle players progress
  data.value["player_progress"] = null;

  startChallenge();

  challengeTimer.value = data.value?.battle_duration;
  const screenshotInterval = data.value?.battle_duration / 5;

  challengeTimerInterval = setInterval(async () => {
    // make screenshot every (duration/screenshotInterval)
    if ((data.value?.battle_duration - challengeTimer.value) % screenshotInterval === 0 && challengeTimer.value !== 0 && data.value?.battle_duration !== challengeTimer.value) {
      needToMakeScreenshot = true;
    }

    if (challengeTimer.value === 0) {
      takeHTMLSnapshot(screenshotEl.value);

      clearInterval(challengeTimerInterval);
      challengeTimerInterval = null;
      challengeTimer.value = undefined;
      showEndChallengeScreen();
      stopChallenge();

      setTimeout(() => {
        redirectTo("/battle-complete");
      }, 3000);

      return;
    }
    challengeTimer.value -= 1000;
  }, 1000);
});

onUnmounted(() => {
  ctx.revert();
});
</script>
