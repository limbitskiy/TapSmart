<template>
  <div class="challenge-main flex-1 overflow-y-auto overflow-x-hidden flex flex-col gap-2 relative p-4">
    <!-- bg pattern & color -->
    <BackgroundImage type="red" />

    <BattleStartAnimation v-if="showStartChallengeAnimation" />

    <!-- battle stats -->
    <div class="challenge-stats z-10 flex flex-col gap-2 min-h-[136px]">
      <Transition name="fade">
        <ChallengeStatus />
      </Transition>
      <Transition name="fade">
        <ProgressBar />
      </Transition>
    </div>

    <!-- battle mechanic -->
    <BattleMechanic />

    <!-- end challenge animation -->
    <Transition name="fade-800">
      <div v-if="showEndChallengeAnimation" class="animation-cnt absolute inset-0 grid place-items-center z-[30] bg-black">
        <BattleCompleteAnimation />
      </div>
    </Transition>
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
const { showStartChallengeAnimation, showEndChallengeAnimation } = storeToRefs(store.battleStore);

// setThemeColor("#D26542");

await fetchChallengePageData();
</script>
