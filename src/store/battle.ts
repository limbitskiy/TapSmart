import { computed, ref, watch, Ref } from "vue";
import { defineStore } from "pinia";
import { useBattleProcessor } from "@/composables/useBattleProcessor";
import BreakpointInterval from "@/class/Interval";

// lodash
import { merge } from "lodash-es";

// stores
import { useDataStore } from "@/store/data";
import { useMainStore } from "@/store/main";

// composables
import { waitFor } from "@/utils";

// types
import { BattleType, BattleState, AnswerProps, Task } from "@/types";

export const useBattleStore = defineStore("battle", () => {
  const dataStore = useDataStore();
  const mainStore = useMainStore();

  const battleTypes: { [key: number]: BattleType } = {
    1: "yesno",
    2: "4answers",
    3: "bubble_pairs",
    4: "audio_question",
    5: "match_pairs",
    6: "work_on_mistakes",
    7: "picture_question",
    // level detection
  };

  // callbacks
  const breakpointCb = () => {
    const score = Math.round(challengeScore.value) || undefined;
    mainStore.useFetch({
      key: "battle_breakpoint",
      data: { score },
    });
    return;
  };

  const challengeCb = () => {
    mainStore.useFetch({ key: "challenge_breakpoint" });
    return;
  };

  const waitingCb = () => {
    mainStore.useFetch({ key: "waiting_breakpoint" });
    return;
  };

  // settings
  const settings = ref({
    energyOnCorrect: 1,
    energyOnWrong: -3,
  });

  const correctStreak = ref(0);

  const challengeScore = ref(0);
  const boostersUsed = ref({});
  const afkCounter = ref(0);

  const backendModalOpen = ref(false);
  const relaxPaused = ref(false);

  // challenge vars
  let battleStartTime: number | null = null;

  let currentBreakpointInterval = {
    fn: <BreakpointInterval | null>null,
    type: <string | null>null,
  };

  const state = ref({
    battleData: <BattleState>{},
  });

  // getters
  const data = computed(() => state.value.battleData);

  // returns 'relax' || 'challenge'
  const currentBattleMode = computed(() => state.value.battleData.battle_mode);

  // returns 1, 2, 3 etc
  const currentBattleType = computed(() => state.value.battleData.battle_type);

  // returns "yesno" || "4answers" etc.
  const сurrentMechanicName = computed(() => battleTypes[currentBattleType.value]);

  // returns actual mechanic object
  const сurrentMechanic = computed(() => state.value.battleData.mechanics?.[сurrentMechanicName.value]);

  // battle processor
  const { storeAnswer, getNextTask, cleanAnswers, setTasks, expandTasks, reset: resetBattleProcessor, answers } = useBattleProcessor();

  // setter/getter
  const set = (data: BattleState) => {
    let onCompleteHook: () => void = () => {};

    for (const key in data) {
      const typedKey = key as keyof BattleState;

      if (typedKey === "cleanAnswers" && data.cleanAnswers) {
        cleanAnswers();
        continue;
      }

      // restart working breakpoint if new breakpoint time recieved
      if (typedKey === "breakpoint" || typedKey === "challenge_breakpoint" || typedKey === "waiting_breakpoint") {
        if (currentBreakpointInterval.fn && data[typedKey] !== state.value.battleData[typedKey]) {
          if (typedKey === "breakpoint") {
            onCompleteHook = () => {
              startBreakpoint("battle");
            };
          } else if (typedKey === "challenge_breakpoint") {
            onCompleteHook = () => {
              startBreakpoint("challenge");
            };
          } else if (typedKey === "waiting_breakpoint") {
            onCompleteHook = () => {
              startBreakpoint("waiting");
            };
          }
        }
      }

      // set tasks
      if (typedKey === "data" && data[typedKey]) {
        setTasks(data[typedKey]);
        continue;
      }

      // // if no such typedKey - create an empty object
      // if (!state.value.battleData[typedKey]) {
      //   state.value.battleData[typedKey] = null;
      // }

      // copy data to the typedKey
      state.value.battleData[typedKey] = JSON.parse(JSON.stringify(data[typedKey]));
    }

    if (onCompleteHook) {
      onCompleteHook();
      onCompleteHook = () => {};
    }
  };

  const expand = (data) => {
    // console.log(`expand`);
    for (const key in data) {
      const typedKey = key as keyof BattleState;

      // expand tasks
      if (typedKey === "data") {
        expandTasks(data[typedKey]);
        continue;
      } else {
        // expand other keys
        if (state.value.battleData[typedKey] && Object.keys(state.value.battleData[typedKey]).length) {
          merge(state.value.battleData[typedKey], data[typedKey]);
        } else {
          console.error(`expand: Error - property not of type: array or object`);
        }
      }
    }
    // console.log("expanded battle store:", state.value.battleData);
  };

  // breakpoints
  const startBreakpoint = (type: string) => {
    // console.log(`starting breakpoint`);

    stopBreakpoint();

    let interval;
    let callback;

    switch (type) {
      case "battle": {
        interval = state.value.battleData.breakpoint;
        callback = breakpointCb;
        break;
      }
      case "challenge": {
        interval = state.value.battleData.challenge_breakpoint;
        callback = challengeCb;
        break;
      }
      case "waiting": {
        interval = state.value.battleData.waiting_breakpoint;
        callback = waitingCb;
        break;
      }
      default: {
        console.error(`Unknown type of battle breakpoint: ${type}`);
      }
    }

    if (!interval || !callback || !type) return;

    if (interval < 1000) {
      console.error(`Interval is too small: ${interval}`);
      interval = 1000;
    }

    console.log(`Starting breakpoint: ${type}`);

    const breakpointInterval = new BreakpointInterval(interval, callback);

    currentBreakpointInterval.fn = breakpointInterval;
    currentBreakpointInterval.type = type;
    breakpointInterval.start();
  };

  const stopBreakpoint = () => {
    if (currentBreakpointInterval.fn) {
      // console.log(`Stopping breakpoint`);
      currentBreakpointInterval.fn.stop();
      currentBreakpointInterval.fn = null;
      currentBreakpointInterval.type = null;
    }
  };

  // latest
  const handleAnswer = async ({ isCorrect, answerString, task, autoAnswer = false }: AnswerProps) => {
    // console.group();
    // console.log("is correct: ", isCorrect);
    // console.log("answer string:", answerString);
    // console.log(task);
    // console.log("auto answer: ", autoAnswer);
    // console.groupEnd();

    let msec;
    let returnData;

    switch (currentBattleMode.value) {
      case "challenge": {
        msec = Date.now() - (battleStartTime ?? 0);

        if (isCorrect) {
          challengeScore.value += calculateCalcPoint();
          correctStreak.value += 1;
        } else {
          if (data.value?.battle_extra_mistake && !boostersUsed.value["extra_mistake"]) {
            boostersUsed.value["extra_mistake"] = true;
          } else {
            correctStreak.value = 0;
          }
        }
        break;
      }

      case "relax": {
        // if (task.settings?.isAds) {
        //   returnData = await mainStore.useFetch({ key: task.api });
        // } else {
        if (isCorrect) {
          dataStore.addBolts(calculateRelaxMultiplierAmount());
          addEnergy(settings.value.energyOnCorrect);
          correctStreak.value += 1;
          afkCounter.value = 0;
        } else {
          if (autoAnswer) {
            afkCounter.value += 1;
          } else {
            addEnergy(settings.value.energyOnWrong);
            afkCounter.value = 0;
          }

          correctStreak.value = 0;
        }
        // }
        break;
      }
    }

    // general case
    if (isCorrect) {
      mainStore.vibrate("correct");
    } else {
      mainStore.vibrate("wrong");
    }

    storeAnswer({ task, answerString, msec });

    return returnData;
  };

  const changeMechanic = async (mechId: number) => {
    await mainStore.useFetch({
      key: "battle_init",
      data: { battle_type: mechId },
    });
    return;
  };

  const setBackendModal = (value: "open" | "closed") => {
    if (value === "open") {
      backendModalOpen.value = true;
      stopBreakpoint();
    } else if (value === "closed") {
      backendModalOpen.value = false;
      startBreakpoint("battle");
    }
  };

  const addEnergy = (value: number) => {
    state.value.battleData.energy += value;

    if (state.value.battleData.energy < 0) {
      state.value.battleData.energy = 0;
    }
  };

  const calculateRelaxMultiplierAmount = () => {
    const multiplicator = state.value.battleData.multiplicator;
    const calcPoints = [...state.value.battleData.calc_points];
    const idx = correctStreak.value;

    if (multiplicator && calcPoints?.length && idx >= 0) {
      if (!calcPoints[idx]) {
        return multiplicator * calcPoints[calcPoints.length - 1];
      }

      return multiplicator * calcPoints[idx];
    }
    return 0;
  };

  const resetBattleStats = () => {
    correctStreak.value = 0;
    challengeScore.value = 0;
    boostersUsed.value = {};
    afkCounter.value = 0;
  };

  const pauseBattle = () => {
    // console.log(`Battle paused`);
    currentBreakpointInterval.fn?.stop();

    if (data.value.battle_mode === "relax") {
      relaxPaused.value = true;
    }
  };

  const resumeBattle = () => {
    // console.log(`Battle resumed`);
    const type = currentBreakpointInterval.type || "";

    if (type) {
      startBreakpoint(type);
    }

    if (data.value.battle_mode === "relax") {
      relaxPaused.value = false;
    }
  };

  const startChallenge = () => {
    battleStartTime = Date.now();
    startBreakpoint("battle");
  };

  const stopChallenge = async () => {
    battleStartTime = null;
    stopBreakpoint();

    await mainStore.useFetch({ key: "battle_breakpoint", data: { final: 1 } });
  };

  const calculateCalcPoint = () => data.value.calc_points?.[correctStreak.value] ?? data.value.calc_points?.[data.value.calc_points.length - 1] ?? 1;

  const changeWaitingTimer = (amount: number) => {
    state.value.battleData.waiting_timer! += amount;
  };

  const getMechanicName = (mechId: number): string => battleTypes[mechId];

  window.piniaStore = data;

  return {
    data,
    answers,
    challengeScore,
    boostersUsed,
    currentBattleMode,
    currentBattleType,
    сurrentMechanicName,
    сurrentMechanic,
    afkCounter,
    correctStreak,
    settings,
    backendModalOpen,
    relaxPaused,
    set,
    expand,
    pauseBattle,
    resumeBattle,
    handleAnswer,
    changeMechanic,
    getMechanicName,
    startBreakpoint,
    stopBreakpoint,
    resetBattleStats,
    resetBattleProcessor,
    startChallenge,
    stopChallenge,
    setBackendModal,
    calculateCalcPoint,
    calculateRelaxMultiplierAmount,
    getNextTask,
    addEnergy,
    changeWaitingTimer,
  };
});
