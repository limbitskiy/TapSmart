<template>
  <div class="pill-radio-group-cnt">
    <Pill v-for="item in data" :key="item.id" v-bind="$attrs" @click="emit('select', item.id)">
      <div class="pill-content flex items-center justify-between gap-2">
        <div class="pill-start">
          <span>{{ item.label }}</span>
        </div>
        <div class="pill-end flex items-center gap-4">
          <input type="radio" :value="item.id" :checked="item.id === selected" />
        </div>
      </div>
    </Pill>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Pill from "@/components/UI/Pill.vue";

defineProps<{
  data: [
    {
      label: string;
      id: number;
    }
  ];
  selected: number;
}>();

const emit = defineEmits<{
  select: [id: number];
}>();
</script>
