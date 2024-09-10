import { computed, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { defineStore } from "pinia";

// stores
import { useDataStore } from "@/store/data";
import { useBattleStore } from "@/store/battle";

// types
import { NotificationProps, ResponseObject, ResponseData, MainState } from "@/types";

// api
import { makeRequest } from "@/api/server";
import { log } from "console";

export const useMainStore = defineStore("main", () => {
  const notification = ref<NotificationProps>({
    title: null,
    subtitle: null,
    buttons: {},
    isShown: false,
  });

  const tooltip = ref({
    text: <null | string>null,
    element: <null | HTMLElement>null,
    isShown: false,
  });

  const state = ref<MainState>({});

  const router = useRouter();
  const dataStore = useDataStore();
  const battleStore = useBattleStore();

  const notificationData = computed(() => notification.value);

  const requestPending = ref(false);
  const requestQueue = ref([]);

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
          } else {
            dataStore.set(section, sectionData);
          }
        });
      } else {
        state.value[key] = response[key];
      }
    });
  };

  const startApp = () => {
    if (state.value.entryPoint) {
      router.push(state.value.entryPoint);
    } else {
      router.push("/home/main");
    }
  };

  const showNotification = ({ title, subtitle, buttons, timeout }: NotificationProps) => {
    if (notification.value.isShown) return;

    notification.value.title = title;
    notification.value.subtitle = subtitle;
    notification.value.buttons = buttons;
    // notification.value.isShown = true;

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

  const notificationAction = ({ api, data }: { api: string; data: unknown }) => {
    useFetch({ key: api, data });
  };

  const initialFetch = async (data: unknown) => {
    return await useFetch({ data });
  };

  const fetchFriendsPage = async () => {
    return await useFetch({ key: "friend_table_list" });
  };

  const fetchBattlesPage = async () => {
    return await useFetch({ key: "battle_init" });
  };

  const fetchChallengePage = async (data) => {
    return await useFetch({ key: "challenge_init", data });
  };

  const setLanguages = async (data: unknown) => {
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

  return {
    notificationData,
    tooltip,
    startApp,
    fetchFriendsPage,
    fetchBattlesPage,
    fetchChallengePage,
    setLanguages,
    initialFetch,
    useFetch,
    showNotification,
    hideNotification,
    notificationAction,
    showTooltip,
    hideTooltip,
  };
});
