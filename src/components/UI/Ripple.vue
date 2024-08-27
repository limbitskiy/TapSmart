<template>
  <div ref="container" @mousedown="addRipple" class="ripple-outer">
    <transition-group class="ripples z-10" name="grow" tag="div">
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

const ripples = ref([]);
const container = ref(null);
let rippleWidth = 0;
let halfRippleWidth = 0;

const addRipple = (e) => {
  const { left, top } = container.value?.getBoundingClientRect();
  const rippleId = Date.now();
  ripples.value.push({
    width: `${rippleWidth}px`,
    height: `${rippleWidth}px`,
    left: `${e.clientX - left - halfRippleWidth}px`,
    top: `${e.clientY - top - halfRippleWidth}px`,
    id: rippleId,
  });
};

const purgeRipples = () => {
  ripples.value = [];
};

onMounted(() => {
  const width = container.value?.offsetWidth;
  const height = container.value?.offsetHeight;
  rippleWidth = width > height ? width : height;
  halfRippleWidth = rippleWidth / 2;

  window.addEventListener("mouseup", purgeRipples);
});

onBeforeUnmount(() => {
  window.removeEventListener("mouseup", purgeRipples);
});
</script>
