import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { useDataStore } from "@/store/data.ts";

export const useUserStore = defineStore("user", () => {
  const state = ref({
    toast: {
      message: null,
      isShown: false,
    },
    service: {},
    entryPoint: null,
    apiUrl: {},
  });

  const router = useRouter();
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

  return { toast, setStore, startApp, showToast };
});
