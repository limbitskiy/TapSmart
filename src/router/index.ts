import { createWebHistory, createRouter } from "vue-router";

import Intro from "@/views/Intro.vue";

const routes = [
  { path: "/", redirect: "/intro" },
  {
    path: "/intro",
    component: Intro,
    meta: { transition: "long-fade" },
  },
  {
    path: "/tutorial",
    component: () => import("@/views/Tutorial.vue"),
  },
  {
    path: "/home",
    component: () => import("@/views/Home.vue"),
    children: [
      {
        id: 0,
        path: "main",
        component: () => import("@/views/Main.vue"),
      },
      {
        id: 1,
        path: "battles",
        component: () => import("@/views/Battles.vue"),
      },
      {
        id: 2,
        path: "friends",
        component: () => import("@/views/Friends.vue"),
      },
      {
        id: 3,
        path: "options",
        component: () => import("@/views/Options.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
