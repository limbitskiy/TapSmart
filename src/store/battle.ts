import { computed, ref, shallowRef, watch } from "vue";
import { useRouter } from "vue-router";
import { defineStore } from "pinia";

// composables
import { useTaskTimeout } from "@/composables/useTaskTimeout";
import { useBpInterval } from "@/composables/useBpInterval";

// stores
import { useDataStore } from "@/store/data.ts";
import { useMainStore } from "@/store/main.ts";

export const useBattleStore = defineStore("battle", () => {
  const router = useRouter();
  const dataStore = useDataStore();
  const userStore = useMainStore();

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

  const battleTypes = {
    1: "yesno",
    2: "4answers",
    3: "bubble_pairs",
    4: "audio_question",
  };

  const taskIndex = shallowRef(0);
  const lastTaskId = shallowRef(null);

  const state = ref({
    data: [],
    mechanics: null,
    battle_button_challenge: null,
    energy: 0,
    multiplicator: null,
    calc_value: null,
  });

  const correctStreak = shallowRef(1);

  const answers = ref([]);

  const currentTask = computed(() => state.value.data[taskIndex.value]);
  const mechanics = computed(() => state.value.mechanics);
  const energy = computed(() => state.value.energy);
  const challengeButton = computed(() => state.value.battle_button_challenge);
  const currentMechanic = computed(() => state.value.mechanics?.[getMechanicName(currentBattleType.value)]);

  const currentBattleType = ref(null);

  const { start: startTaskTimeout, stop: stopTaskTimeout, setTime: setTaskTimeout } = useTaskTimeout(currentMechanic, taskTimeoutCb);
  const { start: startBpInterval, stop: stopBpInterval, setTime: setBpInterval, time: bpTime } = useBpInterval(breakpointCb);

  watch(currentBattleType, (val, oldVal) => {
    if (val === oldVal) return;
    setTaskTimeout(currentMechanic.value.timeout);
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

    // console.log("battle store:", state.value);
  };

  const expand = (data) => {
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
  };

  const onAnswer = ({ isCorrect, answerString, subtractEnergyAmount = 5 }) => {
    if (energy.value === 0) return;

    startTaskTimeout();
    const currentDataItem = state.value.data[taskIndex.value];

    // set lastTaskId
    lastTaskId.value = currentDataItem.id;

    // store answer
    const foundIdx = answers.value.findIndex((answer) => answer.id === currentDataItem.id);

    if (foundIdx !== -1) {
      answers.value[foundIdx] = { id: currentDataItem.id, answer: answerString };
    } else {
      answers.value.push({ id: currentDataItem.id, answer: answerString });
    }

    if (currentDataItem.api) {
      callApi(currentDataItem.api);
    }

    if (isCorrect) {
      onCorrectAnswer();
    } else {
      if (subtractEnergyAmount) {
        subtractEnergy(50);
      }
      onWrongAnswer();
    }

    incrementTaskIndex();

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

  const getMechanicName = (mechId: string) => {
    return battleTypes[mechId];
  };

  const subtractEnergy = (value: number) => {
    state.value.energy -= value;

    if (energy.value <= 0) {
      state.value.energy = 0;
    }
  };

  const calculateBoltsAmount = () => {
    if (state.value.multiplicator && state.value.calc_points.length) {
      return state.value.multiplicator * state.value.calc_points[correctStreak.value];
    }
  };

  return {
    battleTypes,
    currentTask,
    energy,
    lastTaskId,
    answers,
    currentBattleType,
    mechanics,
    challengeButton,
    set,
    onAnswer,
    changeMechanic,
    expand,
    getMechanicName,
    onVibrate,
    startTaskTimeout,
    stopTaskTimeout,
    startBpInterval,
    stopBpInterval,
  };
});
