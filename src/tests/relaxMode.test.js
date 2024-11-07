import { beforeAll, beforeEach, afterEach, describe, expect, expectTypeOf, test, vi, mount } from "vitest";
import { useBattleStore } from "@/store/battle";
import { useMainStore } from "@/store/main";
import { useDataStore } from "@/store/data";
import { setActivePinia, createPinia } from "pinia";
import { ref } from "vue";
import { waitFor } from "@/utils";
import { makeRequest } from "@/api/server";

const mockData = {
  battle_mode: "relax",
  calc_points: [1, 2, 4, 8, 16],
  data: [
    {
      api: null,
      bonus_score: null,
      correct: "пасовать",
      id: 2,
      key: "1543",
      task: {
        answer: "пасовать",
        question: "pass",
        variants: ["пасовать", "закрывать"],
      },
    },
    {
      api: null,
      bonus_score: null,
      correct: "мост",
      id: 3,
      key: "1417",
      task: {
        answer: "удостоверение личности",
        question: "bridge",
        variants: ["удостоверение личности", "мост"],
      },
    },
    {
      api: null,
      bonus_score: null,
      correct: "группа",
      id: 31,
      key: "1413",
      task: {
        answer: "выигрыш",
        question: "band",
        variants: ["выигрыш", "группа"],
      },
    },
  ],
  energy: 10,
  multiplicator: 1.2,
};

