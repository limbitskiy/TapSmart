<template>
  <div id="init" class="h-dvh flex flex-col gap-2 justify-between bg-gradient-to-b from-[#FEAC3E] to-[#E46C02] overflow-hidden relative">
    <!-- loader -->
    <div v-if="isLoaderShown" class="loader absolute inset-0 bg-black z-[99]"></div>

    <!-- bg pattern -->
    <div class="bg-pattern absolute inset-0 z-1">
      <img class="h-full w-full object-cover" src="/loader/gradient-bg.webp" />
    </div>

    <!-- main image -->
    <div class="main-image h-dvh grid grid-flow-col grid-rows-[30%_auto_30%] items-center gap-2 p-4 z-[2] pb-8">
      <!-- tiger 1 cutout -->
      <div class="tiger1-circle h-full">
        <div class="image-wrap relative h-full aspect-square">
          <div class="wave-top bg-[#4AE823] inset-0 rounded-full absolute scale-75"></div>
          <div class="shadow-cnt absolute inset-0">
            <svg class="absolute left-0 right-0 -bottom-[8dvh] w-full" width="276" height="130" viewBox="0 0 276 130" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g filter="url(#filter0_f_2400_2272)">
                <ellipse cx="136" cy="65" rx="90" ry="15" fill="black" fill-opacity="0.8" />
              </g>
              <defs>
                <filter id="filter0_f_2400_2272" x="-4" y="0" width="280" height="130" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                  <feFlood flood-opacity="0" result="BackgroundImageFix" />
                  <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                  <feGaussianBlur stdDeviation="25" result="effect1_foregroundBlur_2400_2272" />
                </filter>
              </defs>
            </svg>
          </div>
          <img class="object-contain absolute inset-0 h-full" src="/loader/white-circle1.webp" />
          <Transition name="fade">
            <img v-if="tiger1Animations.success" class="object-contain absolute inset-0 h-full" src="/loader/green-circle1.webp" />
          </Transition>
          <img ref="topImageRef" class="object-contain absolute inset-0 h-full" src="/loader/tiger-cutout1-norim.webp" />
        </div>
      </div>

      <!-- title & progress -->
      <div class="title-progress mx-auto w-[70vw] flex flex-col gap-2">
        <!-- title -->
        <img src="/loader/title.webp" />

        <!-- progress pill -->
        <div class="flex items-center gap-4">
          <div class="progress-bar flex-1 flex flex-col relative">
            <!-- top row -->
            <div class="top-row px-[25px] py-1">
              <img class="top-marker w-[36px]" src="/loader/tiger-cutout1-small.webp" />
            </div>

            <!-- middle row -->
            <div class="middle-row rounded-xl py-[6px] mx-8 px-2 bg-[var(--grey-dark)]">
              <div ref="gaugeRef" class="gauge h-[8px] p-[1px] bg-[var(--grey-light)] rounded-[11px] w-full">
                <div class="gauge-value h-full rounded-[11px] w-[1%]" style="background: linear-gradient(180deg, #519a58 -1.1%, #ffffff 14.3%, #519a58 30.4%, #275a2c 120%)"></div>
              </div>
            </div>

            <!-- bottom row -->
            <div class="bottom-row px-[27px] py-1">
              <img class="bottom-marker w-[36px]" src="/loader/tiger-cutout2-small.webp" />
            </div>

            <!-- present -->
            <div class="present absolute -right-5 top-[27px]">
              <img class="w-[50px]" src="/loader/present.webp" />
            </div>
          </div>
        </div>
      </div>

      <!-- tiger 2 cutout -->
      <div class="tiger2-circle h-full">
        <div class="image-wrap relative h-full aspect-square ml-auto">
          <div class="wave-bottom bg-[#4AE823] inset-0 rounded-full absolute scale-75"></div>
          <div class="shadow-cnt absolute inset-0">
            <svg class="absolute left-0 right-0 -bottom-[8dvh] w-full" width="276" height="130" viewBox="0 0 276 130" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g filter="url(#filter0_f_2400_2272)">
                <ellipse cx="136" cy="65" rx="90" ry="15" fill="black" fill-opacity="0.8" />
              </g>
              <defs>
                <filter id="filter0_f_2400_2272" x="-4" y="0" width="280" height="130" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                  <feFlood flood-opacity="0" result="BackgroundImageFix" />
                  <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                  <feGaussianBlur stdDeviation="25" result="effect1_foregroundBlur_2400_2272" />
                </filter>
              </defs>
            </svg>
          </div>
          <img class="object-contain ml-auto absolute inset-0 h-full" src="/loader/white-circle1.webp" />
          <Transition name="fade">
            <img v-if="tiger2Animations.success" class="object-contain ml-auto absolute inset-0 h-full" src="/loader/green-circle1.webp" />
          </Transition>
          <img ref="bottomImageRef" class="h-full absolute inset-0 object-contain" src="/loader/tiger-cutout2-norim.webp" />
        </div>
      </div>
    </div>

    <!-- service info -->
    <div class="service-cnt flex flex-col items-center px-4 py-0 bg-[var(--grey-dark)] absolute bottom-0 left-0 right-0 z-[2]">
      <div class="top flex items-center justify-between w-full">
        <!-- loading text -->
        <div class="loading-text text-[var(--accent-color)] exo-bold">Loading...</div>

        <!-- version number -->
        <div class="build-no text-[12px] text-[var(--accent-color)] fira-bold leading-4">build: {{ version }}</div>
      </div>

      <!-- errors -->
      <div class="errors w-full">
        <ul class="error-list w-full flex flex-col items-start">
          <li v-for="error in errors" :key="error" class="text-red-500 text-sm leading-4">{{ error }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import { useRoute } from "vue-router";
import { waitFor } from "@/utils";
import { tg, setThemeColor } from "@/api/telegram";
import constants from "@/constants";
import { version } from "@/../package.json";
import gsap from "gsap";

// composables
import preloadAssets from "@/utils/preloadAssets";
import loadNonEssentialAssets from "@/utils/loadNonEssentialAssets";

// stores
import { useMainStore } from "@/store/main";

const { botName } = constants;

const route = useRoute();
const store = useMainStore();

const { startApp, initialFetch } = store;
const { addSound, playSound } = store.soundStore;

const errors = ref([]);
const gaugeRef = ref();
const animationDuration = ref(2);
const markerPositions = {
  top: 0,
  bottom: 0,
};
const tiger1Animations = ref({
  success: false,
});
const tiger2Animations = ref({
  success: false,
});
const topImageRef = ref();
const bottomImageRef = ref();
const isLoaderShown = ref(true);

const assetsPreloaded = ref(false);
const introProgressFinished = ref(false);

let gsapCtx;

tg?.ready();

tg?.disableVerticalSwipes();

tg?.expand();

setThemeColor("#222");

console.log("tg:", tg);

Promise.allSettled([
  initialFetch({
    fullPath: route.fullPath,
    botName,
    host: location?.href?.slice(0, -5),
    tg: {
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      rawInitData: tg?.initData,
      initData: tg?.initDataUnsafe,
      version: tg?.version,
      platform: tg?.platform,
    },
  }),
  preloadAssets({ addSound }),
  waitFor(2000),
]).then((data) => {
  const preloadErrors = [data[0], ...data[1].value].filter((p) => p.status === "rejected");

  if (preloadErrors.length) {
    errors.value = preloadErrors.map((err) => err.reason);
    return;
  }

  // loadNonEssentialAssets();

  assetsPreloaded.value = true;

  if (introProgressFinished.value) {
    // startApp();
  }
  // playSound("soundtrack");
});

const generateRandomMarkerDuration = () => {
  const newValue = animationDuration.value / gsap.utils.random(2, 4);
  // markerPositions[type] += newValue;

  return newValue;
};

onMounted(() => {
  gsapCtx = gsap.context(() => {
    // preload big images
    const cutouts = [topImageRef.value, bottomImageRef.value];
    let loadedImages = 0;

    cutouts.forEach((img) => {
      img.addEventListener("load", () => {
        loadedImages += 1;

        if (loadedImages === 2) {
          isLoaderShown.value = false;
          progressTimeline.resume();
          topMarkerTimeline.resume();
          bottomMarkerTimeline.resume();
          loadingTextTimeline.resume();
        }
      });
    });

    // present animation
    // gsap.set(".present", { rotate: 0 });

    const pMasterTl = gsap.timeline({ paused: true });
    const pScaleTl = gsap.timeline();
    const pShakeTl = gsap.timeline({ defaults: { duration: 0.1 } });

    pMasterTl.add(pScaleTl).add(pShakeTl);

    // shake
    pShakeTl.to(".present", {
      rotate: 5,
    });
    pShakeTl.to(".present", {
      rotate: -5,
    });
    pShakeTl.to(".present", {
      rotate: 5,
    });
    pShakeTl.to(".present", {
      rotate: -5,
    });
    pShakeTl.to(".present", {
      rotate: 5,
    });
    pShakeTl.to(".present", {
      rotate: 0,
    });

    // scale
    pScaleTl.to(".present", {
      scale: 1.3,
      duration: 0.2,
    });
    pScaleTl.to(".present", {
      scale: 1,
      duration: 0.2,
    });

    // progress-bar animation
    const progressTimeline = gsap.timeline({ paused: true });

    progressTimeline.to(".gauge-value", {
      width: "100%",
      duration: animationDuration.value,
      ease: "none",
      // onComplete: onCompleteCb,
    });

    // "loading" text animation
    const loadingTextTimeline = gsap.timeline({ paused: true, repeat: -1, defaults: { duration: 0.5, ease: "none" } });
    loadingTextTimeline.to(".loading-text", {
      opacity: 0,
    });
    loadingTextTimeline.to(".loading-text", {
      opacity: 1,
    });

    // top marker timeline
    const rect = gaugeRef.value.getBoundingClientRect();

    const topMarkerTimeline = gsap.timeline({
      paused: true,
      defaults: { translateX: `+=${(rect.width - 8) / 4}`, duration: () => generateRandomMarkerDuration(), ease: "none" },
      onComplete: () => onCompleteCb({ winner: "top" }),
    });
    topMarkerTimeline.to(".top-marker", {});
    topMarkerTimeline.to(".top-marker", {});
    topMarkerTimeline.to(".top-marker", {});
    topMarkerTimeline.to(".top-marker", {});

    // bottom marker timeline
    const bottomMarkerTimeline = gsap.timeline({
      paused: true,
      defaults: { translateX: `+=${(rect.width - 8) / 4}`, duration: () => generateRandomMarkerDuration(), ease: "none" },
      onComplete: () => onCompleteCb({ winner: "bottom" }),
    });
    bottomMarkerTimeline.to(".bottom-marker", {});
    bottomMarkerTimeline.to(".bottom-marker", {});
    bottomMarkerTimeline.to(".bottom-marker", {});
    bottomMarkerTimeline.to(".bottom-marker", {});

    function onCompleteCb(params) {
      pMasterTl.resume();

      if (params.winner === "top") {
        tiger1Animations.value.success = true;

        bottomMarkerTimeline.pause();

        if (CSS.supports("aspect-ratio: 1/1")) {
          gsap.to(".wave-top", {
            opacity: 0,
            scale: 1.5,
            duration: 1,
          });
        }
      } else {
        tiger2Animations.value.success = true;
        topMarkerTimeline.pause();
        bottomMarkerTimeline.pause();

        if (CSS.supports("aspect-ratio: 1/1")) {
          gsap.to(".wave-bottom", {
            opacity: 0,
            scale: 1.5,
            duration: 1,
          });
        }
      }

      // setTimeout(() => {
      //   introProgressFinished.value = true;

      // if (assetsPreloaded.value) {
      startApp();
      // }
      // }, 1000);
    }
  });
});

onUnmounted(() => {
  gsapCtx.revert();
});
</script>
