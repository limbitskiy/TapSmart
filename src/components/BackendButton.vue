<template>
  <Button @click="onClick"><slot></slot></Button>
</template>

<script setup lang="ts">
// stores
import { useMainStore } from "@/store/main";

// components
import Button from "@/components/UI/Button.vue";

const mainStore = useMainStore();

const { redirectTo, callApi } = mainStore;

const props = defineProps<{
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
