import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
// import { Howl, Howler } from "howler";
// import { fetchSounds, fetchInitData } from "@/api/server";

export const useUserStore = defineStore("user", () => {
  const state = ref({
    locale: {},
    tutorial: [
      {
        id: 0,
        title: "<span class='text-[var(--accent-color)]'>Welcome</span><br /> to our app!",
        subtitle: "Tiger-app is a multiplayer platform for learning languages, making friends and earning achievements.",
        "bg-image": "tiger-bg.png",
        "bg-color": "#1f2937",
      },
      {
        id: 1,
        title: "<span class='text-[var(--accent-color)]'>Play battles,</span> earn friends and learn!",
        topic: "Battles",
        subtitle: "In Tiger-app you can play different types of battles, earn new achievements and event make new friends while you're at it",
        "bg-image": "tiger-bg1.png",
        "bg-color": "#281f37",
      },
      {
        id: 2,
        title: "Confirm languages",
        subtitle: "Just to be sure, let's confirm our target and native languages",
        "bg-color": "#27396d",
      },
    ],
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
          points: "340",
        },
        {
          id: 4343243449,
          name: "Max_4832",
          isOnline: false,
          title: "Lord",
          money: "100K",
          moneyEarned: "481K",
          points: "2K",
        },
        {
          id: 3254235,
          name: "Alex_950",
          isOnline: false,
          title: "Duke",
          money: "80K",
          moneyEarned: "371K",
          points: "28K",
        },
        {
          id: 3254611,
          name: "Lillit_4567",
          isOnline: true,
          title: "Duke",
          money: "75K",
          moneyEarned: "271K",
          points: "871K",
        },
        {
          id: 3452221,
          name: "Annie_345621",
          isOnline: true,
          title: "Duke",
          money: "45K",
          moneyEarned: "593K",
          points: "563",
        },
      ],
    },
    sounds: {},
    toast: {
      message: null,
      isShown: false,
    },
    entryPoint: "/required-settings",
  });

  const router = useRouter();

  const tutorial = computed(() => state.value.tutorial);

  const friends = computed(() => state.value.friends);

  const menu = computed(() => state.value.menu);

  const locale = computed(() => state.value.locale);

  const toast = computed(() => state.value.toast);

  const sounds = computed(() => state.value.sounds);

  const setData = (data) => {
    state.value.data = data;
  };

  const playSound = (soundId) => {
    state.value.sounds[soundId].play();
  };

  const addSound = (id, sound) => {
    state.value.sounds[id] = sound;
  };

  const startApp = () => {
    if (state.value.entryPoint) {
      router.push(state.value.entryPoint);
    } else {
      router.push("/home/main");
    }
  };

  const showToast = (text) => {
    if (state.value.toast.isShown) return;

    state.value.toast.message = text;
    state.value.toast.isShown = true;

    setTimeout(() => {
      state.value.toast.message = null;
      state.value.toast.isShown = false;
    }, 3000);
  };

  return { tutorial, friends, menu, locale, toast, sounds, startApp, showToast, addSound, playSound };
});
