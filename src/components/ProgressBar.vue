<template>
  <div class="progressbar flex flex-col gap-1">
    <div class="enemy-markers">
      <div class="marker">
        <img class="h-4" :src="getAsset('enemy-marker')" />
      </div>
    </div>
    <div class="gauge h-2 bg-[var(--grey-light)] rounded-full w-full">
      <div class="gauge-value h-2 bg-[var(--accent-color)] rounded-full" :style="{ width: value + '%' }"></div>
    </div>
    <div class="player-marker mt-2">
      <div class="marker">
        <img class="h-4 scale-[2]" :src="getAsset('player-marker')" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { getAsset } from "../utils";
import { tg, getUserName } from "@/api/telegram";
import { useWindowSize } from "@vueuse/core";

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

const dataStore = useDataStore();
const mainStore = useMainStore();
const localeStore = useLocaleStore();

const { battles: data } = storeToRefs(dataStore);
const { battles: locale } = storeToRefs(localeStore);

const value = ref(50);
</script>
