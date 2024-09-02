<template>
  <div ref="el" :class="`pill p-4 rounded-2xl relative select-none ${outlined ? 'border' : ''}`" @click="onClick" :style="`background-color: var(--grey-${color})`">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

// store
import { useMainStore } from "@/store/main.ts";
import Ripple from "./Ripple.vue";

const mainStore = useMainStore();

const { showTooltip } = mainStore;

const el = ref();

const props = defineProps<{
  color: "light" | "dark" | "darker";
  outlined?: boolean;
  ripple?: boolean;
  tooltip?: string;
}>();

const onClick = (event: MouseEvent) => {
  if (props.tooltip?.length) {
    showTooltip({
      element: el.value,
      text: props.tooltip,
    });
  }
};
</script>
