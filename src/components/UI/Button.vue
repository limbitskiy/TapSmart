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
      <span :class="[font, 'inline-svg']" v-if="data?.label" v-html="replaceWithSpecialSymbols(data.label)" />
    </slot>
  </button>
</template>

<script setup lang="ts">
import { ref, useCssModule } from "vue";
import { storeToRefs } from "pinia";
import { useRoute } from "vue-router";
import { inviteFriend } from "@/api/telegram";
import { replaceWithSpecialSymbols } from "@/utils";

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
  accent: "orange" | "purple";
  action?: "invite";
}

const route = useRoute();

const { active: activeClass } = useCssModule();

const store = useMainStore();
const { friends: friendsLocale } = storeToRefs(store.localeStore);

const { redirectTo, useFetch, sendInviteAnalitycsData } = store;

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
}>();

const emit = defineEmits<{
  close: [];
}>();

const onClick = () => {
  if (props.data?.action === "invite") {
    sendInviteAnalitycsData(route.path);
    inviteFriend(friendsLocale.value?.["invite_message"] || "Invite message");
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
