import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import { Howl, Howler } from "howler";

export const useUserStore = defineStore("user", () => {
  const router = useRouter();

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
  });

  const tutorial = computed(() => state.value.tutorial);

  const menu = computed(() => state.value.menu);

  const locale = computed(() => state.value.locale);

  const setData = (data) => {
    state.value.data = data;
  };

  const fetchInitData = async () => {
    const sound = new Howl({
      src: ["/soundtrack.mp3"],
      volume: 0.5,
      loop: true,
    });

    sound.play();

    const data = await axios.get("https://httpbin.org/delay/3");

    setData(data);

    if (state.value.tutorial?.length) {
      router.push("/tutorial");
    } else {
      router.push("/");
    }
  };

  return { tutorial, menu, locale, fetchInitData };
});
