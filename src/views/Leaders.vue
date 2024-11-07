<template>
  <div id="leaders" class="flex flex-col gap-4 flex-1 p-4 relative">
    <div class="top-part">
      <div class="icon-and-title flex items-center gap-2">
        <img class="h-[40px]" :src="getAsset('leaders')" />
        <div class="page-title mb-2">{{ locale?.["title"] || "Leaders" }}</div>
      </div>
      <!-- <div class="page-subtitle mt-2" v-html="locale?.['subtitle'] || 'Our new section! Complete tasks and get something! Maybe bolts, maybe nuts, maybe fame - who knows?'"></div> -->
    </div>

    <div class="flex-1 flex flex-col gap-4">
      <BackgroundPill class="">
        <div class="pill-header flex items-center justify-between">
          <!-- league -->
          <div class="league flex gap-2">
            <div class="league-icon">
              <img class="h-[50px]" :src="getAsset('league')" />
            </div>
            <div class="league-details flex flex-col">
              <span class="text-gray-300 text-sm">Текущая лига:</span>
              <span class="fira-condensed-bold text-[26px] leading-5">{{ profile?.["league_name"] }}</span>
            </div>
          </div>
        </div>

        <!-- filters -->
        <div class="filters flex flex-col gap-2 mt-2">
          <!-- top filters -->
          <div class="top-filters flex-1 flex items-center justify-between">
            <div class="total-week-toggle">
              <Toggle option1="Total" option2="Week" @change="onToggleChange" />
            </div>
            <div class="country-friends-btns flex gap-2">
              <Button
                class="!py-1 !px-3 !rounded-lg flex"
                font="fira-condensed"
                :class="{ '!bg-[var(--grey-light)] text-white': !filters.country }"
                @click="() => onSmallFilter('country')"
                ><span class="text-base">Country</span></Button
              >
              <Button
                class="!py-1 !px-3 !rounded-lg flex"
                font="fira-condensed"
                :class="{ '!bg-[var(--grey-light)] text-white': !filters.friends }"
                @click="() => onSmallFilter('friends')"
                ><span class="text-base">Friends</span></Button
              >
            </div>
          </div>

          <!-- bottom-filter -->
          <div class="bottom-filter">
            <Pill class="rounded-lg py-[10px] px-1 pr-4">
              <div class="filter-grid grid grid-cols-5 gap-2">
                <div
                  class="bolts flex items-center justify-center"
                  :class="{ '!text-[var(--accent-color)] fira-bold': filters.secondFilter === 'bolts' }"
                  @click="() => onSecondFilterSelect('bolts')"
                >
                  <span class="text-[12px] inline-block text-center" style="line-height: 14px">Bolts</span>
                </div>
                <div
                  class="tokens flex items-center justify-center"
                  :class="{ '!text-[var(--accent-color)] fira-bold': filters.secondFilter === 'tokens' }"
                  @click="() => onSecondFilterSelect('tokens')"
                >
                  <span class="text-[12px] inline-block text-center" style="line-height: 14px">Winner tokens</span>
                </div>
                <div
                  class="victories flex items-center justify-center"
                  :class="{ '!text-[var(--accent-color)] fira-bold': filters.secondFilter === 'victories' }"
                  @click="() => onSecondFilterSelect('victories')"
                >
                  <span class="text-[12px] inline-block text-center" style="line-height: 14px">Battle victories</span>
                </div>
                <div
                  class="learned flex items-center justify-center"
                  :class="{ '!text-[var(--accent-color)] fira-bold': filters.secondFilter === 'learned' }"
                  @click="() => onSecondFilterSelect('learned')"
                >
                  <span class="text-[12px] inline-block text-center" style="line-height: 14px">Learned words</span>
                </div>
                <div
                  class="friends flex items-center justify-center"
                  :class="{ '!text-[var(--accent-color)] fira-bold': filters.secondFilter === 'friends' }"
                  @click="() => onSecondFilterSelect('friends')"
                >
                  <span class="text-[12px] inline-block text-center" style="line-height: 14px">Friends in battles</span>
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
        <div class="leaderboard flex flex-col gap-2 pt-4 flex-1">
          <div :ref="player.isPlayer ? 'target' : null" v-for="player in leaders?.data" :key="player.id">
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
                    <span class="text-lg fira-bold">{{ player.name }}</span>
                    <div class="other-info flex items-center gap-4">
                      <div class="score p-1 bg-[var(--grey-dark)] rounded-lg flex gap-[6px] items-center">
                        <img class="h-[18px]" :src="getAsset('score')" />
                        <span class="text-sm" style="line-height: 13px">{{ shortenNumber(player.score) }}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="end">
                  <div v-if="player.pos === 1" class="text-lg text-gray-400 exo-bold">
                    <img class="h-[36px]" :src="getAsset('leaderboard_1st')" />
                  </div>
                  <div v-else-if="player.pos === 2" class="text-lg text-gray-400 exo-bold">
                    <img class="h-[36px]" :src="getAsset('leaderboard_2nd')" />
                  </div>
                  <div v-else-if="player.pos === 3" class="text-lg text-gray-400 exo-bold">
                    <img class="h-[36px]" :src="getAsset('leaderboard_3rd')" />
                  </div>
                  <span v-else class="text-lg text-gray-400 exo-bold mr-2">#{{ player.pos }}</span>
                </div>
              </div>
            </Pill>
          </div>
        </div>
      </BackgroundPill>
    </div>

    <!-- <div class="debug fixed bottom-[80px]">
      {{ targetIsVisible }}
    </div> -->

    <Transition name="slight-move-up">
      <div v-if="!targetIsVisible" class="fixed-player fixed bottom-[135px] left-8 right-8">
        <!-- normal player -->
        <Pill class="!py-2 !px-3 rounded-xl bg-black" light>
          <div class="content flex gap-2 items-center justify-between">
            <div class="start flex gap-3 items-center">
              <div>
                <img class="h-[50px] rounded-lg" :src="getAsset('avatar1')" />
              </div>
              <div class="player-info">
                <span class="text-lg fira-bold">{{ computedPlayer.name }}</span>
                <div class="other-info flex items-center gap-4">
                  <div class="score px-2 py-1 bg-[var(--grey-dark)] rounded-lg flex gap-[6px] items-center">
                    <img class="h-[18px]" :src="getAsset('score')" />
                    <span class="text-sm" style="line-height: 13px">{{ shortenNumber(computedPlayer.score) }}</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="end">
              <div v-if="computedPlayer.pos === 1" class="text-lg text-gray-400 exo-bold">
                <img class="h-[36px]" :src="getAsset('leaderboard_1st')" />
              </div>
              <div v-else-if="computedPlayer.pos === 2" class="text-lg text-gray-400 exo-bold">
                <img class="h-[36px]" :src="getAsset('leaderboard_2nd')" />
              </div>
              <div v-else-if="computedPlayer.pos === 3" class="text-lg text-gray-400 exo-bold">
                <img class="h-[36px]" :src="getAsset('leaderboard_3rd')" />
              </div>
              <span v-else class="text-lg text-gray-400 exo-bold mr-2">#{{ computedPlayer.pos }}</span>
            </div>
          </div>
        </Pill>
      </div>
    </Transition>

    <div class="story-btn-cnt fixed bottom-20 left-2 right-2 flex justify-between gap-3 z-10">
      <Button class="flex-1">
        <span class="text-xl">Post a telegram story</span>
        <!-- <img :src="getAsset('paw')" /> -->
      </Button>
    </div>

    <!-- <Teleport to="#modals">
      <Modal id="task-modal" v-model:visible="isTaskModal">
        <TaskModal :data="selectedTask" @close="() => (isTaskModal = false)" />
      </Modal>
    </Teleport> -->
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from "vue";
import { getAsset, showFormattedNumber, shortenNumber } from "@/utils";
import { storeToRefs } from "pinia";
import { useIntersectionObserver } from "@vueuse/core";

