<template>
  <Pill
    class="flex flex-col gap-2 !p-2 justify-between outline-1 relative"
    :class="{ 'outline outline-2 outline-[var(--accent-color)]': data.battle_type == propData.id }"
    color="light"
    @click="() => emit('select', propData.id)"
  >
    <div class="pill-content">
      <div class="pill-toolbar flex items-center justify-between min-h-[20px]">
        <!-- league -->
        <div v-if="propData.league" ref="leagueRef" class="league flex gap-1 items-center rounded-full px-2 bg-[var(--grey-dark)]" @click="onLeagueClick">
          <img class="h-4" :src="getAsset('league')" />
          <span class="text-sm exo-bold">: {{ propData.league }}</span>
        </div>

        <!-- bolts -->
        <div v-if="propData.bolts_bonus" ref="boltsRef" class="bolts-bonus flex gap-1 items-center rounded-full px-2 bg-[var(--grey-dark)]" @click="onBoltClick">
          <span class="text-sm exo-bold">+{{ propData.bolts_bonus }}%</span>
          <img class="h-4" :src="getAsset('bolt')" />
        </div>
      </div>

      <!-- content -->
      <div class="content flex flex-col gap-2 items-center justify-between text-center">
        <div class="pill-img">
          <img class="" :src="getAsset(`mech_${propData.id}`) ?? getAsset('mech_placeholder')" />
        </div>
        <span class="mx-2">{{ locale?.[`${mechName}_title`] }}</span>
        <span class="text-[#838383] leading-5">{{ locale?.[`${mechName}_desc`] }}</span>
      </div>
    </div>

    <!-- active -->
    <Button v-if="data.battle_type == propData.id" class="!px-2 w-full bg-[var(--accent-color)] text-black !text-lg rounded-full mt-2 !py-1">
      {{ locale?.["button_active"] || "Active" }}
    </Button>

    <!-- trial message -->
    <Button v-else-if="propData.nuts" class="!px-2 w-full bg-[var(--green-color)] text-white mt-2 !py-1" activeColor="#74d77d">
      <div class="btn-content flex items-center justify-center gap-3 !text-lg">
        {{ locale?.["button_trial_message"] }}
        <div class="bolts flex items-center gap-1">
          <img class="h-4" :src="getAsset('nut')" />
          <span class="exo-black">{{ propData.nuts }}</span>
        </div>
      </div>
    </Button>

    <!--  disabled -->
    <Button v-else-if="propData.disabled" class="!px-2 w-full bg-transparent border border-gray-500 text-gray-200 !py-1 !text-lg" :class="{ '': propData.disabled }">
      {{ buttonLabel }}
    </Button>

    <!-- normal -->
    <Button
      v-else
      class="!px-2 w-full bg-[var(--green-color)] text-white !py-1 !text-lg"
      :class="{ 'bg-transparent border border-gray-500 text-gray-200': propData.disabled }"
      activeColor="#74d77d"
    >
      {{ buttonLabel }}
    </Button>
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

// types
import { Mechanic } from "@/types";

const props = defineProps<{
  propData: Mechanic;
}>();

const emit = defineEmits<{
  select: [mechId: number];
}>();

const leagueRef = ref();
const boltsRef = ref();

const dataStore = useDataStore();
const localeStore = useLocaleStore();
const mainStore = useMainStore();

const { battles: locale } = storeToRefs(localeStore);
const { data } = storeToRefs(dataStore.battles);
const { getMechanicName } = dataStore.battles;
const { showTooltip } = mainStore;

const mechName = getMechanicName(props.propData.id);

const buttonLabel = computed(() => {
  if (props.propData.disabled) {
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
