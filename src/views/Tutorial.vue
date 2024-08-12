<template>
  <div class="tutorial-cnt flex-1 flex flex-col p-4">
    <div class="tutorial-header py-2 flex items-center justify-between absolute top-2 w-[calc(100vw-2rem)] z-20">
      <div class="tutorial-header__start">
        <span class="font-medium text-[var(--accent-color)]">{{ data.content[currentSlide].topic }}</span>
      </div>
      <div class="tutorial-header__end">
        <button class="border border-gray-400 px-6 py-1 rounded-lg" @click="onSkip">{{ data.settings.buttons.skip || "Skip" }}</button>
      </div>
    </div>
    <div class="tutorial-body flex-1 flex mt-10">
      <Transition name="fade" mode="out-in">
        <TutorialSlide :data="data.content[currentSlide]" :key="data.content[currentSlide].id" />
      </Transition>
    </div>
    <div class="bnt-cnt flex justify-between absolute bottom-2 w-[calc(100vw-2rem)]">
      <Button :class="{ invisible: isFirstSlide }" black @click="prevSlide">{{ data.settings.buttons.back || "Back" }}</Button>
      <Button label="Next" @click="nextSlide">{{ isLastSlide ? data.settings.buttons.finish || "Finish" : data.settings.buttons.next || "Next" }}</Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from "vue";
import { useDataStore } from "@/store/data.ts";
import { storeToRefs } from "pinia";
import TutorialSlide from "../components/TutorialSlide.vue";
import Button from "@/components/UI/Button.vue";
import { useRouter } from "vue-router";

const router = useRouter();
const dataStore = useDataStore();
const { tutorial: data } = storeToRefs(dataStore);

const currentSlide = ref(0);

const isLastSlide = computed(() => !data.value.content[currentSlide.value + 1]);
const isFirstSlide = computed(() => currentSlide.value === 0);

// const computedStyles = computed(() => "url(/" + data.value[currentSlide.value].picture + ")");

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
