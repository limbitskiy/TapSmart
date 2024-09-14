<template>
  <button :class="dark ? 'bg-black' : 'bg-[var(--accent-color)] text-black'" class="rounded-xl font-bold fira-bold py-3 px-8 text-xl" @click="onClick">
    <slot>
      <span v-if="data?.label">{{ data.label }}</span>
    </slot>
  </button>
</template>

<script setup lang="ts">
// stores
import { useMainStore } from "@/store/main";

const mainStore = useMainStore();

const { redirectTo, callApi } = mainStore;

const props = defineProps<{
  dark?: boolean;
  data?: { route?: string; api?: string; data?: {} };
  defaultAction?: () => void;
}>();

const onClick = () => {
  if (props.data?.route) {
    redirectTo(props.data.route);
  } else if (props.data?.api) {
    callApi({ api: props.data.api, data: props.data.data });
  }

  if (props.defaultAction) {
    props.defaultAction();
  }
};
</script>
