import { computed, nextTick, ref, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { defineStore } from "pinia";
import { useVibrate } from "@vueuse/core";
import { tg } from "@/api/telegram";
import { getAsset, waitFor } from "@/utils";

// stores
import { useDataStore } from "@/store/data";
import { useBattleStore } from "@/store/battle";
import { useLocaleStore } from "@/store/locale";
import { useSoundStore } from "@/store/sound";

// types
import { NotificationProps, ResponseObject, ResponseData, MainState, TooltipProps, ModalProps } from "@/types";

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
    timeout: null,
  });

  const tooltip = ref<TooltipProps>({
    text: null,
    element: null,
    isShown: false,
    timeout: null,
  });

  const modal = ref<ModalProps>({
    title: null,
    subtitle: null,
    image: null,
    buttons: {},
    isShown: false,
  });

  const debugMessages = ref([]);

  const state = ref<MainState>({});

  const router = useRouter();
  const route = useRoute();

  // access to other stores
  const dataStore = useDataStore();
  const battleStore = useBattleStore();
  const localeStore = useLocaleStore();
  const soundStore = useSoundStore();

  const isAppLoaded = ref(false);

  const requestPending = ref(false);
  const requestQueue = ref([]);

  const HTMLSnapshots = ref<string[]>([]);

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
      } else if (key === "route" && isAppLoaded.value) {
        redirectTo(response.route);
      } else if (key === "externalUrl") {
        location.href = response.externalUrl;
      } else {
        state.value[key] = response[key];
      }
    });
  };

  const startApp = () => {
    isAppLoaded.value = true;

    const route = state.value.route;

    if (route) {
      redirectTo(route);
    }
  };

  const showNotification = ({ title, subtitle, buttons, timeout }: NotificationProps) => {
    // console.log(`showing n`);

    if (notification.value.isShown) {
      // console.log(`need to hide prev notification!`);

      hideNotification();

      setTimeout(() => {
        showNotification({ title, subtitle, buttons, timeout });
      }, 500);
      return;
    }

    notification.value.title = title;
    notification.value.subtitle = subtitle;
    notification.value.buttons = buttons;
    notification.value.isShown = true;
    notification.value.timeout = timeout;

    hideTooltip();

    // console.log(`notification: `, notification.value);

    notification.value.fn = setTimeout(() => {
      hideNotification();
    }, timeout);
  };

  const hideNotification = () => {
    // console.log(`hiding n`);
    if (notification.value.fn) {
      clearTimeout(notification.value.fn);
    }

    notification.value.title = null;
    notification.value.subtitle = null;
    notification.value.buttons = {};
    notification.value.isShown = false;
    notification.value.fn = null;
  };

  const showTooltip = ({ element, text }: { element: HTMLElement; text: string }) => {
    if (element === tooltip.value.element) {
      return;
    }

    hideTooltip();

    setTimeout(() => {
      clearTimeout(tooltip.value.timeout);
      tooltip.value.text = text;
      tooltip.value.element = element;
      tooltip.value.isShown = true;
      tooltip.value.timeout = setTimeout(hideTooltip, 5000);
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
    return await useFetch({ key: "battle_init" });
  };

  const fetchWaitingData = async (data: {}) => {
    return await useFetch({ key: "challenge_init", data });
  };

  const fetchChallengePageData = async () => {
    const res = await useFetch({ key: "battle_init" });

    if (res?.data?.battles?.store?.battle_mode === "relax") {
      redirectTo("/home/relax");
    }
    return;
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

  const fetchBattleResultsData = async (data: {}) => {
    return await useFetch({ key: "battle_results", data });
  };

  const getOnlineFriends = async () => {
    await useFetch({ key: "get_online_friends" });
    return;
  };

  const setLanguages = async (data: {}) => {
    return await useFetch({ key: "profile_set", data });
  };

  const sendInviteAnalitycsData = (route) => {
    return useFetch({ key: "invite_click", data: { route } });
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
              },
              service: state.value.service,
            },
          });

          parseResponse(result.data);

          res(result.data);
        } catch (error) {
          // debugMessages.value.push("fetch error:", error);
          rej(error?.response?.data?.error?.message || error?.message || error);
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

    console.log(`redirecting to ${location}`);

    router.push(location);
  };

  const takeHTMLSnapshot = (el: HTMLElement) => {
    console.log(`taking snapshot`);
    HTMLSnapshots.value.push(el.outerHTML);
  };

  const createFinalImage = () =>
    new Promise((res, rej) => {
      const bgSrc = getAsset("battle_results_final");

      const bgImage = new Image();
      bgImage.src = bgSrc;
      const leaderBoardImage = new Image();
      leaderBoardImage.src = HTMLSnapshots.value.pop();

      leaderBoardImage.onload = () => {
        bgImage.onload = () => {
          const canvas = document.createElement("canvas");
          const scale = devicePixelRatio || 1;

          canvas.width = innerWidth * scale;
          canvas.height = innerHeight * scale;

          const ctx = canvas.getContext("2d");

          ctx?.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
          ctx?.drawImage(leaderBoardImage, 32 * scale, canvas.height / 2 - 110 * scale);

          ctx.fillRect(0, 0, canvas.width, 22 * scale);
          ctx.font = `${18 * scale}px sans-serif`;
          ctx.fillStyle = "white";
          const textWidth = ctx?.measureText(battleStore.data?.["story_call_to_action"] ?? "Played at @Tapsmart in Telegram").width;
          ctx.fillText(battleStore.data?.["story_call_to_action"] ?? "Played at @Tapsmart in Telegram", canvas.width / 2 - textWidth / 2, 18 * scale);

          const dataURL = canvas.toDataURL("image/jpeg");
          HTMLSnapshots.value?.push(dataURL);
          console.log(`resolving promise`);

          res(true);
        };
      };
    });

  const sendScreeshots = async () => {
    console.log(`starting to generate story`);

    try {
      console.log(HTMLSnapshots.value);

      await createFinalImage();
    } catch (error) {
      console.error(error);
      // debugMessages.value.push(error);
    }

    let storyParams = {};

    console.log(`starting usefetch`);
    try {
      const res = await useFetch({ key: "tg_story", data: { images: HTMLSnapshots.value } })!;
      console.log(`got usefetch response. sharing to story`);

      storyParams.url = res.data.url;

      // let widgetLink;
      storyParams.widgetParams = {};

      if (battleStore.data?.["story_link"]) {
        storyParams.widgetParams = { url: battleStore.data?.["story_link"], name: battleStore.data?.["story_link_text"] };
      }

      // debugMessages.value.push(`link recieved: ${res.data.url}`);

      // console.log(`waiting for 10s`);
      // await waitFor(10000);
    } catch (error) {
      console.error(error);
      debugMessages.value.push(error);
    }

    console.log(`sharing to story`);
    // tg.shareToStory("https://stories-dev.tapsmart.io/123_456.mp4", {
    //   text: "TapSmart text",
    //   widget_link: { url: "https://t.me/TapSmartBot/TapSmartGame?startapp=fr193438653_sr1", name: "Widget link text" },
    // });

    console.log(storyParams.url);
    console.log(storyParams.widgetParams);

    tg.shareToStory(storyParams.url, {
      text: battleStore.data?.["story_text"] ?? "TapSmart text",
      widget_link: storyParams.widgetParams,
    });
  };

  // debug
  const showTestNotification = () => {
    showNotification({
      title: "Test notification",
      subtitle: "User Michael_Jackson_89700 challenged you to a 4 answer battle. Do you accept?",
      timeout: 50000,
      buttons: { left: { label: "Reject", isClose: true }, right: { label: "Accept", isClose: true } },
    });
  };

  window.showNotification = showTestNotification;

  // watch(
  //   debugMessages,
  //   (val) => {
  //     if (val.length >= 5) {
  //       debugMessages.value = ["cleared debug console.."];
  //     }
  //   },
  //   {
  //     deep: true,
  //   }
  // );

  return {
    localeStore,
    dataStore,
    battleStore,
    soundStore,
    notification,
    tooltip,
    modal,
    debugMessages,
    HTMLSnapshots,
    startApp,
    fetchFriendsList,
    getOnlineFriends,
    fetchRelaxPageData,
    fetchWaitingData,
    fetchProfilePageData,
    fetchChallengePageData,
    fetchTasksList,
    fetchBattleCompleteData,
    fetchBattleResultsData,
    sendInviteAnalitycsData,
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
    showModal,
    takeHTMLSnapshot,
    sendScreeshots,
  };
});
