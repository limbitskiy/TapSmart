<template>
  <BackgroundPill class="progressbar flex flex-col rounded-xl gap-1 !py-2">
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
        <svg width="13" height="16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M2.075 10.612 6.6 16l4.524-5.388a6.106 6.106 0 0 0 1.656-2.788 5.923 5.923 0 0 0 0-3.201 6.125 6.125 0 0 0-1.664-2.796A6.261 6.261 0 0 0 8.246.211a6.537 6.537 0 0 0-3.293 0 6.26 6.26 0 0 0-2.87 1.616A6.125 6.125 0 0 0 .42 4.623a5.923 5.923 0 0 0 0 3.201 6.106 6.106 0 0 0 1.655 2.788Zm4.517-8.59c1.18 0 2.187.39 3.019 1.172.832.78 1.247 1.723 1.247 2.827 0 1.103-.415 2.043-1.247 2.818-.832.776-1.838 1.164-3.02 1.164-1.18 0-2.187-.388-3.018-1.164-.832-.775-1.248-1.715-1.248-2.819 0-1.103.416-2.045 1.248-2.826.831-.781 1.838-1.172 3.019-1.172Z"
            fill="#46C553"
          />
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
            d="M10.242 5.164 6 0 1.758 5.164A5.88 5.88 0 0 0 .207 7.836a5.8 5.8 0 0 0 0 3.07 5.9 5.9 0 0 0 1.56 2.679 5.838 5.838 0 0 0 2.69 1.549 6 6 0 0 0 3.087 0 5.838 5.838 0 0 0 2.69-1.55 5.899 5.899 0 0 0 1.56-2.679 5.8 5.8 0 0 0 0-3.069 5.88 5.88 0 0 0-1.552-2.672Zm-4.234 8.233c-1.107 0-2.05-.374-2.83-1.122-.78-.749-1.17-1.652-1.17-2.71 0-1.057.39-1.958 1.17-2.702.78-.743 1.723-1.115 2.83-1.115s2.05.372 2.83 1.115c.78.744 1.17 1.645 1.17 2.702 0 1.058-.39 1.961-1.17 2.71-.78.748-1.723 1.122-2.83 1.122Z"
            fill="#AFAFAF"
          />
          <circle cx="6" cy="8.996" r="4.67" transform="rotate(180 6 8.996)" fill="#AFAFAF" />
          <path
            d="M6.67 5.88c.8 0 1.376.133 1.73.4.36.267.503.677.43 1.23-.04.28-.13.523-.27.73a2.93 2.93 0 0 1-.48.55c-.187.167-.38.337-.58.51a4.356 4.356 0 0 0-.55.6 2.6 2.6 0 0 0-.39.82H4.92a2.98 2.98 0 0 1 .19-.84c.1-.253.216-.48.35-.68.14-.207.28-.39.42-.55.14-.16.263-.303.37-.43a1.6 1.6 0 0 0 .24-.33c.073-.153.08-.25.02-.29-.054-.04-.167-.06-.34-.06H4.04l.01-1.39.58-.11c.173-.033.353-.06.54-.08.186-.027.396-.047.63-.06.24-.013.53-.02.87-.02Zm-.8 5.27c.24 0 .423.063.55.19.133.127.183.317.15.57l-.06.41c-.027.233-.104.407-.23.52-.12.107-.307.16-.56.16h-.41c-.52 0-.754-.253-.7-.76l.06-.41c.06-.453.326-.68.8-.68h.4Z"
            fill="#000"
          />
        </svg>

        <!-- standart enemy icon -->
        <svg v-else width="12" height="16" viewBox="0 0 12 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M10.2417 5.16446L6 0.000128746L1.75828 5.16446C0.99935 5.92289 0.482131 6.81355 0.206628 7.83643C-0.0688759 8.85932 -0.0688759 9.88221 0.206628 10.9051C0.482131 11.928 1.00195 12.8211 1.76608 13.5846C2.53021 14.348 3.4269 14.8644 4.45614 15.1339C5.48538 15.4033 6.51462 15.4033 7.54386 15.1339C8.5731 14.8644 9.46979 14.348 10.2339 13.5846C10.9981 12.8211 11.5179 11.928 11.7934 10.9051C12.0689 9.88221 12.0689 8.85932 11.7934 7.83643C11.5179 6.81355 11.0006 5.92289 10.2417 5.16446ZM6.0078 13.3974C4.90058 13.3974 3.95711 13.0232 3.17739 12.2748C2.39766 11.5263 2.0078 10.6232 2.0078 9.56536C2.0078 8.50755 2.39766 7.60691 3.17739 6.86345C3.95711 6.11998 4.90058 5.74825 6.0078 5.74825C7.11501 5.74825 8.05848 6.11998 8.83821 6.86345C9.61793 7.60691 10.0078 8.50755 10.0078 9.56536C10.0078 10.6232 9.61793 11.5263 8.83821 12.2748C8.05848 13.0232 7.11501 13.3974 6.0078 13.3974Z"
            :fill="getMarkerColor(enemy.id)"
          />
          <circle cx="4.6697" cy="4.6697" r="4.6697" transform="matrix(-1 -8.74228e-08 -8.74228e-08 1 10.6699 4.66992)" :fill="getMarkerColor(enemy.id)" />
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
