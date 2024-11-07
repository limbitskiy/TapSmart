<template>
  <div class="toggle bg-[var(--grey-light)] rounded-[8px] flex p-1 w-fit relative">
    <div class="option1 px-3 rounded-[8px]" :class="{ 'bg-[var(--accent-color)] text-black ': selected === option1 }" @click="() => onSelect(option1)">
      <span>{{ option1 }}</span>
    </div>
    <div class="option2 px-3 rounded-[8px]" :class="{ 'bg-[var(--accent-color)] text-black ': selected === option2 }" @click="() => onSelect(option2)">
      <span>{{ option2 }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const props = defineProps<{
  option1: string;
  option2: string;
}>();

defineEmits<{
  change: [value: string];
}>();

const selected = ref(props.option1);

const onSelect = (option: string | number) => {
  selected.value = option;
};
</script>
