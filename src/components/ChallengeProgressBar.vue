<template>
  <BackgroundPill class="progressbar flex flex-col rounded-xl gap-1 !py-4">
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
        <svg v-if="enemy.id === 999" width="12" height="16" viewBox="0 0 12 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M10.2417 10.1715L6 15.3358L1.75828 10.1715C0.99935 9.41305 0.482131 8.52239 0.206628 7.4995C-0.0688759 6.47662 -0.0688759 5.45373 0.206628 4.43084C0.482131 3.40796 1.00195 2.5148 1.76608 1.75138C2.53021 0.987958 3.4269 0.471526 4.45614 0.202082C5.48538 -0.0673608 6.51462 -0.0673608 7.54386 0.202082C8.5731 0.471526 9.46979 0.987958 10.2339 1.75138C10.9981 2.5148 11.5179 3.40796 11.7934 4.43084C12.0689 5.45373 12.0689 6.47662 11.7934 7.4995C11.5179 8.52239 11.0006 9.41305 10.2417 10.1715ZM6.0078 1.93849C4.90058 1.93849 3.95712 2.31272 3.17739 3.06117C2.39766 3.80963 2.0078 4.71276 2.0078 5.77058C2.0078 6.82839 2.39766 7.72903 3.17739 8.47249C3.95712 9.21596 4.90058 9.58769 6.0078 9.58769C7.11501 9.58769 8.05848 9.21596 8.83821 8.47249C9.61793 7.72903 10.0078 6.82839 10.0078 5.77058C10.0078 4.71276 9.61793 3.80963 8.83821 3.06117C8.05848 2.31272 7.11501 1.93849 6.0078 1.93849Z"
            fill="#AFAFAF"
          />
          <circle cx="6.00022" cy="5.99632" r="4.6697" transform="rotate(180 6.00022 5.99632)" fill="#AFAFAF" />
          <path
            d="M6.6698 2.88C7.4698 2.88 8.04647 3.01333 8.39981 3.28C8.7598 3.54667 8.90314 3.95667 8.82981 4.51C8.78981 4.79 8.69981 5.03333 8.5598 5.24C8.42647 5.44 8.26647 5.62333 8.0798 5.79C7.89314 5.95667 7.6998 6.12667 7.4998 6.3C7.30647 6.47333 7.12314 6.67333 6.9498 6.9C6.78314 7.12667 6.65314 7.4 6.5598 7.72H4.9198C4.94647 7.41333 5.0098 7.13333 5.1098 6.88C5.2098 6.62667 5.32647 6.4 5.4598 6.2C5.5998 5.99333 5.7398 5.81 5.8798 5.65C6.0198 5.49 6.14314 5.34667 6.2498 5.22C6.36314 5.09333 6.44314 4.98333 6.4898 4.89C6.56314 4.73667 6.5698 4.64 6.5098 4.6C6.45647 4.56 6.34314 4.54 6.1698 4.54C5.8098 4.54 5.51647 4.54 5.2898 4.54C5.06314 4.54 4.85647 4.54 4.6698 4.54C4.48314 4.54 4.27314 4.54 4.0398 4.54L4.0498 3.15C4.26314 3.11 4.45647 3.07333 4.6298 3.04C4.80314 3.00667 4.98314 2.98 5.1698 2.96C5.35647 2.93333 5.56647 2.91333 5.7998 2.9C6.0398 2.88667 6.3298 2.88 6.6698 2.88ZM5.8698 8.15C6.1098 8.15 6.29314 8.21333 6.4198 8.34C6.55314 8.46667 6.60314 8.65667 6.5698 8.91L6.5098 9.32C6.48314 9.55333 6.40647 9.72667 6.2798 9.84C6.1598 9.94667 5.97314 10 5.7198 10H5.3098C4.7898 10 4.55647 9.74667 4.6098 9.24L4.6698 8.83C4.7298 8.37667 4.99647 8.15 5.4698 8.15H5.8698Z"
            fill="black"
          />
        </svg>

        <!-- standart enemy icon -->
        <svg v-else width="12" height="16" viewBox="0 0 12 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M10.2417 10.1715L6 15.3358L1.75828 10.1715C0.99935 9.41305 0.482131 8.52239 0.206628 7.4995C-0.0688759 6.47662 -0.0688759 5.45373 0.206628 4.43084C0.482131 3.40796 1.00195 2.5148 1.76608 1.75138C2.53021 0.987958 3.4269 0.471526 4.45614 0.202082C5.48538 -0.0673608 6.51462 -0.0673608 7.54386 0.202082C8.5731 0.471526 9.46979 0.987958 10.2339 1.75138C10.9981 2.5148 11.5179 3.40796 11.7934 4.43084C12.0689 5.45373 12.0689 6.47662 11.7934 7.4995C11.5179 8.52239 11.0006 9.41305 10.2417 10.1715ZM6.0078 1.93849C4.90058 1.93849 3.95712 2.31272 3.17739 3.06117C2.39766 3.80963 2.0078 4.71276 2.0078 5.77058C2.0078 6.82839 2.39766 7.72903 3.17739 8.47249C3.95712 9.21596 4.90058 9.58769 6.0078 9.58769C7.11501 9.58769 8.05848 9.21596 8.83821 8.47249C9.61793 7.72903 10.0078 6.82839 10.0078 5.77058C10.0078 4.71276 9.61793 3.80963 8.83821 3.06117C8.05848 2.31272 7.11501 1.93849 6.0078 1.93849Z"
            :fill="getMarkerColor(enemy.id)"
          />
          <circle cx="6.00022" cy="5.99632" r="4.6697" transform="rotate(180 6.00022 5.99632)" :fill="getMarkerColor(enemy.id)" />
        </svg>
      </div>
    </div>

    <!-- main progress -->
    <div ref="gaugeRef" class="gauge h-2 bg-[var(--grey-light)] rounded-full w-full">
      <div ref="progressRef" class="gauge-value h-2 bg-[var(--accent-color)] rounded-full" :style="{ width: progressBarValue + '%', transition: '1s linear' }"></div>
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
        <img class="h-4 scale-[1.4]" :src="getAsset('player-marker')" />
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
  playersProgress: [];
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
});

// onMounted(() => {
//   // console.log(`mounted`);
//   calculatePlayerPositions();
// });
</script>
