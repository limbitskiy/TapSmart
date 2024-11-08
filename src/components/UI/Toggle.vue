<template>
  <div class="toggle bg-[var(--grey-light)] rounded-[8px] flex p-1 w-fit fira-condensed relative">
    <div class="option1 px-3 rounded-[8px]" :class="{ 'bg-[var(--accent-color)] text-black ': selected === option1.value }" @click="() => onSelect(option1)">
      <span>{{ option1.label }}</span>
    </div>
    <div class="option2 px-3 rounded-[8px]" :class="{ 'bg-[var(--accent-color)] text-black ': selected === option2.value }" @click="() => onSelect(option2)">
      <span>{{ option2.label }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const props = defineProps<{
  option1: { label: string; value: string };
  option2: { label: string; value: string };
}>();

const emit = defineEmits<{
  change: [value: string];
}>();

const selected = ref<string>(props.option1.value);

const onSelect = (option: { label: string; value: string }) => {
  selected.value = option.value;
  emit("change", option.value);
};
</script>
