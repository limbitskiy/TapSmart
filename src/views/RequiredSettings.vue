<template>
  <div id="required-settings" class="flex-1">
    <div class="top-part p-5 mb-4">
      <div class="page-title mb-4">{{ getLocale("title") }}</div>
      <div class="page-subtitle">{{ getLocale("subtitle") }}</div>
    </div>

    <Settings />

    <div class="bnt-cnt flex justify-between absolute bottom-0 w-full">
      <Button class="w-full py-4" label="Next" @click="onNext">{{ getLocale("button_next") }}</Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from "vue";
import Button from "@/components/UI/Button.vue";
import { tg, getUserId } from "@/api/telegram";
import { useRouter } from "vue-router";
import { useStoreHelpers } from "@/composables/useStoreHelpers";
import Settings from "@/components/Settings.vue";

const { getLocale, getStoreData } = useStoreHelpers("requiredSettings");

const router = useRouter();

const onNext = () => {
  router.push("/home/battles");
};
</script>
