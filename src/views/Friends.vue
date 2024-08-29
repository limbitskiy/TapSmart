<template>
  <div id="friends" class="flex-1">
    <div class="top-part p-5">
      <div class="page-title mb-2">{{ locale["title"] }}</div>
      <div class="page-subtitle text-gray-200">{{ locale["subtitle"] }}</div>

      <div class="pills flex flex-col gap-4 my-4">
        <IconPill color="dark">
          <template #start>
            <img class="h-[39px]" :src="getAsset('telegram')" />
          </template>

          <template #end>
            <div class="flex flex-col gap-1">
              <span class="text-lg pill-title">{{ locale["tg_pill_title"] }}</span>
              <span class="text-gray-400" v-html="locale['tg_pill_subtitle']"></span>
            </div>
          </template>
        </IconPill>

        <IconPill color="dark">
          <template #start>
            <img class="h-[39px]" :src="getAsset('telegram-premium')" />
          </template>

          <template #end>
            <div class="flex flex-col gap-1">
              <span class="text-lg pill-title">{{ locale["premium_pill_title"] }}</span>
              <span class="text-gray-400" v-html="locale['premium_pill_subtitle']"></span>
            </div>
          </template>
        </IconPill>
      </div>
    </div>

    <!-- income -->
    <BackgroundPill class="py-8">
      <span class="bg-pill-title">{{ locale["income_title"] }}</span>

      <Pill class="mt-4" color="light" ripple>
        <div class="content flex flex-col items-center gap-2 justify-between">
          <span class="text-xl font-semibold">{{ locale["total_income"] }}</span>
          <div class="price flex gap-2 items-center">
            <img class="h-4" :src="getAsset('bolt')" />
            <span class="text-xl font-bold exo-bold">{{ data["income"] || 0 }}</span>
          </div>
        </div>
      </Pill>

      <Pill class="mt-4" color="light" ripple>
        <div class="content flex justify-between">
          <span class="text-xl font-semibold">{{ locale["battles_played"] }}</span>
          <span class="text-xl font-bold exo-bold">{{ data["battles"] || 0 }}</span>
        </div>
      </Pill>

      <Pill class="mt-4" color="light" ripple>
        <div class="content flex justify-between">
          <span class="text-xl font-semibold">{{ locale["points_earned"] }}</span>
          <span class="text-xl font-bold exo-bold">{{ data["points"] || 0 }}</span>
        </div>
      </Pill>
    </BackgroundPill>

    <!-- friends -->
    <BackgroundPill class="py-8 mt-12 mb-32 relative">
      <div class="header flex items-center justify-between">
        <div class="title flex gap-2">
          <span class="bg-pill-title">{{ locale["friends_title"] }}</span>
          <div class="counter bg-[var(--grey-dark)] py-1 px-2 rounded flex items-center h-7 font-semibold">{{ filteredFriends.length }}</div>
        </div>
        <div class="refresh-friends mr-4" @click="onRefreshFriends">
          <img :src="getAsset('refresh')" />
        </div>
      </div>

      <template v-if="data.friendList.length">
        <div class="switches flex justify-start gap-3 mt-4">
          <Button class="!py-1 !px-3" :class="filters.online ? '' : 'bg-gray-500 text-white'" @click="onOnlineFilter">{{ locale["online"] }}</Button>
          <Button class="!py-1 !px-3" :class="filters.battles ? '' : 'bg-gray-500 text-white'" @click="onBattlesFilter">{{ locale["battles"] }}</Button>
        </div>

        <TransitionGroup class="friend-list flex flex-col gap-4 my-4" name="list" tag="div">
          <FriendPill v-for="friend in filteredFriends" :key="friend.id" :data="friend" color="light" :battles="filters.battles" />
        </TransitionGroup>
      </template>
      <div v-else class="empty-message my-4">
        <span class="text-gray-300">У вас пока нету друзей</span>
      </div>
    </BackgroundPill>

    <!-- invite buttons -->
    <div class="invite-btn-cnt fixed bottom-16 w-full p-4 flex justify-between gap-3 z-10">
      <Button class="flex items-center justify-between flex-1 px-4 py-2" @click="onInviteFriend">
        <span class="text-xl">{{ locale["invite_a_friend"] }}</span>
        <img :src="getAsset('paw')" />
      </Button>
      <Button class="px-4 py-2 border border-gray-800" black @click="onCopyToClipboard"><img :src="getAsset('copy')" /></Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from "vue";
import { tg, getUserId } from "@/api/telegram";
import { getAsset } from "@/utils";
import { storeToRefs } from "pinia";

// store
import { useMainStore } from "@/store/main.ts";
import { useDataStore } from "@/store/data.ts";
import { useLocaleStore } from "@/store/locale.ts";

// components
import Button from "@/components/UI/Button.vue";
import IconPill from "@/components/UI/IconPill.vue";
import Pill from "@/components/UI/Pill.vue";
import FriendPill from "@/components/UI/FriendPill.vue";
import BackgroundPill from "@/components/UI/BackgroundPill.vue";

const mainStore = useMainStore();
const dataStore = useDataStore();
const localeStore = useLocaleStore();

const { friends: data } = storeToRefs(dataStore);
const { friends: locale } = storeToRefs(localeStore);

const { showToast, fetchFriendsPage } = mainStore;

await fetchFriendsPage();

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

const onRefreshFriends = () => {};

const onOnlineFilter = () => {
  filters.value.online = !filters.value.online;
};

const onBattlesFilter = () => {
  filters.value.battles = !filters.value.battles;
};

const generateLink = () => {
  const userId = getUserId();
  console.log(userId);

  return `https://t.me/${import.meta.env.VITE_BOT_NAME}/${import.meta.env.VITE_APP_NAME}?startapp=fr${userId}`;
};

const onInviteFriend = () => {
  const link = generateLink();
  console.log(`link is: ${link}`);
  tg.openTelegramLink(`https://t.me/share/url?url=${link}&text=${locale.value["inviteMessage"]}`);
};

const onCopyToClipboard = () => {
  const link = generateLink();
  navigator.clipboard.writeText(link);
  // showToast("Link has been copied to clipboard");
};

onMounted(() => {});
</script>
