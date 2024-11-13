<template>
  <div class="notification glass flex flex-col rounded-xl fixed top-2 left-4 right-4 min-h-[20dvh] z-[70] p-[1px]">
    <div class="inner flex-1 flex flex-col gap-2 rounded-xl bg-[#222] p-4">
      <!-- header -->
      <div class="header text-center">
        <div class="header-text">
          <span class="text-lg fira-condensed-bold text-white">{{ data.title }}</span>
        </div>
      </div>

      <!-- content -->
      <div class="content flex-1 text-center leading-4">
        <span class="fira-condensed text-sm text-gray-300 inline-svg svg-top-margin" v-html="replaceWithSpecialSymbols(data.subtitle)"></span>
      </div>

      <!-- buttons -->
      <div class="btns flex justify-around">
        <Button v-if="!data.buttons?.left?.hidden" class="text-[var(--red-color)]" :data="data.buttons.left" unstyled @click="hideNotification"></Button>
        <Button v-if="!data.buttons?.right?.hidden" class="text-[var(--green-color)]" :data="data.buttons.right" unstyled @click="hideNotification"></Button>
      </div>

      <!-- timeout progress -->
      <div
        class="timeout-progress h-[3px] bg-[var(--red-color)] absolute left-3 bottom-0 right-3 rounded"
        :class="{ started: started }"
        :style="{ transition: `transform ${data.timeout - 100}ms linear` }"
      ></div>
    </div>
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
