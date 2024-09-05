import { ref, shallowRef, watch } from "vue";

export const useTaskTimeout = (cb: () => void) => {
  let timeout: number | null = null;
  let started = false;
  let timer: ReturnType<typeof setTimeout> | null = null;
  let lastCb = false;

  const start = () => {
    // console.log(`starting timeout`);

    if (!timeout) return;

    clear();

    started = true;

    timer = setTimeout(() => {
      clear();
      cb();
      lastCb = false;
    }, timeout);
  };

  const clear = () => {
    if (timer) {
      // console.log(`clearing timeout`);
      clearTimeout(timer);
      timer = null;
    }
  };

  const reset = () => {
    if (!timeout) return;

    clear();

    timer = setTimeout(() => {
      if (started) {
        clear();
        cb();
        lastCb = false;
      } else if (!started && !lastCb) {
        clear();
        cb();
        lastCb = true;
      } else {
        clear();
      }
    }, timeout);
  };

  const stop = () => {
    started = false;
  };

  const fullStop = () => {
    clear();
    started = false;
  };

  const setTime = (value: number) => {
    timeout = value;
  };

  return { start, stop, setTime, reset, fullStop };
};

// export const useTaskTimeout = (cb: () => void) => {
//   let timeout: number | null = null;
//   let timer: ReturnType<typeof setTimeout> | null = null;
//   let started = false;

//   const clear = () => {
//     if (timer !== null) {
//       clearTimeout(timer);
//       timer = null;
//     }
//   };

//   const start = () => {
//     if (timeout === null || started) return;

//     started = true;
//     timer = setTimeout(() => {
//       cb();
//       clear();
//     }, timeout);
//   };

//   const reset = () => {
//     if (timeout === null) return;

//     clear();
//     timer = setTimeout(() => {
//       if (started) {
//         cb();
//       }
//       clear();
//     }, timeout);
//   };

//   const stop = () => {
//     started = false;
//     clear();
//   };

//   const setTime = (value: number) => {
//     timeout = value;
//   };

//   return { start, stop, setTime, reset };
// };
