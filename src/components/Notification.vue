<template>
  <div
    class="notification flex flex-col text-lg fixed top-0 left-0 right-0 p-4 text-white transition-transform z-50"
    style="background: linear-gradient(103.32deg, #353535 6.07%, #1a1a1a 98.61%)"
  >
    <!-- title & subtitle -->
    <div class="top flex gap-4">
      <div class="icon pt-2 scale-75">
        <svg width="46" height="46" viewBox="0 0 46 46" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M10.4997 4.29193C14.1998 1.8196 18.5499 0.5 23 0.5C28.9674 0.5 34.6903 2.87053 38.9099 7.0901C43.1295 11.3097 45.5 17.0326 45.5 23C45.5 27.4501 44.1804 31.8002 41.7081 35.5003C39.2357 39.2004 35.7217 42.0843 31.6104 43.7873C27.499 45.4902 22.975 45.9358 18.6105 45.0677C14.2459 44.1995 10.2368 42.0566 7.09011 38.9099C3.94343 35.7632 1.80051 31.7541 0.932341 27.3895C0.0641742 23.025 0.509749 18.501 2.21272 14.3896C3.91569 10.2783 6.79957 6.76426 10.4997 4.29193ZM11.7696 39.8076C15.0938 42.0287 19.002 43.2143 23 43.2143C28.3612 43.2143 33.5027 41.0846 37.2937 37.2937C41.0846 33.5027 43.2143 28.3612 43.2143 23C43.2143 19.002 42.0287 15.0938 39.8076 11.7695C37.5864 8.44532 34.4294 5.85441 30.7357 4.32443C27.042 2.79446 22.9776 2.39415 19.0564 3.17413C15.1352 3.9541 11.5334 5.87932 8.70635 8.70634C5.87933 11.5334 3.95411 15.1352 3.17414 19.0564C2.39416 22.9776 2.79447 27.042 4.32444 30.7357C5.85442 34.4293 8.44533 37.5864 11.7696 39.8076Z"
            fill="#E42A2A"
            stroke="#E42A2A"
          />
          <path d="M21.8571 10.3574H24.1428V27.4288H21.8571V10.3574Z" fill="#E42A2A" stroke="#E42A2A" />
          <path
            d="M21.9087 33.6885C22.2317 33.4726 22.6115 33.3574 23 33.3574C23.521 33.3574 24.0206 33.5644 24.3889 33.9327C24.7573 34.3011 24.9643 34.8007 24.9643 35.3217C24.9643 35.7102 24.8491 36.09 24.6332 36.413C24.4174 36.736 24.1106 36.9878 23.7517 37.1365C23.3928 37.2851 22.9978 37.324 22.6168 37.2482C22.2357 37.1725 21.8857 36.9854 21.611 36.7107C21.3363 36.436 21.1492 36.086 21.0734 35.7049C20.9977 35.3239 21.0366 34.9289 21.1852 34.57C21.3339 34.2111 21.5857 33.9043 21.9087 33.6885Z"
            fill="#E42A2A"
            stroke="#E42A2A"
          />
        </svg>
      </div>
      <div class="text flex flex-col">
        <span class="text-xl fira-condensed-bold text-gray-100">{{ data.title }}</span>
        <span class="fira-condensed text-sm inline-svg svg-top-margin my-1" v-html="replaceWithSpecialSymbols(data.subtitle)"></span>
      </div>
    </div>

    <!-- buttons -->
    <div class="btns flex justify-end gap-8 px-2">
      <Button v-if="!data.buttons?.left?.hidden" class="text-base text-[var(--red-color)]" :data="data.buttons.left" :defaultAction="hideNotification" unstyled></Button>
      <Button v-if="!data.buttons?.right?.hidden" class="text-base text-[var(--green-color)]" :data="data.buttons.right" :defaultAction="hideNotification" unstyled></Button>
    </div>

    <!-- timeout progress -->
    <div
      class="timeout-progress h-[2px] bg-red-500 absolute left-0 bottom-0 right-0 rounded"
      style="transform-origin: left"
      :style="{ transition: `transform ${timeout}s linear`, transform: `scaleX(${scaleX})` }"
    ></div>
  </div>
</template>

<script setup lang="ts">
// :style="{ transition: `transform ${timeout}s linear`, transform: start ? 'scaleX(0)' : null }"
import { onMounted, ref, computed } from "vue";
import { storeToRefs } from "pinia";
import { getAsset, replaceWithSpecialSymbols } from "@/utils";

const props = defineProps<{
  data: {};
  hideNotification: () => void;
}>();

// store
// import { useMainStore } from "@/store/main";

const start = ref(true);
const timeout = computed(() => props.data?.timeout / 1000);
const scaleX = computed(() => (timeout.value ? 0 : 100));

// const store = useMainStore();
// const { notification } = storeToRefs(store);
// const { hideNotification } = store;

onMounted(() => {
  // console.log(`notification mounted`);
  // console.log(`timeout: `, notification.value.timeout);
  // start.value = true;
  // setTimeout(() => {
  // }, 100);
});
</script>
