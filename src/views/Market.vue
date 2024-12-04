<template>
  <div id="market" class="flex-1">
    <div class="top-part p-5 mb-4">
      <div class="page-title mb-4">{{ locale?.["title"] }}</div>
      <RouteSubtitle :text="locale?.['subtitle']" />
    </div>

    <div class="flex-1 flex flex-col gap-4">
      <BackgroundPill v-for="section in data.data" :key="section.id" class="task-section flex-1">
        <div class="pill-header flex items-center justify-between">
          <span class="bg-pill-title">{{ section.title }}</span>
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

        <!-- task pills -->
        <div class="section-tasks flex flex-col gap-2 pt-4">
          <Pill
            v-for="task in section.prizes.filter((task) => {
              if (task.filterKeys?.length) {
                return task.filterKeys.includes(activeFilters[section.id]);
              } else {
                return task;
              }
            })"
            :key="task.id"
            class="!py-2 rounded-xl"
            @click="() => onPrizeClick(task)"
            light
          >
            <div class="content flex gap-2 items-center justify-between">
              <div class="start flex gap-4 items-center">
                <div class="flex gap-2 items-center p-2">
                  <img class="h-4 w-4 object-contain scale-[2]" :src="getAsset(task.icon)" />
                </div>
                <div class="task-meta">
                  <span class="text-lg fira-regular text-gray-300">{{ task.title }}</span>
                  <div class="rewards flex items-center gap-4 ml-1 h-6">
                    <div v-if="task.nuts" class="nuts flex gap-2 items-center">
                      <img class="h-4 scale-125" :src="getAsset('nut')" />
                      <span class="text-lg exo-bold text-[var(--accent-color)]">{{ showFormattedNumber(task.nuts) }}</span>
                    </div>
                    <div class="bolts flex gap-2 items-center">
                      <img class="h-4 scale-125" :src="getAsset('bolt')" />
                      <span class="text-lg exo-bold text-[var(--accent-color)]">{{ showFormattedNumber(task.bolts) }}</span>
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
        <TaskModal
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
