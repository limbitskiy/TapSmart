<template>
  <div class="profile-widget flex items-center z-10 relative">
    <div class="avatar-cnt w-[35px] h-full">
      <div
        class="avatar w-[90px] h-[90px] rounded-full overflow-hidden border-[var(--grey-light)] border-4 absolute bottom-0"
        @click="$router.push(`/profile?from=${$route.path}`)"
      >
        <div class="gray-bg absolute inset-0 bg-[var(--grey-dark)] z-[1] grid place-items-center">
          <img class="h-4 scale-[2]" :src="getAsset('loader')" />
        </div>
        <img v-if="profileData.avatar" class="relative z-[2]" :src="profileData.avatar" />
        <img v-else class="z-[2]" :src="getAsset('avatar1')" />
      </div>
    </div>

    <!-- league & boost -->
    <div class="data flex-1 flex flex-col bg-[var(--grey-dark)] rounded-xl">
      <div class="top flex">
        <div class="margin w-[55px]"></div>
        <div class="top-content flex items-center gap-4 justify-between p-2 flex-1">
          <div class="league-progress flex-1">
            <LeagueProgress />
          </div>
          <Button class="boost-btn !py-[2px] !px-3 !rounded-lg bg-gradient-to-r from-[#408CFF] to-[#894899]" :data="battleData?.data?.['button_boost']">
            <span class="text-base text-gray-200">{{ battleLocale?.["button_boost"] || "Boost" }}</span>
          </Button>
        </div>
      </div>

      <!-- stats -->
      <div class="bottom grid grid-cols-[3fr_2fr_2fr] bg-[var(--grey-light)] py-1 rounded-xl pl-[55px]">
        <!-- bolts -->
        <div class="bolts flex-1 flex items-center gap-1 relative justify-center">
          <img class="h-4" :src="getAsset('bolt')" />
          <span data-locale="profile.tooltip_bolts" class="exo-bold text-[var(--accent-color)]" @click="onTooltip">{{ shortenNumber(profileData?.["bolts"]) ?? 0 }}</span>
          <div class="separator h-[10px] w-[1px] bg-gray-500 absolute -right-1 mt-[2px]"></div>
        </div>

        <!-- nuts -->
        <div class="nuts flex-1 flex items-center gap-1 relative justify-center">
          <img class="h-4" :src="getAsset('nut')" />
          <span data-locale="profile.tooltip_nuts" class="exo-bold" @click="onTooltip">{{ profileData?.["nuts"] ?? 0 }}</span>
          <div class="separator h-[10px] w-[1px] bg-gray-500 absolute -right-1 mt-[2px]"></div>
        </div>

        <!-- energy -->
        <div class="energy flex items-center gap-1 justify-center">
          <img class="h-4" :src="getAsset('energy')" />
          <span data-locale="battle.tooltip_energy" class="exo-bold" @click="onTooltip">{{ battleData?.data?.["energy"] ?? 0 }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { watch, ref } from "vue";
import { storeToRefs } from "pinia";
import { getAsset, shortenNumber } from "@/utils";

// stores
import { useMainStore } from "@/store/main";

const store = useMainStore();

const { showTooltip } = store;
const { profile: profileData, battles: battleData } = storeToRefs(store.dataStore);
const { profile: profileLocale, battles: battleLocale } = storeToRefs(store.localeStore);

const onTooltip = (event: MouseEvent) => {
  const locales = {
    profile: profileLocale.value,
    battle: battleLocale.value,
  };

  const localeKey = event.target.dataset.locale.split(".")[0];
  const localeValue = event.target.dataset.locale.split(".")[1];

  showTooltip({
    element: event.target,
    text: locales[localeKey][localeValue],
  });
};
</script>
