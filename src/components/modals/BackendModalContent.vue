<template>
  <div class="data-content flex flex-col gap-4 items-center text-center mb-4">
    <img v-if="data.image" class="h-[20dvh] my-4" :src="getAsset(data.image)" />
    <img v-else class="h-[20dvh] my-4" :src="getAsset('confirm')" />
    <div class="text flex flex-col gap-2">
      <span class="text-3xl fira-bold text-gray-100" v-html="data.title"></span>
      <Pill>
        <span class="text-gray-300 inline-svg leading-4" v-html="replaceWithSpecialSymbols(data.subtitle)"></span>
      </Pill>
    </div>
    <div class="btns flex flex-col gap-2 mt-4 w-full">
      <Button v-for="button in data.buttons" :key="button.label" :data="button" @close="() => emit('close')" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { getAsset, replaceWithSpecialSymbols } from "@/utils";

// types
import { BackendButton } from "@/types";

defineProps<{
  data: {
    image: string;
    title: string;
    subtitle: string;
    buttons: BackendButton[];
  };
}>();

const emit = defineEmits<{
  close: [];
}>();
</script>
