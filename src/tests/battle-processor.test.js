import { beforeAll, describe, expect, test } from "vitest";
import { useBattleProcessor } from "@/composables/useBattleProcessor";
import { mockBattleData } from "./mockBattleData";

// resetTaskIndex, incrementTaskIndex, storeAnswer, answers, _currentTask

describe("battle processor", () => {
  let battleProcessor;

  beforeAll(() => {
    battleProcessor = useBattleProcessor(mockBattleData);
  });

  test("resets taskIndex", () => {
    const { resetTaskIndex, _currentTask } = battleProcessor;
    resetTaskIndex();
    expect(_currentTask.value.id).toBe(1);
  });

  test("increments taskIndex", () => {
    const { incrementTaskIndex, _currentTask } = battleProcessor;
    incrementTaskIndex();
    expect(_currentTask.value.id).toBe(2);
  });

  test("stores one answer with new id", () => {
    const { storeAnswer, answers } = battleProcessor;
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
});