describe("relax mode", () => {
  let battleStore;
  let mainStore;
  let dataStore;

  beforeAll(() => {
    // stub window object
    vi.stubGlobal("window", {});

    vi.mock("@/api/server", () => ({
      makeRequest: vi.fn(() => {
        return { data: {} };
      }),
    }));
  });

  beforeEach(() => {
    setActivePinia(createPinia());
    battleStore = useBattleStore();
    battleStore.set(mockData);
    battleStore.stopRelax();
    battleStore.startRelax();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test("battle is started", () => {
    expect(battleStore.battleStarted).toBe(true);
  });

  test("battle is stopped", () => {
    battleStore.stopChallenge();
    expect(battleStore.battleStarted).toBe(false);
  });

  test("currentTask being selected", () => {
    expect(battleStore.currentTask.id).toBe(2);
  });

  test("lastTaskId being recorded", () => {
    battleStore.handleAnswer({ isCorrect: true, answerString: "test answer" });
    expect(battleStore.lastTaskId).toBe(2);
  });

  test("relax answers being recorded", async () => {
    battleStore.handleAnswer({
      isCorrect: true,
      answerString: "test answer 1",
    });
    await waitFor(100);
    battleStore.handleAnswer({
      isCorrect: false,
      answerString: "test answer 2",
    });
    await waitFor(100);
    battleStore.handleAnswer({
      isCorrect: true,
      answerString: "test answer 3",
    });
    await waitFor(100);

    expect(battleStore.answers[0]).toHaveProperty("id", 2);
    expect(battleStore.answers[0]).toHaveProperty("answer", "test answer 1");

    expect(battleStore.answers[1]).toHaveProperty("id", 3);
    expect(battleStore.answers[1]).toHaveProperty("answer", "test answer 2");

    expect(battleStore.answers[2]).toHaveProperty("id", 31);
    expect(battleStore.answers[2]).toHaveProperty("answer", "test answer 3");
  });

  test("reset afkCounter on correct answer", async () => {
    battleStore.afkCounter = 1;
    battleStore.handleAnswer({
      isCorrect: true,
      answerString: "test answer 1",
    });
    await waitFor(100);
    expect(battleStore.afkCounter).toBe(0);
  });

  test("api in task is called", async () => {
    mainStore = useMainStore();
    battleStore.expand({
      data: [
        {
          api: "test-api",
          bonus_score: null,
          correct: "пасовать",
          id: 2,
          key: "1543",
          task: {
            answer: "пасовать",
            question: "pass",
            variants: ["пасовать", "закрывать"],
          },
        },
      ],
    });

    battleStore.handleAnswer({
      isCorrect: true,
      answerString: "test answer 1",
    });

    await waitFor(100);

    expect(makeRequest).toBeCalledWith({
      payload: {
        data: {
          answers: [
            {
              answer: "test answer 1",
              id: 2,
              key: "1543",
            },
          ],
          lastTaskId: 2,
        },
        key: "test-api",
      },
    });
  });

  test("calculate multiplier add correct amount of bolts on correct answer", async () => {
    dataStore = useDataStore();
    dataStore.set("profile", {
      store: {
        bolts: 0,
      },
    });

    // 1st answer
    battleStore.handleAnswer({
      isCorrect: true,
      answerString: "test answer 1",
    });

    await waitFor(100);
    expect(dataStore.profile.bolts).toEqual(1.2);

    // // 2nd answer
    battleStore.handleAnswer({
      isCorrect: true,
      answerString: "test answer 2",
    });

    await waitFor(100);
    expect(dataStore.profile.bolts).toEqual(3.6);

    // 3rd answer
    battleStore.handleAnswer({
      isCorrect: true,
      answerString: "test answer 3",
    });

    await waitFor(100);
    expect(dataStore.profile.bolts).toEqual(8.4);

    // 4th answer
    battleStore.handleAnswer({
      isCorrect: true,
      answerString: "test answer 4",
    });

    await waitFor(100);
    expect(dataStore.profile.bolts).toEqual(18);

    // 5th answer
    battleStore.handleAnswer({
      isCorrect: true,
      answerString: "test answer 5",
    });

    await waitFor(100);
    expect(dataStore.profile.bolts).toEqual(37.2);

    // 6th answer
    battleStore.handleAnswer({
      isCorrect: true,
      answerString: "test answer 6",
    });

    await waitFor(100);
    expect(dataStore.profile.bolts).toEqual(56.4);

    // 7th answer (wrong)
    battleStore.handleAnswer({
      isCorrect: false,
      answerString: "wrong test answer 7",
    });

    await waitFor(100);
    expect(dataStore.profile.bolts).toEqual(56.4);

    // 8th answer
    battleStore.handleAnswer({
      isCorrect: true,
      answerString: "test answer 8",
    });

    await waitFor(100);
    expect(dataStore.profile.bolts).toEqual(57.6);
  });

  test("calculate energy on answer", async () => {
    // correct answer
    battleStore.handleAnswer({
      isCorrect: true,
      answerString: "test answer 1",
    });
    await waitFor(100);
    expect(battleStore.data.energy).toEqual(11);

    // correct answer
    battleStore.handleAnswer({
      isCorrect: true,
      answerString: "test answer 2",
    });
    await waitFor(100);
    expect(battleStore.data.energy).toEqual(12);

    // wrong answer
    battleStore.handleAnswer({
      isCorrect: false,
      answerString: "test answer 3",
    });
    await waitFor(100);
    expect(battleStore.data.energy).toEqual(9);

    // wrong answer
    battleStore.handleAnswer({
      isCorrect: false,
      answerString: "test answer 4",
    });
    await waitFor(100);
    expect(battleStore.data.energy).toEqual(6);

    // correct answer
    battleStore.handleAnswer({
      isCorrect: true,
      answerString: "test answer 5",
    });
    await waitFor(100);
    expect(battleStore.data.energy).toEqual(7);
  });

  test("handle auto answer", async () => {
    battleStore.handleAnswer({
      autoAnswer: true,
    });
    await waitFor(100);
    expect(battleStore.data.energy).toEqual(10);
    expect(battleStore.afkCounter).toBe(1);
    expect(battleStore.answers.length).toEqual(1);
    expect(battleStore.answers[0]).toHaveProperty("id", 2);
    expect(battleStore.answers[0]).toHaveProperty("answer", "");

    battleStore.handleAnswer({
      autoAnswer: true,
    });
    await waitFor(100);
    expect(battleStore.data.energy).toEqual(10);
    expect(battleStore.afkCounter).toBe(2);
    expect(battleStore.answers.length).toEqual(2);
    expect(battleStore.answers[1]).toHaveProperty("id", 3);
    expect(battleStore.answers[1]).toHaveProperty("answer", "");
  });

  test("task index is being incremented on answer", async () => {
    battleStore.handleAnswer({
      isCorrect: true,
      answerString: "test answer 1",
    });
    await waitFor(100);
    expect(battleStore.currentTask.id).toEqual(3);

    battleStore.handleAnswer({
      isCorrect: false,
      answerString: "test answer 2",
    });
    await waitFor(100);
    expect(battleStore.currentTask.id).toEqual(31);
  });
});
