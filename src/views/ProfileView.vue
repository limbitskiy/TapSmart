<template>
  <div id="profile" class="flex-1">
    <div class="top-part p-5 mb-4">
      <div class="page-title mb-4">{{ locale["title"] }}</div>
      <div class="page-subtitle">{{ locale["subtitle"] }}</div>
    </div>

    <Pill class="py-8 mb-12" color="dark">
      <span class="bg-pill-title">{{ locale["stats_title"] }}</span>

      <!-- <div class="pill-grid grid grid-cols-2 gap-4"> -->
      <Pill class="mt-4" color="light" ripple>
        <div class="content flex flex-col gap-2 items-center justify-between text-center">
          <span class="text-xl font-semibold text-gray-300">{{ locale["bolts"] }}</span>
          <div class="price flex gap-2 items-center">
            <img class="h-4" :src="getAsset('bolt')" />
            <span class="text-xl font-bold exo-bold">{{ data["bolts"] }}</span>
          </div>
        </div>
      </Pill>

      <Pill class="mt-4" color="light" ripple>
        <div class="content flex flex-col gap-2 items-center justify-between text-center">
          <span class="text-xl font-semibold text-gray-300">{{ locale["nuts"] }}</span>
          <div class="price flex gap-2 items-center">
            <img class="h-4" :src="getAsset('nut')" />
            <span class="text-xl font-bold exo-bold">{{ data["nuts"] }}</span>
          </div>
        </div>
      </Pill>
      <!-- </div> -->

      <Pill class="mt-4" color="light" ripple>
        <div class="content flex gap-2 items-center justify-between">
          <span class="text-xl font-semibold text-gray-300">{{ locale["battles_played"] }}</span>
          <div class="price flex gap-2 items-center">
            <img class="h-6" src="/swords.png" />
            <span class="text-xl font-bold">{{ data["battles"] }}</span>
          </div>
        </div>
      </Pill>

      <Pill class="mt-4" color="light" ripple>
        <div class="content flex gap-2 items-center justify-between">
          <span class="text-xl font-semibold text-gray-300">{{ locale["words_learned"] }}</span>
          <div class="price flex gap-2 items-center">
            <img class="h-6" src="/book.png" />
            <span class="text-xl font-bold">{{ data["learned"] }}</span>
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
import { tg } from "@/api/telegram";
import { storeToRefs } from "pinia";
import { getAsset } from "@/utils";

// store
import { useMainStore } from "@/store/main.ts";
import { useDataStore } from "@/store/data.ts";
import { useLocaleStore } from "@/store/locale.ts";

// components
import Pill from "@/components/UI/Pill.vue";
import Settings from "@/components/Settings.vue";

const mainStore = useMainStore();
const dataStore = useDataStore();
const localeStore = useLocaleStore();

const { profile: data } = storeToRefs(dataStore);
const { profile: locale } = storeToRefs(localeStore);

const { setLanguages } = mainStore;

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
