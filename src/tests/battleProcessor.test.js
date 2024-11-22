import { beforeAll, beforeEach, describe, expect, test } from "vitest";
import { useBattleProcessor } from "@/composables/useBattleProcessor";
// import { mockBattleData } from "./mockBattleData";

const mockData = {
  data: [
    {
      api: null,
      bonus_score: null,
      correct: "звезда",
      id: 6,
      key: "1480",
      task: {
        answer: "интервью",
        question: "star",
        variants: ["интервью", "звезда"],
      },
    },
    {
      api: null,
      bonus_score: null,
      correct: "пасовать",
      id: 2,
      key: "1543",
      task: {
        answer: "тянуть",
        question: "pass",
        variants: ["тянуть", "пасовать"],
      },
    },
    {
      api: null,
      bonus_score: null,
      correct: "мост",
      id: 31,
      key: "1417",
      task: {
        answer: "мост",
        question: "bridge",
        variants: ["мост", "паб"],
      },
    },
    {
      api: null,
      bonus_score: null,
      correct: "начальник",
      id: 502,
      key: "1499",
      task: {
        answer: "начальник",
        question: "boss",
        variants: ["начальник", "мусорное ведро"],
      },
    },
  ],
};
// id's:
// 2, 6, 31, 502
const taskIndexes = [2, 6, 31, 502];

// exposed data:
// resetTaskID, incrementTaskID, storeAnswer, answers, _currentTask

describe("battle processor", () => {
  let battleProcessor;

  beforeAll(() => {
    battleProcessor = useBattleProcessor(mockData);
  });

  beforeEach(() => {
    const { resetTaskID } = battleProcessor;
    resetTaskID();
  });

  test("resets to lowest id", () => {
    const { _currentTask } = battleProcessor;
    expect(_currentTask.value.id).toBe(taskIndexes[0]);
  });

  test("increments taskIndex several times", () => {
    const { incrementTaskID, _currentTask } = battleProcessor;
    incrementTaskID();
    expect(_currentTask.value.id).toBe(taskIndexes[1]);

    incrementTaskID();
    expect(_currentTask.value.id).toBe(taskIndexes[2]);
  });

  test("stores one answer with new id", () => {
    const { storeAnswer, answers } = battleProcessor;
    expect(answers.value.length).toEqual(0);
    storeAnswer("test answer", 1001);

    expect(answers.value.length).toEqual(1);
    expect(answers.value[0].answer).toBe("test answer");
    expect(answers.value[0].msec).toEqual(1001);
  });

  test("rewrites one answer with existing id", () => {
    const { storeAnswer, answers } = battleProcessor;
    storeAnswer("test answer rewritten", 1555);

    expect(answers.value.length).toEqual(1);
    expect(answers.value[0].answer).toBe("test answer rewritten");
    expect(answers.value[0].msec).toEqual(1555);
  });

  test("loop back to smallest id", () => {
    const { incrementTaskID, _currentTask } = battleProcessor;

    incrementTaskID();
    incrementTaskID();
    incrementTaskID();
    incrementTaskID();

    expect(_currentTask.value.id).toBe(taskIndexes[0]);
  });
});
