<template>
  <div id="tasks" class="flex flex-col gap-4 flex-1 p-4">
    <div class="top-part">
      <div class="icon-and-title flex items-center gap-4">
        <img class="h-[60px]" :src="getAsset('tasks')" />
        <div class="page-title">{{ locale?.["title"] || "Tasks" }}</div>
      </div>
      <RouteSubtitle :text="locale?.['subtitle']" />
    </div>

    <div class="flex-1 flex flex-col gap-4">
      <BackgroundPill v-for="section in tasks.data" :key="section.id" class="task-section flex-1">
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
            v-for="task in section.tasks.filter((task) => {
              if (task.filterKeys?.length) {
                return task.filterKeys.includes(activeFilters[section.id]);
              } else {
                return task;
              }
            })"
            :key="task.id"
            class="!py-2 rounded-xl"
            @click="() => onTaskClick(task)"
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
      <Modal id="task-modal" v-model:visible="isTaskModal">
        <TaskModal :data="selectedTask" @close="() => (isTaskModal = false)" />
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

const { fetchTasksList } = store;
const { tasks } = storeToRefs(store.dataStore);
const { tasks: locale } = storeToRefs(store.localeStore);

await fetchTasksList();

// console.log(tasks.value.data);

const activeFilters = ref({});
const selectedTask = ref({});
const isTaskModal = ref(false);

const onFilter = (sectionId: number, filter: Filter) => {
  if (activeFilters.value[sectionId] === filter.key) {
    activeFilters.value[sectionId] = null;
  } else {
    activeFilters.value[sectionId] = filter.key;
  }
};

const onTaskClick = (task) => {
  // console.log(task);

  selectedTask.value = task;
  isTaskModal.value = true;
};

tasks.value.data.forEach((section) => {
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
