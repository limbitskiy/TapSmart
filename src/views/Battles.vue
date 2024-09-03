<template>
  <div class="home-main flex-1 overflow-auto flex flex-col gap-2">
    <Profile />
    <div class="top-btns flex gap-4 w-full px-4 relative">
      <Button class="flex-1 bg-black text-white border fira-condensed-bold !text-sm leading-4 px-4 py-2" @click="onChangeMech">
        <div class="flex gap-1 items-center justify-between">
          <div v-if="width > 410" class="icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="10.8387" height="10.8387" rx="2" fill="white" />
              <rect y="13.1613" width="10.8387" height="10.8387" rx="2" fill="white" />
              <rect x="13.1611" width="10.8387" height="10.8387" rx="2" fill="white" />
              <rect x="13.1611" y="13.1613" width="10.8387" height="10.8387" rx="2" fill="white" />
            </svg>
          </div>
          <span class="text-base leading-4">{{ locale["button_change_mech"] }}</span>
          <div class="chevron">
            <svg width="18" height="10" viewBox="0 0 18 10" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 10L0 1.22807L1.26 0L9 7.54386L16.74 0L18 1.22807L9 10Z" fill="white" />
            </svg>
          </div>
        </div>
      </Button>
      <ChallengeButton />
      <VolumeControl />
    </div>
    <RouterView v-slot="{ Component }">
      <!-- <Transition name="fade" mode="out-in"> -->
      <component :is="Component" />
      <!-- </Transition> -->
    </RouterView>
    <Teleport to="body">
      <Modal v-model:visible="isChangeMechModalVisible">
        <ChangeMechanic @close="closeModal" />
      </Modal>
    </Teleport>
    <Teleport to="body">
      <Modal v-model:visible="isNoEnergyModalVisible">
        <NoEnergyModal />
      </Modal>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { getAsset } from "../utils";
import { tg, getUserName } from "@/api/telegram";
import { useWindowSize } from "@vueuse/core";

// stores
import { useDataStore } from "@/store/data.ts";
import { useMainStore } from "@/store/main.ts";
import { useLocaleStore } from "@/store/locale.ts";

// components
import Pill from "@/components/UI/Pill.vue";
import Profile from "@/components/Profile.vue";
import Button from "@/components/UI/Button.vue";
import Modal from "@/components/Modal.vue";
import ChangeMechanic from "@/components/ChangeMechanic.vue";
import VolumeControl from "@/components/VolumeControl.vue";
import NoEnergyModal from "@/components/UI/NoEnergyModal.vue";
import ChallengeButton from "@/components/UI/ChallengeButton.vue";

const dataStore = useDataStore();
const mainStore = useMainStore();
const localeStore = useLocaleStore();

const { showTooltip } = mainStore;
const { battles: data } = storeToRefs(dataStore);
const { battles: locale } = storeToRefs(localeStore);
const { fetchBattlesPage } = mainStore;

const isChangeMechModalVisible = ref(false);
const isNoEnergyModalVisible = ref(false);

watch(isChangeMechModalVisible, (val) => {
  if (val) {
    data.value.stopTaskTimeout();
  } else {
    data.value.startTaskTimeout();
  }
});

watch(
  () => data.value.energy,
  (val) => {
    if (val === 0) {
      data.value.stopTaskTimeout();
      isNoEnergyModalVisible.value = true;
    }
  }
);

const { width } = useWindowSize();

await fetchBattlesPage();

const onChangeMech = () => {
  isChangeMechModalVisible.value = true;
};

const closeModal = () => {
  isChangeMechModalVisible.value = false;
};
</script>
