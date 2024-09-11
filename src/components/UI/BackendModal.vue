<template>
  <div class="data-content flex flex-col gap-2 items-center text-center mb-4">
    <img class="h-[30dvh] my-4" :src="getAsset('congrats')" />
    <span class="text-3xl fira-bold text-gray-100" v-html="modal.title"></span>
    <span class="text-lg px-[10vw] text-gray-300" v-html="modal.subtitle"></span>
    <div class="btns flex justify-end gap-4 mt-4">
      <Button
        v-if="modal.buttons?.left && !modal.buttons?.left?.hidden"
        class="flex-1 py-2 px-8 bg-[var(--green-color)] text-white"
        @click="() => onModalButton(modal.buttons.left)"
      >
        {{ modal.buttons?.left?.label }}
      </Button>
      <Button v-if="modal.buttons?.right && !modal.buttons?.right?.hidden" class="flex-1 py-2 px-8" @click="() => onModalButton(modal.buttons.right)">
        {{ modal.buttons?.right?.label }}
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { getAsset } from "@/utils";

// store
import { useMainStore } from "@/store/main";
import { useDataStore } from "@/store/data";

// components
import Button from "@/components/UI/Button.vue";

const mainStore = useMainStore();
const dataStore = useDataStore();

const { modal } = storeToRefs(mainStore);
const { startTaskTimeout, setTaskTimeoutCounter, startBreakpoint, stopBreakpoint } = dataStore.battles;
const { hideModal, callApi } = mainStore;

const onModalButton = (btn: { api: string; data: {} }) => {
  if (btn.api) {
    callApi({ api: btn.api, data: btn.data });
  }

  hideModal();
};

onMounted(() => {
  console.log(`mounted`);

  setTaskTimeoutCounter(1);
  stopBreakpoint();
});

onBeforeUnmount(() => {
  console.log(`unmounted`);

  setTaskTimeoutCounter(null);
  startTaskTimeout();
  startBreakpoint("battle");
});
</script>
