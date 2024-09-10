import { computed, ref, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { defineStore } from "pinia";

// common
import { BreakpointInterval } from "@/common/interval";

// composables
import { useTaskTimeout } from "@/composables/useTaskTimeout";
import { useBpInterval } from "@/composables/useBpInterval";

// stores
import { useDataStore } from "@/store/data";
import { useMainStore } from "@/store/main";

// types
import { BattleTypes, BattleState, AnswerProps, Answer } from "@/types";

export const useBattleStore = defineStore("battle", () => {
  const router = useRouter();
  const route = useRoute();

  const dataStore = useDataStore();
  const userStore = useMainStore();

  const battleTypes: BattleTypes = {
    1: "yesno",
    2: "4answers",
    3: "bubble_pairs",
    4: "audio_question",
    5: "match_pairs",
    6: "work_on_mistakes",
  };

  const taskIndex = ref(0);
  const lastTaskId = ref<number | null>(null);
  const correctStreak = ref(1);
  const answers = ref<Answer[]>([]);
  const currentBattleType = ref(0);
  const currentBreakpointInterval = ref(null);

  const state = ref<BattleState>({});

  // getters
  const currentTask = computed(() => state.value.data?.[taskIndex.value]);
  const mechanics = computed(() => state.value.mechanics);
  const boosters = computed(() => state.value.boosters);
  const energy = computed(() => state.value.energy);
  const questions_left = computed(() => state.value.questions_left);
  const friends_only_badge = computed(() => state.value.friends_only_badge);
  const players_waiting = computed(() => state.value.players_waiting);
  const player_progress = computed(() => state.value.player_progress);
  const waiting_timer = computed(() => state.value.waiting_timer);
  const battle_duration = computed(() => state.value.battle_duration);
  const challengeButton = computed(() => state.value.battle_button_challenge);
  const currentMechanic = computed(
    () => state.value.mechanics?.[getMechanicName(currentBattleType.value)]
  );

  const taskTimeoutCb = () => {
    onAnswer({ isCorrect: false, answerString: "", subtractEnergyAmount: 0 });
  };

  const breakpointCb = () => {
    if (document.hasFocus()) {
      console.log(`is in focus`);
      userStore.useFetch({ key: "battle_breakpoint" });
      return;
    }

    console.log(`is not in focus`);
  };

  // composables
  const {
    start: startTaskTimeout,
    stop: stopTaskTimeout,
    setTime: setTaskTimeout,
    reset: resetTaskTimeout,
    fullStop: fullStopTaskTimeout,
  } = useTaskTimeout(taskTimeoutCb);
  const {
    start: startBpInterval,
    stop: stopBpInterval,
    setTime: setBpInterval,
    time: bpTime,
  } = useBpInterval(breakpointCb);

  watch(currentBattleType, (val, oldVal) => {
    if (val === oldVal) return;

    setTaskTimeout(currentMechanic.value?.timeout);
    startTaskTimeout();
  });

  const decreaseWaitingTimer = () => {
    if (state.value.waiting_timer) {
      state.value.waiting_timer -= 1000;
    }
  };

  const startBreakpoint = (type: string) => {
    stopBreakpoint();

    const breakpointCb = () => {
      if (document.hasFocus()) {
        console.log(`is in focus`);
        userStore.useFetch({ key: "battle_breakpoint" });
        return;
      }

      console.log(`is not in focus`);
    };

    const challengeCb = () => {
      if (document.hasFocus()) {
        console.log(`is in focus`);
        userStore.useFetch({ key: "challenge_breakpoint" });
        return;
      }

      console.log(`is not in focus`);
    };

    const waitingCb = () => {
      if (document.hasFocus()) {
        console.log(`is in focus`);
        userStore.useFetch({ key: "waiting_breakpoint" });
        return;
      }

      console.log(`is not in focus`);
    };

    let interval;
    let callback;

    switch (type) {
      case "battle": {
        interval = state.value.breakpoint;
        callback = breakpointCb;
        break;
      }
      case "challenge": {
        interval = state.value.challenge_breakpoint;
        callback = challengeCb;
        break;
      }
      case "waiting": {
        interval = state.value.waiting_breakpoint;
        callback = waitingCb;
        break;
      }
    }

    if (!interval || !callback) return;

    const breakpointInterval = new BreakpointInterval(interval, callback);

    currentBreakpointInterval.value = breakpointInterval;
    breakpointInterval.start();
  };

  const stopBreakpoint = () => {
    if (currentBreakpointInterval.value) {
      currentBreakpointInterval.value.stop();
    }
  };

  const set = (data) => {
    Object.keys(data).forEach((key) => {
      if (key === "cleanAnswers" && data["cleanAnswers"]) {
        lastTaskId.value = null;
        answers.value = [];
      }

      if (key === "data") {
        taskIndex.value = 0;
      }

      if (key === "battle_type") {
        currentBattleType.value = data["battle_type"];

        if (!currentBattleType.value) {
          console.error(`No such battle type`);
        }

        router.push(`/home/battles/${battleTypes[currentBattleType.value]}`);
      }

      // breakpoint logic
      // if ((key === "breakpoint" && data.breakpoint !== bpTime) || (key === "challenge_breakpoint" && data["challenge_breakpoint"] !== bpTime)) {
      //   if (data.breakpoint === 0) {
      //     stopBpInterval();
      //     return;
      //   }

      //   setBpInterval(data.breakpoint);
      //   startBpInterval();
      // }

      if (state.value[key]) {
        state.value[key] = {};
      }

      state.value[key] = data[key];
    });

    if (state.value.data?.length) {
      state.value.data.sort((a, b) => a.id - b.id);
    }

    // console.log("battle store:", state.value);
  };

  const expand = (data) => {
    // console.log(`expand`);

    const _currentId = currentTask.value.id;

    Object.keys(data).forEach((key) => {
      if (state.value[key] && Array.isArray(state.value[key])) {
        data[key].forEach((item) => {
          const foundIdx = state.value[key].findIndex(
            (storeItem) => storeItem.id === item.id
          );

          if (foundIdx != -1) {
            state.value[key].splice(foundIdx, 1);
          }

          state.value[key].push(item);
        });
      } else {
        console.error(`Error trying to expand battle store`);
      }
    });

    state.value.data.sort((a, b) => a.id - b.id);
    taskIndex.value = state.value.data.findIndex(
      (task) => task.id === _currentId
    );
  };

  const onAnswer = ({
    isCorrect,
    answerString,
    subtractEnergyAmount = 1,
  }: AnswerProps) => {
    if (energy.value === 0) return;

    const currentDataItem = state.value.data?.[taskIndex.value];

    if (!currentDataItem) {
      console.error(`Could not find current item`);
      return;
    }

    // set lastTaskId
    lastTaskId.value = currentDataItem!.id;

    // store answer
    const foundIdx = answers.value.findIndex(
      (answer) => answer.id === currentDataItem!.id
    );

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
      callApi(currentDataItem.api);
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

    if (state.value.questions_left > 0) {
      state.value.questions_left -= 1;
    }

    resetTaskTimeout();

    // console.log(answers.value);
  };

  const onChallengeAnswer = ({ answerString }: AnswerProps) => {
    const currentDataItem = state.value.data?.[taskIndex.value];

    if (!currentDataItem) {
      console.error(`Could not find current item`);
      return;
    }

    // set lastTaskId
    lastTaskId.value = currentDataItem!.id;

    // store answer
    const foundIdx = answers.value.findIndex(
      (answer) => answer.id === currentDataItem!.id
    );

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
      callApi(currentDataItem.api);
    }

    incrementTaskIndex();
  };

  const incrementTaskIndex = () => {
    const newIdx = taskIndex.value + 1;

    if (state.value.data[newIdx]) {
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

  const callApi = (apiName: string) => {
    userStore.useFetch({ key: apiName });
  };

  const onVibrate = (type: string) => {
    if (dataStore.settings.vibro) {
      switch (type) {
        case "correct": {
          navigator.vibrate(300);
          break;
        }
        case "wrong": {
          navigator.vibrate([100, 10, 100, 10, 100]);
          break;
        }
      }
    }
  };

  const changeMechanic = (mechId: number) => {
    userStore.useFetch({ key: "battle_init", data: { battle_type: mechId } });
  };

  const getMechanicName = (mechId: number) => {
    return battleTypes[mechId];
  };

  const changeEnergy = (value: number) => {
    state.value.energy += value;

    if (energy.value < 0) {
      state.value.energy = 0;
    }
  };

  const calculateBoltsAmount = () => {
    if (state.value.multiplicator && state.value.calc_points?.length) {
      const idx = correctStreak.value;

      if (!state.value.calc_points[idx]) {
        return (
          state.value.multiplicator *
          state.value.calc_points[state.value.calc_points.length - 1]
        );
      }

      return (
        state.value.multiplicator * state.value.calc_points[correctStreak.value]
      );
    }
    return 0;
  };

  return {
    currentTask,
    energy,
    lastTaskId,
    answers,
    currentBattleType,
    mechanics,
    challengeButton,
    questions_left,
    boosters,
    friends_only_badge,
    players_waiting,
    waiting_timer,
    player_progress,
    battle_duration,
    set,
    onAnswer,
    onChallengeAnswer,
    changeMechanic,
    expand,
    getMechanicName,
    onVibrate,
    startTaskTimeout,
    stopTaskTimeout,
    fullStopTaskTimeout,
    startBpInterval,
    stopBpInterval,
    startBreakpoint,
    stopBreakpoint,
    decreaseWaitingTimer,
  };
});
