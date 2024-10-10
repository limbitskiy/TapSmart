<template>
  <div class="home-main p-4 flex-1 overflow-auto flex flex-col gap-2 mb-[72px]">
    <!-- bg image -->
    <BackgroundImage />

    <!-- profile widget -->
    <ProfileWidget />

    <!-- battle controls -->
    <div class="top-btns grid grid-cols-2 gap-4 pr-1 relative bg-[var(--grey-dark)] rounded-[15px] py-1 z-10">
      <Button class="bg-[var(--grey-dark)] text-white fira-condensed-bold leading-4 !px-4" activeColor="#444" @click="onChangeMech">
        <div class="flex gap-4 items-center justify-end">
          <div v-if="width > 410" class="icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="10.8387" height="10.8387" rx="2" fill="white" />
              <rect y="13.1613" width="10.8387" height="10.8387" rx="2" fill="white" />
              <rect x="13.1611" width="10.8387" height="10.8387" rx="2" fill="white" />
              <rect x="13.1611" y="13.1613" width="10.8387" height="10.8387" rx="2" fill="white" />
            </svg>
          </div>
          <span class="text-base leading-4">{{ locale?.["button_change_mech"] }}</span>
          <!-- chevron down -->
          <svg width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7 8L0 0.982456L0.98 0L7 6.03509L13.02 0L14 0.982456L7 8Z" fill="white" />
          </svg>
        </div>
      </Button>
      <ChallengeButton class="text-base" @challenge="openBoosterModal" />
      <div class="relax-topbar flex flex-col items-end justify-between w-full absolute -bottom-[35px] px-4"></div>
    </div>

    <BackgroundPill class="flex-1 z-10 rounded-[15px] relative" dark>
      <div class="header flex items-center justify-between">
        <span class="fira-bold text-lg text-[#B7B7B7]">{{ locale?.[`yesno_title`] || "Yes-no" }} battle</span>
        <div class="right flex items-center gap-3">
          <!-- <CircleProgress class="text-white" :strokeWidth="2" color="grey" :size="20" /> -->
          <VolumeControl class="scale-75" />
        </div>
      </div>

      <!-- battle body -->
      <div class="battle-body flex-1 flex relative overflow-hidden">
        <RouterView v-slot="{ Component }" type="relax" @answer="onAnswer">
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

      <TaskCountdown class="absolute top-0 left-0 right-0 px-4" color="#a5a5a5" />
    </BackgroundPill>

    <!-- mechanic change modal -->
    <Teleport to="#modals">
      <Modal id="mechanic-change-modal" v-model:visible="isChangeMechModalVisible">
        <ChangeMechanic @close="() => closeModal('changeMechanic')" />
      </Modal>
    </Teleport>

    <!-- no energy modal -->
    <Teleport to="#modals">
      <Modal id="no-energy-modal" v-model:visible="isNoEnergyVisible" sticky>
        <NoEnergy @challenge="openBoosterModal" @close="() => closeModal('noEnergy')" />
      </Modal>
    </Teleport>

    <!-- booster select modal -->
    <Teleport to="#modals">
      <Modal id="select-booster-modal" v-model:visible="isBoostersModalVisible">
        <BoosterSelect @startBattle="onStartWaiting" />
      </Modal>
    </Teleport>

    <!-- afk modal -->
    <Teleport to="#modals">
      <Modal id="afk-modal" v-model:visible="isAFKModalVisible" sticky>
        <AFK @close="onAfkModalClose" />
      </Modal>
    </Teleport>

    <!-- waiting modal -->
    <Teleport to="#modals">
      <Modal id="waiting-modal" v-model:visible="isWaitingModalVisible" sticky>
        <Waiting :challengeProps="challengeProps" @countdownComplete="onStartChallenge" @abort="onAbortWaiting" />
      </Modal>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch, onBeforeUnmount, computed } from "vue";
import { storeToRefs } from "pinia";
import { getAsset } from "@/utils";
import { tg, setThemeColor } from "@/api/telegram";
import { useWindowSize } from "@vueuse/core";
import { useRoute } from "vue-router";

// stores
import { useDataStore } from "@/store/data";
import { useMainStore } from "@/store/main";
import { useLocaleStore } from "@/store/locale";

const dataStore = useDataStore();
const mainStore = useMainStore();
const localeStore = useLocaleStore();

const route = useRoute();

const { data, afkCounter } = storeToRefs(dataStore.battles);
const { battles: locale } = storeToRefs(localeStore);
const { startBreakpoint, stopBreakpoint, startTaskTimeout, stopTaskTimeout, setTaskTimeoutCounter, resetBattleStats, resetAfkCounter, getCurrentMechanicName } = dataStore.battles;
const { redirectTo, fetchRelaxPageData, resetPageKey } = mainStore;
const { backgroundColor } = storeToRefs(mainStore);

const isCorrectTextShown = ref(false);
const isWrongTextShown = ref(false);
const isChangeMechModalVisible = ref(false);
const isNoEnergyVisible = ref(false);
const isBoostersModalVisible = ref(false);
const isWaitingModalVisible = ref(false);
const challengeProps = ref({
  extra_mistake: 0,
  extra_time: 0,
  friends_only: 0,
});

setThemeColor("#222");
backgroundColor.value = "blue";

await fetchRelaxPageData();

const isAFKModalVisible = computed(() => afkCounter.value >= 3);

// stop questions when modals are open
watch([isChangeMechModalVisible, isNoEnergyVisible, isBoostersModalVisible, isAFKModalVisible, isWaitingModalVisible], (val) => {
  if (val.some((modal) => modal)) {
    if (!val[3]) {
      resetAfkCounter();
    }

    setTaskTimeoutCounter(1);
  } else {
    resetAfkCounter();
    setTaskTimeoutCounter(null);
    startTaskTimeout();
  }
});

// watch energy
watch(
  () => data.value.energy,
  (val) => {
    if (val === 0) {
      stopTaskTimeout();
      isNoEnergyVisible.value = true;
    }
  }
);

const { width } = useWindowSize();

const onChangeMech = () => {
  isChangeMechModalVisible.value = true;
};

const closeModal = (modalName: string) => {
  const modals = {
    changeMechanic: isChangeMechModalVisible,
    noEnergy: isNoEnergyVisible,
  };

  modals[modalName].value = false;
};

const openBoosterModal = () => {
  isNoEnergyVisible.value = false;
  isBoostersModalVisible.value = true;
};

const onAnswer = (_data) => {
  if (data.value.energy === 0) {
    isNoEnergyVisible.value = true;
  }

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

const onAfkModalClose = () => {
  resetAfkCounter();
};

// waiting
const onStartWaiting = (_challengeProps: {}) => {
  isBoostersModalVisible.value = false;
  challengeProps.value = _challengeProps;
  isWaitingModalVisible.value = true;
};

const onStartChallenge = () => {
  isWaitingModalVisible.value = false;
  redirectTo(`/challenge/${getCurrentMechanicName()}`);
};

const onAbortWaiting = () => {
  challengeProps.value = { extra_mistake: 0, extra_time: 0, friends_only: 0 };
  isWaitingModalVisible.value = false;
};

onMounted(() => {
  // console.log(route.query);

  console.log(`mounted`);
  // resetPageKey("homeChild");
  startBreakpoint("battle");
  setTaskTimeoutCounter(null);
  startTaskTimeout();
  resetBattleStats();
});

onBeforeUnmount(() => {
  // console.log(`unmounted`);
  resetAfkCounter();
  stopBreakpoint();
  setTaskTimeoutCounter(1);
});
</script>
