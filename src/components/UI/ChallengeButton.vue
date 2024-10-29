<template>
  <div class="challenge-btn-wrap relative flex overflow-hidden rounded-lg" :class="{ heartbeat }">
    <div ref="animationRef" class="lightray absolute -top-5 -left-[100%] w-[15px] h-[80px] bg-white z-10 rotate-45 opacity-80"></div>
    <Button
      ref="challengeBtnRef"
      activeColor="#fcdcb0"
      class="flex-1 py-4 !px-2 relative !rounded-lg"
      :class="{ 'bg-gray-300 text-gray-400': data.button_challenge?.disabled }"
      @click="onClick"
      ><div class="flex justify-center gap-2">
        <span v-bind="$attrs" class="text-lg leading-4">{{ locale?.["button_challenge"] }}</span>
        <Badge v-if="data?.questions_left > 0" class="relative bottom-1" :data="data?.questions_left" grey />
      </div>
    </Button>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import { storeToRefs } from "pinia";
import { useAnimate } from "@vueuse/core";

// stores
import { useMainStore } from "@/store/main";

const emit = defineEmits<{
  challenge: [];
}>();

const store = useMainStore();

const { showTooltip } = store;
const { data } = storeToRefs(store.battleStore);
const { battles: locale } = storeToRefs(store.localeStore);

const challengeBtnRef = ref();
const animationRef = ref();

const heartbeat = ref(false);

let interval;

const onClick = () => {
  if (data.value.button_challenge?.disabled) {
    showTooltip({
      element: challengeBtnRef.value.btnRef,
      text: locale.value["button_challenge_tooltip"],
    });
  } else {
    emit("challenge");
  }
};

const animateBtn = () => {
  animationRef.value.animate({ left: "calc(150%)" }, 800);
  setTimeout(() => {
    heartbeat.value = true;
  }, 1000);

  setTimeout(() => {
    heartbeat.value = false;
  }, 500);
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
