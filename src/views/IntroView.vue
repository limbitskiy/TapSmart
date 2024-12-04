<template>
  <div class="intro-cnt flex-1 flex flex-col p-4 relative h-dvh">
    <div class="slide-cnt flex-1 flex">
      <div class="intro-body flex-1 flex absolute inset-0 z-1">
        <Transition name="fade" mode="out-in">
          <component :is="slidesMap[0]" :locale="locale.slides[currentSlide]" />
        </Transition>
      </div>
    </div>
    <div class="bnt-cnt flex justify-center z-50">
      <Button class="w-[50vw]" :data="locale.slides[currentSlide].buttons.right"></Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from "vue";
import { storeToRefs } from "pinia";

// slides
import IntroSlide1 from "@/components/intro/IntroSlide1.vue";

// stores
import { useMainStore } from "@/store/main";

const store = useMainStore();

const { redirectTo } = store;
const { intro: locale } = storeToRefs(store.localeStore);

const slidesMap = [IntroSlide1];

const currentSlide = ref(0);
</script>
