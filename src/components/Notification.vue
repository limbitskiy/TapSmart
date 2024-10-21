<template>
  <div
    class="notification flex flex-col rounded-xl fixed top-2 left-4 right-4 min-h-[20dvh] transition-transform z-50 border border-gray-600"
    style="background: linear-gradient(103.32deg, #353535 6.07%, #1a1a1a 98.61%)"
  >
    <!-- header -->
    <div class="header text-center">
      <div class="header-text px-2 pb-0 pt-4">
        <span class="text-lg fira-condensed-bold text-white">{{ data.title }}</span>
      </div>
    </div>

    <!-- content -->
    <div class="content flex-1 text-center px-2 pt-2 pb-0 leading-4">
      <span class="fira-condensed text-sm text-gray-300 inline-svg svg-top-margin" v-html="replaceWithSpecialSymbols(data.subtitle)"></span>
    </div>

    <!-- buttons -->
    <div class="btns flex justify-around p-2 pb-4">
      <Button v-if="!data.buttons?.left?.hidden" class="text-[var(--red-color)]" :data="data.buttons.left" unstyled @click="hideNotification"></Button>
      <Button v-if="!data.buttons?.right?.hidden" class="text-[var(--green-color)]" :data="data.buttons.right" unstyled @click="hideNotification"></Button>
    </div>

    <!-- timeout progress -->
    <div
      class="timeout-progress h-[3px] bg-[var(--accent-color)] absolute left-3 bottom-0 right-3 rounded"
      :class="{ started: started }"
      :style="{ transition: `transform ${data.timeout - 100}ms linear` }"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import { getAsset, replaceWithSpecialSymbols } from "@/utils";

const props = defineProps<{
  data: {};
  hideNotification: () => void;
}>();

const started = ref(false);

onMounted(() => {
  // console.log(`notification mounted`);
  // console.log(`timeout: `, notification.value.timeout);
  setTimeout(() => {
    started.value = true;
  }, 100);
});
</script>
