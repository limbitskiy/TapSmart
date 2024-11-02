import { ref, computed } from "vue";

// types
import { Answer, BattleState } from "@/types";

export const useBattleProcessor = (battleData: BattleState) => {
  const taskIndex = ref<number | null>(null);
  const answers = ref<Answer[]>([]);

  const resetTaskIndex = () => {
    if (!battleData.data) return;
    const clone = JSON.parse(JSON.stringify(battleData.data));

    clone.sort((a, b) => a.id - b.id);
    taskIndex.value = clone[0].id;
  };

  const incrementTaskIndex = () => {
    const clone = JSON.parse(JSON.stringify(battleData.data));
    clone.sort((a, b) => a.id - b.id);

    const idx = clone.findIndex((task) => task.id === taskIndex.value);

    const newIdx = idx + 1;

    if (clone[newIdx]) {
      taskIndex.value = clone[newIdx].id;
    } else {
      resetTaskIndex();
    }
  };

  const storeAnswer = (answerString: string, msec?: number) => {
    const task = battleData.data.find((task) => task.id === taskIndex.value);

    console.log(task);

    const foundIdx = answers.value.findIndex((answer) => answer.id === task!.id);

    if (foundIdx !== -1) {
      answers.value[foundIdx] = {
        key: task.key,
        answer: answerString,
        msec,
      };
    } else {
      answers.value.push({
        id: task.id,
        key: task.key,
        answer: answerString,
        msec,
      });
    }
  };

  const _currentTask = computed(() => {
    return battleData.data?.find((task) => task.id === taskIndex.value);
  });

  return {
    resetTaskIndex,
    incrementTaskIndex,
    storeAnswer,
    _currentTask,
    answers,
  };
};
