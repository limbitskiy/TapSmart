import { ref } from "vue";

// types
import { Task } from "@/types";

interface Pill {
  id: number;
  task?: Task;
  wrong?: boolean;
  success?: boolean;
  selected?: boolean;
}

export const useMatchPairsLogic = (settings: { maxTasks: number }) => {
  const taskArray = ref<Task[]>([]);
  const leftPills = ref<Pill[]>([{ id: 2 }, { id: 4 }, { id: 6 }, { id: 8 }, { id: 10 }]);
  const rightPills = ref<Pill[]>([{ id: 1 }, { id: 3 }, { id: 5 }, { id: 7 }, { id: 9 }]);

  const addTask = (task: Task) => {
    if (taskArray.value.length >= settings.maxTasks) return;
    taskArray.value.push(task);

    // add task on the left
    let freeLeftIdx = leftPills.value.find((pill) => !("task" in pill));
    if (freeLeftIdx) {
      freeLeftIdx.task = task;
    }

    // find free spots on the right
    let freeRightIdx = rightPills.value.filter((pill) => !("task" in pill));

    // pick a random free spot
    const randIdx = Math.round(Math.random() * (freeRightIdx.length - 1));

    // insert task on the right
    freeRightIdx[randIdx].task = task;
  };

  const removeTask = (id: number) => {
    if (taskArray.value.length <= 0) return;
    const idx = taskArray.value.findIndex((task) => task.id === id);
    taskArray.value.splice(idx, 1);

    const leftTask = leftPills.value.find((pill) => pill.task?.id === id);
    delete leftTask?.task;

    const rightTask = rightPills.value.find((pill) => pill.task?.id === id);
    delete rightTask?.task;
  };

  const getSmallestIdTask = () => {
    const clone = JSON.parse(JSON.stringify(taskArray.value));
    return clone.sort((a, b) => a.id - b.id)[0];
  };

  return {
    addTask,
    removeTask,
    getSmallestIdTask,
    leftPills,
    rightPills,
  };
};
