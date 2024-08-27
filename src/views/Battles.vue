<template>
  <div class="home-main flex-1 overflow-auto flex flex-col gap-2">
    <Profile />
    <div class="top-btns flex gap-4 w-full px-4 relative">
      <Button class="flex-1 bg-black text-white border-2" @click="changeMech">{{ locale["button_change_mech"] }}</Button>
      <Button class="flex-1"
        ><div class="flex justify-center gap-1">
          <span class="">{{ locale["button_challenge"] }}</span>
          <div class="counter text-sm bg-green-500 rounded-md h-5 p-[2px] grid place-items-center leading-3">13</div>
        </div>
      </Button>
      <VolumeControl />
    </div>
    <RouterView v-slot="{ Component }">
      <Transition name="fade" mode="out-in">
        <component :is="Component" />
      </Transition>
    </RouterView>
    <Teleport to="body">
      <Modal v-model:visible="isModalVisible">
        <ChangeMechanic @close="closeModal" />
      </Modal>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { getAsset } from "../utils";
import { tg, getUserName } from "@/api/telegram";

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

const { battles: locale } = localeStore;
const { fetchBattlesPage } = mainStore;

const isModalVisible = ref(false);

await fetchBattlesPage();

const changeMech = () => {
  isModalVisible.value = true;
};

const closeModal = () => {
  isModalVisible.value = false;
};
</script>
