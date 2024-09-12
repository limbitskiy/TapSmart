import { computed, ref, watch } from "vue";
import { defineStore } from "pinia";

// common
import { Interval as BreakpointInterval, Timer as TaskTimer } from "@/common/interval";

// composables

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

  const taskIndex = ref<number | null>(null);
  const lastTaskId = ref<number | null>(null);
  const correctStreak = ref(1);
  const answers = ref<Answer[]>([]);

  let currentBreakpointInterval: BreakpointInterval | null = null;
  let currentTaskTimeout: TaskTimer | null = null;
  let taskTimeoutCounter: number | null = null;

  const state = ref<BattleState>({
    battleData: {},
  });

  // getters
  const currentTask = computed(() => state.value.battleData.data?.[taskIndex.value]);
  // const mechanics = computed(() => state.value.mechanics);
  // const boosters = computed(() => state.value.boosters);
  // const energy = computed(() => state.value.energy);
  // const questions_left = computed(() => state.value.questions_left);
  // const friends_only_badge = computed(() => state.value.friends_only_badge);
  // const players_waiting = computed(() => state.value.players_waiting);
  // const player_progress = computed(() => state.value.player_progress);
  // const waiting_timer = computed(() => state.value.waiting_timer);
  // const battle_duration = computed(() => state.value.battle_duration);
  // const challengeButton = computed(() => state.value.battle_button_challenge);
  // const currentBattleType = computed(() => state.value.battle_type);
  const currentMechanic = computed(() => state.value.battleData.mechanics?.[getMechanicName(state.value.battleData.battle_type)]);
  // const battleResultButtons = computed(() => state.value.battle_results_buttons);

  const data = computed(() => state.value.battleData);

  const set = (data) => {
    Object.keys(data).forEach((key) => {
      if (key === "cleanAnswers" && data["cleanAnswers"]) {
        lastTaskId.value = null;
        answers.value = [];
      }

      if (key === "data") {
        taskIndex.value = 0;
      }

      // battle mode
      if (key === "battle_mode") {
        if (data["battle_mode"] === "relax") {
          mainStore.redirectTo(`/home/relax/${battleTypes[data["battle_type"]]}`);
        } else if (data["battle_mode"] === "challenge") {
          mainStore.redirectTo(`/home/challenge/${battleTypes[data["battle_type"]]}`);
        }
      }
      // if no such key - create an empty object
      if (state.value.battleData[key]) {
        state.value.battleData[key] = null;
      }
      // copy data to the key
      state.value.battleData[key] = data[key];
    });

    if (state.value.battleData.data?.length) {
      state.value.battleData.data.sort((a, b) => a.id - b.id);
    }

    console.log("set battle store:", state.value.battleData);
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

    console.log("expanded battle store:", state.value.battleData);
  };

  const decreaseWaitingTimer = () => {
    if (state.value.battleData.waiting_timer > 0) {
      state.value.battleData.waiting_timer -= 1000;
    }
  };

  const startTaskTimeout = () => {
    if (!currentMechanic.value?.timeout || currentTaskTimeout || taskTimeoutCounter === 0) return;

    const callback = () => {
      stopTaskTimeout();
      handleRelaxAnswer({ isCorrect: false, answerString: "", subtractEnergyAmount: 0 });
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

    const breakpointCb = () => {
      if (document.hasFocus()) {
        console.log(`is in focus`);
        mainStore.callApi({ api: "battle_breakpoint" });
        return;
      }

      console.log(`is not in focus`);
    };

    const challengeCb = () => {
      if (document.hasFocus()) {
        console.log(`is in focus`);
        mainStore.callApi({ api: "battle_breakpoint" });
        return;
      }

      console.log(`is not in focus`);
    };

    const waitingCb = () => {
      if (document.hasFocus()) {
        console.log(`is in focus`);
        mainStore.callApi({ api: "waiting_breakpoint" });
        return;
      }

      console.log(`is not in focus`);
    };

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
        console.error(`Unknown type of battle breakpoint`);
      }
    }

    if (!interval || !callback) return;

    const breakpointInterval = new BreakpointInterval(interval, callback);

    currentBreakpointInterval = breakpointInterval;
    breakpointInterval.start();
  };

  const stopBreakpoint = () => {
    if (currentBreakpointInterval) {
      currentBreakpointInterval.stop();
    }
  };

  const handleRelaxAnswer = ({ isCorrect, answerString, subtractEnergyAmount = 1 }: AnswerProps) => {
    if (state.value.battleData.energy === 0) return;

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
    } else {
      if (subtractEnergyAmount) {
        changeEnergy(-subtractEnergyAmount);
      }
      onWrongAnswer();
    }

    incrementTaskIndex();

    if (state.value.battleData.questions_left > 0) {
      state.value.battleData.questions_left -= 1;
    }

    startTaskTimeout();

    // console.log(answers.value);
  };

  const handleChallengeAnswer = ({ answerString }: AnswerProps) => {
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

    // call api
    if (currentDataItem.api) {
      mainStore.callApi({ api: currentDataItem.api });
    }

    incrementTaskIndex();
  };

  const incrementTaskIndex = () => {
    const newIdx = taskIndex.value + 1;

    if (state.value.battleData.data[newIdx]) {
      taskIndex.value = newIdx;
    } else {
      taskIndex.value = 0;
    }
  };

  const onCorrectAnswer = () => {
    dataStore.addBolts(calculateBoltsAmount());
    correctStreak.value += 1;
  };

  const onWrongAnswer = () => {
    correctStreak.value = 1;
  };

  const changeMechanic = (mechId: number) => {
    stopTaskTimeout();
    mainStore.callApi({ api: "battle_init", data: { battle_type: mechId } });
    startTaskTimeout();
  };

  const getMechanicName = (mechId: number) => {
    return battleTypes[mechId];
  };

  const changeEnergy = (value: number) => {
    state.value.battleData.energy += value;

    if (state.value.battleData.energy < 0) {
      state.value.battleData.energy = 0;
    }
  };

  const calculateBoltsAmount = () => {
    if (state.value.battleData.multiplicator && state.value.battleData.calc_points?.length) {
      const idx = correctStreak.value;

      if (!state.value.battleData.calc_points[idx]) {
        return state.value.battleData.multiplicator * state.value.battleData.calc_points[state.value.battleData.calc_points.length - 1];
      }

      return state.value.battleData.multiplicator * state.value.battleData.calc_points[correctStreak.value];
    }
    return 0;
  };

  return {
    data,
    currentTask,
    // energy,
    lastTaskId,
    answers,
    // currentBattleType,
    // mechanics,
    // challengeButton,
    // questions_left,
    // boosters,
    // friends_only_badge,
    // players_waiting,
    // waiting_timer,
    // player_progress,
    // battle_duration,
    // battleResultButtons,
    set,
    handleRelaxAnswer,
    handleChallengeAnswer,
    changeMechanic,
    expand,
    getMechanicName,
    startTaskTimeout,
    stopTaskTimeout,
    setTaskTimeoutCounter,
    startBreakpoint,
    stopBreakpoint,
    decreaseWaitingTimer,
  };
});
