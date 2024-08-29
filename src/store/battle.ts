import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { useDataStore } from "@/store/data.ts";
import { useMainStore } from "@/store/main.ts";

export const useBattleStore = defineStore("battle", () => {
  const router = useRouter();
  const dataStore = useDataStore();
  const userStore = useMainStore();

  const battleTypes = {
    1: "yesno",
    2: "4answers",
    3: "bubble_pairs",
    4: "audio_question",
  };

  let breakpointInterval = null;
  const taskIndex = ref(0);
  const lastTaskId = ref(null);

  const state = ref({
    data: [],
    mechanics: null,
  });

  const answers = ref([]);
  const energy = ref(1500);

  const currentTask = computed(() => state.value.data[taskIndex.value]);
  const mechanics = computed(() => state.value.mechanics);

  const currentBattleType = ref(1);

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
      if (key === "breakpoint" && breakpointInterval !== data["breakpoint"]) {
        if (breakpointInterval) {
          clearInterval(breakpointInterval);
        }

        breakpointInterval = setInterval(() => {
          // console.log(`breakpoint!`);
          breakpointCall();
        }, data["breakpoint"]);
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

  const onAnswer = ({ isCorrect, answerString }) => {
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
    dataStore.addBolts(2);
  };

  const onWrongAnswer = () => {
    energy.value -= 100;
  };

  const callApi = (apiName: string) => {
    userStore.useFetch({ key: apiName });
  };

  const breakpointCall = () => {
    if (document.hasFocus()) {
      console.log(`is in focus`);
      userStore.useFetch({ key: "battle_breakpoint" });
      return;
    }

    console.log(`is not in focus`);
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

  return { battleTypes, currentTask, energy, lastTaskId, answers, currentBattleType, mechanics, set, onAnswer, changeMechanic, expand, getMechanicName, onVibrate };
});
