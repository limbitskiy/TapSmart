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
          <span class="fira-semibold text-xl">{{ showFormattedNumber(data.bolts) }}</span>
        </div>
        <div v-if="data.nuts" class="nuts flex gap-2 text-center items-center justify-center">
          <img class="h-6" :src="getAsset('nut')" />
          <span class="fira-semibold text-xl">{{ data.nuts }}</span>
        </div>
      </div>
    </div>

    <div class="tsk-btns flex flex-col gap-2 w-full">
      <Button v-if="data?.buttons?.top" class="w-full" activeColor="#525252" :data="data.buttons.top" />
      <Button v-if="data?.buttons?.bottom" class="w-full text-white bg-[var(--grey-light)]" activeColor="#fcdcb0" :data="data.buttons.bottom" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { getAsset, showFormattedNumber } from "@/utils";

// stores
import { useMainStore } from "@/store/main";

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

const store = useMainStore();

const { battles: locale } = storeToRefs(store.localeStore);
const { profile } = storeToRefs(store.dataStore);
</script>
