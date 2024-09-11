<template>
  <div class="challenge-statusbar flex items-center justify-center exo-black">
    <div class="bolts flex items-center gap-2 px-4 bg-[var(--grey-light)] rounded-l-full py-1 relative -right-2 z-[2] w-[80px]">
      <!-- <img class="h-4" :src="getAsset('bolt')" /> -->
      <span class="text-lg w-full text-center">{{ score || 0 }}</span>
    </div>
    <div class="timer w-[125px] flex px-4 py-1 bg-[var(--accent-color)] text-[#444] text-[32px] rounded-full z-[5]">
      <div class="timer">
        <span>{{ "00:" + formattedTime }}</span>
      </div>
      <!-- <CountdownTimer :initValue="60000" /> -->
    </div>
    <div class="place flex items-center gap-2 px-4 bg-[var(--grey-light)] rounded-r-full py-1 relative -left-2 z-[2]">
      <img class="h-4 scale-150" :src="getAsset('cup')" />
      <span class="text-lg">{{ place }}/5</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { getAsset } from "@/utils";

// components
import CountdownTimer from "@/components/CountdownTimer.vue";

const props = defineProps<{
  time: number;
  score: number;
}>();

const boltsEarned = ref(0);
const place = ref(2);

const formattedTime = computed(() => {
  if (props.time > 9000) {
    return props.time / 1000;
  } else {
    return "0" + props.time / 1000;
  }
});
</script>
