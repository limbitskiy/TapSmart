import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { useBattleStore } from "@/store/battle.ts";

export const useDataStore = defineStore("data", () => {
  const battleStore = useBattleStore();
  const { setBattleData } = battleStore;

  const state = ref({
    menu: [
      // {
      //   id: 0,
      //   title: "Home",
      //   link: "/home/main",
      //   icon: "home",
      // },
      // {
      //   id: 1,
      //   title: "Battles",
      //   link: "/home/battles",
      //   icon: "battles",
      // },
      // {
      //   id: 2,
      //   title: "Friends",
      //   link: "/home/friends",
      //   icon: "friends",
      // },
      // {
      //   id: 3,
      //   title: "Options",
      //   link: "/home/options",
      //   icon: "options",
      // },
    ],
    tutorial: {
      // {
      //   id: 0,
      //   title: "<span class='text-[var(--accent-color)]'>Welcome</span><br /> to our app!",
      //   subtitle: "Tiger-app is a multiplayer platform for learning languages, making friends and earning achievements.",
      //   "bg-image": "tiger-bg.png",
      //   "bg-color": "#1f2937",
      // },
      // {
      //   id: 1,
      //   title: "<span class='text-[var(--accent-color)]'>Play battles,</span> earn friends and learn!",
      //   topic: "Battles",
      //   subtitle: "In Tiger-app you can play different types of battles, earn new achievements and event make new friends while you're at it",
      //   "bg-image": "tiger-bg1.png",
      //   "bg-color": "#281f37",
      // },
      // {
      //   id: 2,
      //   title: "Confirm languages",
      //   subtitle: "Just to be sure, let's confirm our target and native languages",
      //   "bg-color": "#27396d",
      // },
    },
    friends: {
      // title: "Friends",
      // subtitle: "Inviting a friend gives you points. Play battles with your friends to get even more points!",
      // friendList: [
      //   {
      //     id: 4867349,
      //     name: "John_4534",
      //     isOnline: true,
      //     title: "Lord",
      //     money: "120K",
      //     moneyEarned: "564K",
      //     points: "340",
      //   },
      //   {
      //     id: 4343243449,
      //     name: "Max_4832",
      //     isOnline: false,
      //     title: "Lord",
      //     money: "100K",
      //     moneyEarned: "481K",
      //     points: "2K",
      //   },
      //   {
      //     id: 3254235,
      //     name: "Alex_950",
      //     isOnline: false,
      //     title: "Duke",
      //     money: "80K",
      //     moneyEarned: "371K",
      //     points: "28K",
      //   },
      //   {
      //     id: 3254611,
      //     name: "Lillit_4567",
      //     isOnline: true,
      //     title: "Duke",
      //     money: "75K",
      //     moneyEarned: "271K",
      //     points: "871K",
      //   },
      //   {
      //     id: 3452221,
      //     name: "Annie_345621",
      //     isOnline: true,
      //     title: "Duke",
      //     money: "45K",
      //     moneyEarned: "593K",
      //     points: "563",
      //   },
      // ],
    },
    profile: {},
    "required-settings": {},
  });

  const tutorial = computed(() => state.value.tutorial);

  const friends = computed(() => state.value.friends);

  const menu = computed(() => state.value.menu);

  const profile = computed(() => state.value.profile);

  const requiredSettings = computed(() => state.value["required-settings"]);

  const setData = (data) => {
    console.log("data: ", data);

    Object.keys(data).forEach((section) => {
      if (section === "battle_procesor") {
        setBattleData(data[section]);
      } else {
        Object.keys(data[section]).forEach((sectionKey) => {
          if (sectionKey === "locale") {
            state.value[section].locale = data[section].locale;
          } else if (sectionKey === "store") {
            if (!state.value[section].store) {
              state.value[section].store = data[section].store;
              return;
            }

            Object.keys(data[section].store).forEach((storeKey) => {
              state.value[section].store[storeKey] = data[section].store[storeKey];
            });
          }
        });
      }
    });
    console.log("merged store: ", state.value);
  };

  const addBolts = (amount) => {
    state.value.profile.store.bolts += amount;
  };

  return { tutorial, friends, menu, profile, requiredSettings, setData, addBolts };
});
