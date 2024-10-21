<template>
  <div id="change-mechanic" class="flex-1 flex flex-col gap-4 py-1">
    <div class="pill-header flex items-center justify-between">
      <span class="bg-pill-title">{{ locale?.["select_mechanic_title"] || "Select mechanic" }}</span>
    </div>

    <div class="pill-grid grid grid-cols-2 gap-4 p-[2px] flex-1 overflow-y-scroll" @scroll="onScroll">
      <MechanicCard v-for="mech in battleMechanics" :key="mech!.id" :propData="mech!" @select="onMechSelect">
        <template #image>
          <svg width="116" height="60" viewBox="0 0 116 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="14.5" y="13.5" width="36" height="36" rx="2.5" stroke="white" stroke-dasharray="2 2" />
            <path
              d="M33.6022 32.483L39.8197 26.2821C39.9425 26.139 40.0067 25.955 39.9994 25.7667C39.9921 25.5785 39.9139 25.3999 39.7803 25.2667C39.6468 25.1335 39.4677 25.0554 39.2789 25.0482C39.0902 25.0409 38.9056 25.1049 38.7622 25.2275L32.5447 31.4283L26.3272 25.22C26.1859 25.0791 25.9944 25 25.7947 25C25.5949 25 25.4034 25.0791 25.2622 25.22C25.1209 25.3608 25.0416 25.5519 25.0416 25.7511C25.0416 25.9502 25.1209 26.1413 25.2622 26.2821L31.4872 32.483L25.2622 38.6839C25.1836 38.7509 25.1199 38.8334 25.0749 38.9262C25.0298 39.019 25.0045 39.1201 25.0006 39.2231C24.9966 39.3261 25.014 39.4289 25.0517 39.5249C25.0894 39.6208 25.1466 39.708 25.2197 39.7809C25.2928 39.8538 25.3802 39.9109 25.4764 39.9485C25.5727 39.9861 25.6757 40.0034 25.7789 39.9994C25.8822 39.9955 25.9836 39.9702 26.0766 39.9253C26.1697 39.8804 26.2524 39.8168 26.3197 39.7385L32.5447 33.5377L38.7622 39.7385C38.9056 39.8611 39.0902 39.9251 39.2789 39.9178C39.4677 39.9106 39.6468 39.8325 39.7803 39.6993C39.9139 39.5661 39.9921 39.3875 39.9994 39.1993C40.0067 39.011 39.9425 38.827 39.8197 38.6839L33.6022 32.483Z"
              fill="#F02D2D"
            />
            <rect x="64.5" y="13.5" width="36" height="36" rx="2.5" stroke="white" stroke-dasharray="2 2" />
            <path d="M74.5 31.5L80 37L91.5 26" stroke="#519A58" stroke-width="1.5" stroke-linecap="round" />
          </svg>
        </template>
      </MechanicCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { getAsset, showFormattedNumber } from "@/utils/index";

// stores
import { useMainStore } from "@/store/main";

const emit = defineEmits<{
  close: [];
}>();

const store = useMainStore();

const { hideTooltip } = store;
const { battles: locale } = storeToRefs(store.localeStore);
const { data } = storeToRefs(store.battleStore);
const { getMechanicName, changeMechanic } = store.battleStore;

const battleMechanics = computed(() =>
  Object.keys(data.value.mechanics ?? {})
    .map((key) => data.value.mechanics?.[key])
    .sort((a, b) => a!.order - b!.order)
);

const onMechSelect = (mechId: number) => {
  const mechName = getMechanicName(mechId);

  if (data.value.mechanics?.[mechName].disabled) {
    return;
  }

  changeMechanic(mechId);
  emit("close");
};

const onScroll = () => {
  hideTooltip();
};
</script>
