<template>
  <div class="home-main flex-1 overflow-auto flex flex-col gap-2 mb-[72px]">
    <Backlight color="green" />
    <Profile />
    <div class="top-btns grid grid-cols-2 gap-4 w-full px-4 relative">
      <Button class="bg-black text-white border fira-condensed-bold leading-4 !px-4 py-2" activeColor="#fff" @click="onChangeMech">
        <div class="flex gap-1 items-center justify-between">
          <div v-if="width > 410" class="icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="10.8387" height="10.8387" rx="2" fill="white" />
              <rect y="13.1613" width="10.8387" height="10.8387" rx="2" fill="white" />
              <rect x="13.1611" width="10.8387" height="10.8387" rx="2" fill="white" />
              <rect x="13.1611" y="13.1613" width="10.8387" height="10.8387" rx="2" fill="white" />
            </svg>
          </div>
          <span class="text-base leading-4">{{ locale?.["button_change_mech"] }}</span>
          <svg width="18" height="10" viewBox="0 0 18 10" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 10L0 1.22807L1.26 0L9 7.54386L16.74 0L18 1.22807L9 10Z" fill="white" />
          </svg>
        </div>
      </Button>
      <ChallengeButton class="text-base" @challenge="openBoosterModal" />
      <div class="relax-topbar flex flex-col items-end justify-between w-full absolute -bottom-[35px] px-4">
        <!-- <TaskCountdown /> -->
        <VolumeControl />
      </div>
    </div>

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

    <!-- select booster modal -->
    <Teleport to="#modals">
      <Modal id="select-booster-modal" v-model:visible="isBoostersModalVisible">
        <BoosterSelect @startBattle="onStartChallenge" />
      </Modal>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch, onBeforeUnmount, onUpdated } from "vue";
import { storeToRefs } from "pinia";
import { getAsset } from "@/utils";
import { tg, setThemeColor } from "@/api/telegram";
import { useWindowSize } from "@vueuse/core";

// stores
import { useDataStore } from "@/store/data";
import { useMainStore } from "@/store/main";
import { useLocaleStore } from "@/store/locale";

// components
import Backlight from "@/components/UI/Backlight.vue";
import Profile from "@/components/Profile.vue";
import Button from "@/components/UI/Button.vue";
import Modal from "@/components/Modal.vue";
import ChangeMechanic from "@/components/modals/ChangeMechanic.vue";
import VolumeControl from "@/components/VolumeControl.vue";
import TaskCountdown from "@/components/TaskCountdown.vue";
import NoEnergy from "@/components/modals/NoEnergy.vue";
import ChallengeButton from "@/components/UI/ChallengeButton.vue";
import BoosterSelect from "@/components/modals/BoosterSelect.vue";
import Loader from "@/components/UI/Loader.vue";

const dataStore = useDataStore();
const mainStore = useMainStore();
const localeStore = useLocaleStore();

const { data } = storeToRefs(dataStore.battles);
const { battles: locale } = storeToRefs(localeStore);
const { startBreakpoint, stopBreakpoint, startTaskTimeout, stopTaskTimeout, getMechanicName, setTaskTimeoutCounter, resetBattleStats } = dataStore.battles;
const { redirectTo } = mainStore;

const isChangeMechModalVisible = ref(false);
const isNoEnergyVisible = ref(false);
const isBoostersModalVisible = ref(false);

setThemeColor("#222");

// stop questions when modals are open
watch([isChangeMechModalVisible, isNoEnergyVisible, isBoostersModalVisible], (val) => {
  if (val.some((modal) => modal)) {
    setTaskTimeoutCounter(1);
  } else {
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
  isBoostersModalVisible.value = true;
};

const onStartChallenge = ({ extra_mistake, extra_time, friends_only }: { [key: string]: string }) => {
  isBoostersModalVisible.value = false;
  setTimeout(() => {
    redirectTo(`/challenge/yesno?extra_mistake=${extra_mistake}&extra_time=${extra_time}&friends_only=${friends_only}`);
  }, 300);
};

const onAnswer = () => {
  if (data.value.energy === 0) {
    isNoEnergyVisible.value = true;
  }
};

onMounted(() => {
  // console.log(`mounted`);

  startBreakpoint("battle");
  setTaskTimeoutCounter(null);
  startTaskTimeout();
  resetBattleStats();
});

onBeforeUnmount(() => {
  // console.log(`unmounted`);

  stopBreakpoint();
  setTaskTimeoutCounter(1);
});
</script>
