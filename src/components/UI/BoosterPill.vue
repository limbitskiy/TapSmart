<template>
  <div class="flex-1 flex flex-col">
    <div class="bg flex-1 flex p-1 rounded-xl" :style="{ background: selected ? 'var(--green-gradient)' : color }">
      <Pill class="flex-1 flex flex-col gap-2 !p-2" style="box-shadow: 0px 0px 1.6px 1px rgba(0, 0, 0, 0.25)">
        <div class="top flex gap-4 p-2">
          <div class="icon min-w-[50px] contain flex items-center">
            <img class="w-[50px]" :src="getAsset(icon)" />
          </div>
          <div class="text flex flex-col gap-2">
            <span class="fira-bold text-xl leading-5">{{ title }}</span>
            <p class="text-gray-300 text-sm fira-condensed leading-5">
              {{ subtitle }}
            </p>
          </div>
        </div>
        <div class="bottom">
          <Button
            class="w-full bg-[var(--accent-color)] !py-2"
            style="transition: 0.5s ease"
            :style="{ background: selected ? 'var(--green-gradient)' : 'var(--grey-dark)', color: selected ? '#fff' : '#fff' }"
            activeColor="#fcdcb0"
            @click="() => emit('select')"
          >
            <span v-if="selected">{{ locale?.["button_active"] || "active" }}</span>
            <span v-else class="inline-svg leading-4" v-html="replaceWithSpecialSymbols(buttonLabel)"></span>
          </Button>
        </div>
      </Pill>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getAsset, replaceWithSpecialSymbols } from "@/utils";
import { storeToRefs } from "pinia";

// stores
import { useMainStore } from "@/store/main";

const store = useMainStore();

const { battles: locale } = storeToRefs(store.localeStore);

defineProps<{
  color: string;
  icon: string;
  title: string;
  subtitle: string;
  selected: boolean;
  buttonLabel: string;
}>();

const emit = defineEmits<{
  select: [];
}>();
</script>
