<template>
  <Teleport to="#modals">
    <Transition name="toast-slide">
      <div
        v-if="notification.isShown"
        class="notification glass flex flex-col text-lg fixed top-1 left-1 right-1 bg-[--grey-light] p-4 rounded-2xl text-white transition-transform z-50 border border-gray-600"
      >
        <span class="text-xl fira-condensed-bold text-gray-100">{{ notification.title }}</span>
        <!-- <span class="fira-condensed text-sm inline-svg" v-html="notification.subtitle"></span> -->
        <span class="fira-condensed text-sm inline-svg svg-top-margin leading-3 my-2" v-html="textWithSpecialSymbols(notification.subtitle)"></span>
        <div class="btns flex justify-end gap-4 mt-2">
          <Button
            v-if="!notification.buttons?.left?.hidden"
            class="!py-1 !text-lg text-white bg-[var(--red-color)] !rounded-lg"
            :data="notification.buttons.left"
            :defaultAction="hideNotification"
            activeColor="#ff8964"
          ></Button>
          <Button
            v-if="!notification.buttons?.right?.hidden"
            class="!py-1 !text-lg text-white bg-[var(--green-color)] !rounded-lg"
            :data="notification.buttons.right"
            :defaultAction="hideNotification"
            activeColor="#74d77d"
          ></Button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { storeToRefs } from "pinia";
import { getAsset, getSpecialSymbol } from "@/utils";

// store
import { useMainStore } from "@/store/main";

// components
import Button from "@/components/UI/Button.vue";

const userStore = useMainStore();
const { notification } = storeToRefs(userStore);
const { hideNotification } = userStore;

const textWithSpecialSymbols = (text) => text?.replace(/<bolt>/, getSpecialSymbol("bolt")).replace(/<nut>/, getSpecialSymbol("nut"));
</script>
