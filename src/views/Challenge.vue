<template>
  <div class="challenge-main flex-1 overflow-auto flex flex-col gap-2">
    <RouterView v-slot="{ Component }">
      <!-- <Transition name="fade" mode="out-in"> -->
      <component :is="Component" />
      <!-- </Transition> -->
    </RouterView>

    <!-- waiting modal -->
    <Teleport to="body">
      <Modal v-model:visible="isWaitingModalVisible">
        <WaitingModal />
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
import { useDataStore } from "@/store/data";
import { useMainStore } from "@/store/main";
import { useLocaleStore } from "@/store/locale";

// components
import Button from "@/components/UI/Button.vue";
import Modal from "@/components/Modal.vue";
import VolumeControl from "@/components/VolumeControl.vue";
import WaitingModal from "@/components/WaitingModal.vue";

const dataStore = useDataStore();
const mainStore = useMainStore();
const localeStore = useLocaleStore();

const { battles: data } = storeToRefs(dataStore);
const { battles: locale } = storeToRefs(localeStore);

const { fetchChallengePage } = mainStore;

const { width } = useWindowSize();

await fetchChallengePage();

const isWaitingModalVisible = ref(true);
</script>
