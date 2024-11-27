import { Ref, watch } from "vue";

// stores
import { useMainStore } from "@/store/main";

// types
import { Task } from "@/types";

export const useActions = (emit) => {
  const store = useMainStore();
  const { useFetch } = store;

  const parseAction = (action: string) => {
    if (action === "start-challenge") {
      emit("startChallenge");
    }
  };

  const useAction = async (task?: Task) => {
    if (!task) return;

    if (task.action?.api) {
      if (task.action.wait) {
        const res = await useFetch({ key: task.action.api, data: { lastTaskId: task.id }, handleResponse: false });
        parseAction(res.action);
      } else {
        useFetch({ key: task.action.api, data: { lastTaskId: task.id }, handleResponse: false });
      }
    }
  };

  return { useAction };
};
