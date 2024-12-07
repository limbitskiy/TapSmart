<template>
  <BackgroundPill class="progressbar flex flex-col rounded-xl gap-1 !pt-2 !pb-3">
    <!-- enemies -->
    <div class="enemy-markers relative h-4">
      <div
        v-for="enemy in computedEnemies"
        :key="enemy?.id"
        class="marker absolute"
        :style="{
          transform: `translateX(${getEnemyPosition(enemy)}px)`,
          transition: '1s linear',
        }"
      >
        <!-- unknown enemy icon -->
        <svg v-if="enemy.id === 999" width="12" height="16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M10.242 10.171 6 15.337 1.758 10.17A5.88 5.88 0 0 1 .207 7.5a5.8 5.8 0 0 1 0-3.07 5.899 5.899 0 0 1 1.56-2.679A5.837 5.837 0 0 1 4.456.202a5.998 5.998 0 0 1 3.087 0c1.03.27 1.926.786 2.69 1.55a5.898 5.898 0 0 1 1.56 2.679 5.8 5.8 0 0 1 0 3.069 5.88 5.88 0 0 1-1.552 2.671ZM6.008 1.938c-1.107 0-2.05.375-2.83 1.123-.78.749-1.17 1.652-1.17 2.71 0 1.057.39 1.958 1.17 2.701.78.744 1.723 1.116 2.83 1.116s2.05-.372 2.83-1.116c.78-.743 1.17-1.644 1.17-2.701 0-1.058-.39-1.961-1.17-2.71-.78-.748-1.723-1.123-2.83-1.123Z"
            fill="#AFAFAF"
          />
          <circle cx="6" cy="5.996" r="4.67" transform="rotate(180 6 5.996)" fill="#AFAFAF" />
          <path
            d="M6.67 2.88c.8 0 1.376.133 1.73.4.36.267.503.677.43 1.23-.04.28-.13.523-.27.73a2.93 2.93 0 0 1-.48.55c-.187.167-.38.337-.58.51a4.356 4.356 0 0 0-.55.6 2.6 2.6 0 0 0-.39.82H4.92c.026-.307.09-.587.19-.84s.216-.48.35-.68c.14-.207.28-.39.42-.55.14-.16.263-.303.37-.43a1.6 1.6 0 0 0 .24-.33c.073-.153.08-.25.02-.29-.054-.04-.167-.06-.34-.06H4.04l.01-1.39.58-.11c.173-.033.353-.06.54-.08.186-.027.396-.047.63-.06.24-.013.53-.02.87-.02Zm-.8 5.27c.24 0 .423.063.55.19.133.127.183.317.15.57l-.06.41c-.027.233-.104.407-.23.52-.12.107-.307.16-.56.16h-.41c-.52 0-.754-.253-.7-.76l.06-.41c.06-.453.326-.68.8-.68h.4Z"
            fill="#000"
          />
        </svg>

        <!-- standart enemy icon -->
        <svg v-else width="12" height="16" viewBox="0 0 12 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M10.2417 10.1715L6 15.3358L1.75828 10.1715C0.99935 9.41305 0.482131 8.52239 0.206628 7.4995C-0.0688759 6.47662 -0.0688759 5.45373 0.206628 4.43084C0.482131 3.40796 1.00195 2.5148 1.76608 1.75138C2.53021 0.987958 3.4269 0.471526 4.45614 0.202082C5.48538 -0.0673608 6.51462 -0.0673608 7.54386 0.202082C8.5731 0.471526 9.46979 0.987958 10.2339 1.75138C10.9981 2.5148 11.5179 3.40796 11.7934 4.43084C12.0689 5.45373 12.0689 6.47662 11.7934 7.4995C11.5179 8.52239 11.0006 9.41305 10.2417 10.1715ZM6.0078 1.93849C4.90058 1.93849 3.95711 2.31272 3.17739 3.06117C2.39766 3.80963 2.0078 4.71276 2.0078 5.77058C2.0078 6.82839 2.39766 7.72903 3.17739 8.47249C3.95711 9.21596 4.90058 9.58769 6.0078 9.58769C7.11501 9.58769 8.05848 9.21596 8.83821 8.47249C9.61793 7.72903 10.0078 6.82839 10.0078 5.77058C10.0078 4.71276 9.61793 3.80963 8.83821 3.06117C8.05848 2.31272 7.11501 1.93849 6.0078 1.93849Z"
            :fill="getMarkerColor(enemy.id)"
          />
          <circle cx="6.00022" cy="5.99632" r="4.6697" transform="rotate(180 6.00022 5.99632)" :fill="getMarkerColor(enemy.id)" />
        </svg>
      </div>
    </div>

    <!-- main progress -->
    <div ref="gaugeRef" class="gauge h-[12px] p-[2px] bg-black rounded-[11px] w-full">
      <div
        ref="progressRef"
        class="gauge-value h-full rounded-[11px]"
        :style="{
          width: progressBarValue + '%',
          transition: '1s linear',
          background: `linear-gradient(180deg, hsl(${hslDegree}deg 98.97% 61.96%) 0%, #ffffff 10%, hsl(${hslDegree}deg 98.97% 61.96%) 50%,hsl(${hslDegree}deg 98.97% 61.96%) 100%)`,
        }"
      ></div>
      <!-- <span>{{ progressPercent }}</span> -->
    </div>

    <!-- player -->
    <div class="player-marker-cnt h-4">
      <div
        class="marker w-[14px]"
        :style="{
          transform: `translateX(${computedPlayerProgress - 7}px)`,
          transition: '1s linear',
        }"
      >
        <!-- <img class="h-4 scale-[1.4]" src="/player-marker.webp" /> -->
        <svg width="16" height="20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M13.357 6.735 7.825 0 2.293 6.735A7.669 7.669 0 0 0 .269 10.22a7.564 7.564 0 0 0 0 4.002 7.693 7.693 0 0 0 2.034 3.494 7.613 7.613 0 0 0 3.508 2.02 7.825 7.825 0 0 0 4.027 0 7.613 7.613 0 0 0 3.508-2.02 7.692 7.692 0 0 0 2.034-3.494 7.564 7.564 0 0 0 0-4.002 7.669 7.669 0 0 0-2.023-3.485ZM7.835 17.472c-1.444 0-2.674-.488-3.691-1.464s-1.526-2.154-1.526-3.534.509-2.554 1.526-3.523C5.16 7.98 6.39 7.496 7.835 7.496s2.674.485 3.691 1.455c1.017.97 1.526 2.144 1.526 3.523 0 1.38-.509 2.558-1.526 3.534s-2.247 1.464-3.691 1.464Z"
            fill="#75EB3F"
          />
          <circle cx="6.09" cy="6.09" r="6.09" transform="matrix(-1 0 0 1 13.915 6.09)" fill="#75EB3F" />
        </svg>
      </div>
    </div>
  </BackgroundPill>

  <!-- debug -->
  <!-- <div class="debug flex flex-1 items-center justify-between">
    <div class="player flex flex-col">
      <span class="text-sm">Player score: {{ Math.round(computedPlayer?.score) }}</span>
      <span class="text-sm">Player progress: {{ Math.round(computedPlayer?.progress) }}</span>
    </div>
    <div class="enemy flex flex-col">
      <span class="text-sm">Enemy score: {{ Math.round(computedEnemies[0]?.score) }}</span>
      <span class="text-sm">Enemy progress: {{ Math.round(computedEnemies[0]?.progress) }}</span>
    </div>
  </div> -->
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed, onUpdated } from "vue";
import { storeToRefs } from "pinia";
import { getAsset } from "../utils";

