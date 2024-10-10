import { computed, ref, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { defineStore } from "pinia";
import { useVibrate } from "@vueuse/core";

// stores
import { useDataStore } from "@/store/data";
import { useBattleStore } from "@/store/battle";

// types
import {
  NotificationProps,
  ResponseObject,
  ResponseData,
  MainState,
  TooltipProps,
  ModalProps,
} from "@/types";

// api
import { makeRequest } from "@/api/server";

export const useMainStore = defineStore("main", () => {
  const notification = ref<NotificationProps>({
    title: null,
    subtitle: null,
    buttons: {
      left: {},
      right: {},
    },
    isShown: false,
    fn: null,
  });

  const tooltip = ref<TooltipProps>({
    text: null,
    element: null,
    isShown: false,
  });

  const modal = ref<ModalProps>({
    title: null,
    subtitle: null,
    image: null,
    buttons: {},
    isShown: false,
  });

  const state = ref<MainState>({});

  const router = useRouter();
  const route = useRoute();
  const dataStore = useDataStore();
  const battleStore = useBattleStore();

  const isAppLoaded = ref(false);

  const requestPending = ref(false);
  const requestQueue = ref([]);

  const pageKeys = {
    homeChild: Math.random() * 99999,
  };

  // process request queue
  watch(
    requestQueue,
    (queue) => {
      if (queue.length) {
        processRequestQueue();
      }
    },
    { deep: true }
  );

  const parseResponse = (response: ResponseObject) => {
    (Object.keys(response) as Array<keyof ResponseObject>).forEach((key) => {
      if (key === "data") {
        (Object.keys(response.data) as Array<keyof ResponseData>).forEach(
          (section) => {
            const sectionData = response.data[section];

            if (sectionData === null) return;

            if (section === "notification") {
              showNotification(sectionData as NotificationProps);
            } else if (section === "modal") {
              showModal(sectionData as ModalProps);
            } else {
              dataStore.set(section, sectionData);
            }
          }
        );
      } else if (key === "entryPoint" && isAppLoaded.value) {
        redirectTo(response.entryPoint);
      } else if (key === "externalUrl") {
        location.href = response.externalUrl;
      } else {
        state.value[key] = response[key];
      }
    });
  };

  const startApp = () => {
    isAppLoaded.value = true;

    const entryPoint = state.value.entryPoint;

    if (entryPoint) {
      redirectTo(entryPoint);
    }
  };

  const showNotification = ({
    title,
    subtitle,
    buttons,
    timeout,
  }: NotificationProps) => {
    if (notification.value.isShown) {
      // hideNotification();

      setTimeout(() => {
        // showNotification({ title, subtitle, buttons, timeout });
      }, 500);
      return;
    }

    notification.value.title = title;
    notification.value.subtitle = subtitle;
    notification.value.buttons = buttons;
    // notification.value.isShown = true;

    // hideTooltip();

    // console.log(`notification: `, notification.value);

    notification.value.fn = setTimeout(() => {
      // hideNotification();
    }, timeout);
  };

  const hideNotification = () => {
    notification.value.title = null;
    notification.value.subtitle = null;
    notification.value.buttons = {};
    notification.value.isShown = false;
    notification.value.fn = null;
  };

  const showTooltip = ({
    element,
    text,
  }: {
    element: HTMLElement;
    text: string;
  }) => {
    if (element === tooltip.value.element) {
      return;
    }

    hideTooltip();

    setTimeout(() => {
      tooltip.value.text = text;
      tooltip.value.element = element;
      tooltip.value.isShown = true;

      setTimeout(hideTooltip, 5000);
    }, 100);
  };

  const hideTooltip = () => {
    tooltip.value.text = null;
    tooltip.value.element = null;
    tooltip.value.isShown = false;
  };

  const showModal = ({ title, subtitle, image, buttons }: ModalProps) => {
    if (modal.value.isShown) return;

    modal.value.title = title;
    modal.value.subtitle = subtitle;
    modal.value.image = image;
    modal.value.buttons = buttons;
    modal.value.isShown = true;

    // console.log(`modal: `, modal.value);
  };

  const hideModal = () => {
    modal.value.title = null;
    modal.value.subtitle = null;
    modal.value.image = null;
    modal.value.buttons = {};
    modal.value.isShown = false;
  };

  const callApi = async ({ api, data }: { api: string; data?: {} }) => {
    await useFetch({ key: api, data });
  };

  const callApiSync = ({ api, data }: { api: string; data?: {} }) => {
    useFetch({ key: api, data });
  };

  const onVibrate = (type: string) => {
    if (dataStore.settings.vibro) {
      let pattern;
      switch (type) {
        case "correct": {
          pattern = [300];
          break;
        }
        case "wrong": {
          pattern = [100, 10, 100, 10, 100];
          break;
        }
      }

      const { vibrate, isSupported } = useVibrate({ pattern });

      if (isSupported) {
        vibrate();
      }
    }
  };

  const initialFetch = (data: {}) => {
    return useFetch({ data });
  };

  const fetchFriendsList = async () => {
    return await useFetch({ key: "friend_table_list" });
  };

  const fetchRelaxPageData = async () => {
    let data = {};

    if (battleStore.battleTypeHasChanged) {
      data.battle_type = battleStore.currentBattleType;
      battleStore.battleTypeHasChanged = false;
    }

    await useFetch({ key: "battle_init", data });

    redirectTo(
      `/home/relax/${battleStore.getMechanicName(battleStore.data.battle_type)}`
    );
    return;
  };

  const fetchWaitingData = async (data: {}) => {
    return await useFetch({ key: "challenge_init", data });
  };

  const fetchChallengePageData = async () => {
    return await useFetch({ key: "challenge_init" });
  };

  const fetchProfilePageData = async () => {
    return await useFetch({ key: "profile_get" });
  };

  const fetchTasksList = async () => {
    return await useFetch({ key: "tasks_list" });
  };

  const fetchBattleCompleteData = async () => {
    return await useFetch({ key: "battle_completed" });
  };

  const getOnlineFriends = async () => {
    await useFetch({ key: "get_online_friends" });
    return;
  };

  const setLanguages = async (data: {}) => {
    return await useFetch({ key: "profile_set", data });
  };

  const useFetch = ({ key, data }: { key?: string; data?: {} }) => {
    if (requestQueue.value.length > 3) return;

    return new Promise((res, rej) => {
      // console.log(requestQueue.value.length);

      requestQueue.value.push(async () => {
        try {
          const result = await makeRequest({
            apiUrl: state.value.apiUrl,
            payload: {
              key,
              data: {
                ...data,
                answers: battleStore.answers,
                lastTaskId: battleStore.lastTaskId,
                routeData: state.value.routeData,
              },
              service: state.value.service,
            },
          });

          parseResponse(result.data);

          // clean route data
          if (state.value.routeData) {
            delete state.value.routeData;
          }

          res(true);
        } catch (error) {
          rej(error?.response?.data?.error?.message || error?.message || error);
        }

        // const redirectLocation = result.data.redirect;

        // if (redirectLocation) {
        //   console.log(`redirecting to ${redirectLocation}`);
        //   router.push(redirectLocation);
        // }
      });
    });
  };

  const processRequestQueue = async () => {
    if (requestPending.value) return;

    requestPending.value = true;
    const currentRequest = requestQueue.value[0];

    if (currentRequest) {
      await currentRequest();
    }

    requestPending.value = false;
    requestQueue.value.shift();
  };

  const redirectTo = (location: string) => {
    if (route.path === location) return;

    console.log(`redirecting to ${location}`);

    router.push(location);
  };

  const setRouteData = (value: any) => {
    state.value.routeData = value;
  };

  const getPageKey = (page) => pageKeys[page];

  const resetPageKey = (page) => {
    pageKeys[page] = Math.random() * 9999;
  };

  return {
    notification,
    tooltip,
    modal,
    startApp,
    fetchFriendsList,
    getOnlineFriends,
    fetchRelaxPageData,
    fetchWaitingData,
    fetchProfilePageData,
    fetchChallengePageData,
    fetchTasksList,
    fetchBattleCompleteData,
    setLanguages,
    initialFetch,
    useFetch,
    showNotification,
    hideNotification,
    callApi,
    callApiSync,
    showTooltip,
    hideTooltip,
    hideModal,
    redirectTo,
    onVibrate,
    setRouteData,
    showModal,
    getPageKey,
    resetPageKey,
  };
});
