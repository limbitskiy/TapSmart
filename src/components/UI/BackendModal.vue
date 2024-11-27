<template>
  <Transition name="fade" mode="out-in">
    <BackendModalContent :key="modal.id" :data="modal" @close="() => emit('close')" />
  </Transition>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { getAsset, replaceWithSpecialSymbols } from "@/utils";

// backend modal content
import BackendModalContent from "@/components/modals/BackendModalContent.vue";

// store
import { useMainStore } from "@/store/main";

const emit = defineEmits<{
  close: [];
}>();

const store = useMainStore();

const { modal } = storeToRefs(store);
const { setBackendModal } = store.battleStore;

onMounted(() => {
  // console.log(`mounted`);
  setBackendModal("open");
});

onBeforeUnmount(() => {
  // console.log(`unmounted`);
  setBackendModal("closed");
});
</script>
