<template>
  <div class="data-content flex flex-col gap-4 items-center text-center mb-4">
    <img v-if="data.image" class="h-[30dvh]" :src="getAsset(data.image)" />
    <!-- <img v-else class="h-[30dvh] my-4" :src="getAsset('confirm')" /> -->
    <div class="text flex flex-col gap-2">
      <span class="text-3xl font-semibold text-gray-100" v-html="data.title"></span>
      <Pill class="border border-[var(--accent-color)] mx-[10vw]">
        <span class="text-gray-300 inline-svg leading-4" v-html="replaceWithSpecialSymbols(data.subtitle)"></span>
      </Pill>
    </div>
    <div v-if="data.buttons.length <= 2" class="btns flex flex-col gap-2 mt-4 w-full">
      <Button v-for="button in data.buttons" :key="button.label" :data="button" @close="() => emit('close')" />
    </div>
    <div v-else class="btns grid grid-cols-2 gap-2 mt-4 w-full">
      <Button
        v-for="(button, index) in data.buttons"
        class="!px-2 flex-1"
        :class="{ 'col-span-2': data.buttons.length === 3 && index === 2 }"
        :key="button.label"
        :data="button"
        @close="() => emit('close')"
      />
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
