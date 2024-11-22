import { ref, computed } from "vue";

// types
import { Answer, BattleState, Task } from "@/types";

export const useBattleProcessor = (battleData: BattleState) => {
  let tasks: Task[] | [] = [];
  let lastTask: Task | null = null;
  const answers = ref<Answer[]>([]);

  const giveNextTask = () => {
    if (!tasks) {
      console.error(`No tasks: battle processor`);
    }

    const clone = JSON.parse(JSON.stringify(tasks));
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

  const storeAnswer = ({ task, answerString, msec }: { task: Task; answerString?: string; msec?: number; auto?: boolean }) => {
    const foundIdx = answers.value.findIndex((answer) => answer.id === task.id);

    const answerObject = {
      id: task.id,
      key: task.key,
      answer: answerString,
      msec,
    };

    if (foundIdx !== -1) {
      answers.value[foundIdx] = answerObject;
    } else {
      answers.value.push(answerObject);
    }

    console.log(`answer recorded`);
    console.log(answers.value);
  };

  const cleanAnswers = () => {
    // lastTask = null;
    answers.value = [];
  };

  const resetTask = () => {
    lastTask = null;
    // if (!tasks) return;
    // const clone = JSON.parse(JSON.stringify(tasks));

    // clone.sort((a, b) => a.id - b.id);
  };

  const setTasks = (taskArray) => {
    tasks = taskArray;
  };

  return {
    resetTask,
    storeAnswer,
    giveNextTask,
    cleanAnswers,
    setTasks,
    answers,
    lastTask,
  };
};
