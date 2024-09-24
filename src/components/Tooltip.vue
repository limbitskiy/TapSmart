<template>
  <div
    ref="tooltipRef"
    class="tooltip absolute z-[100] bg-[#535353] border border-[#4b4b4b] p-4 rounded-xl text-sm w-max"
    :style="{ top: `${params.y}px`, left: `${params.x}px`, maxWidth: `${params.width}px` }"
    @click="onClick"
  >
    <div v-if="params.position === 'bottom'" class="triangle-up absolute -top-[8px]" :style="{ left: params.center - 5 + 'px' }"></div>
    <span>{{ tooltip.text }}</span>
    <div v-if="params.position === 'top'" class="triangle-down absolute -bottom-[8px]" :style="{ left: params.center - 5 + 'px' }"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { storeToRefs } from "pinia";

// store
import { useMainStore } from "@/store/main";

const mainStore = useMainStore();

const { tooltip } = storeToRefs(mainStore);
const { hideTooltip } = mainStore;

const tooltipRef = ref();

const { left: elementLeft, width: elementWidth, height: elementHeight, top: elementTop, right: elementRight } = tooltip.value.element.getBoundingClientRect();

const calculatedElementWidth = (elementWidth: number) => {
  return elementWidth > 150 ? elementWidth : 150;
};

const params = ref({
  x: elementLeft,
  y: elementTop + window.scrollY,
  center: elementWidth / 2,
  position: tooltip.value.position || "top",
  width: calculatedElementWidth(elementWidth),
});

const onClick = () => {
  hideTooltip();
};

const onScroll = () => {
  hideTooltip();
};

onMounted(() => {
  const { height: tooltipHeight, width: tooltipWidth, right: tooltipRight, left: tooltipLeft } = tooltipRef.value.getBoundingClientRect();

  // check for Y overflowing
  if (params.value.y - tooltipHeight < window.scrollY) {
    params.value.y = params.value.y + elementHeight + 10;
    params.value.position = "bottom";
  } else {
    params.value.y = params.value.y - tooltipHeight - 10;
  }

  // check for X overflowing
  if (tooltipRight > window.innerWidth) {
    const delta = tooltipRight - window.innerWidth;
    params.value.x -= delta;
  }

  const triangleDeltaX = elementLeft - params.value.x;

  params.value.center = triangleDeltaX + elementWidth / 2;

  document.querySelector("#app")?.addEventListener("scroll", onScroll);
});

onBeforeUnmount(() => {
  removeEventListener("scroll", onScroll);
});
</script>
