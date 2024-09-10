<template>
  <Pill
    class="flex flex-col gap-2 !p-2 justify-between outline-1 relative"
    :class="{ 'outline outline-2 outline-[var(--accent-color)]': battles.currentBattleType == data.id }"
    color="light"
  >
    <div class="pill-content">
      <div class="pill-toolbar flex items-center justify-between min-h-[20px]">
        <!-- league -->
        <div v-if="data.league" ref="leagueRef" class="league flex gap-1 items-center rounded-full px-2 bg-[var(--grey-dark)]" @click="onLeagueClick">
          <img class="h-4" :src="getAsset('league')" />
          <span class="text-sm exo-bold">: {{ data.league }}</span>
        </div>

        <!-- bolts -->
        <div v-if="data.bolts_bonus" ref="boltsRef" class="bolts-bonus flex gap-1 items-center rounded-full px-2 bg-[var(--grey-dark)]" @click="onBoltClick">
          <span class="text-sm exo-bold">+{{ data.bolts_bonus }}%</span>
          <img class="h-4" :src="getAsset('bolt')" />
        </div>
      </div>

      <!-- content -->
      <div class="content flex flex-col gap-2 items-center justify-between text-center">
        <div class="pill-img">
          <img class="" :src="getAsset(`mech_${data.id}`)" />
        </div>
        <span class="fira-semibold">{{ locale?.[`${mechName}_title`] }}</span>
        <span class="fira-condensed text-[#838383] leading-5">{{ locale?.[`${mechName}_desc`] }}</span>
      </div>
    </div>
    <!-- active -->
    <button v-if="battles.currentBattleType == data.id" class="px-2 w-full bg-[var(--accent-color)] text-black rounded-full fira-condensed-bold mt-2 py-1">
      {{ locale?.["button_active"] || "Active" }}
    </button>
    <!-- trial message -->
    <button v-else-if="data.nuts" class="px-2 w-full bg-[var(--green-color)] text-white rounded-full fira-condensed-bold mt-2 py-1" @click="() => emit('select', data.id)">
      <div class="btn-content flex items-center justify-center gap-3">
        {{ locale?.["button_trial_message"] }}
        <div class="bolts flex items-center gap-1">
          <img class="h-4" :src="getAsset('nut')" />
          <span class="exo-black">{{ data.nuts }}</span>
        </div>
      </div>
    </button>
    <!-- normal / disabled -->
    <button
      v-else
      class="px-2 w-full bg-[var(--green-color)] text-white rounded-full fira-condensed-bold mt- py-1"
      :class="{ 'bg-transparent border border-gray-500 text-gray-200': data.disabled }"
      @click="() => emit('select', data.id)"
    >
      {{ buttonLabel }}
    </button>
  </Pill>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { storeToRefs } from "pinia";
import { getAsset } from "@/utils";

// stores
import { useDataStore } from "@/store/data";
import { useLocaleStore } from "@/store/locale";
import { useMainStore } from "@/store/main";

// components
import Pill from "@/components/UI/Pill.vue";

// types
import { Mechanic } from "@/types";

const props = defineProps<{
  data: Mechanic;
}>();

console.log(props);

const emit = defineEmits<{
  select: [mechId: number];
}>();

const leagueRef = ref();
const boltsRef = ref();

const dataStore = useDataStore();
const localeStore = useLocaleStore();
const mainStore = useMainStore();

const { battles: locale } = storeToRefs(localeStore);
const { battles } = storeToRefs(dataStore);
const { showTooltip } = mainStore;

const mechName = battles.value.getMechanicName(props.data.id);

const buttonLabel = computed(() => {
  if (props.data.disabled) {
    return locale.value?.["button_coming_soon"] ?? "Coming soon";
  }

  return locale.value?.["button_mechanic_select"] ?? "Select";
});

const onLeagueClick = () => {
  showTooltip({
    element: leagueRef.value,
    text: locale.value?.["tooltip_league"] ?? "",
  });
};

const onBoltClick = () => {
  showTooltip({
    element: boltsRef.value,
    text: locale.value?.["tooltip_bonus"] ?? "",
  });
};
</script>
