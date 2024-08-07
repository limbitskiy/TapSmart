<template>
  <div class="tutorial-cnt flex-1 flex flex-col p-4">
    <div class="tutorial-header py-2 flex items-center justify-between absolute top-2 w-[calc(100vw-2rem)] z-20">
      <div class="tutorial-header__start">
        <span class="text-[var(--accent-color)]">Taxes</span>
      </div>
      <div class="tutorial-header__end">
        <button class="border border-gray-400 px-6 py-1 rounded-lg" @click="onSkip">Skip</button>
      </div>
    </div>
    <div class="tutorial-body flex-1 flex mt-10">
      <Transition name="fade" mode="out-in">
        <TutorialSlide :data="data[currentSlide]" :key="currentSlide" />
      </Transition>
    </div>
    <div class="bnt-cnt flex justify-between absolute bottom-2 w-[calc(100vw-2rem)]">
      <Button variant="black" label="Back" @click="prevSlide" />
      <Button label="Next" @click="nextSlide" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from "vue";
import { useUserStore } from "@/store/user.ts";
import { storeToRefs } from "pinia";
import TutorialSlide from "../components/TutorialSlide.vue";
import Button from "@/components/UI/Button.vue";
import { useRouter } from "vue-router";
import { useVibrate } from "@vueuse/core";

const { vibrate, stop, isSupported } = useVibrate({ pattern: [300, 100, 300] });

const router = useRouter();
const userStore = useUserStore();
const { tutorial: data } = storeToRefs(userStore);

const currentSlide = ref(0);

// const computedStyles = computed(() => "url(/" + data.value[currentSlide.value].picture + ")");

const preloadImages = (data) =>
  Promise.all(
    data.value.map(
      (item) =>
        new Promise((res, rej) => {
          const image = new Image();
          image.onload = () => {
            res(image);
          };
          image.onerror = rej;
          image.src = "/" + item.background;
        })
    )
  );

const nextSlide = () => {
  if (data.value[currentSlide.value + 1]) {
    currentSlide.value += 1;
  } else {
    vibrate();
  }
};

const prevSlide = () => {
  if (data.value[currentSlide.value - 1]) {
    currentSlide.value -= 1;
  } else {
    vibrate();
  }
};

const onSkip = () => {
  router.push("/home/main");
};

onMounted(async () => {
  await preloadImages(data);
});
</script>
