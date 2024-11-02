import { beforeAll, beforeEach, describe, expect, expectTypeOf, test } from "vitest";
import { useBattleStore } from "@/store/battle";
import { setActivePinia, createPinia } from "pinia";
import { ref } from "vue";
import { waitFor } from "@/utils";

const mockData = {
  battle_mode: "relax",
  battle_type: 1,
  boosters: {
    extra_mistake: {
      price: 0,
    },
    extra_time: {
      price: 0,
    },
    prize_fund: {
      price: 0,
    },
  },
  calc_points: [1, 2, 4, 8, 16],
  challenge_multiplicator: 17.3,
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
  mechanics: {
    "4answers": {
      bolts_bonus: 0,
      disabled: false,
      id: 2,
      order: 2,
      timeout: 5000,
    },
    audio_question: {
      bolts_bonus: 0,
      disabled: true,
      id: 4,
      league: 3,
      order: 4,
      timeout: 5000,
    },
    bubble_pairs: {
      bolts_bonus: 0,
      disabled: true,
      id: 3,
      league: 3,
      order: 6,
      timeout: 3000,
    },
    match_pairs: {
      bolts_bonus: 0,
      disabled: true,
      id: 5,
      league: 2,
      order: 3,
      timeout: 3000,
    },
    work_on_mistakes: {
      bolts_bonus: 0,
      disabled: true,
      id: 6,
      league: 4,
      order: 5,
      timeout: 0,
    },
    yesno: {
      bolts_bonus: 0,
      disabled: false,
      id: 1,
      order: 1,
      timeout: 3000,
    },
  },
  multiplicator: 1.2,
};

describe("challenge logic", () => {
  let battleStore;

  beforeAll(() => {
    // stub window object
    global.window = {
      showNotification: null,
    };
  });

  beforeEach(() => {
    setActivePinia(createPinia());
    battleStore = useBattleStore();
    battleStore.set(mockData);
    battleStore.stopChallenge();
    battleStore.startChallenge();
    // battleStore.handleAnswer({ isCorrect: true, answerString: "test answer" });
  });

  test("battle is started", () => {
    expect(battleStore.battleStarted).toBe(true);
  });

  test("battle is stopped", () => {
    battleStore.stopChallenge();
    expect(battleStore.battleStarted).toBe(false);
  });
});
