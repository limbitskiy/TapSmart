import { computed, ref, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { defineStore } from "pinia";

// stores
import { useDataStore } from "@/store/data";
import { useBattleStore } from "@/store/battle";

// types
import { NotificationProps, ResponseObject, ResponseData, MainState, TooltipProps, ModalProps } from "@/types";

// api
import { makeRequest } from "@/api/server";

export const useMainStore = defineStore("main", () => {
  const notification = ref<NotificationProps>({
    title: null,
    subtitle: null,
    buttons: {},
    isShown: false,
  });

  const tooltip = ref<TooltipProps>({
    text: null,
    element: null,
    isShown: false,
  });

  const modal = ref<ModalProps>({
    title: null,
    subtitle: null,
    buttons: {},
    isShown: false,
  });

  const state = ref<MainState>({});

  const router = useRouter();
  const route = useRoute();
  const dataStore = useDataStore();
  const battleStore = useBattleStore();

  const isAppLoaded = ref(false);

  const notificationData = computed(() => notification.value);

  const requestPending = ref(false);
  const requestQueue = ref([]);

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
        (Object.keys(response.data) as Array<keyof ResponseData>).forEach((section) => {
          const sectionData = response.data[section];

          if (sectionData === null) return;

          if (section === "notification") {
            showNotification(sectionData as NotificationProps);
          } else if (section === "modal") {
            showModal(sectionData as ModalProps);
          } else {
            dataStore.set(section, sectionData);
          }
        });
      } else if (key === "entryPoint" && isAppLoaded.value) {
        redirectTo(response.entryPoint);
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

  const showNotification = ({ title, subtitle, buttons, timeout }: NotificationProps) => {
    if (notification.value.isShown) return;

    notification.value.title = title;
    notification.value.subtitle = subtitle;
    notification.value.buttons = buttons;
    notification.value.isShown = true;

    // console.log(`notification: `, notification.value);

    setTimeout(() => {
      notification.value.title = null;
      notification.value.subtitle = null;
      notification.value.buttons = {};
      notification.value.isShown = false;
    }, timeout);
  };

  const hideNotification = () => {
    notification.value.title = null;
    notification.value.subtitle = null;
    notification.value.buttons = {};
    notification.value.isShown = false;
  };

  const showTooltip = ({ element, text }: { element: HTMLElement; text: string }) => {
    if (element === tooltip.value.element) {
      return;
    }

    hideTooltip();

    setTimeout(() => {
      tooltip.value.text = text;
      tooltip.value.element = element;
      tooltip.value.isShown = true;
    }, 100);
  };

  const hideTooltip = () => {
    tooltip.value.text = null;
    tooltip.value.element = null;
    tooltip.value.isShown = false;
  };

  const showModal = ({ title, subtitle, buttons }: ModalProps) => {
    if (modal.value.isShown) return;

    modal.value.title = title;
    modal.value.subtitle = subtitle;
    modal.value.buttons = buttons;
    modal.value.isShown = true;

    // console.log(`modal: `, modal.value);
  };

  const hideModal = () => {
    modal.value.title = null;
    modal.value.subtitle = null;
    modal.value.buttons = {};
    modal.value.isShown = false;
  };

  const callApi = ({ api, data }: { api: string; data?: {} }) => {
    useFetch({ key: api, data });
  };

  const onVibrate = (type: string) => {
    if (dataStore.settings.vibro) {
      switch (type) {
        case "correct": {
          navigator.vibrate(300);
          break;
        }
        case "wrong": {
          navigator.vibrate([100, 10, 100, 10, 100]);
          break;
        }
      }
    }
  };

  const initialFetch = async (data: {}) => {
    return await useFetch({ data });
  };

  const fetchFriendsPage = async () => {
    return await useFetch({ key: "friend_table_list" });
  };

  const fetchRelaxPageData = async () => {
    await useFetch({ key: "battle_init" });
    redirectTo(`/home/relax/${battleStore.getMechanicName(battleStore.data.battle_type)}`);
    return;
  };

  const fetchChallengePageData = async (data: {}) => {
    await useFetch({ key: "challenge_init", data });
    redirectTo(`/challenge/${battleStore.getMechanicName(battleStore.data.battle_type)}`);
    return;
  };

  const fetchProfilePageData = async () => {
    await useFetch({ key: "profile_get" });
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
        const result = await makeRequest({
          apiUrl: state.value.apiUrl,
          payload: {
            key,
            data: {
              ...data,
              answers: battleStore.answers,
              lastTaskId: battleStore.lastTaskId,
            },
            service: state.value.service,
          },
        });

        parseResponse(result.data);

        res(true);

        const redirectLocation = result.data.redirect;

        if (redirectLocation) {
          console.log(`redirecting to ${redirectLocation}`);
          router.push(redirectLocation);
        }
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

    router.push(location);
  };

  return {
    notificationData,
    tooltip,
    modal,
    startApp,
    fetchFriendsPage,
    fetchRelaxPageData,
    fetchChallengePageData,
    fetchProfilePageData,
    setLanguages,
    initialFetch,
    useFetch,
    showNotification,
    hideNotification,
    callApi,
    showTooltip,
    hideTooltip,
    hideModal,
    redirectTo,
    onVibrate,
  };
});
