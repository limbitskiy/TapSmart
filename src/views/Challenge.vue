<template>
  <div class="challenge-cnt flex-1 flex">
    <div v-if="screenshotSrc" class="screenshot absolute top-0 w-[150px] z-[2222] border">
      <img :src="screenshotSrc" />
    </div>

    <div ref="screenshotEl" class="challenge-main flex-1 overflow-y-auto overflow-x-hidden flex flex-col gap-2 relative z-[20]">
      <!-- bg pattern & color -->
      <BackgroundImage />

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
        <BattleMechanic @answer="onAnswer" />
      </div>
    </div>

    <!-- end challenge animation -->
    <div class="animation-cnt absolute inset-0 z-[10] flex">
      <BattleCompleteAnimation />
    </div>

    <!-- onscreen booster usage -->
    <div class="boosters-cnt">
      <Transition name="challenge-bonus-1">
        <div v-if="boosterState.isShown" class="booster absolute top-[35dvh] left-0 right-0 grid place-items-center z-30">
          <div class="bonus">
            <span
              class="text-[8vw] exo-black text-[#edaa38]"
              style="
                background: linear-gradient(to top left, #ff75c3, #ffa647, #ffe83f, #9fff5b, #70e2ff, #cd93ff);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
              "
              >{{ boosterState.text }}</span
            >
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from "vue";
import { storeToRefs } from "pinia";
import { getAsset } from "@/utils";
import { tg } from "@/api/telegram";
import { gsap } from "gsap";

// stores
import { useMainStore } from "@/store/main";

console.log(`challenge created`);

const store = useMainStore();

const {} = storeToRefs(store);
const { fetchChallengePageData, redirectTo, takeHTMLSnapshot, setBgColor } = store;
const { startChallenge, stopChallenge } = store.battleStore;
const { data, challengeScore, boostersUsed } = storeToRefs(store.battleStore);
const { battles: locale } = storeToRefs(store.localeStore);

const ctx = gsap.context(() => {});
const settings = {
  screenshotInterval: 1 / 5,
};

let needToMakeScreenshot = false;
let challengeTimerInterval = null;

const screenshotEl = ref();
const screenshotSrc = ref();
const challengeTimer = ref(data.value?.battle_duration);

const boosterState = ref({
  text: "",
  isShown: false,
  used: {},
});

const timeLeft = computed(() => data.value?.["battle_duration"] - challengeTimer.value);
const isMakeScreenshot = computed(() => timeLeft.value % (data.value?.battle_duration * settings.screenshotInterval) === 0 && challengeTimer.value !== 0);

const playerPosition = computed(() => {
  if (!data.value?.["player_progress"]?.length) return [0, 0];

  const clone = [...data.value["player_progress"]];

  const playersSorted = clone?.sort((a, b) => b.score - a.score);

  return [playersSorted?.findIndex((player) => player.isPlayer) + 1 || data.value?.["player_progress"].length, data.value?.["player_progress"].length];
});

const progressBarValue = computed(() => (timeLeft.value * 100) / data.value?.["battle_duration"]);

setBgColor("linear-gradient(180deg, #000B14 17.5%, #A90306 100%");

await fetchChallengePageData();

const onAnswer = async () => {
  if (needToMakeScreenshot) {
    setTimeout(() => {
      takeHTMLSnapshot(screenshotEl.value);
    }, 50);
  }
  needToMakeScreenshot = false;
};

const showEndChallengeScreen = () => {
  ctx.slideScreenUp();
};

const onBoosterUsed = (bonusName: string) => {
  const bonusLocale = locale?.value[`${bonusName}_title`];
  console.log(bonusLocale);

  boosterState.value.text = bonusLocale;
  boosterState.value.isShown = true;

  setTimeout(() => {
    boosterState.value.text = "";
    boosterState.value.isShown = false;

    boosterState.value.used[bonusName] = true;
  }, 1000);
};

// watch boosters
watch(
  boostersUsed,
  (val) => {
    if (Object.keys(val).length) {
      Object.keys(val).forEach((bonus) => {
        if (!boosterState.value.used[bonus]) {
          onBoosterUsed(bonus);
        }
      });
    }
  },
  {
    deep: true,
  }
);

const setup = () => {
  ctx.add("slideScreenUp", () => {
    gsap.to(".challenge-main", {
      yPercent: -100,
      duration: 0.5,
    });
  });
};

onMounted(() => {
  console.log(`challenge mounted`);

  setup();

  // reset previous battle players progress
  data.value["player_progress"] = null;

  startChallenge();

  challengeTimerInterval = setInterval(async () => {
    // make screenshot every (duration/screenshotInterval)
    if (isMakeScreenshot.value) {
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
  stopChallenge();
});
</script>
