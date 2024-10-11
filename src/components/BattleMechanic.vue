<template>
  <BackgroundPill class="flex-1 !p-4 z-10 rounded-[15px] relative" dark>
    <div class="header flex items-center justify-between mb-4">
      <span class="fira-regular text-lg text-[#B7B7B7]">{{ locale?.[`yesno_title`] || "Yes-no" }} battle</span>
      <div class="right flex items-center gap-3">
        <CircleCountdown class="" :strokeWidth="2" color="grey" :size="20" />
        <VolumeControl />
      </div>
    </div>

    <!-- battle body -->
    <div class="battle-body flex-1 flex relative overflow-hidden">
      <!-- <RouterView v-slot="{ Component }" type="relax" @answer="onAnswer" @mounted="onMechanicMounted" @unmounted="onMechanicUnmounted">
          <template v-if="Component">
            <Transition name="fade" mode="out-in">
              <Suspense suspensible>
                <component :is="Component" />
                <template #fallback><Loader /></template>
              </Suspense>
            </Transition>
          </template>
        </RouterView> -->
      <Transition name="fade">
        <component :is="mountedMechanic" :task="currentTask" :locales="locale" @mounted="onMechanicMounted" @unmounted="onMechanicUnmounted" />
      </Transition>
    </div>
  </BackgroundPill>
</template>

<script setup lang="ts">
import { onMounted, ref, watch, onBeforeUnmount, computed } from "vue";
import { storeToRefs } from "pinia";
import { getAsset } from "@/utils";
import { useRoute } from "vue-router";

// stores
import { useDataStore } from "@/store/data";
import { useMainStore } from "@/store/main";
import { useLocaleStore } from "@/store/locale";

// battle mechanics
import YesNo from "@/components/battles/YesNo.vue";
import FourAnswers from "@/components/battles/FourAnswers.vue";

const dataStore = useDataStore();
const mainStore = useMainStore();
const localeStore = useLocaleStore();

const route = useRoute();
const {} = mainStore;
const { battles: locale } = storeToRefs(localeStore);
const { сurrentMechanicName, currentTask, data, afkCounter } = storeToRefs(dataStore.battles);
const { startBreakpoint, stopBreakpoint, startTaskTimeout, stopTaskTimeout, setTaskTimeoutCounter, resetBattleStats, resetAfkCounter, getMechanicName } = dataStore.battles;

const mechMap = {
  yesno: YesNo,
  "4answers": FourAnswers,
};

const mountedMechanic = computed(() => mechMap[getMechanicName(route.query.battle_type)] ?? mechMap[сurrentMechanicName.value]);

const onMechanicMounted = () => {
  startBreakpoint("battle");
  setTaskTimeoutCounter(null);
  startTaskTimeout();
  resetBattleStats();
};

const onMechanicUnmounted = () => {
  resetAfkCounter();
  stopBreakpoint();
  setTaskTimeoutCounter(1);
};
</script>
