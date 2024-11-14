<template>
  <div class="challenge-btn-wrap relative flex overflow-hidden rounded-xl" :class="{ heartbeat }">
    <div ref="animationRef" class="lightray absolute -top-5 -bottom-5 -left-[100%] w-[15px] bg-white z-20 rotate-45 opacity-80"></div>
    <button
      class="w-full bg-gradient-to-b from-[#F0B563] to-[#FF9500] text-[#222]"
      :disabled="data.button_challenge?.disabled"
      @click="onClick"
      @touchstart="btnTouchstart"
      @touchend="btnTouchend"
    >
      <div class="flex justify-center gap-2 py-5 !px-2 relative">
        <div
          v-if="glossVisible"
          class="gloss absolute top-0 left-0 right-0 rounded-[4px] h-4 mx-[2px] z-10"
          style="background: linear-gradient(180deg, #ffffff 0%, #f6a739 60%)"
        ></div>
        <div class="btn-cnt flex justify-center gap-2 z-20">
          <span v-bind="$attrs" class="text-[22px] fira-condensed-bold leading-4">{{ locale?.["button_challenge"] }}</span>
          <Badge v-if="data?.questions_left > 0" class="relative bottom-1" :data="data?.questions_left" grey />
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
