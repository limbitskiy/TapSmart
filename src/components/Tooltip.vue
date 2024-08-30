<template>
  <div
    ref="el"
    class="tooltip absolute z-[5] bg-[#535353] border border-[#4b4b4b] p-4 rounded-xl text-sm w-max"
    :style="{ top: `${params.y}px`, left: `${params.x}px` }"
    style="transform: translateX(-50%); max-width: 70vw"
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

const el = ref();

const { left: parentLeft, width: parentWidth, height: parentHeight } = tooltip.value.parent.getBoundingClientRect();

const params = ref({
  x: parentLeft + parentWidth / 2,
  y: tooltip.value.parent.offsetTop,
  center: 0,
  position: tooltip.value.position || "top",
});

const onClick = () => {
  hideTooltip();
};

onMounted(() => {
  const { height, width } = el.value.getBoundingClientRect();

  if (params.value.y - height < window.scrollY) {
    params.value.y = params.value.y + parentHeight + 10;
    params.value.position = "bottom";
  } else {
    params.value.y = params.value.y - height - 10;
  }

  params.value.center = width / 2;
});
</script>
