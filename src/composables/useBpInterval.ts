import { computed, ref, shallowRef, watch } from "vue";

export const useBpInterval = (cb) => {
  let period = shallowRef(null);
  const started = shallowRef(false);
  let interval = null;

  const start = () => {
    // console.log(`starting interval`);

    clear();

    started.value = true;

    if (!period.value) return;

    interval = setInterval(() => {
      cb();
    }, period.value);
  };

  const clear = () => {
    if (interval) {
      // console.log(`clearing interval`);
      clearInterval(interval);
      interval = null;
    }
  };

  const stop = () => {
    clear();
    started.value = false;
  };

  const setTime = (value) => {
    period.value = value;
  };

  const time = computed(() => period.value);

  return { start, stop, setTime, time };
};
