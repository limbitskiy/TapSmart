<template>
  <div id="friends" class="flex flex-col flex-1 gap-4 p-4 mb-[60px]">
    <div class="top-part">
      <div class="icon-and-title flex items-center gap-4 mb-2">
        <img class="h-[40px]" :src="getAsset('friends')" />
        <div class="page-title mb-2">{{ locale?.["title"] }}</div>
      </div>
      <RouteSubtitle :text="locale?.['subtitle']" />

      <div class="pills flex flex-col gap-4 mt-4">
        <IconPill color="dark">
          <template #start>
            <img class="h-[39px]" :src="getAsset('telegram')" />
          </template>

          <template #end>
            <div class="flex flex-col gap-1">
              <span class="text-lg pill-title">{{ locale?.["premium_pill_title"] }}</span>
              <div class="flex items-center gap-2 h-4 mb-1">
                <img class="h-4 scale-150" :src="getAsset('bolt')" />
                <span class="exo-bold" v-html="locale?.['premium_pill_subtitle']"></span>
              </div>
            </div>
          </template>
        </IconPill>

        <IconPill color="dark">
          <template #start>
            <img class="h-[39px]" :src="getAsset('telegram-premium')" />
          </template>

          <template #end>
            <div class="flex flex-col gap-1">
              <span class="text-lg pill-title">{{ locale?.["tg_pill_title"] }}</span>
              <div class="flex items-center gap-2 h-4 mb-1">
                <img class="h-4 scale-150" :src="getAsset('bolt')" />
                <span class="exo-bold" v-html="locale?.['tg_pill_subtitle']"></span>
              </div>
            </div>
          </template>
        </IconPill>
      </div>
    </div>

    <!-- friend stats -->
    <BackgroundPill>
      <span class="bg-pill-title">{{ locale?.["income_title"] }}</span>

      <div class="flex flex-col gap-2 mt-2">
        <Pill class="!py-2 rounded-xl" :tooltip="locale?.['tooltip_bolts_earned']">
          <div class="content flex items-center justify-between">
            <span class="text-gray-300">{{ locale?.["bolts_earned"] || "Bolts earned" }}</span>
            <div class="price flex gap-2 items-center">
              <img class="h-4 scale-150" :src="getAsset('bolt')" />
              <span class="exo-bold">{{ shortenNumber(data?.["income"]) || 0 }}</span>
            </div>
          </div>
        </Pill>

        <Pill class="!py-2 rounded-xl" :tooltip="locale?.['tooltip_battles_played']">
          <div class="content flex justify-between">
            <span class="text-gray-300">{{ locale?.["battles_played"] || "Battles played" }}</span>
            <span class="exo-bold">{{ data?.["battles"] || 0 }}</span>
          </div>
        </Pill>

        <Pill class="!py-2 rounded-xl" :tooltip="locale?.['tooltip_points_earned']">
          <div class="content flex justify-between">
            <span class="text-gray-300">{{ locale?.["points_earned"] || "Points earned" }}</span>
            <span class="exo-bold">{{ data?.["points"] || 0 }}</span>
          </div>
        </Pill>
      </div>
    </BackgroundPill>

    <!-- friends -->
    <BackgroundPill class="flex flex-col gap-4 py-8 relative">
      <div class="header flex items-center justify-between">
        <div class="title flex items-center gap-2">
          <span class="bg-pill-title">{{ locale?.["friends_title"] }}</span>
          <div class="counter bg-[var(--grey-light)] py-1 px-2 rounded flex items-center h-7 exo-black">{{ data?.friendList?.length }}</div>
        </div>
        <div ref="el" class="refresh-friends mr-4" @click="onRefreshFriends">
          <img :src="getAsset('refresh')" />
        </div>
      </div>

      <template v-if="data?.friendList?.length">
        <div class="switches flex justify-start gap-3">
          <Button class="!py-0 !px-3 !rounded-lg" :class="filters.online ? '' : 'bg-gray-500 text-white'" @click="onOnlineFilter">
            <div class="flex gap-1">
              <span class="fira-regular text-base">{{ locale?.["online"] }}</span>
              <Badge :data="onlineFriends.length" :dark="filters.online" :grey="!filters.online" />
            </div>
          </Button>
          <Button class="!py-0 !px-3 !rounded-lg" :class="filters.battles ? '' : 'bg-gray-500 text-white'" @click="onBattlesFilter">
            <span class="fira-regular text-base">{{ locale?.["battles"] }}</span>
          </Button>
        </div>

        <TransitionGroup class="friend-list flex flex-col gap-2" name="list" tag="ul">
          <FriendPill v-for="friend in filteredFriends" :key="friend.id" :data="friend" :battleFilter="filters.battles" />
        </TransitionGroup>
      </template>
      <div v-else class="empty-message my-4">
        <span class="text-gray-300">У вас пока нету друзей</span>
      </div>
    </BackgroundPill>

    <!-- invite buttons -->
    <div class="invite-btn-cnt fixed bottom-24 left-2 right-2 flex justify-between gap-3 z-10">
      <Button class="!px-4 border border-gray-800" dark @click="onCopyToClipboard"><img :src="getAsset('copy')" /></Button>
      <Button class="flex-1" @click="onInviteFriend">
        <span class="text-xl">{{ locale?.["invite_a_friend"] }}</span>
      </Button>
      <Button class="!px-4 border border-gray-800" dark @click="onQRCode"
        ><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M0 0.75C0 0.551088 0.0790176 0.360322 0.21967 0.21967C0.360322 0.0790176 0.551088 0 0.75 0L5.25 0C5.44891 0 5.63968 0.0790176 5.78033 0.21967C5.92098 0.360322 6 0.551088 6 0.75C6 0.948912 5.92098 1.13968 5.78033 1.28033C5.63968 1.42098 5.44891 1.5 5.25 1.5H1.5V5.25C1.5 5.44891 1.42098 5.63968 1.28033 5.78033C1.13968 5.92098 0.948912 6 0.75 6C0.551088 6 0.360322 5.92098 0.21967 5.78033C0.0790176 5.63968 0 5.44891 0 5.25V0.75ZM18 0.75C18 0.551088 18.079 0.360322 18.2197 0.21967C18.3603 0.0790176 18.5511 0 18.75 0L23.25 0C23.4489 0 23.6397 0.0790176 23.7803 0.21967C23.921 0.360322 24 0.551088 24 0.75V5.25C24 5.44891 23.921 5.63968 23.7803 5.78033C23.6397 5.92098 23.4489 6 23.25 6C23.0511 6 22.8603 5.92098 22.7197 5.78033C22.579 5.63968 22.5 5.44891 22.5 5.25V1.5H18.75C18.5511 1.5 18.3603 1.42098 18.2197 1.28033C18.079 1.13968 18 0.948912 18 0.75ZM0.75 18C0.948912 18 1.13968 18.079 1.28033 18.2197C1.42098 18.3603 1.5 18.5511 1.5 18.75V22.5H5.25C5.44891 22.5 5.63968 22.579 5.78033 22.7197C5.92098 22.8603 6 23.0511 6 23.25C6 23.4489 5.92098 23.6397 5.78033 23.7803C5.63968 23.921 5.44891 24 5.25 24H0.75C0.551088 24 0.360322 23.921 0.21967 23.7803C0.0790176 23.6397 0 23.4489 0 23.25V18.75C0 18.5511 0.0790176 18.3603 0.21967 18.2197C0.360322 18.079 0.551088 18 0.75 18ZM23.25 18C23.4489 18 23.6397 18.079 23.7803 18.2197C23.921 18.3603 24 18.5511 24 18.75V23.25C24 23.4489 23.921 23.6397 23.7803 23.7803C23.6397 23.921 23.4489 24 23.25 24H18.75C18.5511 24 18.3603 23.921 18.2197 23.7803C18.079 23.6397 18 23.4489 18 23.25C18 23.0511 18.079 22.8603 18.2197 22.7197C18.3603 22.579 18.5511 22.5 18.75 22.5H22.5V18.75C22.5 18.5511 22.579 18.3603 22.7197 18.2197C22.8603 18.079 23.0511 18 23.25 18ZM6 6H7.5V7.5H6V6Z"
            fill="white"
          />
          <path d="M10.5 3H3V10.5H10.5V3ZM4.5 4.5H9V9H4.5V4.5ZM7.5 16.5H6V18H7.5V16.5Z" fill="white" />
          <path d="M10.5 13.5H3V21H10.5V13.5ZM4.5 15H9V19.5H4.5V15ZM16.5 6H18V7.5H16.5V6Z" fill="white" />
          <path
            d="M13.5 3H21V10.5H13.5V3ZM15 4.5V9H19.5V4.5H15ZM12 12V15H13.5V16.5H12V18H15V15H16.5V18H18V16.5H21V15H16.5V12H12ZM15 15H13.5V13.5H15V15ZM21 18H19.5V19.5H16.5V21H21V18ZM15 21V19.5H12V21H15Z"
            fill="white"
          />
          <path d="M18 13.5H21V12H18V13.5Z" fill="white" />
        </svg>
      </Button>
    </div>

    <!-- qrcode modal -->
    <Teleport to="#modals">
      <Modal id="task-modal" v-model:visible="isQRCodeModal">
        <div class="qrcode-modal flex-1 flex flex-col justify-center items-center mt-[6dvh] mb-4 mx-8 text-center">
          <canvas ref="canvasRef" class="!w-full !h-full"></canvas>
          <div class="flex flex-col gap-2">
            <span class="title text-lg fira-bold text-[var(--accent-color)]">{{ locale?.["qr_modal_title"] }}</span>
            <span class="subtitle">{{ locale?.["qr_modal_subtitle"] }}</span>
          </div>
        </div>
      </Modal>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, nextTick } from "vue";
