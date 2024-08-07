import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { Howl, Howler } from "howler";
import { fetchSounds, fetchInitData } from "@/api";

export const useUserStore = defineStore("user", () => {
  const state = ref({
    locale: {},
    // tutorial: [
    //   {
    //     id: 0,
    //     title: "Welcome to our app!",
    //     subtitle: "Tiger-app is a multiplayer platform for learning languages, making friends and earning achievements.",
    //     background: "tiger-bg.png",
    //   },
    //   {
    //     id: 1,
    //     title: "<span class='text-[var(--accent-color)]'>Play battles,</span> earn friends and learn!",
    //     topic: "Taxes",
    //     subtitle: "In Tiger-app you can play different types of battles, earn new achievements and event make new friends while you're at it",
    //     background: "tiger-bg1.png",
    //   },
    // ],
    menu: [
      {
        id: 0,
        title: "Home",
        link: "/home/main",
        icon: "home",
      },
      {
        id: 1,
        title: "Battles",
        link: "/home/battles",
        icon: "battles",
      },
      {
        id: 2,
        title: "Friends",
        link: "/home/friends",
        icon: "friends",
      },
      {
        id: 3,
        title: "Options",
        link: "/home/options",
        icon: "options",
      },
    ],
    friends: {
      title: "Friends",
      subtitle: "Inviting a friend gives you points. Play battles with your friends to get even more points!",
      friendList: [
        {
          id: 4867349,
          name: "John_4534",
          isOnline: true,
          title: "Lord",
          money: "120K",
          moneyEarned: "564K",
        },
        {
          id: 4343243449,
          name: "Max_4832",
          isOnline: false,
          title: "Lord",
          money: "100K",
          moneyEarned: "481K",
        },
        {
          id: 3254235,
          name: "Alex_950",
          isOnline: false,
          title: "Duke",
          money: "80K",
          moneyEarned: "371K",
        },
        {
          id: 3254611,
          name: "Lillit_4567",
          isOnline: true,
          title: "Duke",
          money: "75K",
          moneyEarned: "271K",
        },
        {
          id: 3452221,
          name: "Amy_345621",
          isOnline: true,
          title: "Duke",
          money: "45K",
          moneyEarned: "593K",
        },
      ],
    },
    soundtrack: null,
  });

  const router = useRouter();

  const tutorial = computed(() => state.value.tutorial);

  const friends = computed(() => state.value.friends);

  const menu = computed(() => state.value.menu);

  const locale = computed(() => state.value.locale);

  const setData = (data) => {
    state.value.data = data;
  };

  const playSoundtrack = () => {
    if (state.value.soundtrack) {
      state.value.soundtrack.play();
    }
  };

  const loadInitData = async () => {
    const res = await Promise.all([fetchSounds, fetchInitData]);
    state.value.soundtrack = res[0];
    setData(res[1]);
    return true;
  };

  const startApp = () => {
    if (state.value.tutorial?.length) {
      router.push("/tutorial");
    } else {
      router.push("/home/friends");
    }

    // playSoundtrack();
  };

  return { tutorial, friends, menu, locale, loadInitData, startApp };
});
