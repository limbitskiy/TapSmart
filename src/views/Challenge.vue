<template>
  <div class="challenge-main flex-1 overflow-y-auto overflow-x-hidden flex flex-col gap-2 relative p-4">
    <!-- bg pattern & color -->
    <BackgroundImage type="red" />

    <!-- battle stats -->
    <div class="challenge-stats z-10 flex flex-col gap-2 min-h-[136px]">
      <Transition name="fade" mode="out-in">
        <ChallengeStatus v-if="battleStarted" />
      </Transition>
      <Transition name="fade" mode="out-in">
        <ProgressBar v-if="battleStarted" />
      </Transition>
    </div>

    <!-- battle mechanic -->
    <BattleMechanic />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { storeToRefs } from "pinia";
import { getAsset } from "@/utils";
import { tg, setThemeColor } from "@/api/telegram";

// stores
import { useMainStore } from "@/store/main";

const store = useMainStore();

const { fetchChallengePageData } = store;
const { battleStarted } = storeToRefs(store.battleStore);

// setThemeColor("#D26542");

await fetchChallengePageData();
</script>
