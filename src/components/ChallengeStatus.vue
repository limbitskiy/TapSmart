<template>
  <BackgroundPill id="challenge-statusbar" class="flex !flex-row rounded-xl gap-4 items-center justify-between exo-black !py-2">
    <!-- bolts amount -->
    <div class="bolts flex items-baseline gap-2">
      <div class="multiplier text-sm" :style="{ color: multiplierColor }">{{ "x" + Math.round(currentCalcPoint) }}</div>
      <span class="text-xl w-1/2 text-center">{{ Math.round(score) || 0 }}</span>
    </div>

    <!-- timer -->
    <div class="timer flex text-4xl">
      <span>{{ formattedTime(time) ?? "00:00" }}</span>
    </div>

    <!-- place -->
    <div class="place flex items-center gap-2">
      <img class="h-4 scale-150" :src="getAsset('cup')" />
      <span class="text-xl">{{ playerPosition[0] + "/" + playerPosition[1] }}</span>
    </div>
  </BackgroundPill>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { getAsset } from "@/utils";
import { storeToRefs } from "pinia";
import { formattedTime } from "@/utils";

// stores
import { useDataStore } from "@/store/data";

const props = defineProps<{
  time: number;
}>();

const dataStore = useDataStore();

const { data, challengeScore: score, currentCalcPoint } = storeToRefs(dataStore.battles);

const el = ref();

const multiplierColor = computed(() => {
  playMultAnimation();
  const mult = currentCalcPoint.value;
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

const playerPosition = computed(() => {
  if (!data.value?.["player_progress"]?.length) return [0, 0];

  const clone = [...data.value["player_progress"]];

  const playersSorted = clone?.sort((a, b) => b.score - a.score);

  return [playersSorted?.findIndex((player) => player.isPlayer) + 1 || data.value?.["player_progress"].length, data.value?.["player_progress"].length];
});

const playMultAnimation = () => {
  if (el.value) {
    el.value.animate([{ transform: "scale(1.8)" }, { transform: "scale(1)" }], 500);
  }
};
</script>
