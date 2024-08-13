<template>
  <div class="home-main flex-1 overflow-auto flex flex-col">
    <ProfilePill />
    <!-- <Pill class="mt-4" color="darker" ripple @click="$router.push('/profile')">
      <div class="content flex gap-4">
        <img :src="getAsset('profile')" />
        <div class="profile-meta flex flex-col">
          <span class="text-xl font-bold">{{ getUserName() || "Unknown User" }}</span>
          <span class="font-bold text-[var(--accent-color)]">Lord</span>
        </div>
      </div>
    </Pill> -->

    <!-- <Pill class="mt-12 flex-1 rounded-3xl bg-[var(--grey-darker)]">
      <p class="text-2xl font-bold mt-2">Main page</p>
      <p class="mt-2">This is a page where you can select a battle to participate in</p>

      <Pill class="mt-4 rounded-xl bg-[var(--grey-dark)]">
        <p class="text-xl font-bold">Battles list</p>

        <div class="pills-cnt mt-4 flex flex-col gap-4">
          <Pill class="rounded-xl bg-[var(--grey-light)] flex items-center justify-between gap-2">
            <div class="pill-start flex gap-4">
              <img src="/battle-single.png" />
              <div class="pill-text">
                <span class="text-lg font-bold">Single answer</span>
                <div class="coins-cnt flex items-center gap-1">
                  <img src="/coin.png" class="mb-1" />
                  <span class="font-bold text-[var(--accent-color)]">+300</span>
                </div>
              </div>
            </div>
            <div class="pill-end">
              <svg width="9" height="16" viewBox="0 0 9 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M0.180771 0.180771C0.237928 0.123469 0.305828 0.0780065 0.380583 0.0469869C0.455337 0.0159672 0.535477 0 0.616412 0C0.697347 0 0.777487 0.0159672 0.852241 0.0469869C0.926996 0.0780065 0.994896 0.123469 1.05205 0.180771L8.4358 7.56452C8.4931 7.62168 8.53857 7.68958 8.56959 7.76433C8.60061 7.83909 8.61657 7.91923 8.61657 8.00016C8.61657 8.0811 8.60061 8.16124 8.56959 8.23599C8.53857 8.31074 8.4931 8.37865 8.4358 8.4358L1.05205 15.8196C0.936514 15.9351 0.779809 16 0.616412 16C0.453015 16 0.29631 15.9351 0.180771 15.8196C0.0652316 15.704 0.000322157 15.5473 0.000322157 15.3839C0.000322157 15.2205 0.0652316 15.0638 0.180771 14.9483L7.13011 8.00016L0.180771 1.05205C0.123469 0.994897 0.078006 0.926996 0.0469863 0.852242C0.0159666 0.777487 0 0.697347 0 0.616412C0 0.535478 0.0159666 0.455338 0.0469863 0.380583C0.078006 0.305829 0.123469 0.237928 0.180771 0.180771Z"
                  fill="white"
                />
              </svg>
            </div>
          </Pill>
          <Pill class="rounded-xl bg-[var(--grey-light)] flex items-center justify-between gap-2">
            <div class="pill-start flex gap-4">
              <img src="/battle-multi.png" />
              <div class="pill-text">
                <span class="text-lg font-bold">Multi answer</span>
                <div class="coins-cnt flex items-center gap-1">
                  <img src="/coin.png" class="mb-1" />
                  <span class="font-bold text-[var(--accent-color)]">+500</span>
                </div>
              </div>
            </div>
            <div class="pill-end">
              <svg width="9" height="16" viewBox="0 0 9 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M0.180771 0.180771C0.237928 0.123469 0.305828 0.0780065 0.380583 0.0469869C0.455337 0.0159672 0.535477 0 0.616412 0C0.697347 0 0.777487 0.0159672 0.852241 0.0469869C0.926996 0.0780065 0.994896 0.123469 1.05205 0.180771L8.4358 7.56452C8.4931 7.62168 8.53857 7.68958 8.56959 7.76433C8.60061 7.83909 8.61657 7.91923 8.61657 8.00016C8.61657 8.0811 8.60061 8.16124 8.56959 8.23599C8.53857 8.31074 8.4931 8.37865 8.4358 8.4358L1.05205 15.8196C0.936514 15.9351 0.779809 16 0.616412 16C0.453015 16 0.29631 15.9351 0.180771 15.8196C0.0652316 15.704 0.000322157 15.5473 0.000322157 15.3839C0.000322157 15.2205 0.0652316 15.0638 0.180771 14.9483L7.13011 8.00016L0.180771 1.05205C0.123469 0.994897 0.078006 0.926996 0.0469863 0.852242C0.0159666 0.777487 0 0.697347 0 0.616412C0 0.535478 0.0159666 0.455338 0.0469863 0.380583C0.078006 0.305829 0.123469 0.237928 0.180771 0.180771Z"
                  fill="white"
                />
              </svg>
            </div>
          </Pill>
        </div>
      </Pill>
    </Pill> -->
  </div>
</template>

<script setup lang="ts">
import Pill from "@/components/UI/Pill.vue";
import { useDataStore } from "@/store/data.ts";
import { storeToRefs } from "pinia";
import { getAsset } from "../utils";
import { tg, getUserName } from "@/api/telegram";
import ProfilePill from "@/components/ProfilePill.vue";

const dataStore = useDataStore();
const { profile: data } = storeToRefs(dataStore);
</script>
