import { computed, ref, watch, Ref } from "vue";
import { defineStore } from "pinia";

// common
import { Interval as BreakpointInterval, Timer as TaskTimer } from "@/common/interval";

// stores
import { useDataStore } from "@/store/data";
import { useMainStore } from "@/store/main";

// types
import { BattleTypes, BattleState, AnswerProps, Answer } from "@/types";
import { waitFor } from "@/utils";

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

  const taskIndex = ref<number | null>(null);
  const lastTaskId = ref<number | null>(null);
  const correctStreak = ref(0);
  const answers = ref<Answer[]>([]);
  const challengeScore = ref(0);
  const boostersUsed = ref({});
  const afkCounter = ref(0);

  const battleStarted = ref(false);
  const pauseCurrentTask = ref(false);

  // challenge vars
  let battleStartTime = null;
  const challengeTimer = ref(0);
  let challengeTimerInterval = null;

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

  // returns { api, correct, id, key, task: {} }
  const currentTask = computed(() => battleStarted.value && !pauseCurrentTask.value && state.value.battleData.data?.find((task) => task.id === taskIndex.value));

  // returns { bolts_bonus, disabled, id, order, timeout }
  const currentMechanic = computed(() => state.value.battleData.mechanics?.[getMechanicName(state.value.battleData.battle_type)]);

  const energy = computed(() => state.value.battleData.energy);
  const playerProgress = computed(() => state.value.battleData.player_progress);

  // setter/getter
  const set = (data) => {
    let onCompleteHook: () => void = () => {};

    Object.keys(data).forEach((key) => {
      if (key === "cleanAnswers" && data["cleanAnswers"]) {
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
      state.value.battleData[key] = data[key];
    });

    // reset task index
    if (state.value.battleData?.data?.length) {
      resetTaskIndex();
    }

    if (onCompleteHook) {
      onCompleteHook();
      onCompleteHook = () => {};
    }

    // console.log("set battle store:", state.value.battleData);
  };

  const expand = (data) => {
    // console.log(`expand`);
    Object.keys(data).forEach((key) => {
      if (state.value.battleData[key] && Array.isArray(state.value.battleData[key])) {
        data[key].forEach((item) => {
          const foundIdx = state.value.battleData[key].findIndex((storeItem) => storeItem.id === item.id);

          if (foundIdx != -1) {
            state.value.battleData[key].splice(foundIdx, 1);
          }

          state.value.battleData[key].push(item);
        });
      } else {
        console.error(`Error trying to expand battle store`);
      }
    });
    // console.log("expanded battle store:", state.value.battleData);
  };

  // breakpoints/timers
  const startTaskTimeout = () => {
    if (!currentMechanic.value?.timeout || currentTaskTimeout.value || !energy.value || afkCounter.value >= 3) return;

    const callback = () => {
      stopTaskTimeout();
      handleBattleAnswer({
        isCorrect: false,
        answerString: "",
        subtractEnergyAmount: 0,
      });
      afkCounter.value += 1;
    };

    const taskTimeout = new TaskTimer(currentMechanic.value?.timeout, callback);
    currentTaskTimeout.value = taskTimeout;
    currentTaskTimeout.value.start();
  };

  const stopTaskTimeout = () => {
    if (currentTaskTimeout.value) {
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

  const storeAnswer = (answerString: string, msec?: number) => {
    const task = state.value.battleData.data?.find((task) => task.id === taskIndex.value);

    const foundIdx = answers.value.findIndex((answer) => answer.id === task!.id);

    if (foundIdx !== -1) {
      answers.value[foundIdx] = {
        id: task.id,
        key: task.key,
        answer: answerString,
        msec,
      };
    } else {
      answers.value.push({
        id: task.id,
        key: task.key,
        answer: answerString,
        msec,
      });
    }
  };

  // answer handlers
  const handleBattleAnswer = async ({ isCorrect, answerString, subtractEnergyAmount = 3, nextTaskDelay = 0 }: AnswerProps) => {
    if (currentBattleMode.value === "relax" && data.value.energy === 0) return;

    if (!currentTask.value) {
      console.error(`Could not find current item`);
      return;
    }

    stopTaskTimeout();

    // set lastTaskId
    lastTaskId.value = currentTask.value!.id;

    // call api if needed
    if (currentTask.value.api) {
      mainStore.useFetch({ key: currentTask.value.api });
    }

    pauseCurrentTask.value = true;

    // in a relax battle
    if (currentBattleMode.value === "relax") {
      // store answer
      storeAnswer(answerString);

      // process correct/wrong anwser
      if (isCorrect) {
        afkCounter.value = 0;
        mainStore.onVibrate("correct");
        const multiplier = calculateRelaxMultiplierAmount();
        correctStreak.value += 1;
        dataStore.addBolts(multiplier);
        addEnergy(1);
      } else {
        if (subtractEnergyAmount) {
          addEnergy(-subtractEnergyAmount);
        }
        mainStore.onVibrate("wrong");
        correctStreak.value = 0;
      }

      // in a challenge battle
    } else if (currentBattleMode.value === "challenge") {
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
        if (data.value.battle_extra_mistake && !boostersUsed.value["extra_mistake"]) {
          boostersUsed.value["extra_mistake"] = true;
        } else {
          correctStreak.value = 0;
        }
        mainStore.onVibrate("wrong");
      }
    }

    if (nextTaskDelay) {
      await waitFor(nextTaskDelay);
    }

    incrementTaskIndex();

    pauseCurrentTask.value = false;

    if (state.value.battleData.questions_left > 0) {
      state.value.battleData.questions_left -= 1;
    }

    startTaskTimeout();
  };

  // task index helpers
  const resetTaskIndex = () => {
    const clone = JSON.parse(JSON.stringify(data.value.data));

    clone.sort((a, b) => a.id - b.id);
    taskIndex.value = clone[0].id;
  };

  const incrementTaskIndex = () => {
    const clone = JSON.parse(JSON.stringify(data.value.data));
    clone.sort((a, b) => a.id - b.id);

    const idx = clone.findIndex((task) => task.id === taskIndex.value);

    const newIdx = idx + 1;

    if (clone[newIdx]) {
      taskIndex.value = clone[newIdx].id;
    } else {
      resetTaskIndex();
    }
  };

  // mechanic
  const changeMechanic = async (mechId: number) => {
    return await mainStore.useFetch({
      key: "battle_init",
      data: { battle_type: mechId },
    });
  };

  const getMechanicName = (mechId: number): string => battleTypes[mechId];

  // misc
  const setRelaxModal = (value: "open" | "closed") => {
    if (value === "open") {
      stopTaskTimeout();
      stopBreakpoint();
    } else if (value === "closed") {
      afkCounter.value = 0;
      startTaskTimeout();
      startBreakpoint("battle");
    }
  };

  const resetBattleStats = () => {
    resetTaskIndex();
    lastTaskId.value = null;
    correctStreak.value = 0;
    // answers.value = [];
    challengeScore.value = 0;
    boostersUsed.value = {};
    afkCounter.value = 0;
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
    console.log(`starting challenge`);

    battleStarted.value = true;
    resetBattleStats();
    battleStartTime = Date.now();
    startBreakpoint("battle");
    challengeTimer.value = data.value?.battle_duration;

    challengeTimerInterval = setInterval(() => {
      if (challengeTimer.value === 0) {
        clearInterval(challengeTimerInterval);
        challengeTimer.value = 0;
        stopChallenge();
        return;
      }
      challengeTimer.value -= 1000;
    }, 1000);
  };

  const stopChallenge = async () => {
    if (!battleStarted.value) return;

    console.log(`stopping challenge`);

    battleStarted.value = false;
    resetBattleStats();
    battleStartTime = null;
    stopBreakpoint();

    await mainStore.useFetch({ key: "battle_breakpoint", data: { final: 1 } });
    mainStore.redirectTo("/battle-complete");
  };

  const startRelax = () => {
    console.log(`starting relax`);
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
    energy,
    currentTaskTimeout,
    currentBattleMode,
    currentBattleType,
    afkCounter,
    сurrentMechanicName,
    playerProgress,
    challengeTimer,
    battleStarted,
    set,
    expand,
    pauseBattle,
    resumeBattle,
    handleBattleAnswer,
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
