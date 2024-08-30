<template>
  <div
    :class="`pill p-4 rounded-2xl relative select-none ${outlined ? 'border' : ''}`"
    ref="container"
    @mousedown="onMouseDown"
    class="ripple-outer"
    :style="`background-color: var(--grey-${color})`"
  >
    <transition-group class="ripples" name="grow" tag="div">
      <div
        class="ripple"
        v-for="ripple in ripples"
        :key="ripple.id"
        :style="{
          top: ripple.top,
          left: ripple.left,
          width: ripple.width,
          height: ripple.height,
          background: 'rgba(255, 255, 255, 0.3)',
        }"
      ></div>
    </transition-group>
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";

// store
import { useMainStore } from "@/store/main.ts";

const mainStore = useMainStore();

const { showTooltip } = mainStore;

interface Ripple {
  width: string;
  height: string;
  left: string;
  top: string;
  id: number;
}

const props = defineProps<{
  color: "light" | "dark" | "darker";
  outlined?: boolean;
  ripple?: boolean;
  tooltip?: string;
}>();

const ripples = ref<Ripple[]>([]);
const container = ref<HTMLDivElement | null>(null);
let rippleWidth = 0;
let halfRippleWidth = 0;

const onMouseDown = (event: MouseEvent) => {
  if (props.tooltip?.length) {
    showTooltip({
      parent: container.value,
      text: props.tooltip,
    });
  }

  // addRipple(event);
};

const addRipple = (event: MouseEvent) => {
  if (!props.ripple) return;

  const { left, top } = container.value!.getBoundingClientRect();
  const rippleId = Date.now();
  ripples.value.push({
    width: `${rippleWidth}px`,
    height: `${rippleWidth}px`,
    left: `${event.clientX - left - halfRippleWidth}px`,
    top: `${event.clientY - top - halfRippleWidth}px`,
    id: rippleId,
  });
};

const purgeRipples = () => {
  ripples.value = [];
};

onMounted(() => {
  const width = container.value!.offsetWidth;
  const height = container.value!.offsetHeight;
  rippleWidth = width > height ? width : height;
  halfRippleWidth = rippleWidth / 2;

  window.addEventListener("mouseup", purgeRipples);
});

onBeforeUnmount(() => {
  window.removeEventListener("mouseup", purgeRipples);
});
</script>
