<template>
  <div class="tutorial-cnt flex-1 flex flex-col p-4">
    <div class="tutorial-header py-2 flex items-center justify-between absolute top-2 w-[calc(100vw-2rem)] z-20">
      <div class="tutorial-header__start">
        <span class="font-medium text-[var(--accent-color)]">{{ data.slides[currentSlide].topic }}</span>
      </div>
      <div class="tutorial-header__end">
        <button class="border border-gray-400 px-6 py-1 rounded-lg" @click="onSkip">{{ locale["button_skip"] }}</button>
      </div>
    </div>
    <div class="tutorial-body flex-1 flex mt-10">
      <Transition name="fade" mode="out-in">
        <TutorialSlide :data="data.slides[currentSlide]" :key="data.slides[currentSlide].id" />
      </Transition>
    </div>
    <div class="bnt-cnt flex justify-between absolute bottom-2 w-[calc(100vw-2rem)]">
      <Button :class="{ invisible: isFirstSlide }" black class="px-4 py-2" @click="prevSlide">{{ locale["button_back"] }}</Button>
      <Button class="px-4 py-2" @click="nextSlide">{{ isLastSlide ? locale["button_finish"] : locale["button_next"] }}</Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";

// stores
import { useDataStore } from "@/store/data.ts";
import { useLocaleStore } from "@/store/locale.ts";

// components
import TutorialSlide from "../components/TutorialSlide.vue";
import Button from "@/components/UI/Button.vue";

const router = useRouter();
const dataStore = useDataStore();
const localeStore = useLocaleStore();

const { tutorial: data } = storeToRefs(dataStore);
const { tutorial: locale } = storeToRefs(localeStore);

const currentSlide = ref(0);

const isLastSlide = computed(() => !data.value.slides[currentSlide.value + 1]);
const isFirstSlide = computed(() => currentSlide.value === 0);

const nextSlide = () => {
  if (isLastSlide.value) {
    router.push("/required-settings");
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
  router.push("/required-settings");
};
</script>
