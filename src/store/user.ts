import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { useDataStore } from "@/store/data.ts";
import { makeRequest } from "@/api/server";

export const useUserStore = defineStore("user", () => {
  const notification = ref({
    title: null,
    subtitle: null,
    buttons: {},
    isShown: false,
  });

  const state = ref({
    service: {},
    entryPoint: null,
    apiUrl: null,
  });

  const router = useRouter();
  const dataStore = useDataStore();
  const { setData } = dataStore;

  const notificationData = computed(() => notification.value);
  // const toast = computed(() => state.value.toast);

  const setStore = (data) => {
    console.log(data);

    Object.keys(data).forEach((key) => {
      if (key === "data") {
        setData(data[key]);
      }

      state.value[key] = data[key];
    });
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

  const showNotification = ({ title, subtitle, buttons }) => {
    if (notification.value.isShown) return;

    notification.value.title = title;
    notification.value.subtitle = subtitle;
    notification.value.buttons = buttons;
    notification.value.isShown = true;

    console.log(`notification!!!`, notification.value);

    // setTimeout(() => {
    //   notification.value.title = null;
    //   notification.value.subtitle = null;
    //   notification.value.buttons = {};
    //   notification.value.isShown = false;
    // }, 3000);
  };

  const hideNotification = () => {
    notification.value.title = null;
    notification.value.subtitle = null;
    notification.value.buttons = {};
    notification.value.isShown = false;
  };

  const notificationAction = ({ api, data }) => {
    useFetch({ key: api, data });
  };

  const initialFetch = async (data) => {
    return await useFetch({ data });
  };

  const fetchFriendsPage = async () => {
    return await useFetch({ key: "friend_table_list" });
  };

  const fetchBattlesPage = async () => {
    return await useFetch({ key: "battle_init" });
  };

  const setLanguages = async (data) => {
    return await useFetch({ key: "profile_set", data });
  };

  const useFetch = async ({ key, data }) => {
    const result = await makeRequest({ key, data, service: state.value.service, apiUrl: state.value.apiUrl });
    setStore(result.data);

    const redirectLocation = result.data.redirect;

    if (redirectLocation) {
      console.log(`redirecting to ${redirectLocation}`);

      router.push(redirectLocation);
    }
  };

  return {
    notificationData,
    startApp,
    showToast,
    fetchFriendsPage,
    fetchBattlesPage,
    setLanguages,
    initialFetch,
    useFetch,
    showNotification,
    hideNotification,
    notificationAction,
  };
});
