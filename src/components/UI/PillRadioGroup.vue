<template>
  <div class="pill-radio-group-cnt">
    <Pill v-for="item in data" :key="item.value" v-bind="$attrs" @click="emit('select', item.value)">
      <div class="pill-content flex items-center justify-between gap-2">
        <div class="pill-start">
          <span>{{ item.label }}</span>
        </div>
        <div class="pill-end flex items-center gap-4">
          <input type="radio" :value="item.value" :checked="item.value === selected" />
        </div>
      </div>
    </Pill>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Pill from "@/components/UI/Pill.vue";

const props = defineProps<{
  data: [
    {
      label: string;
      value: any;
    }
  ];
  selected: any;
}>();

const emit = defineEmits<{
  select: [any];
}>();

// const selected = ref(props.selected);
</script>
