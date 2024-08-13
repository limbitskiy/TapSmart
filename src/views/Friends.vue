<template>
  <div id="friends" class="flex-1">
    <div class="top-part p-5">
      <div class="page-title mb-4">{{ getLocale("title") }}</div>
      <div class="page-subtitle">{{ getLocale("subtitle") }}</div>

      <div class="pills flex flex-col gap-4 my-8">
        <IconPill color="dark">
          <template #start>
            <img class="h-[39px]" :src="getAsset('telegram')" />
          </template>

          <template #end>
            <div class="text flex flex-col gap-1">
              <span class="text-lg font-semibold">{{ getLocale("tg_pill_title") }}</span>
              <span class="text-sm text-gray-400" v-html="getLocale('tg_pill_subtitle')"></span>
            </div>
          </template>
        </IconPill>

        <IconPill color="dark">
          <template #start>
            <img class="h-[39px]" :src="getAsset('telegram-premium')" />
          </template>

          <template #end>
            <div class="text flex flex-col gap-1">
              <span class="text-lg font-semibold">{{ getLocale("premium_pill_title") }}</span>
              <span class="text-sm text-gray-400" v-html="getLocale('premium_pill_subtitle')"></span>
            </div>
          </template>
        </IconPill>
      </div>
    </div>

    <!-- income -->
    <Pill class="py-8" color="darker">
      <span class="pill-title">{{ getLocale("income_title") }}</span>

      <Pill class="mt-4" color="dark" ripple>
        <div class="content flex flex-col items-center gap-2 justify-between">
          <span class="text-xl font-semibold">{{ getLocale("total_income") }}</span>
          <div class="price flex gap-2 items-center">
            <img class="h-6" :src="getAsset('coin')" />
            <span class="text-xl font-bold text-[var(--accent-color)]">{{ getStoreData("income") }}</span>
          </div>
        </div>
      </Pill>

      <Pill class="mt-4" color="dark" ripple>
        <div class="content flex justify-between">
          <span class="text-xl font-semibold">{{ getLocale("battles_played") }}</span>
          <span class="text-xl font-bold text-[var(--accent-color)]">{{ getStoreData("battles") }}</span>
        </div>
      </Pill>

      <Pill class="mt-4" color="dark" ripple>
        <div class="content flex justify-between">
          <span class="text-xl font-semibold">{{ getLocale("points_earned") }}</span>
          <span class="text-xl font-bold text-[var(--accent-color)]">{{ getStoreData("points") }}</span>
        </div>
      </Pill>
    </Pill>

    <!-- friends -->
    <Pill class="py-8 mt-12 mb-32 relative" color="darker">
      <div class="header flex items-center justify-between">
        <div class="title flex gap-2">
          <span class="pill-title">{{ getLocale("friends_title") }}</span>
          <div class="counter bg-[var(--grey-dark)] py-1 px-2 rounded flex items-center h-7 font-semibold">{{ filteredFriends.length }}</div>
        </div>
        <div class="refresh-friends mr-4" @click="onRefreshFriends">
          <img :src="getAsset('refresh')" />
        </div>
      </div>

      <div class="switches flex justify-start gap-3 mt-4">
        <Button class="!py-1 !px-3" :class="filters.online ? '' : 'bg-gray-500 text-white'" @click="onOnlineFilter">{{ getLocale("online") }}</Button>
        <Button class="!py-1 !px-3" :class="filters.battles ? '' : 'bg-gray-500 text-white'" @click="onBattlesFilter">{{ getLocale("battles") }}</Button>
      </div>

      <TransitionGroup class="friend-list flex flex-col gap-4 my-4" name="list" tag="div">
        <FriendPill v-for="friend in filteredFriends" :key="friend.id" :data="friend" color="dark" :battles="filters.battles" />
      </TransitionGroup>
    </Pill>

    <!-- invite buttons -->
    <div class="invite-btn-cnt fixed bottom-16 w-full p-4 flex justify-between gap-3 z-10">
      <Button class="flex items-center justify-between flex-1" @click="onInviteFriend">
        <span class="text-xl">{{ getLocale("invite_a_friend") }}</span>
        <img :src="getAsset('paw')" />
      </Button>
      <Button black @click="onCopyToClipboard"><img :src="getAsset('copy')" /></Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from "vue";
import { useUserStore } from "@/store/user.ts";
import Button from "@/components/UI/Button.vue";
import IconPill from "@/components/UI/IconPill.vue";
import Pill from "@/components/UI/Pill.vue";
import FriendPill from "@/components/UI/FriendPill.vue";
import { tg, getUserId } from "@/api/telegram";
import { useStoreHelpers } from "@/composables/useStoreHelpers";
import { getAsset } from "@/utils";

const { getLocale, getStoreData } = useStoreHelpers("friends");

const userStore = useUserStore();

const { showToast, fetchFriendsPage } = userStore;

await fetchFriendsPage();

const filters = ref({
  online: false,
  battles: false,
});

const filteredFriends = computed(() => {
  let friendList = [...getStoreData("friends", "friends")];

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
  return `${import.meta.env.VITE_APP_PATH}?startapp=${userId}`;
};

const onInviteFriend = () => {
  const link = generateLink();
  console.log(`link is: ${link}`);
  tg.openTelegramLink(`https://t.me/share/url?url=${link}&text=Multiplayer language battles with more than 42 language choices.`);
};

const onCopyToClipboard = () => {
  const link = generateLink();
  navigator.clipboard.writeText(link);
  showToast("Link has been copied to clipboard");
};

onMounted(() => {});
</script>
