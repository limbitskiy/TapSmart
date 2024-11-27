import { ref } from "vue";
import { storeToRefs } from "pinia";

// stores
import { useMainStore } from "@/store/main";

export const useTaskTimeout = () => {
  const store = useMainStore();
  const { сurrentMechanic } = storeToRefs(store.battleStore);

  let taskTimeoutStatus = ref({
    timeout: null,
    status: "stopped",
  });
  let _timeout: null | ReturnType<typeof setTimeout> = null;
  let lastTimeout = 0;
  let pausedTimeout = 0;

  // start
  const startTaskTimeout = (_customTimeout?: number) => {
    // console.log(`started timeout`);
    const time = _customTimeout ?? сurrentMechanic.value?.timeout;
    lastTimeout = time;

    if (!time) {
      console.error(`timeout period not defined`);
    }

    stopTaskTimeout();

    _timeout = setTimeout(() => {
      stopWithStatus("stopped");
    }, time);

    taskTimeoutStatus.value.timeout = time;
    taskTimeoutStatus.value.status = "running";
  };

  // stop
  const stopTaskTimeout = () => {
    // console.log(`stopped timeout`);
    clearTimeout(_timeout);
    stopWithStatus("stopped");
  };

  // pause
  const pauseTaskTimeout = () => {
    // console.log(`paused timeout`);

    clearTimeout(_timeout);
    pausedTimeout = lastTimeout;
    stopWithStatus("paused");
  };

  // resume
  const resumeTaskTimeout = () => {
    // console.log(`resumed timeout`);
    _timeout = setTimeout(() => {
      stopWithStatus("stopped");
    }, pausedTimeout);

    taskTimeoutStatus.value.timeout = pausedTimeout;
    taskTimeoutStatus.value.status = "running";

    pausedTimeout = 0;
  };

  const stopWithStatus = (status: string) => {
    taskTimeoutStatus.value.timeout = null;
    taskTimeoutStatus.value.status = status;
    _timeout = null;
  };

  return {
    taskTimeoutStatus,
    startTaskTimeout,
    stopTaskTimeout,
    pauseTaskTimeout,
    resumeTaskTimeout,
  };
};
