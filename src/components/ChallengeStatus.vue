<template>
  <BackgroundPill id="challenge-statusbar" class="flex !flex-row rounded-xl gap-4 items-center justify-between !py-2">
    <!-- bolts amount -->
    <div class="bolts flex items-center gap-2 fira-bold pt-1">
      <div class="multiplier text-sm" :style="{ color: multiplierColor }">{{ "x" + Math.round(calculateCalcPoint()) }}</div>
      <span class="text-xl w-1/2 text-center">{{ Math.round(score) || 0 }}</span>
    </div>

    <!-- timer -->
    <div class="timer flex text-4xl fira-bold">
      <div class="timer flex items-center gap-2 justify-center">
        <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M12.5 25C10.0277 25 7.61099 24.2669 5.55538 22.8934C3.49976 21.5199 1.89761 19.5676 0.951511 17.2835C0.00541604 14.9995 -0.242126 12.4861 0.24019 10.0614C0.722505 7.63661 1.91301 5.40933 3.66117 3.66117C5.40933 1.91301 7.63661 0.722505 10.0614 0.24019C12.4861 -0.242126 14.9995 0.00541604 17.2835 0.951511C19.5676 1.89761 21.5199 3.49976 22.8934 5.55538C24.2669 7.61099 25 10.0277 25 12.5C25 15.8152 23.683 18.9946 21.3388 21.3388C18.9946 23.683 15.8152 25 12.5 25ZM12.5 1.78572C10.3809 1.78572 8.30942 2.4141 6.54747 3.5914C4.78551 4.7687 3.41223 6.44205 2.6013 8.39982C1.79036 10.3576 1.57818 12.5119 1.99159 14.5903C2.405 16.6686 3.42544 18.5777 4.92386 20.0761C6.42228 21.5746 8.33138 22.595 10.4098 23.0084C12.4881 23.4218 14.6424 23.2096 16.6002 22.3987C18.558 21.5878 20.2313 20.2145 21.4086 18.4525C22.5859 16.6906 23.2143 14.6191 23.2143 12.5C23.2143 9.6584 22.0855 6.93318 20.0761 4.92386C18.0668 2.91454 15.3416 1.78572 12.5 1.78572Z"
            fill="#C0C0C0"
          />
          <path d="M16.5982 17.8557L11.6072 12.8647V4.46289H13.3929V12.1236L17.8572 16.5968L16.5982 17.8557Z" fill="#C0C0C0" />
        </svg>
        <span class="">{{ formattedTime(timer) ?? "00:00" }}</span>
      </div>
    </div>

    <!-- place -->
    <div class="place flex items-center gap-2 fira-bold">
      <img class="h-4 scale-150" src="/cup.webp" />
      <span class="text-xl pt-[5px]">{{ position[0] + "/" + position[1] }}</span>
    </div>
  </BackgroundPill>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { getAsset } from "@/utils";
import { storeToRefs } from "pinia";
import { formattedTime } from "@/utils";

// stores
import { useMainStore } from "@/store/main";

const props = defineProps<{
  timer?: number;
  score: number;
  position: [];
}>();

const store = useMainStore();

const { calculateCalcPoint } = store.battleStore;

const el = ref();

const multiplierColor = computed(() => {
  playMultAnimation();
  const mult = calculateCalcPoint();

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
</script>
