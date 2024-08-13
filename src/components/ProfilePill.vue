<template>
  <Pill class="m-4 border border-gray-600" color="dark" ripple @click="$router.push('/profile')">
    <div class="content flex gap-2 items-center">
      <img :src="getAsset('avatar1')" />
      <div class="profile-meta flex flex-col flex-1">
        <span class="text-xl font-bold">{{ getUserName() || "Unknown Tiger" }}</span>
        <div class="rank-money flex gap-2">
          <span class="text-md text-[var(--accent-color)]">{{ getStoreData("rank") }}</span>
          <span>•</span>
          <div class="coins flex gap-1 items-center">
            <img class="h-4" :src="getAsset('coin')" />
            <span class="text-md">{{ getStoreData("coins") }}</span>
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
import Pill from "@/components/UI/Pill.vue";
import { getAsset } from "@/utils";
import { useStoreHelpers } from "@/composables/useStoreHelpers";
import { getUserName } from "@/api/telegram";

const { getLocale, getStoreData } = useStoreHelpers("profile");
</script>
