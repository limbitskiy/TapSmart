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
    1: "yes-no",
    2: "4-answers",
    3: "bubble-pairs",
    4: "audio-question",
  };

  let breakpointInterval = null;
  const taskIndex = ref(0);
  const lastTaskId = ref(null);

  const state = ref({});

  const answers = ref([]);
  const energy = ref(1500);

  const currentTask = computed(() => state.value.data[taskIndex.value]);

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
          console.log(`breakpoint!`);
          breakpointCall();
        }, data["breakpoint"]);
      }

      if (state.value[key]) {
        state.value[key] = {};
      }

      state.value[key] = data[key];
    });

    console.log("battle store:", state.value);
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

  const onAnswer = (answer) => {
    const currentDataItem = state.value.data[taskIndex.value];

    // set lastTaskId
    lastTaskId.value = currentDataItem.id;

    // store answer
    const foundIdx = answers.value.findIndex((answer) => answer.id === currentDataItem.id);

    if (foundIdx !== -1) {
      answers.value[foundIdx] = { id: currentDataItem.id, answer };
    } else {
      answers.value.push({ id: currentDataItem.id, answer });
    }

    switch (state.value.battle_type) {
      // yes-no battle logic
      case 1: {
        if ((currentDataItem.task.answer === currentDataItem.correct && answer === "yes") || (currentDataItem.task.answer !== currentDataItem.correct && answer === "no")) {
          onCorrect();
        } else {
          onWrong();
        }
        break;
      }

      case 2: {
        if (answer === currentDataItem.correct) {
          onCorrect();
        } else {
          onWrong();
        }
        break;
      }
    }

    if (currentDataItem.api) {
      callApi(currentDataItem.api);
    }

    incrementTaskIndex();

    console.log(answers.value);
  };

  const incrementTaskIndex = () => {
    const newIdx = taskIndex.value + 1;
    if (state.value.data[newIdx]) {
      taskIndex.value = newIdx;
    } else {
      taskIndex.value = 0;
    }
  };

  const onCorrect = () => {
    console.log(`correct`);
    dataStore.addBolts(2);
  };

  const onWrong = () => {
    console.log(`not correct`);
    energy.value -= 100;
  };

  const callApi = (apiName) => {
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

  const changeMechanic = (mechId) => {
    userStore.useFetch({ key: "battle_init", data: { battle_type: +mechId } });
  };

  return { currentTask, energy, lastTaskId, answers, currentBattleType, set, onAnswer, changeMechanic, expand };
});
