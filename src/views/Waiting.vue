<template>
  <div ref="waitingRef" id="waiting-cnt" class="flex flex-1 p-4 relative">
    <div v-if="adShown" class="ad absolute inset-0 flex items-center justify-center z-[100] bg-[#222]">Your ad here</div>
    <BackgroundPill class="gap-4 mt-[10dvh] relative">
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

        <!-- subtitle -->
        <span class="">{{ locale?.["waiting_subtitle"] || "Waiting subtitle" }}</span>

        <!-- timer -->
        <Pill>
          <div class="timer flex items-center gap-2 justify-center">
            <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12.5 25C10.0277 25 7.61099 24.2669 5.55538 22.8934C3.49976 21.5199 1.89761 19.5676 0.951511 17.2835C0.00541604 14.9995 -0.242126 12.4861 0.24019 10.0614C0.722505 7.63661 1.91301 5.40933 3.66117 3.66117C5.40933 1.91301 7.63661 0.722505 10.0614 0.24019C12.4861 -0.242126 14.9995 0.00541604 17.2835 0.951511C19.5676 1.89761 21.5199 3.49976 22.8934 5.55538C24.2669 7.61099 25 10.0277 25 12.5C25 15.8152 23.683 18.9946 21.3388 21.3388C18.9946 23.683 15.8152 25 12.5 25ZM12.5 1.78572C10.3809 1.78572 8.30942 2.4141 6.54747 3.5914C4.78551 4.7687 3.41223 6.44205 2.6013 8.39982C1.79036 10.3576 1.57818 12.5119 1.99159 14.5903C2.405 16.6686 3.42544 18.5777 4.92386 20.0761C6.42228 21.5746 8.33138 22.595 10.4098 23.0084C12.4881 23.4218 14.6424 23.2096 16.6002 22.3987C18.558 21.5878 20.2313 20.2145 21.4086 18.4525C22.5859 16.6906 23.2143 14.6191 23.2143 12.5C23.2143 9.6584 22.0855 6.93318 20.0761 4.92386C18.0668 2.91454 15.3416 1.78572 12.5 1.78572Z"
                fill="#C0C0C0"
              />
              <path d="M16.5982 17.8557L11.6072 12.8647V4.46289H13.3929V12.1236L17.8572 16.5968L16.5982 17.8557Z" fill="#C0C0C0" />
            </svg>

            <span class="exo-black text-3xl mr-[38px]">{{ formattedTime(data?.["waiting_timer"]) ?? "00:00" }}</span>
          </div>
        </Pill>
      </div>

      <ul class="players flex-1 overflow-y-scroll flex flex-col gap-2">
        <li v-for="player in data?.['players_waiting'] || []" :key="player.id">
          <Pill class="flex gap-3 !px-3 !py-2">
            <div
              v-if="player.isPlayer || data?.['is_friends_battle']"
              class="avatar flex w-[50px] h-[50px] rounded-xl overflow-hidden border-[1px] border-[var(--grey-dark)] relative"
            >
              <img class="absolute z-[1] w-[50px] h-[50px]" :src="getAsset('avatar-placeholder')" />
              <img v-if="player.avatar" class="screenshot-exclude absolute inset-0 z-[2]" :src="player.avatar" />
            </div>
            <div class="player-meta flex-1">
              <!-- player data -->
              <div class="player-data flex gap-2 items-center justify-between">
                <div class="player-name flex">
                  <!-- <div class="fixed-length-name whitespace-nowrap overflow-x-hidden text-ellipsis"> -->
                  <div class="fixed-length-name">
                    <span class="fira-bold text-lg">{{ sliceTextAmount(player.name, 15) }}</span>
                  </div>
                  <div v-if="player?.isFriend" class="friend-badge ml-2">
                    <!-- friend icon -->
                    <svg width="13" height="9" viewBox="0 0 13 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M3.9 4.5C5.15734 4.5 6.175 3.49353 6.175 2.25C6.175 1.00647 5.15734 0 3.9 0C2.64266 0 1.625 1.00647 1.625 2.25C1.625 3.49353 2.64266 4.5 3.9 4.5ZM5.46 5.14286H5.29141C4.86891 5.34375 4.39969 5.46429 3.9 5.46429C3.40031 5.46429 2.93312 5.34375 2.50859 5.14286H2.34C1.04812 5.14286 0 6.17946 0 7.45714V8.03571C0 8.56808 0.436719 9 0.975 9H6.825C7.36328 9 7.8 8.56808 7.8 8.03571V7.45714C7.8 6.17946 6.75187 5.14286 5.46 5.14286ZM9.75 4.5C10.8266 4.5 11.7 3.63616 11.7 2.57143C11.7 1.5067 10.8266 0.642857 9.75 0.642857C8.67344 0.642857 7.8 1.5067 7.8 2.57143C7.8 3.63616 8.67344 4.5 9.75 4.5ZM10.725 5.14286H10.6478C10.3655 5.23929 10.0669 5.30357 9.75 5.30357C9.43312 5.30357 9.13453 5.23929 8.85219 5.14286H8.775C8.36062 5.14286 7.97875 5.26138 7.64359 5.45223C8.13922 5.98058 8.45 6.6817 8.45 7.45714V8.22857C8.45 8.27277 8.43984 8.31496 8.43781 8.35714H12.025C12.5633 8.35714 13 7.92522 13 7.39286C13 6.14933 11.9823 5.14286 10.725 5.14286Z"
                        fill="#35D945"
                      />
                    </svg>
                  </div>
                </div>

                <div class="player-ready">
                  <span v-if="!player.isReady" class="text-[var(--red-color)]">Not ready</span>
                  <span v-else-if="player.isReady" class="text-[var(--green-color)]">Ready</span>
                </div>
              </div>

              <!-- other info -->
              <div class="other-info flex gap-4 items-center">
                <div class="league flex gap-1">
                  <span class="league exo-bold">L:</span>
                  <span class="league exo-bold">{{ player?.league || 0 }}</span>
                </div>
                <div class="battles flex items-center gap-1">
                  <img class="h-4" :src="getAsset('swords')" />
                  <span class="exo-bold">{{ player?.battles || 0 }}</span>
                </div>
                <div class="bolts flex items-center gap-1">
                  <img class="h-4" :src="getAsset('bolt')" />
                  <span class="exo-black text-[var(--accent-color)]">{{ shortenNumber(player?.bolts) || 0 }}</span>
                </div>
              </div>
            </div>
          </Pill>
        </li>
      </ul>

      <div v-if="data?.['is_friends_battle']" class="btns w-full flex gap-4 mt-8">
        <Button class="flex-1 !py-2" activeColor="#525252" @click="onInviteFriend" :dark="data?.['players_waiting']?.length !== 1">
          <span class="text-lg leading-5 inline-block">{{ locale?.["button_waiting_invite"] || "Invite" }}</span>
        </Button>
        <Button class="flex-1 !py-2" activeColor="#fcdcb0" @click="onReadyBtn" :disabled="isReady" :dark="data?.['players_waiting']?.length === 1">
          <span class="text-lg leading-5 inline-block">{{ locale?.["button_waiting_ready"] || "Ready" }}</span>
        </Button>
      </div>
    </BackgroundPill>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted, onBeforeUnmount } from "vue";
