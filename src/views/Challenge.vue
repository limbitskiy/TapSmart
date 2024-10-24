<template>
  <div class="challenge-main flex-1 overflow-y-auto overflow-x-hidden flex flex-col gap-2 relative p-4">
    <!-- bg pattern & color -->
    <BackgroundImage type="red" />

    <BattleStartAnimation v-if="showStartChallengeAnimation" />

    <!-- battle stats -->
    <div class="challenge-stats z-10 flex flex-col gap-2 min-h-[136px]">
      <Transition name="fade">
        <ChallengeStatus :timer="challengeTimer" :score="challengeScore" :position="playerPosition" />
      </Transition>
      <Transition name="fade">
        <ChallengeProgressBar :timer="challengeTimer" />
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

// stores
import { useMainStore } from "@/store/main";

console.log(`challenge created`);

const store = useMainStore();

const { fetchChallengePageData, redirectTo } = store;
const { startChallenge, stopChallenge } = store.battleStore;
const { data, challengeScore } = storeToRefs(store.battleStore);

// animation flags
const showEndChallengeAnimation = ref(false);
const showStartChallengeAnimation = ref(false);

// challenge interval
const challengeTimer = ref();
let challengeTimerInterval = null;

// reset previous battle players progress
data.value["player_progress"] = null;

const playerPosition = computed(() => {
  if (!data.value?.["player_progress"]?.length) return [0, 0];

  const clone = [...data.value["player_progress"]];

  const playersSorted = clone?.sort((a, b) => b.score - a.score);

  return [playersSorted?.findIndex((player) => player.isPlayer) + 1 || data.value?.["player_progress"].length, data.value?.["player_progress"].length];
});

await fetchChallengePageData();

const onMechMounted = () => {};

const onMechUnmounted = () => {
  // optional
  stopChallenge();
};

onMounted(() => {
  console.log(`challenge mounted`);

  showStartChallengeAnimation.value = true;

  setTimeout(() => {
    showStartChallengeAnimation.value = false;
    startChallenge();

    challengeTimer.value = data.value?.battle_duration;

    challengeTimerInterval = setInterval(() => {
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
