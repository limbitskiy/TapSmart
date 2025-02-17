import { ref, computed } from "vue";

// types
import { Answer, Task } from "@/types";

// stores
import { useMainStore } from "@/store/main";

export const useBattleProcessor = () => {
  const mainStore = useMainStore();

  let tasks: Task[] | [] = [];
  let lastTask: Task | null = null;
  const answers = ref<Answer[]>([]);

  const getNextTask = () => {
    // console.log(`Getting new task`);
    // console.log(`lastTask:`);
    // console.log(lastTask);

    if (!tasks) {
      console.error(`No tasks: battle processor`);
    }

    const clone = JSON.parse(JSON.stringify(tasks));
    clone.sort((a, b) => a.id - b.id);

    let currentTask;

    if (!lastTask) {
      currentTask = clone[0];
    } else {
      const idx = clone.findIndex((task) => task.id === lastTask?.id);

      if (clone[idx + 1]) {
        currentTask = clone[idx + 1];
      } else {
        currentTask = clone[0];
      }
    }

    // make an api call
    if (currentTask.api) {
      mainStore.useFetch({ key: currentTask.api, data: { lastTaskId: currentTask?.id } });
    }

    lastTask = currentTask;
    return currentTask;
  };

  const storeAnswer = ({ task, answerString, msec }: { task: Task; answerString: string; msec?: number }) => {
    const answerObject = {
      id: task.id,
      key: task.key,
      answer: answerString,
      msec,
    };

    answers.value.push(answerObject);

    // console.warn(`answer recorded`);
    // console.warn(answers.value);
  };

  const cleanAnswers = () => {
    answers.value = [];
  };

  const reset = () => {
    lastTask = null;
  };

  const setTasks = (taskArray: Task[]) => {
    tasks = taskArray;
  };

  const expandTasks = (taskArray: Task[]) => {
    taskArray.forEach((newTask) => {
      const foundIdx = tasks.findIndex((storeTask) => storeTask.id === newTask.id);

      if (foundIdx != -1) {
        tasks.splice(foundIdx, 1, newTask);
      } else {
        console.warn(`expand: Warning - property does not exist, creating a new one`);
        tasks.push(newTask);
      }
    });
  };

  return {
    reset,
    storeAnswer,
    getNextTask,
    cleanAnswers,
    setTasks,
    expandTasks,
    answers,
    lastTask,
  };
};
