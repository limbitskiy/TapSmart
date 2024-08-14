import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useDataStore } from "@/store/data.ts";
import { makeRequest } from "@/api/server";

export const useUserStore = defineStore("user", () => {
  const state = ref({
    toast: {
      message: null,
      isShown: false,
    },
    service: {},
    entryPoint: null,
    apiUrl: null,
  });

  const router = useRouter();
  const route = useRoute();
  const dataStore = useDataStore();
  const { setData } = dataStore;

  const toast = computed(() => state.value.toast);

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

  const initialFetch = async (data) => {
    return await useFetch({ data });
  };

  const fetchFriendsPage = async () => {
    return await useFetch({ key: "friend_table_list" });
  };

  const setLanguages = async (data) => {
    return await useFetch({ key: "profile_set", data });
  };

  const useFetch = async ({ key, data }) => {
    const result = await makeRequest({ key, data, service: state.value.service, apiUrl: state.value.apiUrl });
    setStore(result.data);

    if (state.value.entryPoint && route.path !== "/init") {
      router.push(state.value.entryPoint);
    }
  };

  return { toast, startApp, showToast, fetchFriendsPage, setLanguages, initialFetch };
});
