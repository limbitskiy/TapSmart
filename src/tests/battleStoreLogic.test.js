import { beforeAll, beforeEach, describe, expect, expectTypeOf, test } from "vitest";
import { useBattleStore } from "@/store/battle";
import { setActivePinia, createPinia } from "pinia";

const mockData = {
  battle_duration: 5000,
  battle_mode: "relax",
  battle_type: 1,
  boosters: {
    extra_mistake: {
      active: 0,
      button: {
        api: "option_activate",
        data: {
          auxId: 1,
          buttonAction: {
            data: {},
          },
          showModal: 1,
          type: "extra_mistake",
        },
        disabled: false,
        label: "<nut>200 или реклама",
      },
      price: 200,
    },
    extra_time: {
      price: 0,
    },
    prize_fund: {
      price: 0,
    },
  },
  breakpoint: 3000,
  button_boost: {
    api: "option_activate",
    data: {
      auxId: 1,
      buttonAction: {
        api: "battle_init",
        data: {},
      },
      showModal: 1,
      type: "boost_main",
    },
    disabled: false,
  },
  button_challenge: {
    disabled: false,
  },
  calc_points: [1, 2, 4, 8, 16],
  challenge_breakpoint: 0,
  challenge_multiplicator: 17.3,
  cleanAnswers: true,
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
  questions_left: 0,
  waiting_breakpoint: 2000,
};

describe("battle store logic", () => {
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
  });

  test("data is being set", () => {
    const { data } = battleStore;

    expect(data).not.toBeNull();
    expect(data).toBeInstanceOf(Object);
  });

  test("expand tasks with same id", () => {
    const { data } = battleStore;

    battleStore.expand({
      data: [
        {
          api: null,
          bonus_score: null,
          correct: "тестовая замена",
          id: 3,
          key: "1480",
          task: {
            answer: "тестовая звезда",
            question: "test1",
            variants: ["тест1", "тест2"],
          },
        },
      ],
    });

    const foundItem = data.data.find((item) => item.id === 3);
    expect(foundItem.correct).toBe("тестовая замена");
    expect(foundItem.task.answer).toBe("тестовая звезда");
    expect(foundItem.task.question).toBe("test1");
  });

  test("expand tasks with new id (basically just set a task)", () => {
    const { data } = battleStore;

    battleStore.expand({
      data: [
        {
          api: null,
          bonus_score: null,
          correct: "тестовая задача",
          id: 999,
          key: "1480",
          task: {
            answer: "тестовая звезда",
            question: "test1",
            variants: ["тест1", "тест2"],
          },
        },
      ],
    });

    const foundItem = data.data.find((item) => item.id === 999);
    expect(foundItem.correct).toBe("тестовая задача");
    expect(foundItem.task.answer).toBe("тестовая звезда");
    expect(foundItem.task.question).toBe("test1");
  });

  test.todo("expand any data of type array");
  test("expand any data of type object", () => {
    battleStore.expand({
      boosters: {
        extra_mistake: {
          active: 1,
          price: 0,
        },
      },
    });

    expect(battleStore.data.boosters.extra_mistake.active).toEqual(1);
    expect(battleStore.data.boosters.extra_mistake.price).toEqual(0);
  });
});

// task timeout tests

// breakpoint tests