import { tg, generateShareLink, inviteFriend, showMainButton } from "@/api/telegram";
import { getAsset, shortenNumber } from "@/utils";
import { storeToRefs } from "pinia";
import { useRoute, useRouter } from "vue-router";
import QRCode from "qrcode";

// store
import { useMainStore } from "@/store/main";

const route = useRoute();
const router = useRouter();
const store = useMainStore();

const { fetchFriendsList, sendInviteAnalitycsData } = store;
const { friends: data } = storeToRefs(store.dataStore);
const { friends: locale } = storeToRefs(store.localeStore);

const el = ref();
const canvasRef = ref();
const isQRCodeModal = ref(false);

fetchFriendsList();

const filters = ref({
  online: false,
  battles: false,
});

const filteredFriends = computed(() => {
  if (!data.value.friendList.length) {
    return [];
  }

  let friendList = [...data.value.friendList];

  if (filters.value.online) {
    friendList = friendList.filter((friend) => friend.isOnline);
  }

  if (filters.value.battles) {
    friendList = friendList.sort((a, b) => b.points - a.points);
  } else {
    friendList.sort((a, b) => b.moneyEarned - a.moneyEarned);
  }

  return friendList;
});

const onlineFriends = computed(() => data.value?.friendList.filter((friend) => friend.isOnline));

const onRefreshFriends = () => {
  fetchFriendsList();
  el.value.animate({ rotate: "360deg" }, 1000);
};

const onOnlineFilter = () => {
  filters.value.online = !filters.value.online;
};

const onBattlesFilter = () => {
  filters.value.battles = !filters.value.battles;
};

const onInviteFriend = () => {
  sendInviteAnalitycsData(route.path);
  inviteFriend(locale.value?.["invite_message"] || "Invite message");
};

const onCopyToClipboard = () => {
  const link = generateShareLink();

  // use useClipboard
  if (navigator?.clipboard) {
    navigator.clipboard.writeText(link);
  }
};

const onQRCode = async () => {
  const link = generateShareLink();

  isQRCodeModal.value = true;

  await nextTick();

  QRCode.toCanvas(
    canvasRef.value,
    link,
    {
      color: {
        dark: "fff",
        light: "#272727",
      },
    },
    function (error) {
      if (error) console.error(error);
    }
  );
};

onMounted(() => {
  // scroll to top on mounted
  window.scrollTo(0, 0);
});
</script>
