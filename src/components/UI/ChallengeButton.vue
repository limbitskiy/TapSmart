<template>
  <div class="challenge-btn-wrap relative flex overflow-hidden rounded-[22px] bg-[#222] p-[4px] min-h-[56px]" :class="{ heartbeat }">
    <div ref="animationRef" class="lightray absolute -top-5 -bottom-5 -left-[100%] w-[15px] bg-white z-20 rotate-45 opacity-80"></div>
    <button
      class="w-full bg-[var(--accent-color)] rounded-[18px] text-[#222] z-[6]"
      style="background: radial-gradient(74.07% 78.4% at 50% 50%, #ffaf03 12.5%, #c08535 100%); box-shadow: 0px 0px 4px 0px #feac3e"
      :disabled="data.button_challenge?.disabled"
      @click="onClick"
      @touchstart="btnTouchstart"
      @touchend="btnTouchend"
    >
      <div class="flex justify-center gap-2 py-4 !px-2 relative">
        <div class="btn-cnt flex justify-center gap-2 z-10">
          <span v-bind="$attrs" class="text-[20px] fira-condensed-bold leading-4">{{ locale?.["button_challenge"] }}</span>
          <Badge v-if="data?.questions_left > 0" class="relative bottom-1" :data="data?.questions_left" grey />
        </div>

        <div class="gloss absolute top-0 left-0 right-0 bottom-[40%] z-20 rounded-t-[22px] overflow-hidden">
          <svg class="h-full w-full" viewBox="0 0 345 33" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M345 22.1555C157.528 41.796 36.8868 30.339 0 22.1555V0H345V22.1555Z" fill="white" fill-opacity="0.23" />
          </svg>
        </div>
      </div>
    </button>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import { storeToRefs } from "pinia";

// stores
import { useMainStore } from "@/store/main";

const emit = defineEmits<{
  challenge: [];
}>();

const store = useMainStore();

const { data } = storeToRefs(store.battleStore);
const { battles: locale } = storeToRefs(store.localeStore);

const animationRef = ref();
const glossVisible = ref(true);

const heartbeat = ref(false);

let interval;

const onClick = () => {
  emit("challenge");
};

const animateBtn = () => {
  animationRef.value?.animate({ left: "calc(150%)" }, 800);
  setTimeout(() => {
    heartbeat.value = true;
  }, 1000);

  setTimeout(() => {
    heartbeat.value = false;
  }, 500);
};

const btnTouchstart = (event: TouchEvent) => {
  glossVisible.value = false;
  const { target } = event;
  const btn = target.closest("button");

  btn?.classList.add("active");
};

const btnTouchend = (event: TouchEvent) => {
  const { target } = event;
  const btn = target?.closest("button");

  btn?.classList.remove("active");
  glossVisible.value = true;
};

onMounted(() => {
  interval = setInterval(() => {
    animateBtn();
  }, 15000);
});

onUnmounted(() => {
  clearInterval(interval);
});
</script>

<style type="module">
.active {
  background: rgb(252, 198, 82);
}
</style>
