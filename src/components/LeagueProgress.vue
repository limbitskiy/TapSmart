<template>
  <div class="league-progress flex flex-col gap-1" @click="onProgressClick">
    <div class="top flex items-baseline justify-between">
      <slot name="leagueName">
        <span class="text-sm text-nowrap">{{ profile?.["league_name"] }}</span>
      </slot>
      <span class="text-[10px] text-gray-300">{{ profile?.["league_progress"] }}%</span>
    </div>
    <div class="bottom">
      <div class="progressbar h-[5px] w-full rounded-full relative" :class="grey ? grey : 'bg-[var(--grey-light)]'">
        <!-- <div
          v-for="item in 7"
          class="separator h-[9px] w-[2px] bg-[var(--grey-dark)] absolute"
          :style="`left: ${item * 12.5}%`"
        ></div> -->
        <div class="value h-[5px] bg-gradient-to-r from-[#408CFF] to-[#894899] rounded-l-full" :style="`width: ${profile?.['league_progress']}%`">
          <div v-for="item in 7" class="separator h-[7px] w-[2px] bg-[var(--grey-dark)] absolute" :style="`left: ${item * 12.5}%`"></div>

          <div :class="`marker w-[3px] h-[7px] bg-[var(--accent-color)] absolute -top-[1px] rounded-full`" :style="`left: ${profile?.['league_progress']}%`"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { storeToRefs } from "pinia";

// store
import { useMainStore } from "@/store/main";
import { useDataStore } from "@/store/data";
import { useLocaleStore } from "@/store/locale";

const mainStore = useMainStore();
const dataStore = useDataStore();
const localeStore = useLocaleStore();

const { showTooltip } = mainStore;
const { profile, battles } = storeToRefs(dataStore);
const { profile: profileLocale, battles: battleLocale } = storeToRefs(localeStore);

defineProps<{
  grey?: string;
}>();

const onProgressClick = (event: MouseEvent) => {
  showTooltip({
    element: event.target,
    text: profileLocale.value?.["tooltip_league"],
  });
};
</script>