// stores
import { useMainStore } from "@/store/main";

const props = defineProps<{
  timer?: number;
  battleDuration: number;
  progressBarValue: number;
  playersProgress: [] | undefined;
}>();

const colors = {
  0: "F01515",
  1: "519A58",
  2: "FEEB3E",
  3: "A142EC",
  4: "3C4FF9",
  5: "FFFFFF",
  6: "24CAFF",
  999: "dfe0df",
};

const gaugeRef = ref();
const progressRef = ref();

const positions = ref([]);

const coef = computed(() => gaugeRef.value?.getBoundingClientRect()?.width / (props.battleDuration / 1000));
const computedPlayer = computed(() => positions.value.find((position) => position?.isPlayer));
const computedEnemies = computed(() => {
  if (positions.value?.length) {
    return positions.value.filter((player) => !player?.isPlayer);
  } else return [{ id: 999, progress: 0 }];
});

const computedPlayerProgress = computed(() => {
  if (!coef.value || !computedPlayer.value) return 0;
  return computedPlayer.value?.progress * coef.value;
});

const getEnemyPosition = (enemy) => {
  if (!coef.value) return -6;
  return enemy?.progress * coef.value - 6;
};

const getMarkerColor = (id: string) => {
  return "#" + colors[+id];
};

const hslDegree = ref(35);

const calculatePlayerPositions = () => {
  const players = props.playersProgress;

  if (!players) return;

  const highestScore = players.sort((a, b) => b.score - a.score)[0].score;
  const secId = (props.battleDuration - props.timer) / 1000;

  players.forEach((player) => {
    let playerPosition = positions.value.find((position) => position?.id === player?.id);

    // if we don't have the position locally - create it
    if (!playerPosition) {
      positions.value.push({ ...player, progress: 0 });
      playerPosition = positions.value.find((position) => position?.id === player?.id);
    }

    if (player.score === 0) return;

    if (player.score === highestScore) {
      playerPosition.progress = secId;
      playerPosition.score = player.score;
      return;
    }

    // X_new = X + (S_new - S) / (S_leader_new - S) * (Sec_id - X)
    playerPosition.progress += ((player.score - playerPosition.score) / (highestScore - playerPosition.score)) * (secId - playerPosition.progress);
    playerPosition.score = player.score;
  });
};

onUpdated(() => {
  // console.log(`change`);
  calculatePlayerPositions();

  if (props.timer < 15000 && hslDegree.value > 0) {
    hslDegree.value -= 1;
  }
});

// onMounted(() => {
//   // console.log(`mounted`);
//   calculatePlayerPositions();
// });
</script>
