<template>
  <Pill class="!py-2">
    <div class="pill-content flex items-center justify-between w-full">
      <!-- <slot name="start"> -->
      <div class="start flex items-center gap-3 flex-1">
        <!-- avatar -->
        <div class="avatar flex">
          <img class="h-[55px]" :src="getAsset('avatar-placeholder')" />
        </div>

        <!-- meta -->
        <div class="friend-meta flex flex-col justify-between flex-1">
          <!-- name + score -->
          <div class="name-score flex items-center justify-between">
            <div class="name flex gap-1">
              <span class="fira-condensed-bold leading-5">{{ sliceTextAmount(data.name, 15) }}</span>
              <span class="status w-2 h-2 rounded-full" :class="data.isOnline ? 'bg-green-600' : 'bg-gray-400'"></span>
            </div>
            <div class="scores">
              <div v-show="battleFilter" class="battles-played flex items-center gap-2">
                <!-- score icon -->
                <svg class="scale-75" width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clip-path="url(#clip0_582_1683)">
                    <circle cx="8.5" cy="8.5" r="8.5" fill="#3C95E3" />
                    <path
                      d="M8.48712 11.8272L5.08665 14L5.98829 9.92593L3 7.18272L6.94145 6.82963L8.48712 3L10.0328 6.82963L14 7.18272L10.9859 9.92593L11.8876 14L8.48712 11.8272Z"
                      fill="white"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_582_1683">
                      <rect width="17" height="17" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
                <span class="exo-bold">{{ shortenNumber(data.points_earned) || 0 }}</span>
              </div>
              <div v-show="!battleFilter" class="money-earned flex items-center">
                <img class="scale-75" :src="getAsset('bolt_earned')" />
                <span class="exo-bold">{{ shortenNumber(data.bolts_earned) || 0 }}</span>
              </div>
            </div>
          </div>

          <!-- title -->
          <div class="title-money flex items-center gap-2">
            <span class="text-sm text-[var(--accent-color)]">{{ data.title }}</span>
          </div>

          <!-- money & score -->
          <div class="wrap flex items-center gap-4">
            <div class="money flex items-center gap-1">
              <img class="scale-75" :src="getAsset('bolt')" />
              <span class="text-sm exo-bold">{{ shortenNumber(data.bolts) || 0 }}</span>
            </div>
            <div class="battle quan flex items-center">
              <img class="scale-75" :src="getAsset('swords')" />
              <span class="text-sm exo-bold">{{ data.battle_quan || 0 }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- data -->
    </div>
  </Pill>
</template>

<script setup lang="ts">
import { getAsset, shortenNumber, sliceTextAmount } from "@/utils";

defineProps<{
  data: {
    id: number;
    name: string;
    isOnline: boolean;
    title: string;
    money: string;
    moneyEarned: string;
    bolts: number;
  };
  battleFilter: boolean;
}>();
</script>
