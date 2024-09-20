<template>
  <div id="task-modal" class="flex-1 flex flex-col gap-4 items-center py-4">
    <div class="task-icon overflow-hidden">
      <img class="h-[20dvh]" :src="getAsset(data.icon)" />
    </div>
    <div class="pill-header flex flex-col items-center text-center gap-4">
      <span class="bg-pill-title">{{ data.title }}</span>
      <p>{{ data.desc }}</p>
    </div>

    <div class="task-rewards flex flex-col gap-4 text-center items-center">
      <div class="rewards-inner">
        <div v-if="data.bolts" class="bolts flex gap-2 text-center items-center justify-center">
          <img class="h-6" :src="getAsset('bolt')" />
          <span class="exo-black text-2xl">{{ data.bolts }}</span>
        </div>
        <div v-if="data.nuts" class="nuts flex gap-2 text-center items-center justify-center">
          <img class="h-6" :src="getAsset('nut')" />
          <span class="exo-black text-2xl">{{ data.nuts }}</span>
        </div>
      </div>
    </div>

    <div class="tsk-btns flex flex-col gap-2 w-full">
      <Button v-if="data?.buttons?.top" class="w-full text-white bg-[var(--grey-light)]" activeColor="#525252" :data="data.buttons.top" />
      <Button v-if="data?.buttons?.bottom" class="w-full" activeColor="#fcdcb0" :data="data.buttons.bottom" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { getAsset } from "@/utils/index";

// stores
import { useDataStore } from "@/store/data";
import { useLocaleStore } from "@/store/locale";

// components
import Button from "@/components/UI/Button.vue";

const props = defineProps<{
  data: {
    title: string;
    icon: string;
    desc: string;
    bolts: number;
    nuts: number;
  };
}>();

const emit = defineEmits<{
  close: [];
}>();

const dataStore = useDataStore();
const localeStore = useLocaleStore();

const { battles: locale } = storeToRefs(localeStore);
// const { data } = storeToRefs(dataStore.battles);
const { getMechanicName, changeMechanic, stopBreakpoint, startBreakpoint } = dataStore.battles;
const { profile } = storeToRefs(dataStore);

onMounted(() => {});

onBeforeUnmount(() => {});
</script>
