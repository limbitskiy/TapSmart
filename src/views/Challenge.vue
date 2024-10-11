<template>
  <div class="challenge-main flex-1 overflow-y-auto overflow-x-hidden flex flex-col gap-2 relative p-4">
    <BackgroundImage type="red" />

    <div class="challenge-stats z-10 flex flex-col gap-2">
      <!-- <button class="absolute z-[9999]" @click="onBonusUsed">get bonus</button> -->
      <ChallengeStatus :time="timer || 0" />
      <ProgressBar :timer="timer || 0" />
    </div>

    <BackgroundPill class="flex-1 z-10 rounded-[15px] relative" dark>
      <div class="header flex items-center justify-between">
        <span class="fira-bold text-lg text-[#B7B7B7]">{{ locale?.[`yesno_title`] || "Yes-no" }} battle</span>
        <div class="right flex items-center gap-3">
          <VolumeControl class="scale-75" />
        </div>
      </div>

      <!-- battle body -->
      <div class="battle-body flex-1 flex relative overflow-hidden">
        <RouterView v-slot="{ Component }" type="challenge" @answer="onAnswer">
          <template v-if="Component">
            <Transition name="fade" mode="out-in">
              <Suspense suspensible>
                <component :is="Component" />
                <template #fallback><Loader /></template>
              </Suspense>
            </Transition>
          </template>
        </RouterView>

        <Transition name="correct-text" mode="out-in">
          <div v-if="isCorrectTextShown" class="correct-text absolute z-20 inset-0 grid place-items-center pointer-events-none">
            <span class="block text-[10vw] exo-black text-[#1fe525] mb-8">{{ locale?.["is_correct_answer"] || "Yes!" }}</span>
          </div>
          <div v-else-if="isWrongTextShown" class="correct-text absolute z-20 inset-0 grid place-items-center pointer-events-none">
            <span class="block text-[10vw] exo-black text-[red] mb-8">{{ locale?.["is_wrong_answer"] || "No!" }}</span>
          </div>
        </Transition>
      </div>
    </BackgroundPill>

    <!-- onscreen bonuses -->
    <Transition name="challenge-bonus-1">
      <div v-if="bonusState.isShown" class="bonuses-cnt absolute top-[45dvh] left-0 right-0 grid place-items-center z-30">
        <div class="bonus">
          <span class="text-[8vw] exo-black text-[#edaa38]">{{ bonusState.text }}</span>
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

const { data, challengeScore: score, bonusesUsed } = storeToRefs(dataStore.battles);
const { startChallenge, stopChallenge } = dataStore.battles;
const { battles: locale } = storeToRefs(localeStore);

const { fetchChallengePageData, callApi, redirectTo } = mainStore;

setThemeColor("#D26542");

const isCorrectTextShown = ref(false);
const isWrongTextShown = ref(false);

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

const onAnswer = (_data) => {
  if (_data.correct) {
    setTimeout(() => {
      isCorrectTextShown.value = true;
    }, 50);

    setTimeout(() => {
      isCorrectTextShown.value = false;
    }, 500);
  }

  if (!_data.correct) {
    setTimeout(() => {
      isWrongTextShown.value = true;
    }, 50);

    setTimeout(() => {
      isWrongTextShown.value = false;
    }, 500);
  }
};

onMounted(() => {
  startChallenge();
});

onBeforeUnmount(() => {
  stopChallenge();
});
</script>
