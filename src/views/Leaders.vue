<template>
  <div ref="screenshotEl" id="leaders" class="flex flex-col gap-4 flex-1 p-4 relative">
    <div v-if="capturingScreenshot" class="leaderboard-screenshot-loader absolute inset-0 z-[999] bg-white h-dvh"></div>
    <!-- debug messages -->
    <!-- <div class="fixed top-0 left-0 right-0 bg-black text-white flex flex-col text-sm z-50">
      <span>rect top: {{ debugMsg.recttop }}</span>
      <span>inner height: {{ debugMsg.innerheight }}</span>
    </div> -->

    <div class="top-part">
      <div class="icon-and-title flex items-center gap-2">
        <img class="h-[40px]" :src="getAsset('leaders')" />
        <div class="title-box flex flex-col">
          <div class="page-title text-nowrap">{{ locale?.["title"] || "Leaders" }}</div>
          <div v-if="capturingScreenshot" class="text-nowrap">{{ locale?.["story_subtitle"] || "story subtitle`" }}</div>
        </div>
        <div class="subtitle-icon p-1 relative bottom-2" @click="onShowSubtitleModal">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M8.00226 14.8404C6.14522 14.8404 4.36424 14.1129 3.05112 12.818C1.73799 11.5231 1.00028 9.76674 1.00028 7.93541C1.00028 6.10408 1.73799 4.34776 3.05112 3.05281C4.36424 1.75787 6.14522 1.03038 8.00226 1.03038C9.8593 1.03038 11.6403 1.75787 12.9534 3.05281C14.2665 4.34776 15.0042 6.10408 15.0042 7.93541C15.0042 9.76674 14.2665 11.5231 12.9534 12.818C11.6403 14.1129 9.8593 14.8404 8.00226 14.8404ZM8.00226 15.8269C10.1246 15.8269 12.16 14.9955 13.6607 13.5155C15.1614 12.0356 16.0045 10.0284 16.0045 7.93541C16.0045 5.84246 15.1614 3.83524 13.6607 2.3553C12.16 0.875365 10.1246 0.0439453 8.00226 0.0439453C5.87993 0.0439453 3.84452 0.875365 2.34381 2.3553C0.843093 3.83524 0 5.84246 0 7.93541C0 10.0284 0.843093 12.0356 2.34381 13.5155C3.84452 14.9955 5.87993 15.8269 8.00226 15.8269Z"
              fill="#CFCFCF"
            />
            <path
              d="M8.93259 6.54269L6.64194 6.82579L6.55992 7.20064L7.01005 7.28251C7.30413 7.35156 7.36215 7.45612 7.29813 7.74515L6.55992 11.1661C6.36587 12.0509 6.66495 12.4672 7.36815 12.4672C7.9133 12.4672 8.54648 12.2186 8.83356 11.8773L8.92159 11.467C8.72153 11.6406 8.42945 11.7096 8.2354 11.7096C7.96032 11.7096 7.86029 11.5192 7.93131 11.1839L8.93259 6.54269ZM9.00261 4.48302C9.00261 4.74463 8.89723 4.99554 8.70964 5.18053C8.52205 5.36552 8.26762 5.46945 8.00233 5.46945C7.73704 5.46945 7.48261 5.36552 7.29502 5.18053C7.10743 4.99554 7.00205 4.74463 7.00205 4.48302C7.00205 4.2214 7.10743 3.97049 7.29502 3.7855C7.48261 3.60051 7.73704 3.49658 8.00233 3.49658C8.26762 3.49658 8.52205 3.60051 8.70964 3.7855C8.89723 3.97049 9.00261 4.2214 9.00261 4.48302Z"
              fill="#CFCFCF"
            />
          </svg>
        </div>
      </div>
    </div>

    <div class="flex-1 flex flex-col gap-4">
      <BackgroundPill :class="{ '!mb-10': leaders?.['has_story'] }">
        <div class="pill-header flex items-center justify-between">
          <!-- league -->
          <div class="league flex gap-2">
            <div class="league-icon">
              <img class="h-[50px]" :src="getAsset('league')" />
            </div>
            <div class="league-details flex flex-col justify-center">
              <span class="text-gray-300 text-sm">{{ locale?.["current_league"] ?? "current league" }}</span>
              <span class="font-semibold text-lg text-nowrap">{{ profile?.["league_name"] }}</span>
            </div>
          </div>
        </div>

        <!-- filters -->
        <div class="filters flex flex-col gap-2 mt-2">
          <!-- top filter -->
          <div class="top-filters flex-1 flex flex-wrap gap-2 items-center justify-between">
            <div class="total-week-toggle">
              <Toggle
                :option1="{ label: locale?.['period_total'] ?? 'total', value: 'total' }"
                :option2="{ label: locale?.['period_week'] ?? 'week', value: 'week' }"
                @change="onToggleChange"
              />
            </div>
            <div class="country-friends-btns flex gap-2">
              <Button class="!py-1 !px-3 !rounded-lg flex" :class="{ '!bg-[var(--grey-light)] text-white': !filter.country }" @click="() => onSmallFilter('country')"
                ><span class="font-normal capitalize text-base line-clamp-1">{{ locale?.["filter_country"] ?? "country" }}</span></Button
              >
              <Button class="!py-1 !px-3 !rounded-lg flex" :class="{ '!bg-[var(--grey-light)] text-white': !filter.friends }" @click="() => onSmallFilter('friends')"
                ><span class="font-normal capitalize text-base">{{ locale?.["filter_friends"] ?? "friends" }}</span></Button
              >
            </div>
          </div>

          <!-- bottom-filter -->
          <div class="bottom-filter">
            <Pill class="rounded-lg py-[10px] px-1 pr-2">
              <div class="filter-grid grid grid-cols-5 gap-2">
                <div
                  class="prize flex items-center justify-center"
                  :class="{ '!text-[var(--accent-color)] font-semibold': filter.bigFilter === 'prize' }"
                  @click="() => onBigFilter('prize')"
                >
                  <span class="text-[12px] inline-block text-center" style="line-height: 14px">{{ locale?.["value_prize"] ?? "prizes" }}</span>
                </div>
                <div
                  class="bolts flex items-center justify-center"
                  :class="{ '!text-[var(--accent-color)] font-semibold': filter.bigFilter === 'bolt' }"
                  @click="() => onBigFilter('bolt')"
                >
                  <span class="text-[12px] inline-block text-center" style="line-height: 14px">{{ locale?.["value_bolts"] ?? "bolts" }}</span>
                </div>
                <div class="tokens flex items-center justify-center" @click="() => onBigFilter('winner_token')">
                  <span
                    :class="{ '!text-[var(--accent-color)] font-semibold': filter.bigFilter === 'winner_token' }"
                    class="text-[12px] inline-block text-center"
                    style="line-height: 14px"
                    >{{ locale?.["value_winner_token"] ?? "winner tokens" }}</span
                  >
                </div>
                <div
                  class="victories flex items-center justify-center"
                  :class="{ '!text-[var(--accent-color)] font-semibold': filter.bigFilter === 'battle_win' }"
                  @click="() => onBigFilter('battle_win')"
                >
                  <span class="text-[12px] inline-block text-center" style="line-height: 14px">{{ locale?.["value_battle_victory"] ?? "victories" }}</span>
                </div>
                <div
                  class="learned flex items-center justify-center"
                  :class="{ '!text-[var(--accent-color)] font-semibold': filter.bigFilter === 'learned' }"
                  @click="() => onBigFilter('learned')"
                >
                  <span class="text-[12px] inline-block text-center" style="line-height: 14px">{{ locale?.["value_learned"] ?? "learned" }}</span>
                </div>
              </div>
            </Pill>
          </div>
        </div>

        <!-- filter divider -->
        <!-- <div class="divider flex justify-center">
          <svg width="42" height="2" viewBox="0 0 42 2" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 1H41" stroke="#BFBFBF" stroke-width="2" stroke-linecap="round" />
          </svg>
        </div> -->

        <!-- leaderboard -->
        <Transition name="fade">
          <ul v-if="!leaderListLoading && !capturingScreenshot" class="leaderboard flex flex-col gap-2 pt-4 flex-1 !h-[300px] overflow-y-hidden">
            <li v-for="player in leaders?.data" :key="player.id" :id="player.isPlayer ? 'player-pill' : null">
              <!-- divider -->
              <div v-if="player.isDivider" class="divider flex justify-center py-1">
                <svg width="42" height="2" viewBox="0 0 42 2" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 1H41" stroke="#BFBFBF" stroke-width="2" stroke-linecap="round" />
                </svg>
              </div>

              <!-- normal player -->
              <Pill v-else class="!py-2 !px-3 rounded-xl" light>
                <div class="content flex gap-2 items-center justify-between">
                  <div class="start flex gap-3 items-center">
                    <div class="avatar flex w-[50px] h-[50px] rounded-xl overflow-hidden border-[1px] border-[var(--grey-dark)]">
                      <img v-if="player.avatar" :src="player.avatar" />
                      <img v-else :src="getAsset('avatar-placeholder')" />
                    </div>
                    <div class="player-info">
                      <span class="text-nowrap">{{ sliceTextAmount(player.name, 15) }}</span>
                      <div class="other-info flex items-center gap-4">
                        <div class="score py-1 px-3 bg-[var(--grey-dark)] rounded-lg flex gap-[6px] items-center">
                          <img v-if="filter.bigFilter === 'bolt'" class="h-[18px]" :src="getAsset('bolt')" />
                          <img v-else-if="filter.bigFilter === 'battle_win'" class="h-[18px]" :src="getAsset('cup')" />
                          <img v-else-if="filter.bigFilter === 'learned'" class="h-[18px]" :src="getAsset('book')" />
                          <img v-else-if="filter.bigFilter === 'friends_in_battles'" class="h-[18px]" :src="getAsset('swords')" />
                          <img v-else-if="filter.bigFilter === 'winner_token'" class="h-[18px]" :src="getAsset('winner_token')" />
                          <span class="text-sm font-semibold" style="line-height: 13px">{{ showFormattedNumber(player.score) }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="end">
                    <div v-if="player.pos === 1" class="text-lg text-gray-400 font-semibold">
                      <img class="h-[36px]" :src="getAsset('leaderboard_1st')" />
                    </div>
                    <div v-else-if="player.pos === 2" class="text-lg text-gray-400 font-semibold">
                      <img class="h-[36px]" :src="getAsset('leaderboard_2nd')" />
                    </div>
                    <div v-else-if="player.pos === 3" class="text-lg text-gray-400 font-semibold">
                      <img class="h-[36px]" :src="getAsset('leaderboard_3rd')" />
                    </div>
                    <span v-else class="text-lg text-gray-400 font-semibold mr-2">#{{ player.pos }}</span>
                  </div>
                </div>
              </Pill>
            </li>
          </ul>
        </Transition>

        <!-- short leaderboard for screenshots -->
        <Transition name="fade">
          <ul v-if="!leaderListLoading && capturingScreenshot" class="leaderboard flex flex-col gap-2 pt-4 flex-1 !h-[300px] overflow-y-hidden">
            <li v-for="player in leaders?.story_data" :key="player.id" :id="player.isPlayer ? 'player-pill' : null">
              <!-- divider -->
              <div v-if="player.isDivider" class="divider flex justify-center py-1">
                <svg width="42" height="2" viewBox="0 0 42 2" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 1H41" stroke="#BFBFBF" stroke-width="2" stroke-linecap="round" />
                </svg>
              </div>

              <!-- normal player -->
              <Pill v-else class="!py-2 !px-3 rounded-xl" light>
                <div class="content flex gap-2 items-center justify-between">
                  <div class="start flex gap-3 items-center">
                    <div>
                      <img v-if="player.isPlayer" class="h-[50px] rounded-lg" :src="getAsset('avatar1')" />
                      <img v-else="player.isPlayer" class="h-[50px]" :src="getAsset('avatar-placeholder')" />
                    </div>
                    <div class="player-info">
                      <span class="text-lg text-nowrap">{{ player.name }}</span>
                      <div class="other-info flex items-center gap-4">
                        <div class="score py-1 px-3 bg-[var(--grey-dark)] rounded-lg flex gap-[6px] items-center">
                          <img v-if="filter.bigFilter === 'bolt'" class="h-[18px]" :src="getAsset('bolt')" />
                          <img v-else-if="filter.bigFilter === 'battle_win'" class="h-[18px]" :src="getAsset('cup')" />
                          <img v-else-if="filter.bigFilter === 'learned'" class="h-[18px]" :src="getAsset('book')" />
                          <img v-else-if="filter.bigFilter === 'friends_in_battles'" class="h-[18px]" :src="getAsset('swords')" />
                          <span class="text-sm font-semibold" style="line-height: 13px">{{ showFormattedNumber(player.score) }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="end">
                    <div v-if="player.pos === 1" class="text-lg text-gray-400 font-semibold">
                      <img class="h-[36px]" :src="getAsset('leaderboard_1st')" />
                    </div>
                    <div v-else-if="player.pos === 2" class="text-lg text-gray-400 font-semibold">
                      <img class="h-[36px]" :src="getAsset('leaderboard_2nd')" />
                    </div>
                    <div v-else-if="player.pos === 3" class="text-lg text-gray-400 font-semibold">
                      <img class="h-[36px]" :src="getAsset('leaderboard_3rd')" />
                    </div>
                    <span v-else class="text-lg text-gray-400 font-semibold mr-2">#{{ player.pos }}</span>
                  </div>
                </div>
              </Pill>
            </li>
          </ul>
        </Transition>
      </BackgroundPill>
    </div>

    <!-- bottom player pill -->
    <Transition name="slight-move-up">
      <div v-if="!targetIsVisible" class="fixed-player fixed left-8 right-8" :class="[leaders?.['has_story'] ? 'bottom-[140px]' : 'bottom-[80px]']">
        <!-- normal player -->
        <Pill class="!py-2 !px-3 rounded-xl bg-black">
          <div class="content flex gap-2 items-center justify-between">
            <div class="start flex gap-3 items-center">
              <div class="avatar flex w-[50px] h-[50px] rounded-xl overflow-hidden border-[1px] border-[var(--grey-dark)]">
                <img v-if="computedPlayer.avatar" :src="computedPlayer.avatar" />
                <img v-else :src="getAsset('avatar-placeholder')" />
              </div>
              <div class="player-info">
                <span>{{ sliceTextAmount(computedPlayer.name, 15) }}</span>
                <div class="other-info flex items-center gap-4">
                  <div class="score px-2 py-1 bg-[var(--grey-dark)] rounded-lg flex gap-[6px] items-center">
                    <img v-if="filter.bigFilter === 'bolt'" class="h-[18px]" :src="getAsset('bolt')" />
                    <img v-else-if="filter.bigFilter === 'battle_win'" class="h-[18px]" :src="getAsset('cup')" />
                    <img v-else-if="filter.bigFilter === 'learned'" class="h-[18px]" :src="getAsset('book')" />
                    <img v-else-if="filter.bigFilter === 'friends_in_battles'" class="h-[18px]" :src="getAsset('friends')" />
                    <img v-else-if="filter.bigFilter === 'winner_token'" class="h-[18px]" :src="getAsset('winner_token')" />
                    <span class="text-sm font-semibold" style="line-height: 13px">{{ showFormattedNumber(computedPlayer.score) }}</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="end">
              <div v-if="computedPlayer.pos === 1" class="text-lg text-gray-400 font-semibold">
                <img class="h-[36px]" :src="getAsset('leaderboard_1st')" />
              </div>
              <div v-else-if="computedPlayer.pos === 2" class="text-lg text-gray-400 font-semibold">
                <img class="h-[36px]" :src="getAsset('leaderboard_2nd')" />
              </div>
              <div v-else-if="computedPlayer.pos === 3" class="text-lg text-gray-400 font-semibold">
                <img class="h-[36px]" :src="getAsset('leaderboard_3rd')" />
              </div>
              <span v-else class="text-lg text-gray-400 font-semibold mr-2">#{{ computedPlayer.pos }}</span>
            </div>
          </div>
        </Pill>
      </div>
    </Transition>

    <!-- story button -->
    <div v-if="leaders?.['has_story']" class="story-btn-cnt fixed bottom-[80px] left-2 right-2 flex justify-between gap-3 z-10">
      <Button class="flex-1" @click="onPostStory">
        <span>{{ locale?.["post_story"] ?? "post tg story" }}</span>
      </Button>
    </div>

    <!-- subtitle modal -->
    <Teleport to="#modals">
      <Modal id="leaders-subtitle" v-model:visible="isTooltipModal">
        <div class="flex-1 flex flex-col gap-4 items-center py-4">
          <!-- modal html content -->
          <div class="content flex flex-col gap-1 py-4" v-html="locale?.['subtitle'] ?? 'subtitle'"></div>

          <div class="tsk-btns flex flex-col gap-2 w-full">
            <Button activeColor="#525252" @click="onCloseSubtitleModal">
              <span>{{ locale?.["modal_subtitle_button"] ?? "got it!" }}</span>
            </Button>
          </div>
        </div>
      </Modal>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted, nextTick } from "vue";
import { getAsset, showFormattedNumber, waitFor, sliceTextAmount } from "@/utils";
import { storeToRefs } from "pinia";
import * as htmlToImage from "html-to-image";

// store
import { useMainStore } from "@/store/main";

const store = useMainStore();

const { fetchLeadersList, useFetch, shareToStory } = store;
const { profile, leaders } = storeToRefs(store.dataStore);
const { leaders: locale } = storeToRefs(store.localeStore);

interface Filter {
  period: "total" | "week";
  country: boolean;
  friends: boolean;
  bigFilter: "bolt" | "winner_token" | "battle_win" | "learned" | "prize";
}

const filter = ref<Filter>({
  period: "total",
  country: false,
  friends: false,
  bigFilter: "prize",
});
const targetIsVisible = ref(true);
const leaderListLoading = ref(false);
const isTooltipModal = ref(false);
const screenshotEl = ref();

const capturingScreenshot = ref(false);

// const debugMsg = ref({
//   recttop: 0,
//   innerheight: 0,
// });

const computedPlayer = computed(() => leaders.value?.data?.find((player) => player.isPlayer));

await fetchLeadersList();

const onToggleChange = async (value: "week" | "total") => {
  filter.value.period = value;

  await refetchLeaderList();
};

const onBigFilter = async (option) => {
  filter.value.bigFilter = option;

  await refetchLeaderList();
};

const onSmallFilter = async (option) => {
  filter.value[option] = !filter.value[option];

  await refetchLeaderList();
};

const refetchLeaderList = async () => {
  const filterArr = [];

  if (filter.value.country) {
    filterArr.push("country");
  }

  if (filter.value.friends) {
    filterArr.push("friends");
  }

  leaderListLoading.value = true;
  await fetchLeadersList({
    period: filter.value.period,
    value: filter.value.bigFilter,
    filter: filterArr,
  });

  leaderListLoading.value = false;

  await nextTick();
  checkPlayerVisibility();
};

const onShowSubtitleModal = () => {
  isTooltipModal.value = true;
};

const onCloseSubtitleModal = () => {
  isTooltipModal.value = false;
};

const checkPlayerVisibility = () => {
  const playerPill = document.querySelector("#player-pill");

  if (playerPill) {
    const rect = playerPill.getBoundingClientRect();

    if (rect.top < innerHeight - 70 && rect.top > 0) {
      targetIsVisible.value = true;
    } else {
      targetIsVisible.value = false;
    }
  }
};

const onPostStory = async () => {
  await startCapturingScreenshot();

  const filter = (node: HTMLElement) => {
    const exclusionClasses = ["story-btn-cnt", "fixed-player", "leaderboard-screenshot-loader"];
    return !exclusionClasses.some((classname) => node.classList?.contains(classname));
  };

  const url = await htmlToImage.toJpeg(screenshotEl.value, { quality: 0.85, filter });

  const bgImage = new Image();
  bgImage.src = url;

  bgImage.onload = async () => {
    const canvas = document.createElement("canvas");
    const scale = devicePixelRatio || 1;

    canvas.width = innerWidth * scale;
    canvas.height = innerHeight * scale;

    const ctx = canvas.getContext("2d");

    ctx?.drawImage(bgImage, 0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "orange";
    ctx.fillRect(0, 0, canvas.width, 22 * scale);
    ctx.font = `${14 * scale}px sans-serif`;
    ctx.fillStyle = "white";
    const textWidth = ctx?.measureText(leaders.value?.["story_call_to_action"] ?? "Played at @Tapsmart in Telegram").width;
    ctx.fillStyle = "black";
    ctx.fillText(leaders.value?.["story_call_to_action"] ?? "Played at @Tapsmart in Telegram", canvas.width / 2 - textWidth / 2, 16 * scale);

    const dataURL = canvas.toDataURL("image/jpeg");

    const res = await useFetch({ key: "tg_story", data: { images: [dataURL] } });

    shareToStory(res?.data?.url, leaders.value?.["story_text"], {
      url: leaders.value?.["story_link"],
      name: leaders.value?.["story_link_text"],
    });

    // save the image right away
    // const link = document.createElement("a");
    // link.download = "my-image-name.jpeg";
    // link.href = dataURL;
    // link.click();
  };

  finishCapturingScreenshot();
};

const startCapturingScreenshot = async () => {
  document.body.style.overflow = "hidden";
  capturingScreenshot.value = true;
  screenshotEl.value.style.height = "100dvh";
  screenshotEl.value.style.overflow = "hidden";

  await nextTick();

  await waitFor(600);
};

const finishCapturingScreenshot = () => {
  document.body.style.overflow = "initial";
  capturingScreenshot.value = false;
  screenshotEl.value.style.height = "initial";
  screenshotEl.value.style.overflow = "auto";
};

onMounted(() => {
  // scroll to top on mounted
  window.scrollTo(0, 0);

  checkPlayerVisibility();

  addEventListener("scroll", checkPlayerVisibility);
});

onUnmounted(() => {
  removeEventListener("scroll", checkPlayerVisibility);
});
</script>
