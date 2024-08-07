import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { Howl, Howler } from "howler";
import { fetchSounds, fetchInitData } from "@/api";

export const useUserStore = defineStore("user", () => {
  const state = ref({
    locale: {},
    tutorial: [
      {
        id: 0,
        title: "Welcome to our app!",
        subtitle: "Tiger-app is a multiplayer platform for learning languages, making friends and earning achievements.",
        background: "tiger-bg.png",
      },
      {
        id: 1,
        title: "<span class='text-[var(--accent-color)]'>Play battles,</span> earn friends and learn!",
        subtitle: "In Tiger-app you can play different types of battles, earn new achievements and event make new friends while you're at it",
        background: "tiger-bg1.png",
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
    soundtrack: null,
  });

  const router = useRouter();

  const tutorial = computed(() => state.value.tutorial);

  const menu = computed(() => state.value.menu);

  const locale = computed(() => state.value.locale);

  const setData = (data) => {
    state.value.data = data;
  };

  const loadInitData = async () => {
    const res = await Promise.all([fetchSounds(), fetchInitData()]);

    console.log(res);

    state.value.soundtrack = res[0];

    setData(res[1]);

    return true;
  };

  const startApp = () => {
    if (state.value.tutorial?.length) {
      router.push("/tutorial");
    } else {
      router.push("/");
    }

    state.value.soundtrack.play();
  };

  return { tutorial, menu, locale, loadInitData, startApp };
});
