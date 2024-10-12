<template>
  <div class="challenge-main flex-1 overflow-y-auto overflow-x-hidden flex flex-col gap-2 relative p-4">
    <BackgroundImage type="red" />

    <div class="challenge-stats z-10 flex flex-col gap-2">
      <ChallengeStatus :time="timer || 0" />
      <ProgressBar :timer="timer || 0" />
    </div>

    <!-- battle mechanic -->
    <BattleMechanic />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { storeToRefs } from "pinia";
import { getAsset } from "@/utils";
import { tg, setThemeColor } from "@/api/telegram";

// stores
import { useMainStore } from "@/store/main";

const store = useMainStore();

const { fetchChallengePageData, useFetch, redirectTo } = store;
const { data, challengeScore: score } = storeToRefs(store.battleStore);
const { battles: locale } = storeToRefs(store.localeStore);

// setThemeColor("#D26542");

await fetchChallengePageData();

let interval = null;
const timer = ref(0);

timer.value = data.value.battle_duration ? +data.value.battle_duration : 0;

interval = setInterval(() => {
  if (timer.value === 0) {
    clearInterval(interval);
    onEndChallenge();
    return;
  }
  timer.value -= 1000;
}, 1000);

const onEndChallenge = () => {
  useFetch({ key: "battle_breakpoint", data: { final: 1 } });
  redirectTo("/battle-complete-animation");
};
</script>
