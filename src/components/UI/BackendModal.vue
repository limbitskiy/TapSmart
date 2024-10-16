<template>
  <div class="data-content flex flex-col gap-2 items-center text-center mb-4">
    <img v-if="modal?.image" class="h-[30dvh] my-4" :src="getAsset(modal.image)" />
    <img v-else class="h-[30dvh] my-4" :src="getAsset('congrats')" />
    <span class="text-3xl fira-bold text-gray-100" v-html="modal.title"></span>
    <span class="text-lg px-[10vw] text-gray-300" v-html="modal.subtitle"></span>
    <div class="btns flex justify-end gap-4 mt-4">
      <Button v-if="!modal.buttons?.left?.hidden" class="!py-2 bg-[var(--red-color)] text-white" :data="modal.buttons.left" :defaultAction="hideModal" />
      <Button v-if="!modal.buttons?.right?.hidden" class="!py-2 bg-[var(--green-color)] text-white" :data="modal.buttons.right" :defaultAction="hideModal" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { getAsset } from "@/utils";

// store
import { useMainStore } from "@/store/main";

const store = useMainStore();

const { hideModal } = store;
const { modal } = storeToRefs(store);
const { startTaskTimeout, stopTaskTimeout, startBreakpoint, stopBreakpoint } = store.battleStore;

onMounted(() => {
  // console.log(`mounted`);
  stopTaskTimeout();
  stopBreakpoint();
});

onBeforeUnmount(() => {
  // console.log(`unmounted`);

  startTaskTimeout();
  startBreakpoint("battle");
});
</script>
