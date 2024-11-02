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

    const foundIdx = answers.value.findIndex((answer) => answer.id === task!.id);

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
    // console.log(`Battle processor: `, battleData);

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

// const battleData = {
//   energy: 10,
//   nuts_package: [
//     {
//       nuts: 75,
//       package_id: 4,
//       stars: null,
//     },
//     {
//       nuts: 200,
//       package_id: 1,
//       stars: null,
//     },
//     {
//       nuts: 1000,
//       package_id: 2,
//       stars: null,
//     },
//     {
//       nuts: 3000,
//       package_id: 3,
//       stars: null,
//     },
//   ],
//   battle_duration: 5000,
//   battle_mode: "relax",
//   battle_type: 1,
//   boosters: {
//     extra_mistake: {
//       price: 0,
//     },
//     extra_time: {
//       price: 0,
//     },
//     prize_fund: {
//       price: 0,
//     },
//   },
//   breakpoint: 3000,
//   button_boost: {
//     api: "option_activate",
//     data: {
//       auxId: 1,
//       buttonAction: {
//         api: "battle_init",
//         data: {},
//       },
//       showModal: 1,
//       type: "boost_main",
//     },
//     disabled: false,
//   },
//   button_challenge: {
//     disabled: false,
//   },
//   calc_points: [1, 2, 4, 8, 16],
//   challenge_breakpoint: 0,
//   challenge_multiplicator: 17.3,
//   cleanAnswers: true,
//   data: [
//     {
//       api: null,
//       bonus_score: null,
//       correct: "звезда",
//       id: 1,
//       key: "1480",
//       task: {
//         answer: "интервью",
//         question: "star",
//         variants: ["интервью", "звезда"],
//       },
//     },
//     {
//       api: null,
//       bonus_score: null,
//       correct: "пасовать",
//       id: 2,
//       key: "1543",
//       task: {
//         answer: "тянуть",
//         question: "pass",
//         variants: ["тянуть", "пасовать"],
//       },
//     },
//     {
//       api: null,
//       bonus_score: null,
//       correct: "мост",
//       id: 3,
//       key: "1417",
//       task: {
//         answer: "мост",
//         question: "bridge",
//         variants: ["мост", "паб"],
//       },
//     },
//     {
//       api: null,
//       bonus_score: null,
//       correct: "выборы",
//       id: 4,
//       key: "1431",
//       task: {
//         answer: "организация",
//         question: "election",
//         variants: ["организация", "выборы"],
//       },
//     },
//     {
//       api: null,
//       bonus_score: null,
//       correct: "объяснять",
//       id: 5,
//       key: "1435",
//       task: {
//         answer: "объяснять",
//         question: "explain",
//         variants: ["объяснять", "помочь"],
//       },
//     },
//     {
//       api: null,
//       bonus_score: null,
//       correct: "прибывать",
//       id: 6,
//       key: "1437",
//       task: {
//         answer: "записывать",
//         question: "get",
//         variants: ["записывать", "прибывать"],
//       },
//     },
//     {
//       api: null,
//       bonus_score: null,
//       correct: "аморальный",
//       id: 7,
//       key: "1491",
//       task: {
//         answer: "аморальный",
//         question: "wrong",
//         variants: ["аморальный", "трудный"],
//       },
//     },
//     {
//       api: null,
//       bonus_score: null,
//       correct: "справедливый",
//       id: 8,
//       key: "1474",
//       task: {
//         answer: "пустой",
//         question: "right",
//         variants: ["пустой", "справедливый"],
//       },
//     },
//     {
//       api: null,
//       bonus_score: null,
//       correct: "нажать",
//       id: 9,
//       key: "1507",
//       task: {
//         answer: "нажать",
//         question: "click",
//         variants: ["нажать", "читать вслух"],
//       },
//     },
//     {
//       api: null,
//       bonus_score: null,
//       correct: "внизу",
//       id: 10,
//       key: "1429",
//       task: {
//         answer: "довольно",
//         question: "downstairs",
//         variants: ["довольно", "внизу"],
//       },
//     },
//     {
//       api: null,
//       bonus_score: null,
//       correct: "приземляться",
//       id: 11,
//       key: "1529",
//       task: {
//         answer: "закрывать",
//         question: "land",
//         variants: ["закрывать", "приземляться"],
//       },
//     },
//     {
//       api: null,
//       bonus_score: null,
//       correct: "называть",
//       id: 12,
//       key: "1419",
//       task: {
//         answer: "произносить по буквам",
//         question: "call",
//         variants: ["произносить по буквам", "называть"],
//       },
//     },
//     {
//       api: null,
//       bonus_score: null,
//       correct: "вместе",
//       id: 13,
//       key: "1484",
//       task: {
//         answer: "вместе",
//         question: "together",
//         variants: ["вместе", "на юг"],
//       },
//     },
//     {
//       api: null,
//       bonus_score: null,
//       correct: "папа",
//       id: 14,
//       key: "1427",
//       task: {
//         answer: "титул",
//         question: "daddy",
//         variants: ["титул", "папа"],
//       },
//     },
//     {
//       api: null,
//       bonus_score: null,
//       correct: "закрывать",
//       id: 15,
//       key: "1476",
//       task: {
//         answer: "закрывать",
//         question: "shut",
//         variants: ["закрывать", "кусать"],
//       },
//     },
//     {
//       api: null,
//       bonus_score: null,
//       correct: "бой",
//       id: 16,
//       key: "1518",
//       task: {
//         answer: "да",
//         question: "fight",
//         variants: ["да", "бой"],
//       },
//     },
//     {
//       api: null,
//       bonus_score: null,
//       correct: "обгореть",
//       id: 17,
//       key: "1502",
//       task: {
//         answer: "плакать",
//         question: "burn",
//         variants: ["плакать", "обгореть"],
//       },
//     },
//     {
//       api: null,
//       bonus_score: null,
//       correct: "воевать",
//       id: 18,
//       key: "1517",
//       task: {
//         answer: "успевать",
//         question: "fight",
//         variants: ["успевать", "воевать"],
//       },
//     },
//     {
//       api: null,
//       bonus_score: null,
//       correct: "зеркало",
//       id: 19,
//       key: "1538",
//       task: {
//         answer: "зеркало",
//         question: "mirror",
//         variants: ["зеркало", "ответ"],
//       },
//     },
//     {
//       api: null,
//       bonus_score: null,
//       correct: "успевать",
//       id: 20,
//       key: "1504",
//       task: {
//         answer: "успевать",
//         question: "catch",
//         variants: ["успевать", "практиковать"],
//       },
//     },
//     {
//       api: null,
//       bonus_score: null,
//       correct: "куртка",
//       id: 22,
//       key: "1448",
//       task: {
//         answer: "нация",
//         question: "jacket",
//         variants: ["нация", "куртка"],
//       },
//     },
//     {
//       api: null,
//       bonus_score: null,
//       correct: "любовь",
//       id: 23,
//       key: "1533",
//       task: {
//         answer: "стресс",
//         question: "love",
//         variants: ["стресс", "любовь"],
//       },
//     },
//     {
//       api: "battle_data_set",
//       bonus_score: null,
//       correct: "группа",
//       id: 24,
//       key: "1439",
//       task: {
//         answer: "группа",
//         question: "group",
//         variants: ["группа", "вес"],
//       },
//     },
//     {
//       api: null,
//       bonus_score: null,
//       correct: "готовить",
//       id: 25,
//       key: "1425",
//       task: {
//         answer: "читать вслух",
//         question: "cook",
//         variants: ["читать вслух", "готовить"],
//       },
//     },
//     {
//       api: null,
//       bonus_score: null,
//       correct: "прием пищи",
//       id: 26,
//       key: "1458",
//       task: {
//         answer: "ворота",
//         question: "meal",
//         variants: ["ворота", "прием пищи"],
//       },
//     },
//     {
//       api: null,
//       bonus_score: null,
//       correct: "ну",
//       id: 27,
//       key: "1488",
//       task: {
//         answer: "ну",
//         question: "well",
//         variants: ["ну", "только что"],
//       },
//     },
//     {
//       api: "battle_data_get",
//       bonus_score: null,
//       correct: "Земля",
//       id: 28,
//       key: "1512",
//       task: {
//         answer: "Земля",
//         question: "earth",
//         variants: ["Земля", "пустыня"],
//       },
//     },
//     {
//       api: null,
//       bonus_score: null,
//       correct: "звонить",
//       id: 29,
//       key: "1470",
//       task: {
//         answer: "переключиться",
//         question: "phone",
//         variants: ["переключиться", "звонить"],
//       },
//     },
//     {
//       api: null,
//       bonus_score: null,
//       correct: "карточка",
//       id: 30,
//       key: "1422",
//       task: {
//         answer: "карточка",
//         question: "card",
//         variants: ["карточка", "гид"],
//       },
//     },
//     {
//       api: null,
//       bonus_score: null,
//       correct: "группа",
//       id: 31,
//       key: "1413",
//       task: {
//         answer: "чашка",
//         question: "band",
//         variants: ["чашка", "группа"],
//       },
//     },
//     {
//       api: null,
//       bonus_score: null,
//       correct: "начальник",
//       id: 32,
//       key: "1499",
//       task: {
//         answer: "начальник",
//         question: "boss",
//         variants: ["начальник", "мусорное ведро"],
//       },
//     },
//   ],
//   mechanics: {
//     "4answers": {
//       bolts_bonus: 0,
//       disabled: false,
//       id: 2,
//       order: 2,
//       timeout: 5000,
//     },
//     audio_question: {
//       bolts_bonus: 0,
//       disabled: true,
//       id: 4,
//       league: 3,
//       order: 4,
//       timeout: 5000,
//     },
//     bubble_pairs: {
//       bolts_bonus: 0,
//       disabled: true,
//       id: 3,
//       league: 3,
//       order: 6,
//       timeout: 3000,
//     },
//     match_pairs: {
//       bolts_bonus: 0,
//       disabled: true,
//       id: 5,
//       league: 2,
//       order: 3,
//       timeout: 3000,
//     },
//     work_on_mistakes: {
//       bolts_bonus: 0,
//       disabled: true,
//       id: 6,
//       league: 4,
//       order: 5,
//       timeout: 0,
//     },
//     yesno: {
//       bolts_bonus: 0,
//       disabled: false,
//       id: 1,
//       order: 1,
//       timeout: 3000,
//     },
//   },
//   multiplicator: 1.2,
//   questions_left: 0,
//   waiting_breakpoint: 2000,
// };
