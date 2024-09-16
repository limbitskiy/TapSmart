<template>
  <div id="booster-select" class="flex-1 px-[2px] flex flex-col gap-4">
    <div class="pill-header flex items-center justify-between">
      <span class="bg-pill-title">{{ locale?.["booster_select_title"] || "Challenge" }}</span>
      <div class="nuts flex items-center gap-1">
        <img class="h-4" :src="getAsset('nut')" />
        <span class="exo-black">{{ showFormattedNumber(profile?.["nuts"]) }}</span>
      </div>
    </div>

    <div class="filters flex items-center justify-between">
      <!-- friends only filter button -->
      <button
        class="border rounded-full text-sm py-1 px-3 border-[var(--accent-color)] fira-semibold"
        :class="{ 'bg-[var(--accent-color)] text-[#333]': friendsOnly }"
        @click="onFriendsOnly"
      >
        <div class="flex relative">
          <span>{{ locale?.["friends_only"] || "Friends only" }}</span>
          <div
            class="badge text-sm text-black bg-[var(--accent-color)] rounded-md h-4 px-1 grid place-items-center leading-3 exo-bold absolute left-full -top-2"
            :class="{
              'bg-[#333] text-white border border-[#333]': friendsOnly,
            }"
          >
            {{ data["friends_only_badge"] || 0 }}
          </div>
        </div>
      </button>

      <!-- invite friends button -->
      <Button class="!text-base !py-1 !px-4" @click="onInviteFriends">{{ locale?.["invite_friends"] || "Invite friends" }}</Button>
    </div>

    <div class="boosters flex flex-col gap-4 flex-1">
      <span class="fira-bold text-lg">{{ locale?.["available_boosters"] || "Available boosters" }}</span>
      <div class="boosters-content">
        <!-- extra mistake -->
        <Pill
          color="light"
          id="extra-mistake"
          :class="{
            'outline outline-2 outline-[var(--accent-color)]': pickedBonuses['mistake'],
          }"
        >
          <div class="start flex gap-3">
            <div class="icon mt-1">
              <svg width="41" height="41" viewBox="0 0 41 41" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M20.5 0C16.4455 0 12.482 1.2023 9.11082 3.45487C5.73961 5.70744 3.11207 8.9091 1.56048 12.655C0.00888226 16.4009 -0.397086 20.5227 0.393911 24.4993C1.18491 28.476 3.13734 32.1287 6.00432 34.9957C8.87129 37.8627 12.524 39.8151 16.5007 40.6061C20.4773 41.3971 24.5991 40.9911 28.345 39.4395C32.0909 37.8879 35.2926 35.2604 37.5451 31.8892C39.7977 28.518 41 24.5545 41 20.5C41 15.0631 38.8402 9.8488 34.9957 6.00431C31.1512 2.15982 25.9369 0 20.5 0ZM30.75 28.3156C31.0898 28.6554 31.2807 29.1163 31.2807 29.5969C31.2807 30.0774 31.0898 30.5383 30.75 30.8781C30.4102 31.2179 29.9493 31.4088 29.4688 31.4088C28.9882 31.4088 28.5273 31.2179 28.1875 30.8781L20.5 23.1906L12.8125 30.9037C12.6442 31.072 12.4445 31.2055 12.2247 31.2965C12.0048 31.3876 11.7692 31.4345 11.5313 31.4345C11.2933 31.4345 11.0577 31.3876 10.8378 31.2965C10.618 31.2055 10.4183 31.072 10.25 30.9037C10.0818 30.7355 9.94828 30.5357 9.85722 30.3159C9.76616 30.0961 9.7193 29.8604 9.7193 29.6225C9.7193 29.3845 9.76616 29.1489 9.85722 28.9291C9.94828 28.7092 10.0818 28.5095 10.25 28.3412L17.9375 20.6025L10.0322 12.6331C9.69239 12.2933 9.50148 11.8324 9.50148 11.3519C9.50148 10.8713 9.69239 10.4104 10.0322 10.0706C10.372 9.73081 10.8329 9.53991 11.3134 9.53991C11.794 9.53991 12.2549 9.73081 12.5947 10.0706L20.5 18.0656L28.4053 10.1603C28.5736 9.99205 28.7733 9.85859 28.9932 9.76753C29.213 9.67647 29.4486 9.6296 29.6866 9.6296C29.9245 9.6296 30.1601 9.67647 30.38 9.76753C30.5998 9.85859 30.7996 9.99205 30.9678 10.1603C31.1361 10.3286 31.2695 10.5283 31.3606 10.7482C31.4517 10.968 31.4985 11.2036 31.4985 11.4416C31.4985 11.6795 31.4517 11.9151 31.3606 12.135C31.2695 12.3548 31.1361 12.5546 30.9678 12.7228L23.0625 20.6025L30.75 28.3156Z"
                  fill="#D26542"
                />
              </svg>
            </div>
            <div class="text flex flex-col">
              <span class="fira-semibold">{{ locale?.["extra_mistake_title"] || "Extra mistake" }}</span>
              <p class="text-gray-300">
                {{ locale?.["extra_mistake_text"] || "Extra mistake text" }}
              </p>
            </div>
          </div>
          <div class="end flex justify-end">
            <button
              v-if="pickedBonuses['mistake']"
              class="px-5 bg-[var(--accent-color)] text-black rounded-full fira-condensed-bold mt-2 py-1 flex items-center gap-2"
              @click="pickedBonuses['mistake'] = false"
            >
              {{ locale?.["button_active"] }}
            </button>
            <button
              v-else-if="data.boosters?.extra_mistake.price === 0"
              class="px-5 bg-[var(--green-color)] rounded-full fira-condensed-bold mt-2 py-1 flex items-center gap-2"
              @click="pickedBonuses['mistake'] = true"
            >
              <span class="exo-bold">{{ locale?.["enable_boost"] || "Enable" }}</span>
            </button>
            <button v-else class="px-5 bg-[var(--green-color)] rounded-full fira-condensed-bold mt-2 py-1 flex items-center gap-2" @click="pickedBonuses['mistake'] = true">
              <img class="h-4 scale-125" :src="getAsset('nut')" />
              <span class="exo-bold">{{ data.boosters?.extra_mistake.price }}</span>
            </button>
          </div>
        </Pill>

        <!-- extra time -->
        <Pill
          class="mt-4"
          color="light"
          id="extra-time"
          :class="{
            'outline outline-2 outline-[var(--accent-color)]': pickedBonuses['time'],
          }"
        >
          <div class="start flex gap-3">
            <div class="icon mt-1">
              <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M21 42C16.8466 42 12.7865 40.7684 9.33303 38.4609C5.8796 36.1534 3.18798 32.8736 1.59854 29.0364C0.00909895 25.1991 -0.406771 20.9767 0.403519 16.9031C1.21381 12.8295 3.21386 9.08767 6.15077 6.15077C9.08767 3.21386 12.8295 1.21381 16.9031 0.403519C20.9767 -0.406771 25.1991 0.00909895 29.0364 1.59854C32.8736 3.18798 36.1534 5.8796 38.4609 9.33303C40.7684 12.7865 42 16.8466 42 21C42 26.5696 39.7875 31.911 35.8493 35.8493C31.911 39.7875 26.5696 42 21 42ZM21 3.00001C17.4399 3.00001 13.9598 4.05569 10.9997 6.03356C8.03966 8.01142 5.73256 10.8226 4.37018 14.1117C3.0078 17.4008 2.65134 21.02 3.34587 24.5116C4.04041 28.0033 5.75474 31.2106 8.27209 33.7279C10.7894 36.2453 13.9967 37.9596 17.4884 38.6541C20.98 39.3487 24.5992 38.9922 27.8883 37.6298C31.1774 36.2675 33.9886 33.9604 35.9665 31.0003C37.9443 28.0402 39 24.5601 39 21C39 16.2261 37.1036 11.6477 33.7279 8.27209C30.3523 4.89643 25.7739 3.00001 21 3.00001Z"
                  fill="#519A58"
                />
                <path d="M27.885 30L19.5 21.615V7.5H22.5V20.37L30 27.885L27.885 30Z" fill="#519A58" />
              </svg>
            </div>
            <div class="text flex flex-col">
              <span class="fira-semibold">{{ locale?.["extra_battle_time_title"] || "Extra time" }}</span>
              <p class="text-gray-300">
                {{ locale?.["extra_battle_time_text"] || "Extra time text" }}
              </p>
            </div>
          </div>
          <div class="end flex justify-end">
            <button
              v-if="pickedBonuses['time']"
              class="px-5 bg-[var(--accent-color)] text-black rounded-full fira-condensed-bold mt-2 py-1 flex items-center gap-2"
              @click="pickedBonuses['time'] = false"
            >
              {{ locale?.["button_active"] }}
            </button>
            <button
              v-else-if="data.boosters?.extra_time.price === 0"
              class="px-5 bg-[var(--green-color)] rounded-full fira-condensed-bold mt-2 py-1 flex items-center gap-2"
              @click="pickedBonuses['time'] = true"
            >
              <span class="exo-bold">{{ locale?.["enable_boost"] || "Enable" }}</span>
            </button>
            <button v-else class="px-5 bg-[var(--green-color)] rounded-full fira-condensed-bold mt-2 py-1 flex items-center gap-2" @click="pickedBonuses['time'] = true">
              <img class="h-4 scale-125" :src="getAsset('nut')" />
              <span class="exo-bold">{{ data.boosters?.extra_time.price }}</span>
            </button>
          </div>
        </Pill>
      </div>
    </div>

    <Button class="flex-1 py-4 rounded-lg" @click="onStartBattle">
      <div class="flex justify-center gap-1">
        <span class="text-xl leading-4">{{ locale?.["button_booster_select"] || "Challenge" }}</span>
      </div>
    </Button>
  </div>
