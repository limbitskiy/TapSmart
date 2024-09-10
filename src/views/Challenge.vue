<template>
  <div class="challenge-main flex-1 overflow-auto flex flex-col gap-2">
    <Backlight color="red" />

    <template v-if="isBattle">
      <div class="challenge-stats relative z-10 flex flex-col gap-4 mt-2">
        <ChallengeStatus
          :timer="timer!"
          :initialTimerValue="data['battle_duration']!"
          @timeEnd="onEndBattle"
        />

        <div class="wrap px-8">
          <ProgressBar
            :timer="timer!"
            :initialTimerValue="data['battle_duration']!"
          />
        </div>
      </div>

      <RouterView v-slot="{ Component }">
        <!-- <Transition name="fade" mode="out-in"> -->
        <component :is="Component" />
        <!-- </Transition> -->
      </RouterView>
    </template>

    <!-- waiting modal -->
    <Teleport to="body">
      <Modal v-model:visible="isWaiting" sticky>
        <WaitingModal @countdownComplete="onStartBattle" />
      </Modal>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from "vue";
import { storeToRefs } from "pinia";
import { getAsset } from "../utils";
import { tg, getUserName } from "@/api/telegram";
import { useRoute } from "vue-router";

// stores
import { useDataStore } from "@/store/data";
import { useMainStore } from "@/store/main";
import { useLocaleStore } from "@/store/locale";

// components
import Button from "@/components/UI/Button.vue";
import Modal from "@/components/Modal.vue";
import VolumeControl from "@/components/VolumeControl.vue";
import WaitingModal from "@/components/WaitingModal.vue";
import Backlight from "@/components/UI/Backlight.vue";
import ChallengeStatus from "@/components/ChallengeStatus.vue";
import ProgressBar from "@/components/ProgressBar.vue";

const route = useRoute();

const dataStore = useDataStore();
const mainStore = useMainStore();
const localeStore = useLocaleStore();

const { battles: data } = storeToRefs(dataStore);
const { battles: locale } = storeToRefs(localeStore);

const { startBreakpoint, stopBreakpoint } = data.value;

const { fetchChallengePage, callApi } = mainStore;

const challengeParams = {};

Object.keys(route.query).forEach((key) => {
  challengeParams[key] = +route.query[key];
});

await fetchChallengePage(challengeParams);

const isWaiting = ref(false);
const isBattle = ref(false);
const timer = ref(data.value.battle_duration);
let interval = null;

const onStartBattle = () => {
  isWaiting.value = false;
  callApi({ api: "battle_init" });

  setTimeout(() => {
    isBattle.value = true;
    startBreakpoint("challenge");

    interval = setInterval(() => {
      if (timer.value === 0) {
        clearInterval(interval);
        return;
      }

      timer.value -= 1000;
    }, 1000);
  }, 300);
};

const onEndBattle = () => {};

onMounted(() => {
  isWaiting.value = true;
});

onBeforeUnmount(() => {
  stopBreakpoint();
});
</script>
