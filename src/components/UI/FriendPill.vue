<template>
  <li>
    <Pill class="!py-2">
      <div class="pill-content flex items-center justify-between w-full">
        <!-- <slot name="start"> -->
        <div class="start flex items-center gap-3 flex-1">
          <!-- avatar -->
          <div class="avatar flex w-[50px] h-[50px] rounded-xl overflow-hidden border-[1px] border-[var(--grey-dark)]">
            <img v-if="data.avatar" :src="data.avatar" />
            <img v-else :src="getAsset('avatar-placeholder')" />
          </div>

          <!-- meta -->
          <div class="friend-meta flex flex-col justify-between flex-1">
            <!-- name + score -->
            <div class="name-score flex items-center justify-between">
              <div class="name flex gap-1">
                <span class="fira-semibold leading-5">{{ sliceTextAmount(data.name, 15) }}</span>
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
                  <span class="fira-semibold">{{ shortenNumber(data.points_earned) || 0 }}</span>
                </div>
                <div v-show="!battleFilter" class="money-earned flex items-center">
                  <img class="scale-75" :src="getAsset('bolt_earned')" />
                  <span class="fira-semibold">{{ shortenNumber(data.bolts_earned) || 0 }}</span>
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
                <img class="h-5" :src="getAsset('bolt')" />
                <span class="text-sm fira-semibold leading-4">{{ shortenNumber(data.bolts) || 0 }}</span>
              </div>
              <div class="battle quan flex items-center gap-1">
                <img class="h-5" :src="getAsset('swords')" />
                <span class="text-sm fira-semibold leading-4">{{ data.battle_quan || 0 }}</span>
              </div>

              <div v-if="data.has_prize_icon" class="present-icon">
                <img class="h-5" :src="getAsset('present')" />
              </div>
            </div>
          </div>
        </div>

        <!-- data -->
      </div>
    </Pill>
  </li>
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
    avatar: string | null;
    battle_quan: number;
    bolts_earned: number;
    points_earned: number;
    has_prize_icon: boolean;
  };
  battleFilter: boolean;
}>();
</script>
