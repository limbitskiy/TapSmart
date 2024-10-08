<template>
  <div
    ref="tooltipRef"
    class="tooltip absolute z-[100] bg-[#535353] border border-[#4b4b4b] p-4 rounded-xl text-sm w-max"
    :style="{
      top: `${params.y}px`,
      left: `${params.x}px`,
      maxWidth: `${params.width}px`,
    }"
    @click="onClick"
  >
    <!-- arrow down -->
    <div v-if="params.position === 'bottom'" class="triangle-up absolute -top-[8px]" :style="{ left: params.center - 5 + 'px' }"></div>

    <!-- tooltip text -->
    <span>{{ tooltip.text }}</span>

    <!-- arrow up -->
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

const calculateElementWidth = (elementWidth: number) => {
  return elementWidth > 250 ? elementWidth : 250;
};

// parent element passed with the tooltip
const elementRect = tooltip.value.element.getBoundingClientRect();

// tooltip params
const params = ref({
  x: elementRect.left,
  y: elementRect.top + window.scrollY,
  center: elementRect.width / 2,
  position: tooltip.value.position || "top",
  width: calculateElementWidth(elementRect.width),
});

const onClick = () => {
  hideTooltip();
};

const onScroll = () => {
  hideTooltip();
};

onMounted(() => {
  // original tooltip position! probably not the same after all checks
  const { height: tooltipHeight, width: tooltipWidth, right: tooltipRight, left: tooltipLeft } = tooltipRef.value.getBoundingClientRect();

  // center tooltip on element
  params.value.x += elementRect.width / 2 - tooltipWidth / 2;

  // check for Y overflowing
  if (params.value.y - tooltipHeight < window.scrollY) {
    params.value.y = params.value.y + elementRect.height + 10;
    params.value.position = "bottom";
  } else {
    params.value.y = params.value.y - tooltipHeight - 10;
  }

  // check for X overflowing on the right
  if (params.value.x + tooltipWidth > window.innerWidth) {
    const delta = params.value.x + tooltipWidth - window.innerWidth;
    params.value.x -= delta;
    // params.value.x = window.innerWidth - params.value.width;
  }

  // check for X overflowing on the left
  if (params.value.x < 0) {
    params.value.x = 0;
  }

  const triangleDeltaX = elementRect.left - params.value.x;

  params.value.center = triangleDeltaX + elementRect.width / 2;

  document.querySelector("#app")?.addEventListener("scroll", onScroll);
});

onBeforeUnmount(() => {
  removeEventListener("scroll", onScroll);
});
</script>