// store
import { useMainStore } from "@/store/main";

const store = useMainStore();

const { fetchLeadersList } = store;
const { profile, leaders } = storeToRefs(store.dataStore);
const { leaders: locale } = storeToRefs(store.localeStore);

const filters = ref({
  period: "total",
  country: false,
  friends: false,
  category: "bolts",
  secondFilter: "bolts",
});
const target = ref(null);
const targetIsVisible = ref(true);

const { stop } = useIntersectionObserver(target, ([{ isIntersecting }], observerElement) => {
  targetIsVisible.value = isIntersecting;
});

// const mockData = [
//   {
//     id: 10987767412126,
//     name: "Eug23ene",
//     pos: 1,
//     score: 143665641,
//   },
//   {
//     id: 732241691582,
//     name: "Olga1",
//     pos: 2,
//     score: 640687,
//   },
//   {
//     id: 7176462421536,
//     name: "Yug11",
//     pos: 3,
//     score: 605495,
//   },
//   {
//     id: 1098776746,
//     name: "Eugene",
//     pos: 4,
//     score: 1435641,
//   },
//   {
//     id: 7341691582,
//     name: "Olga 💎",
//     pos: 5,
//     score: 64087,
//   },
//   {
//     id: 7176421536,
//     name: "Yug",
//     pos: 6,
//     score: 60595,
//   },
//   {
//     id: 171069406,
//     isDivider: true,
//   },
//   {
//     id: 193438653,
//     name: "Oleg",
//     pos: 38,
//     score: 10394,
//   },
//   {
//     id: 7173896033,
//     name: "Tula",
//     pos: 39,
//     score: 6556,
//   },
//   {
//     id: 19341238653,
//     name: "Osleg",
//     pos: 40,
//     score: 10394,
//   },
//   {
//     id: 717389906033,
//     name: "Tu5la",
//     isPlayer: true,
//     pos: 41,
//     score: 6556,
//   },
//   {
//     id: 19343588653,
//     name: "O24guleg",
//     pos: 42,
//     score: 10394,
//   },
//   {
//     id: 71743896033,
//     name: "Tggula",
//     pos: 43,
//     score: 6556,
//   },
//   {
//     id: 193412938653,
//     name: "Osleg33",
//     pos: 44,
//     score: 10394,
//   },
//   {
//     id: 71744389906033,
//     name: "Tu5ldgfga",
//     pos: 45,
//     score: 6556,
//   },
//   {
//     id: 7172424389906033,
//     name: "Tu5la",
//     pos: 46,
//     score: 6556,
//   },
//   {
//     id: 193442423588653,
//     name: "O24guleg",
//     pos: 47,
//     score: 10394,
//   },
//   {
//     id: 7174384242496033,
//     name: "Tggula",
//     pos: 48,
//     score: 6556,
//   },
//   {
//     id: 1934124242938653,
//     name: "Osleg33",
//     pos: 49,
//     score: 10394,
//   },
//   {
//     id: 717443822249906033,
//     name: "Tu5ldgfga",
//     pos: 50,
//     score: 6556,
//   },
// ];

const computedPlayer = computed(() => leaders.value?.data?.find((player) => player.isPlayer));

await fetchLeadersList();

const onToggleChange = (data) => {
  console.log(data);
};

const onSecondFilterSelect = (option) => {
  filters.value.secondFilter = option;
};

const onSmallFilter = (option) => {
  filters.value[option] = !filters.value[option];
};

onMounted(() => {
  // scroll to top on mounted
  window.scrollTo(0, 0);
});
</script>
