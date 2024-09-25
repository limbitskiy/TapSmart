<template>
  <div id="tasks" class="flex-1 mb-16">
    <div class="top-part p-5 mb-2">
      <div class="page-title mb-2">{{ locale?.["title"] || "Tasks" }}</div>
      <div class="page-subtitle" v-html="locale?.['subtitle'] || 'Our new section! Complete tasks and get something! Maybe bolts, maybe nuts, maybe fame - who knows?'"></div>
    </div>

    <div class="flex-1 flex flex-col gap-12">
      <BackgroundPill v-for="section in tasks.data" :key="section.id" class="task-section overflow-y-hidden flex-1">
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

        <!-- tasks -->
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
            color="light"
            @click="() => onTaskClick(task)"
          >
            <div class="content flex gap-2 items-center justify-between">
              <div class="start flex gap-4 items-center">
                <div class="flex gap-2 items-center p-2">
                  <img class="h-4 scale-[2]" :src="getAsset('cup')" />
                </div>
                <div class="task-meta">
                  <span class="text-lg fira-regular text-gray-300">{{ task.title }}</span>
                  <div class="reward flex items-center gap-2 ml-1 h-6">
                    <img class="h-4 scale-125" :src="getAsset('bolt')" />
                    <span class="text-lg exo-bold text-[var(--accent-color)]">+{{ task.bolts }}</span>
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
        <TaskModal :data="selectedTask" />
      </Modal>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from "vue";
import { tg, getUserId } from "@/api/telegram";
import { getAsset } from "@/utils";
import { storeToRefs } from "pinia";

// store
import { useMainStore } from "@/store/main";
import { useDataStore } from "@/store/data";
import { useLocaleStore } from "@/store/locale";

// components
import Button from "@/components/UI/Button.vue";
import Pill from "@/components/UI/Pill.vue";
import BackgroundPill from "@/components/UI/BackgroundPill.vue";
import TaskModal from "@/components/modals/TaskModal.vue";
import Modal from "@/components/Modal.vue";

interface Filter {
  key: string;
  label: string;
  selected: boolean;
}

const mainStore = useMainStore();
const dataStore = useDataStore();
const localeStore = useLocaleStore();

const { tasks } = storeToRefs(dataStore);
const { tasks: locale } = storeToRefs(localeStore);
const { fetchTasksList } = mainStore;

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

// const data = {
//   sections: [
//     {
//       id: 0,
//       title: "First section",
//       subtitle: "Complete task - get more points and bolts!",
//       filters: [
//         {
//           key: "new",
//           label: "Новые",
//           selected: true,
//         },
//         {
//           key: "todo",
//           label: "Сделать",
//           selected: false,
//         },
//       ],
//       tasks: [
//         {
//           id: 10,
//           title: "Invite 3 friends",
//           desc: "Invite 3 friends into the game and get bonuses!",
//           icon: "invite_friends",
//           image: "invite_friends",
//           bolts: 4500,
//           nuts: 50,
//           status: "new",
//           type: 1,
//           data: {},
//           filterKeys: ["new"],
//           buttons: {
//             top: {
//               hidden: false,
//               label: "Top button",
//               route: "",
//               routeData: {},
//               api: "",
//               data: {},
//               externalUrl: "",
//               showModal: {
//                 title: "Hello",
//                 subtitle: "This is a test modal",
//                 image: "bolt",
//                 buttons: {
//                   left: {
//                     hidden: false,
//                     label: "Top button",
//                     route: "",
//                     routeData: {},
//                     api: "",
//                     data: {},
//                     externalUrl: "",
//                   },
//                   right: {
//                     hidden: false,
//                     label: "Bottom button",
//                     route: "",
//                     routeData: {},
//                     api: "",
//                     data: {},
//                     externalUrl: "",
//                   },
//                 },
//               },
//             },
//             bottom: {
//               disabled: true,
//               hidden: false,
//               label: "Bottom button",
//               route: "",
//               routeData: {},
//               api: "",
//               data: {},
//               externalUrl: "",
//             },
//           },
//         },
//         {
//           id: 11,
//           title: "Win 3 challenges",
//           icon: "congrats",
//           bolts: 6500,
//           nuts: 150,
//           status: "new",
//           type: 1,
//           data: {},
//           filterKeys: ["todo"],
//           buttons: {
//             top: {
//               hidden: false,
//               label: "Top button",
//               route: "",
//               routeData: {},
//               api: "",
//               data: {},
//               externalUrl: "",
//             },
//             bottom: {
//               hidden: false,
//               label: "Bottom button",
//               route: "",
//               routeData: {},
//               api: "",
//               data: {},
//               externalUrl: "",
//             },
//           },
//         },
//       ],
//     },
//     {
//       id: 2,
//       title: "Second section",
//       subtitle: "Complete task - get more points and bolts!",
//       filters: [
//         {
//           key: "big",
//           label: "Сложные",
//           selected: true,
//         },
//         {
//           key: "small",
//           label: "Легкие",
//           selected: false,
//         },
//       ],
//       tasks: [
//         {
//           id: 20,
//           title: "First task",
//           icon: "task1Icon",
//           bolts: 4500,
//           nuts: 50,
//           status: "new",
//           type: 1,
//           data: {},
//           filterKeys: ["small"],
//           buttons: {
//             top: {
//               hidden: false,
//               label: "Top button",
//               route: "",
//               routeData: {},
//               api: "",
//               data: {},
//               externalUrl: "",
//             },
//             bottom: {
//               hidden: false,
//               label: "Bottom button",
//               route: "",
//               routeData: {},
//               api: "",
//               data: {},
//               externalUrl: "",
//             },
//           },
//         },
//         {
//           id: 22,
//           title: "Second task",
//           icon: "task1Icon",
//           bolts: 10000,
//           nuts: 50,
//           status: "new",
//           type: 1,
//           data: {},
//           filterKeys: ["small", "big"],
//           buttons: {
//             top: {
//               hidden: false,
//               label: "Top button",
//               route: "",
//               routeData: {},
//               api: "",
//               data: {},
//               externalUrl: "",
//             },
//             bottom: {
//               hidden: false,
//               label: "Bottom button",
//               route: "",
//               routeData: {},
//               api: "",
//               data: {},
//               externalUrl: "",
//             },
//           },
//         },
//       ],
//     },
//   ],
// };

tasks.value.data.forEach((section) => {
  section.filters.forEach((filter) => {
    if (filter.selected) {
      activeFilters.value[section.id] = filter.key;
    }
  });
});

// console.log(activeFilters.value);
</script>
