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
          <span>{{ locale["button_change_mech"] }}</span>
          <div class="chevron">
            <svg width="18" height="10" viewBox="0 0 18 10" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 10L0 1.22807L1.26 0L9 7.54386L16.74 0L18 1.22807L9 10Z" fill="white" />
            </svg>
          </div>
        </div>
      </Button>
      <Button ref="challengeBtnRef" class="flex-1 py-3 px-5" :class="{ 'bg-gray-300 text-gray-400': data.challengeButton?.disabled }" @click="onChallengeBtnClick"
        ><div class="flex justify-center gap-1">
          <span>{{ locale["button_challenge"] }}</span>
          <div class="counter text-sm bg-green-500 rounded-md h-4 px-1 grid place-items-center leading-3 exo-bold">{{ data.challengeButton?.badge || 0 }}</div>
        </div>
      </Button>
      <VolumeControl />
    </div>
    <RouterView v-slot="{ Component }">
      <!-- <Transition name="fade" mode="out-in"> -->
      <component :is="Component" />
      <!-- </Transition> -->
    </RouterView>
    <Teleport to="body">
      <Modal v-model:visible="isModalVisible">
        <ChangeMechanic @close="closeModal" />
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

const dataStore = useDataStore();
const mainStore = useMainStore();
const localeStore = useLocaleStore();

const { showTooltip } = mainStore;
const { battles: data } = dataStore;
const { battles: locale } = storeToRefs(localeStore);
const { fetchBattlesPage } = mainStore;

const isModalVisible = ref(false);

const challengeBtnRef = ref();

watch(isModalVisible, (val) => {
  if (val) {
    data.stopTaskTimeout();
  } else {
    data.startTaskTimeout();
  }
});

const { width } = useWindowSize();

await fetchBattlesPage();

const onChangeMech = () => {
  isModalVisible.value = true;
};

const closeModal = () => {
  isModalVisible.value = false;
};

const onChallengeBtnClick = () => {
  if (data.challengeButton?.disabled) {
    showTooltip({
      element: challengeBtnRef.value.ref,
      text: locale.value["button_challenge_tooltip"],
    });
  }
};
</script>
