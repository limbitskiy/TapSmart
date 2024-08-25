import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { useDataStore } from "@/store/data.ts";
import { useUserStore } from "@/store/user.ts";

export const useBattleStore = defineStore("battle", () => {
  const router = useRouter();
  const dataStore = useDataStore();
  const userStore = useUserStore();

  const battleTypes = {
    1: "yes-no",
    2: "4-answers",
  };

  let breakpointInterval = null;
  const taskIndex = ref(0);
  const lastTaskId = ref(null);

  const state = ref({});

  const answers = ref([]);
  const energy = ref(1500);

  const currentTask = computed(() => state.value.data[taskIndex.value]);

  const setBattleData = (data) => {
    if (data.store) {
      Object.keys(data.store).forEach((key) => {
        if (key === "battle_type") {
          const battleType = data.store["battle_type"];

          if (!battleType) {
            console.error(`No such battle type`);
          }

          router.push(`/home/battles/${battleTypes[battleType]}`);
        }

        // breakpoint logic
        if (key === "breakpoint" && breakpointInterval !== data.store["breakpoint"]) {
          if (breakpointInterval) {
            clearInterval(breakpointInterval);
          }

          breakpointInterval = setInterval(() => {
            console.log(`breakpoint!`);
            breakpointCall();
          }, data.store["breakpoint"]);
        }

        if (state.value[key]) {
          state.value[key] = {};
        }

        state.value[key] = data.store[key];
      });
    }

    if (data.expand) {
      // overwrite items with duplicate id's
      Object.keys(data.expand).forEach((expandKey) => {
        if (state.value[expandKey] && Array.isArray(state.value[expandKey])) {
          data.expand[expandKey].forEach((item) => {
            const foundIdx = state.value[expandKey].findIndex((storeItem) => storeItem.id === item.id);

            if (foundIdx != -1) {
              state.value[expandKey].splice(foundIdx, 1);
            }

            state.value[expandKey].push(item);
          });
        } else {
          console.error(`Error trying to expand battle store`);
        }
      });
    }

    console.log("battle store:", state.value);
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

  const changeMechanic = (mechanic) => {
    const mechId = Object.keys(battleTypes).find((key) => battleTypes[key] === mechanic);

    if (!mechId) {
      console.error(`Could not send correct mechanic`);
      return;
    }

    userStore.useFetch({ key: "battle_init", data: { battle_type: +mechId } });
  };

  return { currentTask, energy, lastTaskId, answers, setBattleData, onAnswer, changeMechanic };
});