import { storeToRefs } from "pinia";
import { getAsset, shortenNumber, sliceTextAmount } from "@/utils";
import { tg, getUserName, inviteFriend } from "@/api/telegram";
import { useRoute } from "vue-router";
import { formattedTime } from "@/utils";

// stores
import { useMainStore } from "@/store/main";

const route = useRoute();

const store = useMainStore();

const { fetchWaitingData, useFetch, redirectTo, sendInviteAnalitycsData, hideNotification, takeHTMLSnapshot } = store;
const { data } = storeToRefs(store.battleStore);
const { startBreakpoint, stopBreakpoint, changeWaitingTimer } = store.battleStore;
const { battles: locale } = storeToRefs(store.localeStore);

const startBtnBlocked = ref(false);
const isReady = ref(false);
const adShown = ref(false);

const waitingRef = ref();

hideNotification();

await fetchWaitingData(route.query);

if (data.value?.["display_ads"]) {
  adShown.value = true;

  setTimeout(() => {
    adShown.value = false;
  }, 3000);
}

let interval: ReturnType<typeof setInterval> | undefined;

const onAbort = () => {
  clearInterval(interval);
  useFetch({ key: "waiting_exit" });
  redirectTo("/home/relax");
};

const onInviteFriend = () => {
  sendInviteAnalitycsData(route.path);
  inviteFriend(locale.value?.["challenge_message"] || "Invite message");
};

const onFriendStart = () => {
  useFetch({ key: "waiting_run" });
  startBtnBlocked.value = true;
};

const onReadyBtn = () => {
  useFetch({ key: "waiting_ready" });
  isReady.value = true;
};

onMounted(() => {
  startBreakpoint("waiting");

  interval = setInterval(async () => {
    if (Math.round(data.value?.waiting_timer / 1000) === 1 || Math.round(data.value?.waiting_timer / 1000) === 0) {
      takeHTMLSnapshot(waitingRef.value);
    }

    if (data.value.waiting_timer < 1000 && interval) {
      clearInterval(interval);
      redirectTo("/challenge");
      return;
    }

    changeWaitingTimer(-1000);
  }, 1000);
});

onBeforeUnmount(() => {
  stopBreakpoint();
});
</script>
