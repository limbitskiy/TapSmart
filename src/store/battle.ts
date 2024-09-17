import { computed, ref, watch } from "vue";
import { defineStore } from "pinia";

// common
import { Interval as BreakpointInterval, Timer as TaskTimer } from "@/common/interval";

// stores
import { useDataStore } from "@/store/data";
import { useMainStore } from "@/store/main";

// types
import { BattleTypes, BattleState, AnswerProps, Answer } from "@/types";

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
    mainStore.callApi({ api: "battle_breakpoint", data: { score } });
    return;
  };

  const challengeCb = () => {
    mainStore.callApi({ api: "challenge_breakpoint" });
    return;
  };

  const waitingCb = () => {
    mainStore.callApi({ api: "waiting_breakpoint" });
    return;
  };

  const taskIndex = ref<number | null>(null);
  const lastTaskId = ref<number | null>(null);
  const correctStreak = ref(0);
  const answers = ref<Answer[]>([]);
  const challengeScore = ref(0);
  const bonusesUsed = ref({});

  let currentBreakpointInterval = {
    fn: <BreakpointInterval | null>null,
    type: <string | null>null,
  };
  let currentTaskTimeout: TaskTimer | null = null;
  let taskTimeoutCounter: number | null = null;

  const state = ref({
    battleData: <BattleState>{},
  });

  // getters
  const data = computed(() => state.value.battleData);
  const currentTask = computed(() => state.value.battleData.data?.[taskIndex.value]);
  const currentMechanic = computed(() => state.value.battleData.mechanics?.[getMechanicName(state.value.battleData.battle_type)]);
  const currentCalcPoint = computed(() => {
    const calcPoint = data.value.calc_points[correctStreak.value];

    return calcPoint ?? data.value.calc_points[data.value.calc_points.length - 1];
  });

  // setter/getter
  const set = (data) => {
    let onCompleteHook: () => void = () => {};

    Object.keys(data).forEach((key) => {
      if (key === "cleanAnswers" && data["cleanAnswers"]) {
        lastTaskId.value = null;
        answers.value = [];
      }

      if (key === "data") {
        resetTaskIndex();
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

      // set battle mode
      if (key === "battle_mode") {
        if (data["battle_mode"] === "relax") {
          mainStore.redirectTo(`/home/relax/${battleTypes[data["battle_type"]]}`);
        } else if (data["battle_mode"] === "challenge") {
          mainStore.redirectTo(`/challenge/${battleTypes[data["battle_type"]]}`);
        }
      }

      // if no such key - create an empty object
      if (!state.value.battleData[key]) {
        state.value.battleData[key] = null;
      }

      // copy data to the key
      state.value.battleData[key] = data[key];
    });

    if (state.value.battleData.data?.length) {
      state.value.battleData.data.sort((a, b) => a.id - b.id);
    }

    if (onCompleteHook) {
      onCompleteHook();
      onCompleteHook = () => {};
    }
    // console.log("set battle store:", state.value.battleData);
  };

  const expand = (data) => {
    // console.log(`expand`);

    const _currentId = currentTask.value.id;

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

    state.value.battleData.data.sort((a, b) => a.id - b.id);
    taskIndex.value = state.value.battleData.data.findIndex((task) => task.id === _currentId);

    // console.log("expanded battle store:", state.value.battleData);
  };

  // breakpoints/timers
  const startTaskTimeout = () => {
    if (!currentMechanic.value?.timeout || currentTaskTimeout || taskTimeoutCounter === 0) return;

    const callback = () => {
      stopTaskTimeout();
      handleRelaxAnswer({
        isCorrect: false,
        answerString: "",
        subtractEnergyAmount: 0,
      });
    };

    const taskTimeout = new TaskTimer(currentMechanic.value?.timeout, callback);
    currentTaskTimeout = taskTimeout;
    currentTaskTimeout.start();
  };

  const stopTaskTimeout = () => {
    if (currentTaskTimeout) {
      currentTaskTimeout.stop();
      currentTaskTimeout = null;

      if (taskTimeoutCounter) {
        taskTimeoutCounter -= 1;
      }
    }
  };

  const setTaskTimeoutCounter = (value: number | null) => {
    taskTimeoutCounter = value;
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

    if (!interval || !callback) return;

    if (interval < 1000) {
      console.error(`Interval is too small: ${interval}`);
    }

    console.log(`Starting breakpoint: ${type}`);

    const breakpointInterval = new BreakpointInterval(interval, callback);

    currentBreakpointInterval.fn = breakpointInterval;
    currentBreakpointInterval.type = type;
    breakpointInterval.start();
  };

  const stopBreakpoint = () => {
    if (currentBreakpointInterval.fn) {
      console.log(`Stopping breakpoint`);
      currentBreakpointInterval.fn.stop();
      currentBreakpointInterval.fn = null;
      currentBreakpointInterval.type = null;
    }
  };

  // answer handlers
  const handleRelaxAnswer = ({ isCorrect, answerString, subtractEnergyAmount = 1 }: AnswerProps) => {
    if (data.value.energy === 0) return;

    // const currentDataItem = state.value.battleData.data?.[taskIndex.value];

    if (!currentTask.value) {
      console.error(`Could not find current item`);
      return;
    }

    // set lastTaskId
    lastTaskId.value = currentTask.value!.id;

    // store answer
    const foundIdx = answers.value.findIndex((answer) => answer.id === currentTask.value!.id);

    if (foundIdx !== -1) {
      answers.value[foundIdx] = {
        id: currentTask.value.id,
        key: currentTask.value.key,
        answer: answerString,
      };
    } else {
      answers.value.push({
        id: currentTask.value.id,
        key: currentTask.value.key,
        answer: answerString,
      });
    }

    // call api
    if (currentTask.value.api) {
      mainStore.callApi({ api: currentTask.value.api });
    }

    if (isCorrect) {
      onCorrectAnswer();
      const multiplier = calculateRelaxMultiplierAmount();
      dataStore.addBolts(multiplier);
    } else {
      if (subtractEnergyAmount) {
        changeEnergy(-subtractEnergyAmount);
      }
      onWrongRelaxAnswer();
    }

    incrementTaskIndex();

    if (state.value.battleData.questions_left > 0) {
      state.value.battleData.questions_left -= 1;
    }

    startTaskTimeout();

    // console.log(answers.value);
  };

  const handleChallengeAnswer = ({ isCorrect, answerString }: AnswerProps) => {
    const currentDataItem = state.value.battleData.data?.[taskIndex.value];

    if (!currentDataItem) {
      console.error(`Could not find current item`);
      return;
    }

    // set lastTaskId
    lastTaskId.value = currentDataItem!.id;

    // store answer
    const foundIdx = answers.value.findIndex((answer) => answer.id === currentDataItem!.id);

    if (foundIdx !== -1) {
      answers.value[foundIdx] = {
        id: currentDataItem.id,
        key: currentDataItem.key,
        answer: answerString,
      };
    } else {
      answers.value.push({
        id: currentDataItem.id,
        key: currentDataItem.key,
        answer: answerString,
      });
    }

    if (isCorrect) {
      addToChallengeScore(currentCalcPoint.value);
      onCorrectAnswer();
    } else {
      onWrongChallengeAnswer();
    }

    // call api
    if (currentDataItem.api) {
      mainStore.callApi({ api: currentDataItem.api });
    }

    incrementTaskIndex();
  };

  const onCorrectAnswer = () => {
    correctStreak.value += 1;
  };

  const onWrongRelaxAnswer = () => {
    correctStreak.value = 0;
  };

  const onWrongChallengeAnswer = () => {
    if (data.value.battle_extra_mistake && !bonusesUsed.value["extra_mistake"]) {
      bonusesUsed.value["extra_mistake"] = true;
    } else {
      correctStreak.value = 0;
    }
  };

  // task index helpers
  const incrementTaskIndex = () => {
    const newIdx = taskIndex.value + 1;

    if (state.value.battleData.data[newIdx]) {
      taskIndex.value = newIdx;
    } else {
      resetTaskIndex();
    }
  };

  const resetTaskIndex = () => {
    taskIndex.value = 0;
  };

  // mechanic
  const changeMechanic = (mechId: number) => {
    stopTaskTimeout();
    mainStore.callApi({ api: "battle_init", data: { battle_type: mechId } });
    resetBattleStats();
    startTaskTimeout();
  };

  const getMechanicName = (mechId: number) => {
    return battleTypes[mechId];
  };

  // misc
  const resetBattleStats = () => {
    taskIndex.value = 0;
    lastTaskId.value = null;
    correctStreak.value = 0;
    // answers.value = [];
    challengeScore.value = 0;
    bonusesUsed.value = {};
  };

  const changeEnergy = (value: number) => {
    state.value.battleData.energy += value;

    if (state.value.battleData.energy < 0) {
      state.value.battleData.energy = 0;
    }
  };

  const calculateRelaxMultiplierAmount = () => {
    const multiplicator = state.value.battleData.multiplicator;
    const calcPoints = [...state.value.battleData.calc_points];
    const idx = correctStreak.value;

    if (multiplicator && calcPoints?.length && idx) {
      if (!calcPoints[idx]) {
        return multiplicator * calcPoints[calcPoints.length - 1];
      }

      return multiplicator * calcPoints[idx];
    }
    return 0;
  };

  const addToChallengeScore = (value: number) => {
    challengeScore.value += value;
  };

  const decreaseWaitingTimer = () => {
    if (state.value.battleData.waiting_timer > 0) {
      state.value.battleData.waiting_timer -= 1000;
    }
  };

  const pauseBattle = () => {
    console.log(`Battle paused`);
    currentBreakpointInterval.fn?.stop();

    console.log(data.value.battle_type);

    if (data.value.battle_mode === "relax") {
      stopTaskTimeout();
    }
  };

  const resumeBattle = () => {
    console.log(`Battle resumed`);
    const type = currentBreakpointInterval.type || "";
    startBreakpoint(type);

    if (data.value.battle_mode === "relax") {
      startTaskTimeout();
    }
  };

  return {
    data,
    currentTask,
    lastTaskId,
    answers,
    challengeScore,
    bonusesUsed,
    currentCalcPoint,
    set,
    expand,
    pauseBattle,
    resumeBattle,
    handleRelaxAnswer,
    handleChallengeAnswer,
    changeMechanic,
    getMechanicName,
    startTaskTimeout,
    stopTaskTimeout,
    setTaskTimeoutCounter,
    startBreakpoint,
    stopBreakpoint,
    decreaseWaitingTimer,
    resetTaskIndex,
    resetBattleStats,
  };
});
