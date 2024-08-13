<template>
  <div id="profile" class="flex-1">
    <div class="top-part p-5 mb-4">
      <div class="page-title mb-4">{{ getLocale("title") }}</div>
      <div class="page-subtitle">{{ getLocale("subtitle") }}</div>
    </div>

    <Pill class="py-8" color="darker">
      <span class="pill-title">{{ getLocale("stats_title") }}</span>

      <div class="pill-grid grid grid-cols-2 gap-4">
        <Pill class="mt-4" color="dark" ripple>
          <div class="content flex flex-col gap-2 items-center justify-between text-center">
            <span class="text-xl font-semibold text-gray-300">{{ getLocale("coins_earned") }}</span>
            <div class="price flex gap-2 items-center">
              <img class="h-6" src="/coin.png" />
              <span class="text-xl font-bold text-[var(--accent-color)]">{{ getStoreData("coins") }}</span>
            </div>
          </div>
        </Pill>

        <Pill class="mt-4" color="dark" ripple>
          <div class="content flex flex-col gap-2 items-center justify-between text-center">
            <span class="text-xl font-semibold text-gray-300">{{ getLocale("points_earned") }}</span>
            <div class="price flex gap-2 items-center">
              <img class="h-6" src="/point.png" />
              <span class="text-xl font-bold text-purple-500">{{ getStoreData("points") }}</span>
            </div>
          </div>
        </Pill>
      </div>

      <Pill class="mt-4" color="dark" ripple>
        <div class="content flex gap-2 items-center justify-between">
          <span class="text-xl font-semibold text-gray-300">{{ getLocale("battles_played") }}</span>
          <div class="price flex gap-2 items-center">
            <img class="h-6" src="/swords.png" />
            <span class="text-xl font-bold">{{ getStoreData("battles") }}</span>
          </div>
        </div>
      </Pill>

      <Pill class="mt-4" color="dark" ripple>
        <div class="content flex gap-2 items-center justify-between">
          <span class="text-xl font-semibold text-gray-300">{{ getLocale("words_learned") }}</span>
          <div class="price flex gap-2 items-center">
            <img class="h-6" src="/book.png" />
            <span class="text-xl font-bold">{{ getStoreData("learned") }}</span>
          </div>
        </div>
      </Pill>
    </Pill>

    <Settings @change="onSettingsChange" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/store/user.ts";
import Pill from "@/components/UI/Pill.vue";
import Settings from "@/components/Settings.vue";
import { useStoreHelpers } from "@/composables/useStoreHelpers";
import { tg } from "@/api/telegram";

const { getLocale, getStoreData } = useStoreHelpers("profile");
const userStore = useUserStore();

const { setLanguages } = userStore;

const router = useRouter();

tg.BackButton.show();
tg.BackButton.onClick(() => {
  tg.BackButton.hide();
  router.push("/home/battles");
});

const onSettingsChange = ({ setting, value }) => {
  setLanguages({ [setting]: value });
};
</script>
