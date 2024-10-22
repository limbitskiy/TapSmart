<template>
  <div class="data-content flex flex-col gap-2 items-center text-center mb-4">
    <img v-if="modal?.image" class="h-[30dvh] my-4" :src="getAsset(modal.image)" />
    <img v-else class="h-[30dvh] my-4" :src="getAsset('congrats')" />
    <span class="text-3xl fira-bold text-gray-100" v-html="modal.title"></span>
    <span class="text-lg px-[10vw] text-gray-300 inline-svg" v-html="replaceWithSpecialSymbols(modal.subtitle)"></span>
    <div class="btns flex justify-end gap-4 mt-4">
      <Button v-if="!modal.buttons?.left?.hidden" class="bg-[var(--red-color)] text-white" :data="modal.buttons.left" @close="() => emit('close')" />
      <Button v-if="!modal.buttons?.right?.hidden" class="bg-[var(--green-color)] text-white" :data="modal.buttons.right" @close="() => emit('close')" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { getAsset, replaceWithSpecialSymbols } from "@/utils";

// store
import { useMainStore } from "@/store/main";

const emit = defineEmits<{
  close: [];
}>();

const store = useMainStore();

const { modal } = storeToRefs(store);
const { setRelaxModal } = store.battleStore;

onMounted(() => {
  // console.log(`mounted`);
  setRelaxModal("open");
});

onBeforeUnmount(() => {
  // console.log(`unmounted`);

  setRelaxModal("closed");
});
</script>
