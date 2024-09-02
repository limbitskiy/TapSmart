<template>
  <div
    ref="tooltipRef"
    class="tooltip absolute z-[5] bg-[#535353] border border-[#4b4b4b] p-4 rounded-xl text-sm w-max"
    :style="{ top: `${params.y}px`, left: `${params.x}px`, maxWidth: `${params.width}px` }"
    @click="onClick"
  >
    <div v-if="params.position === 'bottom'" class="triangle-up absolute -top-[8px]" :style="{ left: params.center - 5 + 'px' }"></div>
    <span>{{ tooltip.text }}</span>
    <div v-if="params.position === 'top'" class="triangle-down absolute -bottom-[8px]" :style="{ left: params.center - 5 + 'px' }"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { storeToRefs } from "pinia";

// store
import { useMainStore } from "@/store/main.ts";

const mainStore = useMainStore();

const { tooltip } = storeToRefs(mainStore);
const { hideTooltip } = mainStore;

const tooltipRef = ref();

const { left: elementLeft, width: elementWidth, height: elementHeight, top: elementTop, right: elementRight } = tooltip.value.element.getBoundingClientRect();

const params = ref({
  x: elementLeft,
  y: elementTop + window.scrollY,
  center: elementWidth / 2,
  position: tooltip.value.position || "top",
  width: elementWidth,
});

const onClick = () => {
  hideTooltip();
};

onMounted(() => {
  const { height, width, right } = tooltipRef.value.getBoundingClientRect();

  if (params.value.y - height < window.scrollY) {
    params.value.y = params.value.y + elementHeight + 10;
    params.value.position = "bottom";
  } else {
    params.value.y = params.value.y - height - 10;
  }
});
</script>
