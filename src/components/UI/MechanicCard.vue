<template>
  <Pill
    class="flex flex-col gap-2 !p-2 justify-between outline-1 relative"
    :class="{ 'outline outline-2 outline-[var(--accent-color)]': battles.currentBattleType == mechId }"
    color="light"
  >
    <div class="pill-content">
      <div class="pill-toolbar flex items-center justify-between min-h-[20px]">
        <!-- league -->
        <div v-if="battles.mechanics[mechName].league" class="league flex gap-1 items-center rounded-full px-2 bg-[var(--grey-dark)]">
          <img class="h-4" :src="getAsset('league')" />
          <span class="text-sm exo-bold">: {{ battles.mechanics[mechName].league }}</span>
        </div>

        <!-- bolts -->
        <div v-if="battles.mechanics[mechName].bolts_bonus" class="bolts-bonus flex gap-1 items-center rounded-full px-2 bg-[var(--grey-dark)]">
          <span class="text-sm exo-bold">+{{ battles.mechanics[mechName].bolts_bonus }}%</span>
          <img class="h-4" :src="getAsset('bolt')" />
        </div>
      </div>

      <!-- content -->
      <div class="content flex flex-col gap-2 items-center justify-between text-center">
        <div class="pill-img">
          <slot name="image"></slot>
        </div>
        <span class="fira-semibold">{{ locale[`${mechName}_title`] }}</span>
        <span class="fira-condensed text-[#838383] leading-5">{{ locale[`${mechName}_desc`] }}</span>
      </div>
    </div>
    <!-- active -->
    <button v-if="battles.currentBattleType == mechId" class="w-full bg-[var(--accent-color)] text-black rounded-full fira-condensed-bold mt-2 py-1">
      {{ locale["button_active"] || "Active" }}
    </button>
    <!-- trial message -->
    <button
      v-else-if="battles.mechanics[mechName].nuts"
      class="w-full bg-[var(--green-color)] text-white rounded-full fira-condensed-bold mt-2 py-1"
      @click="() => emit('select', mechId)"
    >
      <div class="btn-content flex items-center justify-center gap-1">
        {{ locale["button_trial_message"] }}
        <div class="bolts flex items-center gap-1">
          <img class="h-4" :src="getAsset('nut')" />
          <span class="exo-black">{{ battles.mechanics[mechName].nuts }}</span>
        </div>
      </div>
    </button>
    <!-- normal / disabled -->
    <button
      v-else
      class="w-full bg-[var(--green-color)] text-white rounded-full fira-condensed-bold mt- py-1"
      :class="{ 'bg-transparent border border-gray-500 text-gray-200': battles.mechanics[mechName].disabled }"
      @click="() => emit('select', mechId)"
    >
      {{ locale[`button_${mechName}`] }}
    </button>
  </Pill>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { getAsset } from "@/utils";

// stores
import { useDataStore } from "@/store/data.ts";
import { useLocaleStore } from "@/store/locale.ts";

// components
import Pill from "@/components/UI/Pill.vue";

const props = defineProps<{
  mechId: string;
}>();

const emit = defineEmits<{
  select: [mechId: string];
}>();

const dataStore = useDataStore();
const localeStore = useLocaleStore();

const { battles: locale } = storeToRefs(localeStore);
const { battles } = dataStore;

const mechName = battles.getMechanicName(props.mechId);
</script>
