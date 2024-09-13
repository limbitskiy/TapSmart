<template>
  <div class="challenge-statusbar flex items-center justify-center exo-black">
    <div class="bolts flex items-center gap-2 px-4 bg-[var(--grey-light)] rounded-l-full py-1 relative -right-2 z-[2] w-[100px]">
      <div ref="el" class="multiplier rounded-full !w-[20px] h-[20px] grid place-items-center">
        <div class="mult-value text-sm" :style="{ color: multiplierColor }">{{ "x" + Math.round(multiplier) }}</div>
      </div>
      <span class="text-lg w-1/2 text-center">{{ Math.round(score) || 0 }}</span>
    </div>
    <div class="timer w-[123px] flex px-4 py-1 bg-[var(--accent-color)] text-[#444] text-[32px] rounded-full z-[5]" style="line-height: 45px">
      <div class="timer-value">
        <span>{{ "00:" + formattedTime }}</span>
      </div>
    </div>
    <div class="place flex items-center gap-2 px-4 bg-[var(--grey-light)] rounded-r-full py-1 relative -left-2 z-[2]">
      <img class="h-4 scale-150" :src="getAsset('cup')" />
      <span class="text-lg">{{ place[0] + "/" + place[1] }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { getAsset } from "@/utils";

const props = defineProps<{
  time: number;
  score: number;
  multiplier: number;
  place: number[];
}>();

const el = ref();

const multiplierColor = computed(() => {
  playMultAnimation();
  const mult = props.multiplier;
  if (mult <= 3) {
    return "#28ad28";
  } else if (mult > 3 && mult <= 8) {
    return "#e5ba39";
  } else if (mult > 8 && mult <= 12) {
    return "#da4848";
  } else if (mult > 12) {
    return "#d948da";
  }
});

const playMultAnimation = () => {
  if (el.value) {
    el.value.animate([{ transform: "scale(1.8)" }, { transform: "scale(1)" }], 500);
  }
};

const formattedTime = computed(() => {
  if (props.time > 9000) {
    return props.time / 1000;
  } else {
    return "0" + props.time / 1000;
  }
});
</script>
