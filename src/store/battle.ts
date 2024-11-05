import { computed, ref, watch, Ref } from "vue";
import { defineStore } from "pinia";
import { useBattleProcessor } from "@/composables/useBattleProcessor";

// common
import { Interval as BreakpointInterval, Timer as TaskTimer } from "@/common/interval";

// stores
import { useDataStore } from "@/store/data";
import { useMainStore } from "@/store/main";

// composables
import { waitFor } from "@/utils";

// types
import { BattleTypes, BattleState, AnswerProps } from "@/types";
import { useFetch } from "@vueuse/core";

export const useBattleStore = defineStore("battle", () => {
  const dataStore = useDataStore();
  const mainStore = useMainStore();

  const battleTypes: BattleTypes = {
    1: "yesno",
    2: "4answers",
    3: "bubble_pairs",
    4: "audio_question",
    5: "match_pairs",
    6: "work_on_mistakes",
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
  const settings = {
    energyOnCorrect: 1,
    energyOnWrong: -3,
  };

  const lastTaskId = ref<number | null>(null);
  const correctStreak = ref(0);

  const challengeScore = ref(0);
  const boostersUsed = ref({});
  const afkCounter = ref(0);

  const battleStarted = ref(false);
  const pauseCurrentTask = ref(false);

  // challenge vars
  let battleStartTime: number | null = null;

  let currentBreakpointInterval = {
    fn: <BreakpointInterval | null>null,
    type: <string | null>null,
  };
  const currentTaskTimeout: Ref<TaskTimer | null> = ref(null);

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

  // battle processor
  const { resetTaskIndex, incrementTaskIndex, storeAnswer, answers, _currentTask } = useBattleProcessor(state.value.battleData);

  // returns { api, correct, id, key, task: {} }
  const currentTask = computed(() => battleStarted.value && !pauseCurrentTask.value && _currentTask.value);

  // returns { bolts_bonus, disabled, id, order, timeout }
  const currentMechanic = computed(() => state.value.battleData.mechanics?.[getMechanicName(state.value.battleData.battle_type)]);

  // setter/getter
  const set = (data: BattleState) => {
    let onCompleteHook: () => void = () => {};

    Object.keys(data).forEach((key) => {
      if (key === "cleanAnswers" && data.cleanAnswers) {
        lastTaskId.value = null;
        answers.value = [];
      }

      // restart working breakpoint if new breakpoint time recieved
      if (key === "breakpoint" || key === "challenge_breakpoint" || key === "waiting_breakpoint") {
        if (currentBreakpointInterval.fn && data[key] !== state.value.battleData[key]) {
          if (key === "breakpoint") {
            onCompleteHook = () => {
              startBreakpoint("battle");
            };
          } else if (key === "challenge_breakpoint") {
            onCompleteHook = () => {
              startBreakpoint("challenge");
            };
          } else if (key === "waiting_breakpoint") {
            onCompleteHook = () => {
              startBreakpoint("waiting");
            };
          }
        }
      }

      // if no such key - create an empty object
      if (!state.value.battleData[key]) {
        state.value.battleData[key] = null;
      }

      // copy data to the key
      state.value.battleData[key] = JSON.parse(JSON.stringify(data[key]));
    });

    // reset task index
    if (data.data?.length) {
      console.log(`new data: resetting task index`);
      resetTaskIndex();
    }

    if (onCompleteHook) {
      onCompleteHook();
      onCompleteHook = () => {};
    }
  };

  const expand = (data) => {
    // console.log(`expand`);
    Object.keys(data).forEach((key) => {
      if (state.value.battleData[key] && Array.isArray(state.value.battleData[key])) {
        data[key].forEach((item) => {
          const foundIdx = state.value.battleData[key].findIndex((storeItem) => storeItem.id === item.id);

          if (foundIdx != -1) {
            state.value.battleData[key].splice(foundIdx, 1, item);
          } else {
            console.warn(`expand: Warning - property does not exist, creating a new one`);
            state.value.battleData[key].push(item);
          }
        });
      } else {
        console.error(`expand: Error - property not of type: array`);
      }
    });
    // console.log("expanded battle store:", state.value.battleData);
  };

  // breakpoints/timers
  const startTaskTimeout = (externalTimeout?: number) => {
    if (!currentMechanic.value?.timeout || currentTaskTimeout.value || !data?.value?.energy || afkCounter.value >= 3) return;
    // console.log(`starting task timeout`);

    const callback = () => {
      stopTaskTimeout();
      handleAnswer({
        autoAnswer: true,
      });
    };

    const taskTimeout = new TaskTimer(externalTimeout ?? currentMechanic.value?.timeout, callback);
    currentTaskTimeout.value = taskTimeout;
    currentTaskTimeout.value.start();
  };

  const stopTaskTimeout = () => {
    if (currentTaskTimeout.value) {
      // console.log(`stopping task timeout`);
      currentTaskTimeout.value.stop();
      currentTaskTimeout.value = null;
    }
  };

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

    // console.log(`Starting breakpoint: ${type}`);

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

  // answer handlers
  const handleAnswer = async ({ isCorrect, answerString, autoAnswer = false, nextTaskDelay = 0, task }: AnswerProps) => {
    if (currentBattleMode.value === "relax" && data.value.energy === 0) return;

    if (!currentTask.value) {
      console.error(`Could not find current item: handleAnswer`);
      return;
    }

    if (autoAnswer) {
      isCorrect = false;
      answerString = "";
      afkCounter.value += 1;
    }

    // make a task copy because computed will show false when pauseCurrentTask is true
    // maybe needs refactoring
    const thisTask = currentTask.value;

    stopTaskTimeout();

    // set lastTaskId
    lastTaskId.value = currentTask.value!.id;

    // for screenshot (otherwize we don't see the question)
    await waitFor(100);

    pauseCurrentTask.value = true;

    let returnData;

    // in a relax battle
    if (currentBattleMode.value === "relax" && !thisTask.settings?.isAds) {
      // store answer
      storeAnswer(answerString);

      if (thisTask.api) {
        mainStore.useFetch({ key: thisTask.api });
      }

      // process correct/wrong anwser
      if (isCorrect) {
        afkCounter.value = 0;
        mainStore.onVibrate("correct");
        const multiplier = calculateRelaxMultiplierAmount();
        correctStreak.value += 1;
        dataStore.addBolts(multiplier);
        addEnergy(settings.energyOnCorrect);
      } else {
        if (!autoAnswer) {
          addEnergy(settings.energyOnWrong);
        }
        mainStore.onVibrate("wrong");
        correctStreak.value = 0;
      }

      // in a challenge battle
    } else if (currentBattleMode.value === "challenge" && !thisTask.settings?.isAds) {
      let msec;

      if (battleStartTime) {
        msec = Date.now() - +battleStartTime;
      }

      storeAnswer(answerString, msec);

      if (isCorrect) {
        challengeScore.value += calculateCalcPoint();
        correctStreak.value += 1;
        mainStore.onVibrate("correct");
      } else {
        if (data.value?.battle_extra_mistake && !boostersUsed.value["extra_mistake"]) {
          boostersUsed.value["extra_mistake"] = true;
        } else {
          correctStreak.value = 0;
        }
        mainStore.onVibrate("wrong");
      }
    } else if (thisTask.settings?.isAds) {
      mainStore.bgColor = "linear-gradient(180deg, #000B14 17.5%, #035DA9 100%)";
      storeAnswer(answerString);
      afkCounter.value = 0;
      returnData = await mainStore.useFetch({ key: thisTask.api });
    }

    if (nextTaskDelay) {
      await waitFor(nextTaskDelay);
    }

    incrementTaskIndex();

    pauseCurrentTask.value = false;

    if (state.value.battleData.questions_left && state.value.battleData.questions_left > 0) {
      state.value.battleData.questions_left -= 1;
    }

    let externalTimeout;

    if (currentTask.value?.settings?.wait) {
      if (currentTask.value.settings.style?.background) {
        mainStore.bgColor = currentTask.value.settings.style.background;
      }
      externalTimeout = currentTask.value?.settings?.timeout;
      console.log(`starting external timeout: ${currentTask.value?.settings?.timeout}`);
    }

    startTaskTimeout(externalTimeout);

    return returnData;
  };

  // mechanic
  const changeMechanic = async (mechId: number) => {
    await mainStore.useFetch({
      key: "battle_init",
      data: { battle_type: mechId },
    });

    // start things after new response data recieved
    stopTaskTimeout();
    startTaskTimeout();
    return;
  };

  const getMechanicName = (mechId: number): string => battleTypes[mechId];

  // misc
  const setRelaxModal = (value: "open" | "closed") => {
    if (value === "open") {
      stopTaskTimeout();
      stopBreakpoint();
      battleStarted.value = false;
    } else if (value === "closed") {
      afkCounter.value = 0;
      startTaskTimeout();
      startBreakpoint("battle");
      battleStarted.value = true;
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

  const decreaseWaitingTimer = () => {
    // if (state.value.battleData.waiting_timer > 0) {
    state.value.battleData.waiting_timer -= 1000;
    // }
  };

  const resetBattleStats = () => {
    resetTaskIndex();
    lastTaskId.value = null;
    correctStreak.value = 0;
    challengeScore.value = 0;
    boostersUsed.value = {};
    afkCounter.value = 0;
  };

  const pauseBattle = () => {
    // console.log(`Battle paused`);
    currentBreakpointInterval.fn?.stop();

    if (data.value.battle_mode === "relax") {
      stopTaskTimeout();
    }
  };

  const resumeBattle = () => {
    // console.log(`Battle resumed`);
    const type = currentBreakpointInterval.type || "";

    if (type) {
      startBreakpoint(type);
    }

    if (data.value.battle_mode === "relax") {
      startTaskTimeout();
    }
  };

  const startChallenge = () => {
    console.log(`starting challenge: stats reset`);

    resetBattleStats();
    battleStarted.value = true;
    battleStartTime = Date.now();
    startBreakpoint("battle");
  };

  const stopChallenge = async () => {
    if (!battleStarted.value) return;

    console.log(`stopping challenge`);

    battleStarted.value = false;
    battleStartTime = null;
    stopBreakpoint();

    await mainStore.useFetch({ key: "battle_breakpoint", data: { final: 1 } });
  };

  const startRelax = () => {
    console.log(`starting relax: battle stats reset`);

    battleStarted.value = true;
    resetBattleStats();
    startBreakpoint("battle");
    startTaskTimeout();
  };

  const stopRelax = () => {
    console.log(`stopping relax`);
    battleStarted.value = false;
    stopBreakpoint();
    stopTaskTimeout();
  };

  const calculateCalcPoint = () => data.value.calc_points?.[correctStreak.value] ?? data.value.calc_points?.[data.value.calc_points.length - 1] ?? 1;

  return {
    data,
    currentTask,
    lastTaskId,
    answers,
    challengeScore,
    boostersUsed,
    currentTaskTimeout,
    currentBattleMode,
    currentBattleType,
    afkCounter,
    сurrentMechanicName,
    battleStarted,
    set,
    expand,
    pauseBattle,
    resumeBattle,
    handleAnswer,
    changeMechanic,
    getMechanicName,
    startTaskTimeout,
    stopTaskTimeout,
    startBreakpoint,
    stopBreakpoint,
    decreaseWaitingTimer,
    resetBattleStats,
    startChallenge,
    stopChallenge,
    startRelax,
    stopRelax,
    setRelaxModal,
    calculateCalcPoint,
  };
});
