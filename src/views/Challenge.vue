<template>
  <div class="challenge-main flex-1 overflow-y-auto overflow-x-hidden flex flex-col gap-2 relative">
    <Backlight color="red" />

    <template v-if="isBattle">
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
    </template>

    <!-- onscreen bonuses -->
    <Transition name="challenge-bonus-1">
      <div v-if="bonusState.isShown" class="bonuses-cnt absolute top-[20dvh] left-0 right-0 grid place-items-center">
        <div class="bonus">
          <span class="text-[6vw] exo-black text-[#edaa38]">{{ bonusState.text }}</span>
        </div>
      </div>
    </Transition>

    <!-- waiting modal -->
    <Teleport to="#modals">
      <Modal v-model:visible="isWaiting" sticky>
        <Waiting @countdownComplete="onStart" @abort="onAbortChallenge" @friendStart="onFriendStart" />
      </Modal>
    </Teleport>

    <!-- battle complete animation -->
    <Transition name="fade">
      <div v-if="isBattleCompleteAnimation" class="on-battle-complete-backdrop fixed inset-0 bg-black bg-opacity-80 z-20 grid place-items-center">
        <BattleCompleteAnimation :place="data" />
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

setThemeColor("#D26542");

const route = useRoute();

const dataStore = useDataStore();
const mainStore = useMainStore();
const localeStore = useLocaleStore();

const { data, challengeScore: score, bonusesUsed, currentCalcPoint, currentBattleMode } = storeToRefs(dataStore.battles);
const { stopBreakpoint, startChallenge, stopChallenge } = dataStore.battles;
const { battles: locale } = storeToRefs(localeStore);

const { fetchChallengePageData, callApi, redirectTo } = mainStore;

const isWaiting = ref(false);
const isBattle = ref(false);
const isBattleCompleteAnimation = ref(false);

const bonusState = ref({
  text: "",
  isShown: false,
  used: {},
});

const challengeParams = {};
let interval = null;

Object.keys(route.query).forEach((key) => {
  challengeParams[key] = +route.query[key];
});

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

fetchChallengePageData(challengeParams);

const timer = ref(0);

const playerPosition = computed(() => {
  if (!data.value?.["player_progress"]?.length) return [0, 0];

  const clone = [...data.value["player_progress"]];

  const playersSorted = clone?.sort((a, b) => b.score - a.score);

  return [playersSorted?.findIndex((player) => player.isPlayer) + 1 || data.value["player_progress"].length, data.value["player_progress"].length];
});

const onFriendStart = () => {
  callApi({ api: "waiting_run" });
  onStart();
};

const onStart = async () => {
  isWaiting.value = false;
  await callApi({ api: "battle_init" });
  if (currentBattleMode.value === "challenge") {
    timer.value = data.value.battle_duration ? +data.value.battle_duration : 0;
    isBattle.value = true;
    startChallenge();
    interval = setInterval(() => {
      if (timer.value === 0) {
        clearInterval(interval);
        onEnd();
        return;
      }
      timer.value -= 1000;
    }, 1000);
  }
};

const onEnd = async () => {
  isBattle.value = false;
  stopChallenge();
  callApi({ api: "battle_breakpoint", data: { final: 1 } });
  isBattleCompleteAnimation.value = true;

  setTimeout(() => {
    // callApi({ api: "battle_completed" });
    isBattleCompleteAnimation.value = false;
    redirectTo("/battle-complete");
  }, 3000);
};

const onAbortChallenge = () => {
  isWaiting.value = false;
  isBattle.value = false;
  stopChallenge();
  redirectTo("/home/relax");
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
  isWaiting.value = true;
});

onBeforeUnmount(() => {
  stopBreakpoint();
});
</script>
