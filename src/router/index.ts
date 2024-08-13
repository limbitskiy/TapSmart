import { createWebHistory, createRouter } from "vue-router";

import Init from "@/views/Init.vue";
import Tutorial from "@/views/Tutorial.vue";
import Home from "@/views/Home.vue";
import Main from "@/views/Main.vue";
import Battles from "@/views/Battles.vue";
import Friends from "@/views/Friends.vue";
import Tasks from "@/views/Tasks.vue";
import Leaders from "@/views/Leaders.vue";
import Market from "@/views/Market.vue";
import NotFound from "@/views/NotFound.vue";
import RequiredSettings from "@/views/RequiredSettings.vue";
import Profile from "@/views/Profile.vue";

const routes = [
  { path: "/:pathMatch(.*)*", component: NotFound },
  { path: "/", redirect: "/init" },
  {
    path: "/init",
    component: Init,
    meta: { transition: "long-fade" },
  },
  {
    path: "/tutorial",
    component: Tutorial,
  },
  {
    path: "/required-settings",
    component: RequiredSettings,
  },
  {
    path: "/profile",
    component: Profile,
  },
  {
    path: "/home",
    component: Home,
    children: [
      {
        id: 1,
        path: "battles",
        component: Battles,
      },
      {
        id: 2,
        path: "friends",
        component: Friends,
      },
      {
        id: 3,
        path: "tasks",
        component: Tasks,
      },
      {
        id: 4,
        path: "leaders",
        component: Leaders,
      },
      {
        id: 4,
        path: "market",
        component: Market,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// access only through /init
// router.beforeEach((to, from) => {
//   if (to.path !== "/init" && from.path === "/") {
//     return { path: "/init" };
//   }
// });

export default router;
