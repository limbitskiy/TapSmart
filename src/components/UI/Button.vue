<template>
  <button
    v-if="!data?.hidden"
    ref="btnRef"
    :class="[
      'generic-btn',
      !unstyled && 'rounded-xl font-bold py-3 px-8 text-xl leading-6',
      dark ? 'bg-black' : grey ? 'bg-[var(--grey-light)]' : !unstyled && 'bg-[var(--accent-color)] text-black',
      font ? font : 'fira-bold',
      data?.disabled ?? disabled ? '!bg-gray-500 bg-none' : '',
      data?.accent === 'orange' ? 'bg-[var(--accent-color)] text-black' : data?.accent === 'purple' ? 'bg-gradient-to-r from-[#408CFF] to-[#894899] text-white' : '',
    ]"
    :disabled="data?.disabled ?? disabled"
    @touchstart="btnTouchstart"
    @touchend="btnTouchend"
    @click="onClick"
  >
    <slot>
      <span :class="[font]" v-if="data?.label">{{ data.label }}</span>
    </slot>
  </button>
</template>

<script setup lang="ts">
import { ref, useCssModule } from "vue";

// stores
import { useMainStore } from "@/store/main";

interface ButtonProps {
  hidden: boolean;
  disabled: boolean;
  route?: string;
  api?: string;
  data?: {};
  label: string;
  isClose: boolean;
  showModal: { title: string; subtitle: string; buttons: {} };
  accent: "orange" | "purple";
}

const { active: activeClass } = useCssModule();

const mainStore = useMainStore();

const { redirectTo, callApiSync, setRouteData, showModal } = mainStore;

const btnRef = ref();

defineExpose({
  btnRef,
});

const props = defineProps<{
  dark?: boolean;
  grey?: boolean;
  font?: string;
  data?: ButtonProps;
  activeColor?: string;
  unstyled?: boolean;
  disabled?: boolean;
  defaultAction?: () => void;
}>();

const onClick = () => {
  if (props.data?.api) {
    callApiSync({ api: props.data.api, data: props.data.data });
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
  if (!props.activeColor || props.disabled || props.data?.disabled) return;

  const { target } = event;
  const btn = target.closest("button");

  btn?.classList.add(activeClass);
};

const btnTouchend = (event: TouchEvent) => {
  if (!props.activeColor || props.disabled || props.data?.disabled) return;

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
