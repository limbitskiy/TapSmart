<template>
  <div class="tutorial-cnt flex-1 flex flex-col p-4 relative h-dvh">
    <div class="slide-cnt flex-1">
      <div class="tutorial-body flex-1 flex absolute inset-0 z-1">
        <Transition name="fade" mode="out-in">
          <component :is="slidesMap[currentSlide]" />
        </Transition>
      </div>
    </div>
    <div class="bnt-cnt flex justify-between w-[calc(100vw-2rem)] z-10">
      <Button dark @click="onSkip">{{ locale?.["button_skip"] }}</Button>
      <Button @click="nextSlide">{{ isLastSlide ? locale?.["button_finish"] : locale?.["button_next"] }}</Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from "vue";
import { storeToRefs } from "pinia";

// slides
import TutorialSlide1 from "@/components/tutorial/TutorialSlide1.vue";

// stores
import { useMainStore } from "@/store/main";

const store = useMainStore();

const { redirectTo } = store;
const { tutorial: data } = storeToRefs(store.dataStore);
const { tutorial: locale } = storeToRefs(store.localeStore);

const slidesMap = {
  0: TutorialSlide1,
};

const currentSlide = ref(0);

const isLastSlide = computed(() => !data.value?.slides?.[currentSlide.value + 1]);
const isFirstSlide = computed(() => currentSlide.value === 0);

const nextSlide = () => {
  if (isLastSlide.value) {
    redirectTo("/required-settings");
  } else {
    currentSlide.value += 1;
  }
};

const prevSlide = () => {
  if (!isFirstSlide.value) {
    currentSlide.value -= 1;
  }
};

const onSkip = () => {
  redirectTo("/required-settings");
};
</script>
