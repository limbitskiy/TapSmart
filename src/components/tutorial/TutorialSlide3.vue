<template>
  <div class="tutorial-slide flex-1 flex flex-col gap-2 p-4" style="background: linear-gradient(180deg, #000000 0%, #362581 100%)">
    <div class="slide-text">
      <h2 class="fira-bold mb-3 text-[34px]">
        {{ tutorialLocale?.slides[2]?.["title"] ?? "Заголовок" }}
      </h2>
      <span class="page-subtitle">{{ tutorialLocale?.slides[2]?.["subtitle"] ?? "Подзаголовок" }}</span>
    </div>
    <div ref="battleCntRef" class="flex-1 flex p-4 mb-[50px] pointer-events-none relative scale-90">
      <FourAnswers type="relax" :task="tutorialLocale?.questions?.[currentTaskIdx]" :locales="battleLocale" :energy="10" :buttonsBlocked="false" />
      <div
        v-if="cursorPosition.top && cursorPosition.left"
        class="cursor absolute z-50"
        style="transition: 1s ease"
        :style="{ left: cursorPosition.left + 'px', top: cursorPosition.top + 'px', transform: `scale(${cursorScale})` }"
      >
        <svg width="27" height="35" viewBox="0 0 27 35" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M26.7646 17.0168C24.9935 15.1394 22.632 13.8549 20.1722 13.3609C19.0898 13.0645 18.0075 12.8668 16.9252 12.768C19.6802 9.50734 19.1882 4.56691 15.9412 1.80026C12.6942 -0.966385 7.77448 -0.472341 5.01943 2.78835C2.26439 6.04904 2.75636 10.9895 6.00338 13.7561C6.59375 14.2502 7.18411 14.6454 7.77448 14.843V17.0168L6.20017 15.5347C4.82265 14.1514 2.55957 14.1514 1.08366 15.5347C-0.293866 16.918 -0.392261 19.0918 0.985261 20.4751L5.51141 25.8108C5.7082 27.1941 6.20017 28.4786 6.88893 29.6643C7.3809 30.5536 8.06966 31.4429 8.75842 32.1345V34.0119C8.75842 34.6048 9.152 35 9.74237 35H23.124C23.616 35 24.108 34.506 24.108 34.0119V31.4429C25.9775 29.1703 26.9614 26.3048 26.9614 23.4394V17.7085C27.0598 17.3132 26.9614 17.1156 26.7646 17.0168ZM5.11783 7.72879C5.11783 4.4681 7.77448 1.89907 11.0215 1.99788C14.2685 1.99788 16.8268 4.66571 16.7284 7.9264C16.7284 9.70496 15.9412 11.2859 14.5637 12.3728V7.43236C14.5135 6.57605 14.1389 5.77148 13.5169 5.18359C12.8949 4.59569 12.0725 4.26899 11.2183 4.27048C9.44719 4.17167 7.87287 5.6538 7.87287 7.43236V12.5704C6.20017 11.5823 5.21622 9.70496 5.11783 7.72879ZM25.0919 23.3406C25.1903 25.9096 24.3047 28.3798 22.632 30.356C22.4353 30.5536 22.2385 30.7512 22.2385 31.0477V33.1226H10.8247V31.7393C10.8247 31.4429 10.6279 31.1465 10.4311 30.9488C9.74237 30.356 9.152 29.6643 8.66003 28.7751C8.06966 27.787 7.67608 26.6013 7.4793 25.4156C7.4793 25.2179 7.3809 25.0203 7.28251 24.8227L2.55957 19.1906C2.26439 18.8942 2.0676 18.4989 2.0676 18.0049C2.0676 17.6097 2.26439 17.1156 2.55957 16.8192C3.24833 16.2263 4.23228 16.2263 4.92104 16.8192L7.77448 19.6846V22.6489L9.64397 21.6608V7.43236C9.74237 6.7407 10.3327 6.14785 11.1199 6.24665C11.8087 6.24665 12.4974 6.7407 12.4974 7.43236V18.7954L14.4653 19.1906V14.6454C14.5637 14.5466 14.6621 14.5466 14.7605 14.4478C15.4492 14.4478 16.138 14.5466 16.8268 14.6454V19.6846L18.4011 19.9811V14.843L19.5818 15.1394C20.0738 15.2383 20.5658 15.4359 21.0577 15.6335V20.5739L22.632 20.8703V16.3251C23.5176 16.7204 24.3047 17.3132 24.9935 18.0049L25.0919 23.3406Z"
            fill="white"
          />
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { storeToRefs } from "pinia";

// battles
import FourAnswers from "@/components/battles/FourAnswers/FourAnswers.vue";

// stores
import { useMainStore } from "@/store/main";

const store = useMainStore();

const { tutorial: tutorialLocale, battles: battleLocale } = storeToRefs(store.localeStore);

const battleCntRef = ref();
const currentTaskIdx = ref(0);
const cursorPosition = ref({
  left: null,
  top: null,
});
const cursorScale = ref(1);

const cursorClick = () => {
  cursorScale.value = 0.7;

  setTimeout(() => {
    cursorScale.value = 1;
  }, 300);
};

const playAnimationCycle = () => {
  const scale = devicePixelRatio;
  const battleCntRect = battleCntRef.value.getBoundingClientRect();
  const header = document.querySelector(".battle-header-cnt");

  const mechBtn = header?.closest(".generic-btn");

  console.log(mechBtn);

  cursorPosition.value.left = battleCntRect.width / 2;
  cursorPosition.value.top = battleCntRect.height / 2;

  // first move
  setTimeout(() => {
    cursorPosition.value.left = 60 * scale;
    cursorPosition.value.top = 20 * scale;
  }, 1000);

  // mech btn click
  setTimeout(() => {
    cursorClick();
    mechBtn.style.backgroundColor = "#858585";
  }, 3000);

  setTimeout(() => {
    mechBtn.style.backgroundColor = "#272727";
  }, 3500);

  setTimeout(() => {
    playAnimationCycle();
  }, 5000);
};

onMounted(() => {
  playAnimationCycle();
});
</script>
