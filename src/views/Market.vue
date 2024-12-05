<template>
  <div id="market" class="flex flex-col gap-4 flex-1 p-4 relative">
    <div class="top-part">
      <div class="icon-and-title flex items-center gap-4">
        <img class="h-[40px]" :src="getAsset('present')" />
        <div class="page-title">{{ locale?.["title"] }}</div>
      </div>
      <RouteSubtitle v-if="locale?.['subtitle']" :text="locale?.['subtitle']" />
    </div>

    <div class="flex-1 flex flex-col gap-4">
      <BackgroundPill v-for="section in data.data" :key="section.id" class="task-section flex-1">
        <div class="pill-header flex flex-col">
          <span class="bg-pill-title">{{ section.title }}</span>
          <span class="bg-pill-subtitle !mt-[8px]">{{ section.subtitle }}</span>
        </div>

        <!-- filters -->
        <div class="filters flex gap-2 mt-2">
          <Button
            v-for="filter in section.filters"
            class="!py-0 !px-3 !rounded-lg"
            :class="activeFilters[section.id]?.includes(filter.key) ? '' : 'bg-gray-500 text-white'"
            @click="() => onFilter(section.id, filter)"
          >
            <span class="fira-regular text-base">{{ filter.label }}</span>
          </Button>
        </div>

        <!-- prize pills -->
        <div class="section-tasks flex flex-col gap-2">
          <Pill
            v-for="prize in section.prizes.filter((prize) => {
              if (prize.filterKeys?.length) {
                return prize.filterKeys.includes(activeFilters[section.id]);
              } else {
                return prize;
              }
            })"
            :key="prize.id"
            class="!py-2 rounded-xl"
            @click="() => onPrizeClick(prize)"
            light
          >
            <div class="content flex gap-2 items-center justify-between">
              <div class="start flex gap-4 items-center">
                <div class="flex gap-2 items-center p-2">
                  <img class="h-4 w-4 object-contain scale-[2]" :src="getAsset(prize.icon)" />
                </div>
                <div class="prize-meta">
                  <span class="text-lg fira-regular text-gray-300">{{ prize.title }}</span>
                  <div class="position flex items-center gap-2 h-6">
                    <div class="neededPos flex items-center gap-2">
                      <img class="h-4 w-4 object-contain scale-[2]" :src="getAsset('cup')" />
                      <span class="text-lg text-[var(--accent-color)]">{{ prize.positions.prize }}</span>
                    </div>
                    <div v-if="prize.positions.user" class="userPos flex items-center gap-2">
                      <img class="h-4 w-4 object-contain scale-[1.8] ml-4 relative bottom-[1px]" :src="getAsset('user')" />
                      <span class="text-lg text-[var(--accent-color)]">{{ prize.positions.user }}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="end">
                <img class="h-4" :src="getAsset('chevron-right')" />
              </div>
            </div>
          </Pill>
        </div>
      </BackgroundPill>
    </div>

    <Teleport to="#modals">
      <Modal id="task-modal" v-model:visible="isPrizeModal">
        <PrizeModal
          :data="selectedPrize"
          @close="
            () => {
              isPrizeModal = false;
            }
          "
        />
      </Modal>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from "vue";
import { getAsset, showFormattedNumber } from "@/utils";
import { storeToRefs } from "pinia";

// store
import { useMainStore } from "@/store/main";

interface Filter {
  key: string;
  label: string;
  selected: boolean;
}

const store = useMainStore();

const { fetchMarketPageData } = store;
const { market: data } = storeToRefs(store.dataStore);
const { market: locale } = storeToRefs(store.localeStore);

await fetchMarketPageData();

console.log(data.value);

const activeFilters = ref({});
const selectedPrize = ref({});
const isPrizeModal = ref(false);

const onFilter = (sectionId: number, filter: Filter) => {
  if (activeFilters.value[sectionId] === filter.key) {
    activeFilters.value[sectionId] = null;
  } else {
    activeFilters.value[sectionId] = filter.key;
  }
};

const onPrizeClick = (task) => {
  // console.log(task);

  selectedPrize.value = task;
  isPrizeModal.value = true;
};

data.value.data.forEach((section) => {
  section.filters.forEach((filter) => {
    if (filter.selected) {
      activeFilters.value[section.id] = filter.key;
    }
  });
});

// console.log(activeFilters.value);
onMounted(() => {
  // scroll to top on mounted
  window.scrollTo(0, 0);
});
</script>
