import { ref, shallowRef, watch } from "vue";

export const useTaskTimeout = (currentMechanic, cb) => {
  let timeout = null;
  const started = shallowRef(false);
  let timer = null;

  const start = () => {
    // console.log(`starting timeout`);

    clear();

    started.value = true;

    if (!timeout) return;

    timer = setTimeout(() => {
      started.value = false;
      timer = null;

      cb();
      start();
    }, timeout);
  };

  const clear = () => {
    if (timer) {
      // console.log(`clearing timeout`);
      clearTimeout(timer);
      timer = null;
    }
  };

  const stop = () => {
    clear();
    started.value = false;
  };

  const setTime = (value) => {
    timeout = value;
  };

  return { start, stop, setTime };
};
