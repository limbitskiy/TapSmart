<template>
  <div class="profile-widget mx-4 mt-6 flex items-center z-10">
    <div class="avatar-cnt w-[35px] h-full relative">
      <div class="avatar w-[90px] h-[90px] rounded-full overflow-hidden border-[var(--grey-light)] border-4 absolute bottom-0">
        <img class="w-[90px] h-[90px]" :src="getAsset('avatar1')" />
      </div>
    </div>
    <div class="data flex-1 flex flex-col bg-[var(--grey-dark)] rounded-xl">
      <div class="top flex">
        <div class="margin w-[55px]"></div>
        <div class="top-content flex items-center gap-4 justify-between p-2 flex-1">
          <div class="league-progress flex-1">
            <LeagueProgress />
          </div>
          <Button class="!py-[2px] !px-3 !rounded-lg">
            <span class="text-base exo-black text-[#333]">Boost</span>
          </Button>
        </div>
      </div>
      <div class="bottom grid grid-cols-3 bg-[var(--grey-light)] py-1 rounded-xl pl-[55px]">
        <div class="bolts flex-1 flex items-center gap-1 relative justify-center">
          <img class="h-4" :src="getAsset('bolt')" />
          <span class="exo-black text-[var(--accent-color)]">175K</span>
          <div class="separator h-[10px] w-[1px] bg-gray-500 absolute -right-1 mt-[2px]"></div>
        </div>
        <div class="nuts flex-1 flex items-center gap-1 relative justify-center">
          <img class="h-4" :src="getAsset('nut')" />
          <span class="exo-black">110</span>
          <div class="separator h-[10px] w-[1px] bg-gray-500 absolute -right-1 mt-[2px]"></div>
        </div>
        <div class="energy flex items-center gap-1 justify-center">
          <img class="h-4" :src="getAsset('energy')" />
          <span class="exo-black">10</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { watch, ref } from "vue";
import { storeToRefs } from "pinia";
import { getAsset, showFormattedNumber } from "@/utils";

// stores
import { useDataStore } from "@/store/data";
import { useLocaleStore } from "@/store/locale";

// components
import Button from "@/components/UI/Button.vue";
import LeagueProgress from "@/components/LeagueProgress.vue";

const dataStore = useDataStore();
const localeStore = useLocaleStore();

const { profile: data, battles } = storeToRefs(dataStore);
const { profile: locale } = storeToRefs(localeStore);
const { energy } = storeToRefs(dataStore.battles);

// const energyRef = ref();

// watch(energy, (val, oldVal) => {
//   if (val !== oldVal) {
//     animateEnergy();
//   }
// });

// const animateEnergy = () => {
//   if (energyRef.value) {
//     energyRef.value.animate([{ transform: "scale(1.8)" }, { transform: "scale(1)" }], 500);
//   }
// };
</script>
