<template>
  <div class="tutorial-cnt flex-1 flex flex-col p-4 relative h-dvh">
    <div class="slide-cnt flex-1 flex">
      <div class="tutorial-body flex-1 flex absolute inset-0 z-1">
        <Transition name="fade" mode="out-in">
          <component :is="slidesMap[locale.slides[currentSlide]?.key]" :locale="locale.slides[currentSlide]" />
        </Transition>
      </div>
    </div>
    <div class="bnt-cnt flex justify-between w-[calc(100vw-2rem)] z-50">
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
import TutorialSlide2 from "@/components/tutorial/TutorialSlide2.vue";
import TutorialSlide3 from "@/components/tutorial/TutorialSlide3.vue";
import TutorialSlide4 from "@/components/tutorial/TutorialSlide4.vue";
import TutorialSlide5 from "@/components/tutorial/TutorialSlide5.vue";
import TutorialSlide6 from "@/components/tutorial/TutorialSlide6.vue";

// stores
import { useMainStore } from "@/store/main";

const store = useMainStore();

const { redirectTo } = store;
const { tutorial: data } = storeToRefs(store.dataStore);
const { tutorial: locale } = storeToRefs(store.localeStore);

const slidesMap = {
  intro: TutorialSlide1,
  prize: TutorialSlide2,
  rule_1: TutorialSlide3,
  rule_2: TutorialSlide4,
  rule_3: TutorialSlide5,
  good_luck: TutorialSlide6,
};

const currentSlide = ref(0);

const isLastSlide = computed(() => currentSlide.value === Object.keys(locale.value.slides).length - 1);

const nextSlide = () => {
  if (isLastSlide.value) {
    redirectTo("/required-settings");
  } else {
    currentSlide.value += 1;
  }
};

const onSkip = () => {
  redirectTo("/required-settings");
};
</script>