</template>

<script setup lang="ts">
import { tg, inviteFriend } from "@/api/telegram";
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { storeToRefs } from "pinia";
import { getAsset, showFormattedNumber } from "@/utils";

// components
import Pill from "@/components/UI/Pill.vue";
import Button from "@/components/UI/Button.vue";

// stores
import { useDataStore } from "@/store/data";
import { useLocaleStore } from "@/store/locale";

const emit = defineEmits<{
  startBattle: [payload: {}];
}>();

const pickedBonuses = ref({
  mistake: false,
  time: false,
});

const friendsOnly = ref(false);

const dataStore = useDataStore();
const localeStore = useLocaleStore();

const { battles: locale } = storeToRefs(localeStore);
const { profile } = storeToRefs(dataStore);
const { data } = storeToRefs(dataStore.battles);
const { stopBreakpoint, startBreakpoint } = dataStore.battles;

const onStartBattle = () => {
  const payloadObject = {
    extra_time: pickedBonuses.value.time ? 1 : 0,
    extra_mistake: pickedBonuses.value.mistake ? 1 : 0,
    friends_only: friendsOnly.value ? 1 : 0,
  };

  emit("startBattle", payloadObject);
};

const onFriendsOnly = () => {
  friendsOnly.value = !friendsOnly.value;
};

const onInviteFriends = () => {
  inviteFriend(locale.value?.["challenge_message"] || "Invite message");
};

onMounted(() => {
  startBreakpoint("challenge");
});

onBeforeUnmount(() => {
  startBreakpoint("battle");
});
</script>
