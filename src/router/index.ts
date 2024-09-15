import { createWebHistory, createRouter } from "vue-router";

// views
import Init from "@/views/Init.vue";
import Tutorial from "@/views/Tutorial.vue";
import Home from "@/views/Home.vue";
import Relax from "@/views/Relax.vue";
import Friends from "@/views/Friends.vue";
import Tasks from "@/views/Tasks.vue";
import Leaders from "@/views/Leaders.vue";
import Market from "@/views/Market.vue";
import NotFound from "@/views/NotFound.vue";
import RequiredSettings from "@/views/RequiredSettings.vue";
import ProfileView from "@/views/ProfileView.vue";
import Challenge from "@/views/Challenge.vue";
import BattleResults from "@/views/BattleResults.vue";
import BattleComplete from "@/views/BattleComplete.vue";
import StartRelax from "@/views/StartRelax.vue";

// battles
import YesNo from "@/components/battles/YesNo.vue";
import FourAnswers from "@/components/battles/FourAnswers.vue";

// stores
import { useDataStore } from "@/store/data";
import { useMainStore } from "@/store/main";

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
    component: ProfileView,
  },
  {
    path: "/start-relax",
    component: StartRelax,
  },
  {
    path: "/home",
    component: Home,
    children: [
      {
        id: 1,
        path: "relax",
        component: Relax,
        children: [
          {
            id: 11,
            path: "yesno",
            component: YesNo,
          },
          {
            id: 12,
            path: "4answers",
            component: FourAnswers,
          },
        ],
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
  {
    path: "/challenge",
    component: Challenge,
    children: [
      {
        id: 21,
        path: "yesno",
        component: YesNo,
      },
      {
        id: 22,
        path: "4answers",
        component: FourAnswers,
      },
    ],
  },
  {
    path: "/battle-complete",
    component: BattleComplete,
  },
  {
    path: "/battle-results",
    component: BattleResults,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// access only through /init
router.beforeEach((to, from) => {
  const dataStore = useDataStore();
  const mainStore = useMainStore();
  const { battles } = dataStore;

  mainStore.hideTooltip();

  // init is the only entrypoint
  if (to.path !== "/init" && from.path === "/") {
    return { path: "/init" };
  }

  // if (to.path.match(/^\/home\/relax\/?$/) && from.path.match(/^\/home\/relax\/\w{1,}$/)) {
  //   // router.push(`/home/relax/${battleStore.getMechanicName(battleStore.data.battle_type)}`);
  //   // battleStore.resetBattleStats();
  //   console.log(`poop`);

  //   return { path: "/home/relax",  };
  // }
});

export default router;
