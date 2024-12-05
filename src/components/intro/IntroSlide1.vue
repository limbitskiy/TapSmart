<template>
  <div class="tutorial-slide flex-1 flex flex-col relative" style="background: linear-gradient(180deg, #691ac5 0%, #330d5f 100%)">
    <!-- bg circle -->
    <div
      class="absolute -bottom-[35dvh] -left-[30dvh] rounded-full w-[100dvh] h-[100dvh] bg-[#121212] z-10"
      style="background: linear-gradient(196.71deg, #121212 10.04%, #2e2e2e 64.9%); box-shadow: 3px 2px 1px 4px rgba(0, 0, 0, 0.2)"
    ></div>

    <div class="intro-elements flex flex-col gap-2 p-4 z-20">
      <div class="intro-title">
        <h2 class="font-semibold mb-3 text-[34px]">
          {{ locale?.["title"] ?? "title" }}
        </h2>
      </div>
      <div class="intro-subtitle">
        <span class="page-subtitle">{{ locale?.["subtitle"] ?? "subtitle" }}</span>
      </div>
    </div>

    <!-- bg image -->
    <div class="flex-1 z-40" :style="`background: right bottom / contain no-repeat url(${getAsset('prize_bg')})`"></div>

    <!-- present -->
    <div class="present absolute top-[50%] left-[8%] w-[40vw] h-[40vw] grid place-items-center z-40">
      <div class="items grid place-items-center">
        <img class="ton absolute w-[50px] h-[50px]" :src="getAsset('prize_ton')" />
        <img class="nut absolute w-[50px] h-[50px]" :src="getAsset('prize_nut')" />
        <img class="star absolute w-[50px] h-[50px]" :src="getAsset('prize_star')" />
      </div>
      <img class="rays absolute w-full h-full scale-150" :src="getAsset('prize_rays')" />
      <img class="absolute w-full h-full" :src="getAsset('prize_present')" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";
import { getAsset } from "@/utils";
import gsap from "gsap";

defineProps<{
  locale: {};
}>();

let gsapCtx;

onMounted(() => {
  gsapCtx = gsap.context(() => {
    const tl = gsap.timeline();

    tl.set(".present", {
      scale: 0.5,
    });
    tl.to(".present", {
      scale: 1.2,
      ease: "back.out",
      duration: 0.5,
    });
    tl.to(
      ".rays",
      {
        rotate: 360,
        ease: "none",
        duration: 33,
        repeat: -1,
      },
      0
    );
    tl.to(
      ".ton",
      {
        y: "-=100",
        x: "-=50",
      },
      0.5
    );
    tl.to(
      ".nut",
      {
        y: "-=120",
      },
      0.7
    );
    tl.to(
      ".star",
      {
        y: "-=100",
        x: "+=50",
      },
      0.9
    );
  });
});

onUnmounted(() => {
  gsapCtx.kill();
});
</script>
