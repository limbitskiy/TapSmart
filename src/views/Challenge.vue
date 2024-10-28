<template>
  <div class="challenge-cnt flex-1 flex">
    <div v-if="screenshotSrc" class="screenshot absolute top-0 w-[150px] z-[2222] border">
      <img :src="screenshotSrc" />
    </div>

    <div class="challenge-main flex-1 overflow-y-auto overflow-x-hidden flex flex-col gap-2 relative">
      <!-- bg pattern & color -->
      <BackgroundImage type="red" />

      <BattleStartAnimation v-if="showStartChallengeAnimation" />

      <div ref="screenshotEl" class="screenshot-content z-10 flex flex-col gap-2 flex-1 p-4">
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

      <!-- end challenge animation -->
      <Transition name="fade-800">
        <div v-if="showEndChallengeAnimation" ref="battleCompleteAnimationRef" class="animation-cnt absolute inset-0 grid place-items-center z-[30] bg-black">
          <BattleCompleteAnimation />
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from "vue";
import { storeToRefs } from "pinia";
import { getAsset, takeScreenshot } from "@/utils";
import { tg, setThemeColor } from "@/api/telegram";

// stores
import { useMainStore } from "@/store/main";

console.log(`challenge created`);

const store = useMainStore();

const { fetchChallengePageData, redirectTo, takeHTMLSnapshot } = store;
const { startChallenge, stopChallenge } = store.battleStore;
const { data, challengeScore } = storeToRefs(store.battleStore);

// animation flags
const showEndChallengeAnimation = ref(false);
const showStartChallengeAnimation = ref(false);

const screenshotEl = ref();
const battleCompleteAnimationRef = ref();
const screenshotSrc = ref();

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
        showEndChallengeAnimation.value = true;
        stopChallenge();

        setTimeout(() => {
          redirectTo("/battle-complete");
        }, 3000);

        setTimeout(async () => {
          showEndChallengeAnimation.value = false;
        }, 4000);
        return;
      }
      challengeTimer.value -= 1000;
    }, 1000);
  }, 4000);
});

onUnmounted(() => {});
</script>
