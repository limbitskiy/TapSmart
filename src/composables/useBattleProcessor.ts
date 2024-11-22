import { ref, computed } from "vue";

// types
import { Answer, BattleState, Task } from "@/types";

export const useBattleProcessor = (battleData: BattleState) => {
  let lastTask: Task | null = null;
  const answers = ref<Answer[]>([]);
  const currentTaskBatch = ref();

  window.currentTask = currentTaskBatch;

  const giveNextTask = () => {
    if (!battleData.data) {
      console.error(`No tasks: battle processor`);
    }

    const clone = JSON.parse(JSON.stringify(battleData.data));
    clone.sort((a, b) => a.id - b.id);

    if (!lastTask) {
      lastTask = clone[0];
      return clone[0];
    } else {
      const idx = clone.findIndex((task) => task.id === lastTask?.id);

      if (clone[idx + 1]) {
        lastTask = clone[idx + 1];
        return clone[idx + 1];
      } else {
        lastTask = clone[0];
        return clone[0];
      }
    }
  };

  const storeAnswer = ({ task, answerString, msec, auto }: { task: Task; answerString: string; msec?: number; auto?: boolean }) => {
    const foundIdx = answers.value.findIndex((answer) => answer.id === task.id);

    const answerObject = {
      id: task.id,
      key: task.key,
      answer: auto ? "" : answerString,
      msec,
    };

    if (foundIdx !== -1) {
      answers.value[foundIdx] = answerObject;
    } else {
      answers.value.push(answerObject);
    }
  };

  // const _currentTask = computed(() => {
  //   if (settings.value.taskAmountToLoad === 1) {
  //     return battleData.data?.find((task) => task.id === taskID.value);
  //   } else if (settings.value.taskAmountToLoad > 1) {
  //     const tasks = [];
  //     let counter = 0;

  //     while (counter < settings.value.taskAmountToLoad) {
  //       tasks.push(battleData.data?.find((task) => task.id === taskID.value + counter));
  //       counter++;
  //     }
  //     console.log(tasks);

  //     return tasks;
  //   }
  // });

  const incrementTask = (tasksNumber?: number) => {
    if (!battleData.data) return;

    // get idx context
    const clone = JSON.parse(JSON.stringify(battleData.data));
    clone.sort((a, b) => a.id - b.id);

    let lastID;

    if (currentTaskBatch.value) {
      lastID = currentTaskBatch.value.id;
    } else {
      lastID = clone[0].id;
    }

    const lastIdx = clone.findIndex((task: Task) => task.id === lastID);

    // if more than one task needed
    if (tasksNumber && tasksNumber > 1) {
      const tasks = [];
      let counter = 0;

      while (counter < tasksNumber) {
        tasks.push(battleData.data?.find((task) => task.id === lastID + counter));
        counter++;
      }
      currentTaskBatch.value = tasks;

      return;
    }

    // if only one task is needed
    const newIdx = lastIdx + 1;

    if (clone[newIdx]) {
      currentTaskBatch.value = clone[newIdx];
    } else {
      resetTask();
    }
  };

  const resetTask = () => {
    if (!battleData.data) return;
    const clone = JSON.parse(JSON.stringify(battleData.data));

    clone.sort((a, b) => a.id - b.id);
    currentTaskBatch.value = clone[0];
  };

  const removeTaskFromBatch = (id: number) => {
    const idx = currentTaskBatch.value.findIndex((task: Task) => task.id === id);
    console.log(idx);

    if (idx >= 0) {
      currentTaskBatch.value.splice(idx, 1);
    }
  };

  return {
    resetTask,
    storeAnswer,
    incrementTask,
    removeTaskFromBatch,
    giveNextTask,
    answers,
    currentTaskBatch,
  };
};
