import { ref, computed } from "vue";

// types
import { BattleTypes, BattleState, AnswerProps, Answer } from "@/types";

const battleProcessor = (data) => {
  console.log(data);

  const taskIndex = ref<number | null>(null);
  const answers = ref<Answer[]>([]);

  const resetTaskIndex = () => {
    if (!data) return;
    const clone = JSON.parse(JSON.stringify(data));

    clone.sort((a, b) => a.id - b.id);
    taskIndex.value = clone[0].id;
  };

  const incrementTaskIndex = () => {
    const clone = JSON.parse(JSON.stringify(data));
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
    const task = data.find((task) => task.id === taskIndex.value);

    const foundIdx = answers.value.findIndex(
      (answer) => answer.id === task!.id
    );

    if (foundIdx !== -1) {
      answers.value[foundIdx] = {
        id: task.id,
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
    console.log(data);

    return data?.find((task) => task.id === taskIndex.value);
  });

  return {
    resetTaskIndex,
    incrementTaskIndex,
    storeAnswer,
    _currentTask,
    answers,
  };
};

export default battleProcessor;
