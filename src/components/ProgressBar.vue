<template>
  <div class="progressbar flex flex-col gap-1">
    <div class="enemy-markers relative h-4">
      <div v-for="enemy in enemies" :key="enemy.id" class="marker absolute" :style="{ transform: `translateX(${calculateMarkerPosition(enemy.score)}px)` }">
        <svg width="12" height="16" viewBox="0 0 12 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M10.2417 10.1715L6 15.3358L1.75828 10.1715C0.99935 9.41305 0.482131 8.52239 0.206628 7.4995C-0.0688759 6.47662 -0.0688759 5.45373 0.206628 4.43084C0.482131 3.40796 1.00195 2.5148 1.76608 1.75138C2.53021 0.987958 3.4269 0.471526 4.45614 0.202082C5.48538 -0.0673608 6.51462 -0.0673608 7.54386 0.202082C8.5731 0.471526 9.46979 0.987958 10.2339 1.75138C10.9981 2.5148 11.5179 3.40796 11.7934 4.43084C12.0689 5.45373 12.0689 6.47662 11.7934 7.4995C11.5179 8.52239 11.0006 9.41305 10.2417 10.1715ZM6.0078 1.93849C4.90058 1.93849 3.95712 2.31272 3.17739 3.06117C2.39766 3.80963 2.0078 4.71276 2.0078 5.77058C2.0078 6.82839 2.39766 7.72903 3.17739 8.47249C3.95712 9.21596 4.90058 9.58769 6.0078 9.58769C7.11501 9.58769 8.05848 9.21596 8.83821 8.47249C9.61793 7.72903 10.0078 6.82839 10.0078 5.77058C10.0078 4.71276 9.61793 3.80963 8.83821 3.06117C8.05848 2.31272 7.11501 1.93849 6.0078 1.93849Z"
            :fill="getMarkerColor(enemy.id)"
          />
          <circle cx="6.00022" cy="5.99632" r="4.6697" transform="rotate(180 6.00022 5.99632)" :fill="getMarkerColor(enemy.id)" />
        </svg>
      </div>
    </div>
    <div class="gauge h-2 bg-[var(--grey-light)] rounded-full w-full">
      <div ref="progressRef" class="gauge-value h-2 bg-[var(--accent-color)] rounded-full" :style="{ width: progressPercent + '%' }"></div>
    </div>
    <div class="player-marker mt-2">
      <div class="marker w-[14px]" :style="{ transform: `translateX(${calculateMarkerPosition(player.score)}px)` }">
        <img class="h-4 scale-[2]" :src="getAsset('player-marker')" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed } from "vue";
import { storeToRefs } from "pinia";
import { getAsset } from "../utils";

// stores
import { useDataStore } from "@/store/data";
import { useMainStore } from "@/store/main";
import { useLocaleStore } from "@/store/locale";

const props = defineProps<{
  timer: number;
  initialTimerValue: number;
}>();

const colors = {
  0: "F01515",
  1: "519A58",
  2: "FEEB3E",
  3: "A142EC",
  4: "3C4FF9",
  5: "FFFFFF",
  6: "24CAFF",
};

const dataStore = useDataStore();
const mainStore = useMainStore();
const localeStore = useLocaleStore();

const { battles: data } = storeToRefs(dataStore);
const { battles: locale } = storeToRefs(localeStore);

const progressRef = ref();

const player = computed(() => data.value["player_progress"]?.find((player) => player.isPlayer));

const enemies = computed(() => data.value["player_progress"]?.filter((player) => !player.isPlayer));

const highestScore = computed(() => data.value["player_progress"]?.sort((a, b) => b.score - a.score)[0].score);

const progressPercent = computed(() => ((props.initialTimerValue - props.timer) * 100) / props.initialTimerValue);

const calculateMarkerPosition = (score) => {
  const progressBarWidth = progressRef.value?.getBoundingClientRect().width;

  if (score === highestScore.value) {
    return progressBarWidth;
  }

  const percent = (score * 100) / highestScore.value;

  return (percent * progressBarWidth) / 100;
};

const getMarkerColor = (id: string) => {
  return "#" + colors[+id];
};
</script>
