import { ref } from "vue";

export const useTimer = (initialTime: number) => {
  const timer = ref(initialTime);

  let interval: ReturnType<typeof setInterval> | null = null;

  interval = setInterval(() => {
    if (timer.value <= 0) {
      stop();
    }
    timer.value -= 1000;
  }, 1000);

  const stop = () => {
    if (interval) {
      clearTimeout(interval);
    }
  };

  return {
    timer,
    stop,
  };
};
