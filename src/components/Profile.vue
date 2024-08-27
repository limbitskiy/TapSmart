<template>
  <Pill class="m-4 border border-gray-600" color="dark" ripple @click="$router.push('/profile')">
    <div class="content flex gap-2 items-center">
      <img :src="getAsset('avatar1')" />
      <div class="profile-meta flex flex-col flex-1">
        <span class="text-xl font-bold">{{ userName || "Unknown Tiger" }}</span>
        <div class="rank-money flex gap-2">
          <span class="text-md text-[var(--accent-color)]">{{ data["rank"] }}</span>
          <span>•</span>
          <div class="coins flex gap-1 items-center">
            <img class="h-4" :src="getAsset('coin')" />
            <span class="text-md">{{ data["bolts"] }}</span>
          </div>
          <span>•</span>
          <div class="energy flex gap-1 items-center">
            <img class="h-4" :src="getAsset('energy')" />
            <span class="text-md">{{ battle["energy"] }}</span>
          </div>
        </div>
        <div class="progress mt-2 bg-gray-400 rounded-full w-full h-1">
          <div class="value rounded-full bg-[var(--green-color)] w-[30%] h-1"></div>
        </div>
      </div>
    </div>
  </Pill>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { getUserName, userName } from "@/api/telegram";
import { getAsset } from "@/utils";

// stores
import { useDataStore } from "@/store/data.ts";
import { useLocaleStore } from "@/store/locale.ts";

// components
import Pill from "@/components/UI/Pill.vue";

const dataStore = useDataStore();
const localeStore = useLocaleStore();

const { profile: data, battle } = storeToRefs(dataStore);
const { profile: locale } = storeToRefs(localeStore);
</script>
