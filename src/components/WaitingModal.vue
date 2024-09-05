<template>
  <div class="waiting-modal">
    <div class="header">
      <span>{{ locale?.["waiting_title"] || "Waiting" }}</span>
      <CountdownTimer :initValue="10000" />
    </div>

    <ul class="players">
      <li>Player1</li>
      <li>Player2</li>
      <li>Player3</li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
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
import CountdownTimer from "@/components/CountdownTimer.vue";

const dataStore = useDataStore();
const mainStore = useMainStore();
const localeStore = useLocaleStore();

const { battles: data } = storeToRefs(dataStore);
const { battles: locale } = storeToRefs(localeStore);
</script>

<!-- 

locale:
waiting_title 


data:
waiting_timer (ms)
players_waiting (player [])

-->
