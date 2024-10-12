<template>
  <div class="home-main p-4 flex-1 overflow-auto flex flex-col gap-2 mb-[72px]">
    <!-- bg image -->
    <BackgroundImage type="blue" />

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

    <!-- battle mechanic -->
    <BattleMechanic />

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
      <Modal id="booster-select-modal" v-model:visible="isBoostersModalVisible">
        <BoosterSelect />
      </Modal>
    </Teleport>

    <!-- afk modal -->
    <Teleport to="#modals">
      <Modal id="afk-modal" v-model:visible="isAFKModalVisible" sticky>
        <AFK @close="onAfkModalClose" />
      </Modal>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { storeToRefs } from "pinia";
import { getAsset } from "@/utils";
import { tg, setThemeColor } from "@/api/telegram";
import { useWindowSize } from "@vueuse/core";

// stores
import { useMainStore } from "@/store/main";

const store = useMainStore();

const { fetchRelaxPageData } = store;
const { battles: locale } = storeToRefs(store.localeStore);
const { data, afkCounter } = storeToRefs(store.battleStore);
const { setRelaxModal } = store.battleStore;

const isChangeMechModalVisible = ref(false);
const isNoEnergyVisible = ref(false);
const isBoostersModalVisible = ref(false);

setThemeColor("#222");

await fetchRelaxPageData();

const isAFKModalVisible = computed(() => afkCounter.value >= 3);

// watch opened modals
watch([isChangeMechModalVisible, isNoEnergyVisible, isBoostersModalVisible, isAFKModalVisible], (val) => {
  if (val.some((modal) => modal)) {
    setRelaxModal("open");
  } else {
    setRelaxModal("closed");
  }
});

// watch energy
watch(
  () => data.value.energy,
  (val) => {
    if (val === 0) {
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

const onAfkModalClose = () => {
  afkCounter.value = 0;
};
</script>
