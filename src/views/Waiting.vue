<template>
  <BackgroundPill id="waiting" class="flex flex-col gap-4 mt-[10dvh] relative">
    <div class="header flex flex-col gap-4">
      <div class="top-row flex-1 flex items-center justify-between">
        <span class="bg-pill-title">{{ locale?.["waiting_title"] || "Waiting" }}</span>
        <Button activeColor="#fcdcb0" class="close absolute top-4 right-4 z-50 !p-2 !rounded-lg" @click="onAbort">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M13.6146 11.7596L8.855 7L13.6146 2.2404C14.1285 1.72654 14.1285 0.899258 13.6146 0.385396C13.1007 -0.128465 12.2735 -0.128465 11.7596 0.385396L7 5.145L2.2404 0.385396C1.72654 -0.128465 0.899258 -0.128465 0.385396 0.385396C-0.128465 0.899258 -0.128465 1.72654 0.385396 2.2404L5.145 7L0.385396 11.7596C-0.128465 12.2735 -0.128465 13.1007 0.385396 13.6146C0.899258 14.1285 1.72654 14.1285 2.2404 13.6146L7 8.855L11.7596 13.6146C12.2735 14.1285 13.1007 14.1285 13.6146 13.6146C14.1248 13.1007 14.1248 12.2698 13.6146 11.7596Z"
              fill="#222222"
            />
          </svg>
        </Button>
      </div>

      <span class="">{{ locale?.["waiting_subtitle"] || "Waiting subtitle" }}</span>
      <Pill>
        <div class="timer text-center">
          <span class="exo-black text-3xl">{{ formattedTime(data?.["waiting_timer"]) ?? "00:00" }}</span>
        </div>
      </Pill>
    </div>

    <ul class="players flex-1 overflow-y-scroll flex flex-col gap-2">
      <li v-for="player in data?.['players_waiting'] || []" :key="player.id">
        <Pill class="flex flex-col !py-2">
          <div class="player-data flex gap-2 items-center">
            <div class="player-name flex">
              <div class="fixed-length-name whitespace-nowrap overflow-x-hidden text-ellipsis max-w-[50vw]">
                <span class="fira-bold text-lg max-w-1/2 text-ellipsis">{{ player.name }}</span>
              </div>
              <div v-if="player?.isFriend" class="friend-badge ml-2">
                <svg width="13" height="9" viewBox="0 0 13 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M3.9 4.5C5.15734 4.5 6.175 3.49353 6.175 2.25C6.175 1.00647 5.15734 0 3.9 0C2.64266 0 1.625 1.00647 1.625 2.25C1.625 3.49353 2.64266 4.5 3.9 4.5ZM5.46 5.14286H5.29141C4.86891 5.34375 4.39969 5.46429 3.9 5.46429C3.40031 5.46429 2.93312 5.34375 2.50859 5.14286H2.34C1.04812 5.14286 0 6.17946 0 7.45714V8.03571C0 8.56808 0.436719 9 0.975 9H6.825C7.36328 9 7.8 8.56808 7.8 8.03571V7.45714C7.8 6.17946 6.75187 5.14286 5.46 5.14286ZM9.75 4.5C10.8266 4.5 11.7 3.63616 11.7 2.57143C11.7 1.5067 10.8266 0.642857 9.75 0.642857C8.67344 0.642857 7.8 1.5067 7.8 2.57143C7.8 3.63616 8.67344 4.5 9.75 4.5ZM10.725 5.14286H10.6478C10.3655 5.23929 10.0669 5.30357 9.75 5.30357C9.43312 5.30357 9.13453 5.23929 8.85219 5.14286H8.775C8.36062 5.14286 7.97875 5.26138 7.64359 5.45223C8.13922 5.98058 8.45 6.6817 8.45 7.45714V8.22857C8.45 8.27277 8.43984 8.31496 8.43781 8.35714H12.025C12.5633 8.35714 13 7.92522 13 7.39286C13 6.14933 11.9823 5.14286 10.725 5.14286Z"
                    fill="#35D945"
                  />
                </svg>
              </div>
            </div>
          </div>
          <div class="other-info flex gap-2 items-center">
            <div class="league">
              <span class="league exo-bold">L: {{ player?.league || 0 }}</span>
            </div>
            <div class="battles flex items-center gap-1">
              <img class="h-4" :src="getAsset('swords')" />
              <span class="exo-bold">{{ player?.battles || 0 }}</span>
            </div>
            <div class="bolts flex items-center gap-1">
              <img class="h-4" :src="getAsset('bolt')" />
              <span class="exo-black text-[var(--accent-color)]">{{ player?.bolts || 0 }}</span>
            </div>
          </div>
        </Pill>
      </li>
    </ul>

    <div v-if="challengeProps.friends_only" class="btns w-full flex gap-4 mt-8">
      <Button class="flex-1 py-3 !px-0" activeColor="#525252" @click="onInviteFriend" :dark="data?.['players_waiting']?.length > 1">
        <span class="text-lg leading-4">{{ locale?.["button_waiting_invite"] || "Invite" }}</span>
      </Button>
      <Button class="flex-1 py-3 !px-0" activeColor="#fcdcb0" @click="onFriendStart" :disabled="data?.['players_waiting']?.length <= 1">
        <span class="text-lg leading-4">{{ locale?.["button_waiting_run"] || "Start" }}</span>
      </Button>
    </div>
  </BackgroundPill>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted, onBeforeUnmount } from "vue";
import { storeToRefs } from "pinia";
import { getAsset } from "@/utils";
import { tg, getUserName, inviteFriend } from "@/api/telegram";
import { useRoute } from "vue-router";
import { formattedTime } from "@/utils";

// stores
import { useDataStore } from "@/store/data";
import { useMainStore } from "@/store/main";
import { useLocaleStore } from "@/store/locale";

const route = useRoute();

const challengeProps = ref({});
challengeProps.value = route.query;

const dataStore = useDataStore();
const mainStore = useMainStore();
const localeStore = useLocaleStore();

const { data } = storeToRefs(dataStore.battles);
const { battles: locale } = storeToRefs(localeStore);

const { startBreakpoint, stopBreakpoint, decreaseWaitingTimer } = dataStore.battles;
const { fetchWaitingData, callApi, redirectTo } = mainStore;

await fetchWaitingData(challengeProps.value);

let interval: ReturnType<typeof setInterval> | undefined;

const onAbort = () => {
  clearInterval(interval);
  callApi({ api: "waiting_exit" });
  redirectTo("/home/relax");
};

const onInviteFriend = () => {
  inviteFriend(locale.value?.["invite_message"] || "Invite message");
};

const onFriendStart = () => {
  callApi({ api: "waiting_run" });
};

onMounted(() => {
  startBreakpoint("waiting");

  interval = setInterval(() => {
    if (data.value.waiting_timer === 0 && interval) {
      clearInterval(interval);
      redirectTo("/challenge");
      return;
    }

    decreaseWaitingTimer();
  }, 1000);
});

onBeforeUnmount(() => {
  stopBreakpoint();
});
</script>
