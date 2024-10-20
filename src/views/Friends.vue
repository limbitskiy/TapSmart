<template>
  <div id="friends" class="flex flex-col gap-4 p-4 mb-[60px]">
    <div class="top-part">
      <div class="icon-and-title flex items-center gap-4">
        <img class="h-[60px]" :src="getAsset('friends')" />
        <div class="page-title mb-2">{{ locale?.["title"] }}</div>
      </div>
      <div class="page-subtitle text-gray-200 mt-2" v-html="locale?.['subtitle']"></div>

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
                <span class="exo-black" v-html="locale?.['premium_pill_subtitle']"></span>
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
                <span class="exo-black" v-html="locale?.['tg_pill_subtitle']"></span>
              </div>
            </div>
          </template>
        </IconPill>
      </div>
    </div>

    <!-- friend stats -->
    <BackgroundPill>
      <span class="bg-pill-title">{{ locale?.["income_title"] }}</span>

      <div class="flex flex-col gap-2 mt-4">
        <Pill class="!py-2 rounded-xl" :tooltip="locale?.['tooltip_bolts_earned']">
          <div class="content flex items-center justify-between">
            <span class="text-lg text-gray-300">{{ locale?.["bolts_earned"] || "Bolts earned" }}</span>
            <div class="price flex gap-2 items-center">
              <img class="h-4 scale-150" :src="getAsset('bolt')" />
              <span class="text-lg font-bold exo-bold">{{ shortenNumber(data?.["income"]) || 0 }}</span>
            </div>
          </div>
        </Pill>

        <Pill class="!py-2 rounded-xl" :tooltip="locale?.['tooltip_battles_played']">
          <div class="content flex justify-between">
            <span class="text-lg text-gray-300">{{ locale?.["battles_played"] || "Battles played" }}</span>
            <span class="text-lg font-bold exo-bold">{{ data?.["battles"] || 0 }}</span>
          </div>
        </Pill>

        <Pill class="!py-2 rounded-xl" :tooltip="locale?.['tooltip_points_earned']">
          <div class="content flex justify-between">
            <span class="text-lg text-gray-300">{{ locale?.["points_earned"] || "Points earned" }}</span>
            <span class="text-lg font-bold exo-bold">{{ data?.["points"] || 0 }}</span>
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

        <TransitionGroup class="friend-list flex flex-col gap-2" name="list" tag="div">
          <FriendPill v-for="friend in filteredFriends" :key="friend.id" :data="friend" :battleFilter="filters.battles" />
        </TransitionGroup>
      </template>
      <div v-else class="empty-message my-4">
        <span class="text-gray-300">У вас пока нету друзей</span>
      </div>
    </BackgroundPill>

    <!-- invite buttons -->
    <div class="invite-btn-cnt fixed bottom-20 left-4 right-4 flex justify-between gap-3 z-10">
      <Button class="flex-1" @click="onInviteFriend">
        <span class="text-xl">{{ locale?.["invite_a_friend"] }}</span>
        <!-- <img :src="getAsset('paw')" /> -->
      </Button>
      <Button class="!px-4 border border-gray-800" dark @click="onCopyToClipboard"><img :src="getAsset('copy')" /></Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from "vue";
import { generateShareLink, inviteFriend } from "@/api/telegram";
import { getAsset, shortenNumber } from "@/utils";
import { storeToRefs } from "pinia";
import { useRoute } from "vue-router";

// store
import { useMainStore } from "@/store/main";

const route = useRoute();
const store = useMainStore();

const { fetchFriendsList, sendInviteAnalitycsData } = store;
const { friends: data } = storeToRefs(store.dataStore);
const { friends: locale } = storeToRefs(store.localeStore);

const el = ref();

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

onMounted(() => {
  // scroll to top on mounted
  window.scrollTo(0, 0);
});
</script>
