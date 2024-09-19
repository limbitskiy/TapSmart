<template>
  <div id="tasks" class="flex-1 mb-16">
    <div class="top-part p-5 mb-4">
      <div class="page-title mb-4">{{ locale?.["title"] || "Tasks" }}</div>
      <div class="page-subtitle" v-html="locale?.['subtitle'] || 'Our new section! Complete tasks and get something! Maybe bolts, maybe nuts, maybe fame - who knows?'"></div>
    </div>

    <BackgroundPill v-for="section in data.sections" :key="section.title" class="task-section py-8 mb-8 overflow-y-hidden flex-1">
      <div class="pill-header flex items-center justify-between">
        <span class="bg-pill-title">{{ section.title }}</span>
      </div>

      <div class="section-tasks flex flex-col gap-2 pt-4">
        <Pill v-for="task in section.tasks" :key="task.title" class="py-3" color="light">
          <div class="content flex gap-2 items-center justify-between">
            <div class="start flex gap-4 items-center">
              <div class="flex gap-2 items-center p-2">
                <img class="h-4 scale-[2]" :src="getAsset('cup')" />
              </div>
              <div class="task-meta">
                <span class="text-xl fira-bold text-gray-300">{{ task.title }}</span>
                <div class="reward flex items-center gap-2 ml-1">
                  <img class="h-4 scale-125" :src="getAsset('bolt')" />
                  <span class="text-xl exo-bold text-[var(--accent-color)]">+{{ task.bolts }}</span>
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
import IconPill from "@/components/UI/IconPill.vue";
import Pill from "@/components/UI/Pill.vue";
import BackgroundPill from "@/components/UI/BackgroundPill.vue";

const mainStore = useMainStore();
const dataStore = useDataStore();
const localeStore = useLocaleStore();

// const { tasks: data } = storeToRefs(dataStore);
// const { tasks: locale } = storeToRefs(localeStore);

const data = {
  sections: [
    {
      title: "First section",
      subtitle: "Complete task - get more points and bolts!",
      filter: ["status", "nuts"],
      tasks: [
        {
          title: "First task",
          icon: "task1Icon",
          bolts: 4500,
          nuts: 50,
          status: "new",
          type: 1,
          data: {},
          buttons: {
            top: {
              hidden: false,
              label: "Top button",
              route: "",
              routeData: {},
              api: "",
              data: {},
              externalUrl: "",
            },
            bottom: {
              hidden: false,
              label: "Bottom button",
              route: "",
              routeData: {},
              api: "",
              data: {},
              externalUrl: "",
            },
          },
        },
        {
          title: "Second task",
          icon: "task1Icon",
          bolts: 10000,
          nuts: 50,
          status: "new",
          type: 1,
          data: {},
          buttons: {
            top: {
              hidden: false,
              label: "Top button",
              route: "",
              routeData: {},
              api: "",
              data: {},
              externalUrl: "",
            },
            bottom: {
              hidden: false,
              label: "Bottom button",
              route: "",
              routeData: {},
              api: "",
              data: {},
              externalUrl: "",
            },
          },
        },
      ],
    },
    {
      title: "Second section",
      subtitle: "Complete task - get more points and bolts!",
      filter: ["status", "nuts"],
      tasks: [
        {
          title: "First task",
          icon: "task1Icon",
          bolts: 4500,
          nuts: 50,
          status: "new",
          type: 1,
          data: {},
          buttons: {
            top: {
              hidden: false,
              label: "Top button",
              route: "",
              routeData: {},
              api: "",
              data: {},
              externalUrl: "",
            },
            bottom: {
              hidden: false,
              label: "Bottom button",
              route: "",
              routeData: {},
              api: "",
              data: {},
              externalUrl: "",
            },
          },
        },
        {
          title: "Second task",
          icon: "task1Icon",
          bolts: 10000,
          nuts: 50,
          status: "new",
          type: 1,
          data: {},
          buttons: {
            top: {
              hidden: false,
              label: "Top button",
              route: "",
              routeData: {},
              api: "",
              data: {},
              externalUrl: "",
            },
            bottom: {
              hidden: false,
              label: "Bottom button",
              route: "",
              routeData: {},
              api: "",
              data: {},
              externalUrl: "",
            },
          },
        },
      ],
    },
  ],
};
</script>
