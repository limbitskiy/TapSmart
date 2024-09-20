<template>
  <button
    :class="dark ? 'bg-black' : 'bg-[var(--accent-color)] text-black'"
    class="rounded-xl font-bold fira-bold py-3 px-8 text-xl leading-6"
    @touchstart="btnTouchstart"
    @touchend="btnTouchend"
    @click="onClick"
  >
    <slot>
      <span v-if="data?.label">{{ data.label }}</span>
    </slot>
  </button>
</template>

<script setup lang="ts">
import { useCssModule } from "vue";

// stores
import { useMainStore } from "@/store/main";

const { active: activeClass } = useCssModule();

const mainStore = useMainStore();

const { redirectTo, callApi, setRouteData, showModal } = mainStore;

const props = defineProps<{
  dark?: boolean;
  data?: { route?: string; api?: string; data?: {}; label: string; isClose: boolean; showModal: { title: string; subtitle: string; buttons: {} } };
  activeColor?: string;
  defaultAction?: () => void;
}>();

const onClick = () => {
  if (props.data?.api) {
    callApi({ api: props.data.api, data: props.data.data });
  }

  if (props.data?.route) {
    if (props.data?.routeData) {
      setRouteData(props.data?.routeData);
    }

    redirectTo(props.data.route);
  }

  if (props.defaultAction) {
    props.defaultAction();
  }

  if (props.data?.showModal) {
    showModal(props.data.showModal);
  }
};

const btnTouchstart = (event: TouchEvent) => {
  if (!props.activeColor) return;

  const { target } = event;
  const btn = target.closest("button");

  btn?.classList.add(activeClass);
};

const btnTouchend = (event: TouchEvent) => {
  if (!props.activeColor) return;

  const { target } = event;
  const btn = target?.closest("button");

  btn?.classList.remove(activeClass);
};
</script>

<style module>
.active {
  background-color: v-bind(props.activeColor);
}
</style>
