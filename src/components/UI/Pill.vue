<template>
  <div ref="el" class="pill p-4 rounded-2xl relative select-none" :class="[outlined ? 'border' : null, dark ? 'bg-[var(--grey-dark)]' : 'bg-[var(--grey-light)]']" @click="onClick">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

// store
import { useMainStore } from "@/store/main";
import Ripple from "./Ripple.vue";

const mainStore = useMainStore();

const { showTooltip } = mainStore;

const el = ref();

const props = defineProps<{
  outlined?: boolean;
  tooltip?: string;
  dark?: string;
  // light?: boolean;
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
