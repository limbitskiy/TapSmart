import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { useDataStore } from "./data.ts";
import { useBattleStore } from "./battle.ts";
import { makeRequest } from "../api/server";
import { ResponseData, NotificationProps } from "../types";

export const useMainStore = defineStore("main", () => {
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
  const battleStore = useBattleStore();

  const notificationData = computed(() => notification.value);

  const parseResponse = (response) => {
    // console.log(`Setting stores: `, response);

    Object.keys(response).forEach((key) => {
      if (key === "data") {
        Object.keys(response.data).forEach((section) => {
          const sectionData = response.data[section];

          if (section === "notification") {
            showNotification(sectionData);
          } else {
            dataStore.set(section, sectionData);
          }
        });
      }

      state.value[key] = response[key];
    });
  };

  const startApp = () => {
    if (state.value.entryPoint) {
      router.push(state.value.entryPoint);
    } else {
      router.push("/home/main");
    }
  };

  const showNotification = ({ title, subtitle, buttons, timeout }) => {
    if (notification.value.isShown) return;

    notification.value.title = title;
    notification.value.subtitle = subtitle;
    notification.value.buttons = buttons;
    notification.value.isShown = true;

    // console.log(`notification: `, notification.value);

    // setTimeout(() => {
    //   notification.value.title = null;
    //   notification.value.subtitle = null;
    //   notification.value.buttons = {};
    //   notification.value.isShown = false;
    // }, timeout);
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
    const result = await makeRequest({
      apiUrl: state.value.apiUrl,
      payload: {
        key,
        data,
        service: state.value.service,
        answers: battleStore.answers,
        lastTaskId: battleStore.lastTaskId,
      },
    });
    parseResponse(result.data);

    const redirectLocation = result.data.redirect;

    if (redirectLocation) {
      console.log(`redirecting to ${redirectLocation}`);

      router.push(redirectLocation);
    }
  };

  return {
    notificationData,
    startApp,
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
