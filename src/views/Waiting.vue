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
            <span class="text-3xl fira-bold leading-4 mr-[38px]">{{ formattedTime(data?.["waiting_timer"]) ?? "00:00" }}</span>
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
                <div class="player-name flex flex-1">
                  <!-- <div class="fixed-length-name whitespace-nowrap overflow-x-hidden text-ellipsis"> -->
                  <div class="fixed-length-name">
                    <span class="fira-semibold text-lg whitespace-nowrap">{{ sliceTextAmount(player.name, 15) }}</span>
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
              <div class="other-info flex gap-3 items-center justify-start">
                <div class="league flex items-center gap-1">
                  <svg width="22" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="m11 1.161 10 5.904v10.14l-10 5.647-10-5.648V7.066l10-5.904Z" fill="url(#league)" stroke="#2C9CFB" stroke-width="2" stroke-linejoin="round" />
                    <path
                      d="M8.425 17c-.33 0-.565-.07-.705-.21-.13-.14-.195-.355-.195-.645v-8.49c0-.29.065-.505.195-.645.14-.14.375-.21.705-.21h1.785c.34 0 .575.07.705.21.14.13.21.345.21.645v6.795h3.495c.32 0 .535.07.645.21.12.13.18.345.18.645v.84c0 .3-.06.52-.18.66-.11.13-.325.195-.645.195H8.425Z"
                      fill="#fff"
                    />
                    <defs>
                      <linearGradient id="league" x1="11" y1="0" x2="11" y2="24" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#319DFB" />
                        <stop offset="1" stop-color="#035296" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <span class="fira-semibold inline">{{ player?.league || 0 }}</span>
                </div>
                <div class="battles flex items-center gap-1">
                  <!-- <img class="h-4" :src="getAsset('swords')" /> -->
                  <!-- <img class="h-4" src="@/assets/icons/swords.svg" /> -->
                  <svg class="scale-[.9]" width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="11" fill="url(#a)" stroke="#FF6967" stroke-width="2" />
                    <path d="m15.436 6.41-5.88 6.565.82.82L17.898 6l-2.462.41Z" fill="#FEFEFE" />
                    <path d="m17.488 8.735-6.291 5.88-.82-.82L17.896 6l-.41 2.735Z" fill="#E8ECF4" />
                    <path d="m6.82 17.215 2.462-2.462-.82-.82L6 16.394l.82.82Z" fill="#636977" />
                    <path d="m8.735 12.018-1.094 1.094 1.641 1.64 1.094-1.093-1.64-1.641Z" fill="#FECD00" />
                    <path d="m10.376 13.658-1.094 1.094 1.641 1.641 1.094-1.094-1.64-1.64Z" fill="#D3A227" />
                    <path d="m7.641 18.034 2.462-2.461-.82-.821-2.462 2.462.82.82Z" fill="#414952" />
                    <path d="m8.462 6.41 5.88 6.565-.82.82L6 6l2.462.41Z" fill="#FEFEFE" />
                    <path d="m6.41 8.735 6.291 5.88.82-.82L6.002 6l.41 2.735Z" fill="#E8ECF4" />
                    <path d="m17.077 17.215-2.461-2.462.82-.82 2.462 2.461-.82.82Z" fill="#636977" />
                    <path d="m15.163 12.018 1.094 1.094-1.641 1.64-1.094-1.093 1.64-1.641Z" fill="#FECD00" />
                    <path d="m13.522 13.658 1.094 1.094-1.641 1.641L11.88 15.3l1.64-1.64Z" fill="#D3A227" />
                    <path d="m16.257 18.034-2.462-2.461.82-.821 2.462 2.462-.82.82Z" fill="#414952" />
                    <defs>
                      <linearGradient id="a" x1="12" y1="0" x2="12" y2="24" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#EC0A07" />
                        <stop offset="1" stop-color="#AB0502" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <span class="fira-semibold">{{ player?.battles || 0 }}</span>
                </div>
                <div class="bolts flex items-center gap-1">
                  <!-- <img class="h-4" :src="getAsset('bolt')" /> -->
                  <!-- <img class="h-4" src="@/assets/icons/bolt.svg" /> -->
                  <svg class="scale-[.9]" width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="11" fill="url(#bolt)" stroke="#FBC44A" stroke-width="2" />
                    <g filter="url(#b)">
                      <path
                        d="M8.496 17c-.24 0-.415-.05-.525-.15-.1-.11-.15-.275-.15-.495V7.46c0-.22.05-.385.15-.495.11-.11.285-.165.525-.165h4.395c1.1 0 1.925.255 2.475.765.55.5.825 1.195.825 2.085 0 .47-.115.89-.345 1.26-.22.37-.525.635-.915.795 1.03.34 1.545 1.095 1.545 2.265 0 .57-.135 1.085-.405 1.545-.26.46-.66.825-1.2 1.095-.53.26-1.19.39-1.98.39H8.496Zm3.975-6.075c.4 0 .71-.1.93-.3.22-.2.33-.49.33-.87 0-.41-.105-.7-.315-.87-.2-.18-.515-.27-.945-.27h-2.175v2.31h2.175Zm.24 4.26c.44 0 .765-.115.975-.345.22-.24.33-.55.33-.93 0-.43-.125-.75-.375-.96-.25-.22-.6-.33-1.05-.33h-2.295v2.565h2.415Z"
                        fill="#fff"
                      />
                    </g>
                    <defs>
                      <linearGradient id="bolt" x1="12" y1="0" x2="12" y2="24" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#E1A300" />
                        <stop offset="1" stop-color="#DB7510" />
                      </linearGradient>
                      <filter id="b" x="3.821" y="2.8" width="16.655" height="18.2" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                        <feFlood flood-opacity="0" result="BackgroundImageFix" />
                        <feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                        <feOffset />
                        <feGaussianBlur stdDeviation="2" />
                        <feComposite in2="hardAlpha" operator="out" />
                        <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                        <feBlend in2="BackgroundImageFix" result="effect1_dropShadow_2448_2276" />
                        <feBlend in="SourceGraphic" in2="effect1_dropShadow_2448_2276" result="shape" />
                      </filter>
                    </defs>
                  </svg>
                  <span class="fira-semibold text-[var(--accent-color)]">{{ shortenNumber(player?.bolts) || 0 }}</span>
                </div>
              </div>
            </div>
          </Pill>
        </li>
      </ul>

      <div v-if="data?.['is_friends_battle']" class="btns w-full flex gap-4 mt-8">
        <Button class="flex-1 !py-2" activeColor="#525252" @click="onInviteFriend" :dark="data?.['players_waiting']?.length !== 1">
          <span class="">{{ locale?.["button_waiting_invite"] || "Invite" }}</span>
        </Button>
        <Button class="flex-1 !py-2" activeColor="#fcdcb0" @click="onReadyBtn" :disabled="isReady" :dark="data?.['players_waiting']?.length === 1">
          <span class="">{{ locale?.["button_waiting_ready"] || "Ready" }}</span>
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
    if (Math.round(data.value?.waiting_timer / 1000) === 3 || Math.round(data.value?.waiting_timer / 1000) === 0) {
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
