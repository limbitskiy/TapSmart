<template>
  <button
    v-if="!data?.hidden"
    ref="btnRef"
    :class="[
      'generic-btn',
      !unstyled && 'rounded-xl py-4 px-8 uppercase text-[14px] leading-5 manrope',
      dark ? 'bg-black' : grey ? 'bg-[var(--grey-light)]' : !unstyled && 'bg-[var(--accent-color)] text-black',
      font ? font : 'font-extrabold',
      data?.disabled ?? disabled ? '!bg-gray-500 bg-none' : '',
      backgroundMap[data?.accent],
    ]"
    :disabled="data?.disabled ?? disabled"
    @touchstart="btnTouchstart"
    @touchend="btnTouchend"
    @click="onClick"
  >
    <slot>
      <span class="flex items-center justify-center gap-1" :class="[font, 'inline-svg']" v-if="data?.label" v-html="replaceWithSpecialSymbols(data.label)" />
    </slot>
  </button>
</template>

<script setup lang="ts">
import { ref, useCssModule } from "vue";
import { storeToRefs } from "pinia";
import { useRoute } from "vue-router";
import {} from "@/api/telegram";
import { doAction, replaceWithSpecialSymbols } from "@/utils";

// stores
import { useMainStore } from "@/store/main";

// types
import { BackendButton } from "@/types";

const route = useRoute();

const { active: activeClass } = useCssModule();

const store = useMainStore();
const { redirectTo, useFetch } = store;
const { friends: friendsLocale } = storeToRefs(store.localeStore);

const btnRef = ref();

defineExpose({
  btnRef,
});

const props = defineProps<{
  dark?: boolean;
  grey?: boolean;
  font?: string;
  data?: BackendButton;
  activeColor?: string;
  unstyled?: boolean;
  disabled?: boolean;
}>();

const emit = defineEmits<{
  close: [];
}>();

const backgroundMap = {
  orange: "bg-[var(--accent-color)] text-black",
  purple: "bg-gradient-to-r from-[#408CFF] to-[#894899] text-white",
  black: "bg-black text-white",
  grey: "bg-[var(--grey-light)] text-white",
  green: "bg-[var(--green-light)] text-white",
  red: "bg-[var(--red-light)] text-white",
};

const onClick = () => {
  if (props.data?.action) {
    parseAction(props.data?.action);
  }

  if (props.data?.api) {
    useFetch({ key: props.data.api, data: props.data.data });
  }

  if (props.data?.route) {
    redirectTo(props.data.route);
  }

  if (props.data?.isClose) {
    emit("close");
  }
};

const parseAction = (action: string) => {
  doAction(action);
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
