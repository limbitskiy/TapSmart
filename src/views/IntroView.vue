<template>
  <div id="intro" class="intro-cnt flex-1 flex flex-col relative h-dvh" style="background: linear-gradient(180deg, #000000 0%, #740c0d 100%)">
    <div class="intro-elements flex flex-col gap-2 p-4">
      <div class="intro-title">
        <h2 class="fira-bold mb-3 text-[34px]">
          {{ locale?.slides[0]?.["title"] ?? "Добро пожаловать в" }}
        </h2>
      </div>
      <img class="" :src="getAsset('prize_img')" />
      <div class="intro-subtitle">
        <span class="page-subtitle">{{
          locale?.slides[0]?.["subtitle"] ??
          "- это практика 42-х иностранных языков в соревновании с другими игроками. Здесь можно своими мозгами зарабатывать на реальные товары и услуги"
        }}</span>
      </div>
    </div>

    <!-- bg image -->
    <div class="flex-1 ml-[30vw]" :style="`background: center top/ cover no-repeat url(${getAsset('prize_bg')})`"></div>

    <div class="bnt-cnt flex justify-center fixed bottom-0 left-0 right-0 px-4 pb-4 z-10">
      <!-- <Button dark @click="onSkip">{{ locale?.["button_skip"] }}</Button> -->
      <Button class="w-[50%]" @click="onNext">Got it</Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { getAsset } from "@/utils";
import gsap from "gsap";

// stores
import { useMainStore } from "@/store/main";

const store = useMainStore();

const {} = store;
const {} = storeToRefs(store.dataStore);
const { intro: locale } = storeToRefs(store.localeStore);

const onSkip = () => {};
const onNext = () => {};
</script>
