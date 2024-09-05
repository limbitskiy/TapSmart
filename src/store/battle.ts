import { computed, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { defineStore } from "pinia";

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
  const dataStore = useDataStore();
  const userStore = useMainStore();

  const battleTypes: BattleTypes = {
    1: "yesno",
    2: "4answers",
    3: "bubble_pairs",
    4: "audio_question",
  };

  const taskIndex = ref(0);
  const lastTaskId = ref<number | null>(null);
  const correctStreak = ref(1);
  const answers = ref<Answer[]>([]);
  const currentBattleType = ref(0);

  const state = ref<BattleState>({});

  // getters
  const currentTask = computed(() => state.value.data?.[taskIndex.value]);
  const mechanics = computed(() => state.value.mechanics);
  const boosters = computed(() => state.value.boosters);
  const energy = computed(() => state.value.energy);
  const questions_left = computed(() => state.value.questions_left);
  const friends_only_badge = computed(() => state.value.friends_only_badge);
  const challengeButton = computed(() => state.value.battle_button_challenge);
  const currentMechanic = computed(() => state.value.mechanics?.[getMechanicName(currentBattleType.value)]);

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
  const { start: startTaskTimeout, stop: stopTaskTimeout, setTime: setTaskTimeout, reset: resetTaskTimeout, fullStop: fullStopTaskTimeout } = useTaskTimeout(taskTimeoutCb);
  const { start: startBpInterval, stop: stopBpInterval, setTime: setBpInterval, time: bpTime } = useBpInterval(breakpointCb);

  watch(currentBattleType, (val, oldVal) => {
    if (val === oldVal) return;

    setTaskTimeout(currentMechanic.value?.timeout);
    startTaskTimeout();
  });

  const set = (data) => {
    Object.keys(data).forEach((key) => {
      if (key === "battle_type") {
        currentBattleType.value = data["battle_type"];

        if (!currentBattleType.value) {
          console.error(`No such battle type`);
        }

        router.push(`/home/battles/${battleTypes[currentBattleType.value]}`);
      }

      // breakpoint logic
      if (key === "breakpoint" && data.breakpoint !== bpTime) {
        if (data.breakpoint === 0) {
          stopBpInterval();
          return;
        }

        setBpInterval(data.breakpoint);
        startBpInterval();
      }

      if (state.value[key]) {
        state.value[key] = {};
      }

      state.value[key] = data[key];
    });

    if (state.value.data?.length) {
      state.value.data.sort((a, b) => a.id - b.id);
    }

    taskIndex.value = 0;

    lastTaskId.value = null;

    answers.value = [];

    // console.log("battle store:", state.value);
  };

  const expand = (data) => {
    // console.log(`expand`);

    const _currentId = currentTask.value.id;

    Object.keys(data).forEach((key) => {
      if (state.value[key] && Array.isArray(state.value[key])) {
        data[key].forEach((item) => {
          const foundIdx = state.value[key].findIndex((storeItem) => storeItem.id === item.id);

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
    taskIndex.value = state.value.data.findIndex((task) => task.id === _currentId);
  };

  const onAnswer = ({ isCorrect, answerString, subtractEnergyAmount = 1 }: AnswerProps) => {
    if (energy.value === 0) return;

    resetTaskTimeout();
    const currentDataItem = state.value.data?.[taskIndex.value];

    if (!currentDataItem) {
      console.error(`Could not find current item`);
      return;
    }

    // set lastTaskId
    lastTaskId.value = currentDataItem!.id;

    // store answer
    const foundIdx = answers.value.findIndex((answer) => answer.id === currentDataItem!.id);

    if (foundIdx !== -1) {
      answers.value[foundIdx] = { id: currentDataItem.id, key: currentDataItem.key, answer: answerString };
    } else {
      answers.value.push({ id: currentDataItem.id, key: currentDataItem.key, answer: answerString });
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

    // console.log(answers.value);
  };

  const onAnswerNew = ({ isCorrect, answerString, subtractEnergyAmount = 1 }: AnswerProps) => {
    if (energy.value === 0) return;

    const currentDataItem = state.value.data?.[taskIndex.value];

    if (!currentDataItem) {
      console.error(`Could not find current item`);
      return;
    }

    // set lastTaskId
    lastTaskId.value = currentDataItem!.id;

    // store answer
    const foundIdx = answers.value.findIndex((answer) => answer.id === currentDataItem!.id);

    if (foundIdx !== -1) {
      answers.value[foundIdx] = { id: currentDataItem.id, key: currentDataItem.key, answer: answerString };
    } else {
      answers.value.push({ id: currentDataItem.id, key: currentDataItem.key, answer: answerString });
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

    startTaskTimeout();

    // console.log(answers.value);
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

  const changeMechanic = (mechId: string) => {
    userStore.useFetch({ key: "battle_init", data: { battle_type: +mechId } });
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
      return state.value.multiplicator * state.value.calc_points[correctStreak.value];
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
    set,
    onAnswer,
    changeMechanic,
    expand,
    getMechanicName,
    onVibrate,
    startTaskTimeout,
    stopTaskTimeout,
    fullStopTaskTimeout,
    startBpInterval,
    stopBpInterval,
    onAnswerNew,
  };
});
