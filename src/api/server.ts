import axios from "axios";
import { RequestParams } from "@/types";
import { waitFor } from "@/utils";
import constants from "@/constants";

const { apiUrl: defaultApiUrl } = constants;

let lastCall = Date.now();

export const makeRequest = async ({ apiUrl, endPoint, payload }: RequestParams) => {
  const currentTime = Date.now();

  const deltaTime = currentTime - lastCall;

  if (deltaTime > 90000) {
    const pingResult = await axios.post(`${defaultApiUrl}/main`, {
      key: "ping",
      data: payload.data,
      service: payload.service,
    });
    const timeout = pingResult.data.data.requestTimeout;

    if (timeout) {
      await waitFor(timeout);
    }
  }

  lastCall = Date.now();
  // if (payload?.key === "tg_story") {
  //   debugMessages.value.push(`sending request to ${apiUrl ?? defaultApiUrl}${endPoint ?? "/main"} with payload: ${JSON.stringify(payload?.data)}`);
  // }
  return await axios.post(`${apiUrl ?? defaultApiUrl}${endPoint ?? "/main"}`, payload);
  // mocking response
  // return {
  //   data: {
  //     data: {
  //       battles: {
  //         locale: {
  //           "4answers_desc": "You have a choice among 4 variants",
  //           "4answers_title": "4 answers",
  //           audio_question_desc:
  //             "Listen to a word and find a proper translation",
  //           audio_question_title: "Audio question",
  //           available_boosters: "Select the battle rules",
  //           battle_complete_ad_text:
  //             "Get double \u003cbolt\u003e by making a zero TON transaction",
  //           battle_complete_bolts: "Bolts",
  //           battle_complete_nuts: "Nuts",
  //           battle_complete_place: "Place",
  //           battle_complete_title: "Battle completed",
  //           battle_results_ad_text: "Text",
  //           battle_results_ad_title: "Title",
  //           battle_results_title: "Battle results",
  //           booster_select_title: "Win and get a reward",
  //           bubble_pairs_desc: "Find a word and its translation among bubbles",
  //           bubble_pairs_title: "Bubble pairs",
  //           button_active: "Active",
  //           button_boost: "Boost",
  //           button_booster_friends: "Play with friends only",
  //           button_booster_select: "Run the globat battle",
  //           button_challenge: "Multiplayer",
  //           button_change_mech: "Change game",
  //           button_claim: "Claim {$.b_noton}\u003cseparate\u003e without TON",
  //           button_claim_with_ton:
  //             "Claim {$.b_ton}\u003cseparate\u003e with TON",
  //           button_coming_soon: "Coming soon",
  //           button_mechanic_select: "Select",
  //           button_no_answer_continue: "Continue",
  //           button_trial_message: "3 days",
  //           button_waiting_exit: "Exit",
  //           button_waiting_invite: "Invite friends",
  //           button_waiting_run: "Start",
  //           challenge_message:
  //             "%0A🔥I'm challenging you right now🔥%0A%0A✅Join my battle to check your coolness✅%0A",
  //           enable_boost: "Activate",
  //           error_title: "Here're the correct answers",
  //           extra_battle_time_text: "Add 10 seconds to the battle",
  //           extra_battle_time_title: "Extra time",
  //           extra_mistake_text:
  //             "Don't reset correct in-a-row bonus after the first mistake",
  //           extra_mistake_title: "Forgive mistake",
  //           friends_only: "With friends only",
  //           match_pairs_desc: "Click a question and then a proper answer",
  //           match_pairs_title: "Match pairs",
  //           no_answer_subtitle:
  //             "Select a correct answer as quick as you can to get rewards for practice of a foreign language",
  //           no_answer_title: "Please, concentrate!",
  //           no_energy_challenge_button: "Challenge",
  //           no_energy_subtitle:
  //             'Please play a battle to charge with energy. Click "Challenge" button to run a new battle.',
  //           no_energy_title: "Energy is over",
  //           select_mechanic_title: "Select a game",
  //           tooltip_battle_complete_ad:
  //             "Make a zero TON transaction using your TON wallet and double your bonus in bolts",
  //           tooltip_bonus: "Additional bonus for the mechanics",
  //           tooltip_energy:
  //             'Energy for trainings. Reduced by 3 for each incorrect answer. When used up, click "Multiplayer" button to challenge other players',
  //           tooltip_league:
  //             "This mechanics is free starting with this league, but you can buy a temporary access",
  //           waiting_subtitle:
  //             "Answer the questions as quick and correct as you can. It's a final countdown:",
  //           waiting_title: "Waiting for rivals...",
  //           work_on_mistakes_desc: "Watch video fragments with learning words",
  //           work_on_mistakes_title: "Work on mistakes",
  //           yesno_desc: "A battle with yes or no questions. The easiest battle",
  //           yesno_title: "Yes / No",
  //         },
  //         store: {
  //           battle_duration: 40000,
  //           battle_mode: "relax",
  //           battle_type: 1,
  //           boosters: {
  //             extra_mistake: {
  //               price: 0,
  //             },
  //             extra_time: {
  //               price: 0,
  //             },
  //           },
  //           breakpoint: 0,
  //           button_challenge: {
  //             disabled: false,
  //           },
  //           calc_points: [1, 2, 4, 8, 16],
  //           challenge_breakpoint: 0,
  //           challenge_multiplicator: 14.4,
  //           energy: 64,
  //           mechanics: {
  //             "4answers": {
  //               bolts_bonus: 0,
  //               disabled: false,
  //               id: 2,
  //               order: 2,
  //               timeout: 5000,
  //             },
  //             audio_question: {
  //               bolts_bonus: 0,
  //               disabled: true,
  //               id: 4,
  //               league: 3,
  //               order: 4,
  //               timeout: 5000,
  //             },
  //             bubble_pairs: {
  //               bolts_bonus: 0,
  //               disabled: true,
  //               id: 3,
  //               league: 3,
  //               order: 6,
  //               timeout: 3000,
  //             },
  //             match_pairs: {
  //               bolts_bonus: 0,
  //               disabled: true,
  //               id: 5,
  //               league: 2,
  //               order: 3,
  //               timeout: 3000,
  //             },
  //             work_on_mistakes: {
  //               bolts_bonus: 0,
  //               disabled: true,
  //               id: 6,
  //               league: 4,
  //               order: 5,
  //               timeout: 0,
  //             },
  //             yesno: {
  //               bolts_bonus: 0,
  //               disabled: false,
  //               id: 1,
  //               order: 1,
  //               timeout: 3000,
  //             },
  //           },
  //           multiplicator: 1,
  //           questions_left: 37,
  //           waiting_breakpoint: 2000,
  //         },
  //       },
  //       friends: {
  //         locale: {
  //           battles: "Battles",
  //           battles_played: "Battles played",
  //           bolts_earned: "Earned",
  //           friends_title: "My friends",
  //           income_title: "Friend's stats",
  //           invite_a_friend: "Invite a friend",
  //           invite_message:
  //             "%0AIntroducing the exciting word battle game on Telegram!🤩%0A%0A🔥Invite your friends, win battles and receive rewards!🔥%0A%0A🎁Jumpstart your adventure with a welcome reward of 5.000 Bolts!%0A%0A🎁🎁🎁And for our Telegram Premium users, enjoy an enhanced reward of 10.000 Bolts!%0A%0A✅TapSmart - Learn and earn.✅",
  //           online: "Online",
  //           points_earned: "Total score",
  //           premium_pill_subtitle: "\u003cb\u003e30,000\u003c/b\u003e",
  //           premium_pill_title: "With Telegram premium",
  //           subtitle:
  //             "Invite your friends, challenge them and earn 10x Bolts\u003cbr/\u003e\u003cbr/\u003eIf your friend is new to our battles, you'll gain invitation bonus:",
  //           tg_pill_subtitle: "\u003cb\u003e10,000\u003c/b\u003e",
  //           tg_pill_title: "Without Telegram premium",
  //           title: "My friends",
  //           tooltip_battles_played: "Total amount of battles with friends",
  //           tooltip_bolts_earned: "Your profit on your friends' activities",
  //           tooltip_points_earned: "Balance in friends' battles",
  //         },
  //       },
  //       leaders: {
  //         locale: {
  //           subtitle:
  //             "Soon: Practice regularly, jump on top of Leaderboard and be the coolest Tiger!\u003cbr/\u003e\u003cbr/\u003eGeneral and weekly leaderboards on leagues, languange levels and countries",
  //           title: "Leaderboards",
  //         },
  //       },
  //       market: {
  //         locale: {
  //           subtitle:
  //             "Soon: Exchange Nuts on real life goods and services\u003cbr/\u003e\u003cbr/\u003eExclusive offers, gift cards and exchange of unique promo codes",
  //           title: "Marketplace",
  //         },
  //       },
  //       menu: {
  //         store: {
  //           items: [
  //             {
  //               icon: "friends",
  //               id: 0,
  //               link: "/home/friends",
  //               title: "Friends",
  //             },
  //             { icon: "tasks", id: 1, link: "/home/tasks", title: "Tasks" },
  //             {
  //               icon: "battles",
  //               id: 2,
  //               link: "/start-relax",
  //               title: "Battles",
  //             },
  //             {
  //               icon: "leaders",
  //               id: 3,
  //               link: "/home/leaders",
  //               title: "Leaders",
  //             },
  //             { icon: "market", id: 4, link: "/home/market", title: "Market" },
  //           ],
  //         },
  //       },
  //       profile: {
  //         locale: {
  //           activity_subtitle:
  //             "Coming soon: Vocabulary and cool charts with your progress compared to your friends",
  //           activity_title: "My activities",
  //           battles_played: "Battles played",
  //           battles_played_today: "Played today",
  //           bolts: "Bolts",
  //           bolts_remain: "battles to the next league",
  //           bolts_today: "Bolts today",
  //           button_close: "Close",
  //           feedback: "Feedback",
  //           learning_title: "Learning progress",
  //           level: "Language level",
  //           modal_language_title: "Choose language",
  //           native_language: "Native language",
  //           nuts: "Nuts",
  //           nuts_today: "Nuts today",
  //           questions_learned: "Words learned",
  //           questions_learned_today: "Learned today",
  //           questions_remain: "words to learn to the next level",
  //           questions_repetition: "In repetition cycle",
  //           questions_trained: "Answers",
  //           questions_trained_today: "Trained today",
  //           settings_title: "Settings",
  //           stats_title: "Game statistics",
  //           subtitle: "Your statistics and account settings",
  //           target_language: "Target language",
  //           title: "Profile",
  //           tooltip_battles_played: "Total amount of played battles",
  //           tooltip_battles_won:
  //             "Amount of battles you've won in total and today",
  //           tooltip_bolts: "Bolts - smart coins for correct answers",
  //           tooltip_league:
  //             "The next league gives you 1.2x boost and training of word combinations",
  //           tooltip_level: 'Your language level (corresponds to "{$.dn}")',
  //           tooltip_nuts:
  //             "Nuts - energy coins to boost Bolts иand bying real and virtual goods",
  //           tooltip_questions_learned:
  //             "Total amount of learned words. Each new word should be repeated at least 6 times to get a learning status",
  //           tooltip_questions_repetition:
  //             "Amount of questions in spaced repetition to remember them firmly. Don't miss a daily training",
  //           tooltip_questions_trained:
  //             "Amount of questions you've answered in total and today",
  //         },
  //         store: {
  //           battles_played: 0,
  //           battles_played_today: 0,
  //           bolts: 809,
  //           bolts_remain: 625,
  //           bolts_today: 809,
  //           feedback_url: "https://google.com",
  //           league: 1,
  //           league_name: "Motley Stripes",
  //           league_progress: "0.1",
  //           level: 0,
  //           native_language: 2,
  //           native_language_list: [
  //             { id: 32, label: "العربية" },
  //             { id: 27, label: "Azərbaycan" },
  //             { id: 22, label: "Български" },
  //             { id: 39, label: "বাংলা।" },
  //             { id: 23, label: "Čeština" },
  //             { id: 9, label: "Dansk" },
  //             { id: 4, label: "Deutsch" },
  //             { id: 24, label: "Ελληνικά" },
  //             { id: 1, label: "English" },
  //             { id: 5, label: "Español" },
  //             { id: 13, label: "Eesti keel" },
  //             { id: 11, label: "Suomalainen" },
  //             { id: 42, label: "Filipino" },
  //             { id: 3, label: "Français" },
  //             { id: 31, label: "עברית" },
  //             { id: 38, label: "हिंदी" },
  //             { id: 17, label: "Hrvatski" },
  //             { id: 26, label: "Հայկական" },
  //             { id: 36, label: "Bahasa Indonesia" },
  //             { id: 7, label: "Italiano" },
  //             { id: 33, label: "日本語" },
  //             { id: 25, label: "ქართული" },
  //             { id: 28, label: "Қазақ" },
  //             { id: 35, label: "한국어" },
  //             { id: 30, label: "Кыргыз тили" },
  //             { id: 15, label: "Lietuvių" },
  //             { id: 14, label: "Latviešu" },
  //             { id: 8, label: "Nederlands" },
  //             { id: 12, label: "Norsk" },
  //             { id: 19, label: "Polski" },
  //             { id: 6, label: "Português" },
  //             { id: 21, label: "Română" },
  //             { id: 2, label: "Русский" },
  //             { id: 18, label: "Slovenski" },
  //             { id: 16, label: "Српски" },
  //             { id: 10, label: "Svenska" },
  //             { id: 41, label: "ภาษาไทย" },
  //             { id: 40, label: "Türkçe" },
  //             { id: 20, label: "Український" },
  //             { id: 29, label: "Oʻzbek" },
  //             { id: 37, label: "Tiếng Việt" },
  //             { id: 34, label: "中文" },
  //           ],
  //           nuts: 0,
  //           nuts_today: 0,
  //           questions_learned: 0,
  //           questions_learned_today: 0,
  //           questions_repetition: null,
  //           questions_trained: 0,
  //           questions_trained_today: 0,
  //           target_id: 1,
  //           target_language: 1,
  //           target_language_list: [
  //             { id: 32, label: "Arabic" },
  //             { id: 26, label: "Armenian" },
  //             { id: 27, label: "Azerbaijani" },
  //             { id: 39, label: "Bengali" },
  //             { id: 22, label: "Bulgarian" },
  //             { id: 34, label: "Chinese" },
  //             { id: 17, label: "Croatian" },
  //             { id: 23, label: "Czech" },
  //             { id: 9, label: "Danish" },
  //             { id: 8, label: "Dutch" },
  //             { id: 1, label: "English" },
  //             { id: 13, label: "Estonian" },
  //             { id: 42, label: "Filipino" },
  //             { id: 11, label: "Finnish" },
  //             { id: 3, label: "French" },
  //             { id: 25, label: "Georgian" },
  //             { id: 4, label: "German" },
  //             { id: 24, label: "Greek" },
  //             { id: 31, label: "Hebrew" },
  //             { id: 38, label: "Hindi" },
  //             { id: 36, label: "Indonesian" },
  //             { id: 7, label: "Italian" },
  //             { id: 33, label: "Japanese" },
  //             { id: 28, label: "Kazakh" },
  //             { id: 35, label: "Korean" },
  //             { id: 30, label: "Kyrgyz" },
  //             { id: 14, label: "Latvian" },
  //             { id: 15, label: "Lithuanian" },
  //             { id: 12, label: "Norwegian" },
  //             { id: 19, label: "Polish" },
  //             { id: 6, label: "Portuguese" },
  //             { id: 21, label: "Romanian" },
  //             { id: 16, label: "Serbian" },
  //             { id: 18, label: "Slovene" },
  //             { id: 5, label: "Spanish" },
  //             { id: 10, label: "Swedish" },
  //             { id: 41, label: "Thai" },
  //             { id: 40, label: "Turkish" },
  //             { id: 20, label: "Ukrainian" },
  //             { id: 29, label: "Uzbek" },
  //             { id: 37, label: "Vietnamese" },
  //           ],
  //           target_list: [{ id: 1, label: "Words \u0026 combinations" }],
  //         },
  //       },
  //       "required-settings": {
  //         locale: {
  //           button_next: "Check your level",
  //           subtitle:
  //             "Let's start with a quick test to check your language level. Please confirm your target and native languages",
  //           title: "Language settings",
  //         },
  //       },
  //       tasks: {
  //         locale: {
  //           subtitle: "Do tasks and earn even more Bolts and Nuts",
  //           title: "Tasks",
  //         },
  //       },
  //       tutorial: {
  //         locale: {
  //           button_back: "Back",
  //           button_finish: "Start",
  //           button_next: "Next",
  //           button_skip: "Skip",
  //         },
  //         store: {
  //           slides: [
  //             {
  //               "bg-color": "#1f2937",
  //               "bg-image": "tutorial-0",
  //               id: 0,
  //               subtitle:
  //                 "\u003cb\u003eTapSmart\u003c/b\u003e - Smart multiplayer battles. Your can earn real services using your brains",
  //               title: "Welcome to TapSmart",
  //               topic: "Profitable",
  //             },
  //             {
  //               "bg-color": "#281f37",
  //               "bg-image": "tutorial-1",
  //               id: 1,
  //               subtitle:
  //                 "Practice \u003cb\u003e500+ words\u003c/b\u003e in just 10 minutes. The word selection is based on the spaced repetition method",
  //               title: "Fast practice",
  //               topic: "Useful",
  //             },
  //             {
  //               "bg-color": "#27396d",
  //               "bg-image": "tutorial-2",
  //               id: 2,
  //               subtitle:
  //                 'Challenge your friends, accept chalennges from other clans. Prove, that you deserved to be a member of "Kings of Savannah" league',
  //               title: "Adrenaline at maximum",
  //               topic: "Funny",
  //             },
  //           ],
  //         },
  //       },
  //     },
  //     entryPoint: "/home/relax",
  //     service: {
  //       c: "b82c81df693f546e5008a35a568ce51a",
  //       s: {
  //         a: 1,
  //         ac: 1,
  //         aex: null,
  //         ag: {
  //           "0": 1,
  //           "1024": 0,
  //           "128": 0,
  //           "1280": 1,
  //           "1536": 22,
  //           "192": 0,
  //           "256": 1,
  //           "512": 1,
  //           "64": 0,
  //           "768": 2,
  //         },
  //         al: 1,
  //         am: 1,
  //         as: 1,
  //         at: 1,
  //         bg: "387582177443841",
  //         bt: 1,
  //         cc: 22,
  //         cg: 3,
  //         ci: 0,
  //         dq: 37,
  //         em: null,
  //         en: 10,
  //         et: null,
  //         fe: 0,
  //         hh: null,
  //         ld: 268,
  //         le: 1,
  //         lh: 1500000,
  //         ll: 1,
  //         lm: 0,
  //         lv: 0,
  //         nl: 2,
  //         o: null,
  //         os: 0,
  //         rf: 1,
  //         rg: 268,
  //         sr: 0,
  //         t: 23202242,
  //         tg: 1,
  //         tl: 1,
  //         tz: "Europe/Moscow",
  //         u: "1098776746",
  //         um: "1098776746",
  //       },
  //     },
  //   },
  // };
};

export const makeUploadRequest = async (formData: FormData) => {
  return await axios.post(`${defaultApiUrl}/ub/upload/file`, formData);
};

// first res
// {
//   "data": {
//       "battles": {
//           "locale": {
//               "4answers_desc": "You have a choice among 4 variants",
//               "4answers_title": "4 answers",
//               "audio_question_desc": "Listen to a word and find a proper translation",
//               "audio_question_title": "Audio question",
//               "available_boosters": "Select the battle rules",
//               "battle_complete_ad_text": "Get double <bolt> by making a zero TON transaction (only TON commission is charged)",
//               "battle_complete_bolts": "Bolts",
//               "battle_complete_nuts": "Nuts",
//               "battle_complete_place": "Place",
//               "battle_complete_title": "Battle completed",
//               "battle_results_ad_text": "Text",
//               "battle_results_ad_title": "Title",
//               "battle_results_title": "Battle results",
//               "booster_select_title": "Win and get a reward",
//               "bubble_pairs_desc": "Find a word and its translation among bubbles",
//               "bubble_pairs_title": "Bubble pairs",
//               "button_active": "Active",
//               "button_boost": "Boost",
//               "button_booster_friends": "Play with friends only",
//               "button_booster_select": "Run the globat battle",
//               "button_challenge": "Multiplayer",
//               "button_change_mech": "Change game",
//               "button_claim": "Claim {$.b_noton}<separate> without TON",
//               "button_claim_with_ton": "Claim {$.b_ton}<separate> with TON",
//               "button_coming_soon": "Coming soon",
//               "button_error_data_open_modal": "Correct answers",
//               "button_mechanic_select": "Select",
//               "button_no_answer_continue": "Continue",
//               "button_no_answers": "Continue",
//               "button_trial_message": "3 days",
//               "button_waiting_exit": "Exit",
//               "button_waiting_invite": "Invite friends",
//               "button_waiting_run": "Start",
//               "challenge_message": "%0A🔥I'm challenging you right now🔥%0A%0A✅Join my battle to check your coolness✅%0A",
//               "enable_boost": "Activate",
//               "error_data_title": "Total errors",
//               "error_title": "Here're the correct answers",
//               "extra_battle_time_text": "Add 10 seconds to the battle",
//               "extra_battle_time_title": "Extra time",
//               "extra_mistake_text": "Don't reset correct in-a-row bonus after the first mistake",
//               "extra_mistake_title": "Forgive mistake",
//               "friends_only": "With friends only",
//               "match_pairs_desc": "Click a question and find a proper answer",
//               "match_pairs_title": "Match pairs",
//               "no_answer_subtitle": "Select a correct answer as quick as you can to get rewards for practice of a foreign language",
//               "no_answer_title": "Please, concentrate!",
//               "no_answers_subtitle": "Choose a proper answer quickly, time is limited",
//               "no_answers_title": "No answers😕",
//               "no_energy_challenge_button": "Challenge",
//               "no_energy_subtitle": "Please play a battle to refill your energy. Click \"Challenge\" button to run a new battle.",
//               "no_energy_title": "Out of energy",
//               "select_mechanic_title": "Select a game",
//               "tooltip_battle_complete_ad": "Make a zero TON transaction using your TON wallet and double your bonus in bolts (only TON commission is charged)",
//               "tooltip_bonus": "Additional bonus for the game",
//               "tooltip_energy": "Energy for trainings. Reduced by 3 for each incorrect answer. When used up, click \"Multiplayer\" button to challenge other players",
//               "tooltip_league": "This game is free starting with this league, but you can buy a temporary access",
//               "waiting_subtitle": "Answer the questions as quick and correct as you can. It's a final countdown:",
//               "waiting_title": "Waiting for rivals...",
//               "work_on_mistakes_desc": "Watch video fragments with target words",
//               "work_on_mistakes_title": "Error correction",
//               "yesno_desc": "A battle with yes or no questions. The easiest battle",
//               "yesno_title": "Yes / No"
//           },
//           "store": {
//               "energy": "10"
//           }
//       },
//       "friends": {
//           "locale": {
//               "battles": "Battles",
//               "battles_played": "Battles played",
//               "bolts_earned": "Earned",
//               "friends_title": "My friends",
//               "income_title": "Friend's stats",
//               "invite_a_friend": "Invite a friend",
//               "invite_message": "%0AIntroducing the exciting word battle game on Telegram!🤩%0A%0A🔥Invite your friends, win battles and receive rewards!🔥%0A%0A🎁Jumpstart your adventure with a welcome reward of 5.000 Bolts!%0A%0A🎁🎁🎁And for our Telegram Premium users, enjoy an enhanced reward of 10.000 Bolts!%0A%0A✅TapSmart - Learn and earn.✅",
//               "online": "Online",
//               "points_earned": "Total score",
//               "premium_pill_subtitle": "<b>30,000</b>",
//               "premium_pill_title": "With Telegram premium",
//               "subtitle": "Invite your friends, challenge them and earn 10x Bolts<br/><br/>If your friend is new to our battles, you'll gain invitation bonus:",
//               "tg_pill_subtitle": "<b>10,000</b>",
//               "tg_pill_title": "Without Telegram premium",
//               "title": "My friends",
//               "tooltip_battles_played": "Total amount of battles with friends",
//               "tooltip_bolts_earned": "Your profit on your friends' activities",
//               "tooltip_points_earned": "Balance in friends' battles"
//           }
//       },
//       "leaders": {
//           "locale": {
//               "subtitle": "Soon: Practice regularly, jump on top of Leaderboard and be the coolest Tiger!<br/><br/>General and weekly leaderboards on leagues, languange levels and countries",
//               "title": "Leaderboards"
//           }
//       },
//       "market": {
//           "locale": {
//               "subtitle": "Soon: Exchange Nuts on real life goods and services<br/><br/>Exclusive offers, gift cards and exchange of unique promo codes",
//               "title": "Marketplace"
//           }
//       },
//       "menu": {
//           "store": {
//               "items": [
//                   {
//                       "icon": "friends",
//                       "id": 0,
//                       "link": "/home/friends",
//                       "title": "Friends"
//                   },
//                   {
//                       "icon": "tasks",
//                       "id": 1,
//                       "link": "/home/tasks",
//                       "title": "Tasks"
//                   },
//                   {
//                       "icon": "battles",
//                       "id": 2,
//                       "link": "/home/relax",
//                       "title": "Battles"
//                   },
//                   {
//                       "icon": "leaders",
//                       "id": 3,
//                       "link": "/home/leaders",
//                       "title": "Leaders"
//                   },
//                   {
//                       "icon": "market",
//                       "id": 4,
//                       "link": "/home/market",
//                       "title": "Market"
//                   }
//               ]
//           }
//       },
//       "profile": {
//           "locale": {
//               "activity_subtitle": "Coming soon: Vocabulary and cool charts with your progress compared to your friends",
//               "activity_title": "My activities",
//               "battles_played": "Battles played",
//               "battles_played_today": "Played today",
//               "bolts": "Bolts",
//               "bolts_remain": "battles to the next league",
//               "bolts_today": "Bolts today",
//               "button_close": "Close",
//               "feedback": "Feedback",
//               "learning_title": "Learning progress",
//               "level": "Language level",
//               "modal_language_title": "Choose language",
//               "native_language": "Native language",
//               "nuts": "Nuts",
//               "nuts_today": "Nuts today",
//               "questions_learned": "Words learned",
//               "questions_learned_today": "Learned today",
//               "questions_remain": "words to learn to the next level",
//               "questions_repetition": "In repetition cycle",
//               "questions_repetition_today": "Repeated today",
//               "questions_trained": "Answers",
//               "questions_trained_today": "Trained today",
//               "settings_title": "Settings",
//               "stats_title": "Game stats",
//               "subtitle": "Your stats and account settings",
//               "target_language": "Target language",
//               "title": "Profile",
//               "tooltip_battles_played": "Total amount of played battles",
//               "tooltip_battles_won": "Amount of battles you've won in total and today",
//               "tooltip_bolts": "Bolts - smart coins for correct answers",
//               "tooltip_league": "The next league gives you 1.2x boost and training of word combinations",
//               "tooltip_level": "Your language level estimated using detailed grade from 15 to 85. It's about \"A1\".",
//               "tooltip_nuts": "Nuts - energy coins to boost Bolts and buy real and virtual goods",
//               "tooltip_questions_learned": "Total number of learned words. Each new word should be repeated at least 6 times to remember",
//               "tooltip_questions_repetition": "Number of questions in spaced repetition to remember them firmly. Don't miss a daily training",
//               "tooltip_questions_trained": "Number of questions you've answered in total and today"
//           },
//           "store": {
//               "battles_played": 62,
//               "battles_played_today": 0,
//               "bolts": 36999,
//               "bolts_remain": 2099,
//               "bolts_today": 12000,
//               "feedback_url": "https://docs.google.com/forms/d/e/1FAIpQLScuwpfWlE1qi87ghGRNQvfl5pcViM2h-eRCs8PDJRnPqJO54w/viewform?usp=pp_url&entry.1591633300=Comments",
//               "league": 1,
//               "league_name": "Motley Stripes",
//               "league_progress": "2.5",
//               "level": 11,
//               "level_progress": "5.56",
//               "native_language": 2,
//               "native_language_list": [
//                   {
//                       "id": 32,
//                       "label": "العربية"
//                   },
//                   {
//                       "id": 27,
//                       "label": "Azərbaycan"
//                   },
//                   {
//                       "id": 22,
//                       "label": "Български"
//                   },
//                   {
//                       "id": 39,
//                       "label": "বাংলা।"
//                   },
//                   {
//                       "id": 23,
//                       "label": "Čeština"
//                   },
//                   {
//                       "id": 9,
//                       "label": "Dansk"
//                   },
//                   {
//                       "id": 4,
//                       "label": "Deutsch"
//                   },
//                   {
//                       "id": 24,
//                       "label": "Ελληνικά"
//                   },
//                   {
//                       "id": 1,
//                       "label": "English"
//                   },
//                   {
//                       "id": 5,
//                       "label": "Español"
//                   },
//                   {
//                       "id": 13,
//                       "label": "Eesti keel"
//                   },
//                   {
//                       "id": 11,
//                       "label": "Suomalainen"
//                   },
//                   {
//                       "id": 42,
//                       "label": "Filipino"
//                   },
//                   {
//                       "id": 3,
//                       "label": "Français"
//                   },
//                   {
//                       "id": 31,
//                       "label": "עברית"
//                   },
//                   {
//                       "id": 38,
//                       "label": "हिंदी"
//                   },
//                   {
//                       "id": 17,
//                       "label": "Hrvatski"
//                   },
//                   {
//                       "id": 26,
//                       "label": "Հայկական"
//                   },
//                   {
//                       "id": 36,
//                       "label": "Bahasa Indonesia"
//                   },
//                   {
//                       "id": 7,
//                       "label": "Italiano"
//                   },
//                   {
//                       "id": 33,
//                       "label": "日本語"
//                   },
//                   {
//                       "id": 25,
//                       "label": "ქართული"
//                   },
//                   {
//                       "id": 28,
//                       "label": "Қазақ"
//                   },
//                   {
//                       "id": 35,
//                       "label": "한국어"
//                   },
//                   {
//                       "id": 30,
//                       "label": "Кыргыз тили"
//                   },
//                   {
//                       "id": 15,
//                       "label": "Lietuvių"
//                   },
//                   {
//                       "id": 14,
//                       "label": "Latviešu"
//                   },
//                   {
//                       "id": 8,
//                       "label": "Nederlands"
//                   },
//                   {
//                       "id": 12,
//                       "label": "Norsk"
//                   },
//                   {
//                       "id": 19,
//                       "label": "Polski"
//                   },
//                   {
//                       "id": 6,
//                       "label": "Português"
//                   },
//                   {
//                       "id": 21,
//                       "label": "Română"
//                   },
//                   {
//                       "id": 2,
//                       "label": "Русский"
//                   },
//                   {
//                       "id": 18,
//                       "label": "Slovenski"
//                   },
//                   {
//                       "id": 16,
//                       "label": "Српски"
//                   },
//                   {
//                       "id": 10,
//                       "label": "Svenska"
//                   },
//                   {
//                       "id": 41,
//                       "label": "ภาษาไทย"
//                   },
//                   {
//                       "id": 40,
//                       "label": "Türkçe"
//                   },
//                   {
//                       "id": 20,
//                       "label": "Український"
//                   },
//                   {
//                       "id": 29,
//                       "label": "Oʻzbek"
//                   },
//                   {
//                       "id": 37,
//                       "label": "Tiếng Việt"
//                   },
//                   {
//                       "id": 34,
//                       "label": "中文"
//                   }
//               ],
//               "nuts": 0,
//               "nuts_today": 0,
//               "questions_learned": 8,
//               "questions_learned_today": 0,
//               "questions_remain": 17,
//               "questions_repetition": 34,
//               "questions_repetition_today": 0,
//               "questions_trained": 97,
//               "questions_trained_today": 0,
//               "target_id": 1,
//               "target_language": 1,
//               "target_language_list": [
//                   {
//                       "id": 32,
//                       "label": "Arabic"
//                   },
//                   {
//                       "id": 26,
//                       "label": "Armenian"
//                   },
//                   {
//                       "id": 27,
//                       "label": "Azerbaijani"
//                   },
//                   {
//                       "id": 39,
//                       "label": "Bengali"
//                   },
//                   {
//                       "id": 22,
//                       "label": "Bulgarian"
//                   },
//                   {
//                       "id": 34,
//                       "label": "Chinese"
//                   },
//                   {
//                       "id": 17,
//                       "label": "Croatian"
//                   },
//                   {
//                       "id": 23,
//                       "label": "Czech"
//                   },
//                   {
//                       "id": 9,
//                       "label": "Danish"
//                   },
//                   {
//                       "id": 8,
//                       "label": "Dutch"
//                   },
//                   {
//                       "id": 1,
//                       "label": "English"
//                   },
//                   {
//                       "id": 13,
//                       "label": "Estonian"
//                   },
//                   {
//                       "id": 42,
//                       "label": "Filipino"
//                   },
//                   {
//                       "id": 11,
//                       "label": "Finnish"
//                   },
//                   {
//                       "id": 3,
//                       "label": "French"
//                   },
//                   {
//                       "id": 25,
//                       "label": "Georgian"
//                   },
//                   {
//                       "id": 4,
//                       "label": "German"
//                   },
//                   {
//                       "id": 24,
//                       "label": "Greek"
//                   },
//                   {
//                       "id": 31,
//                       "label": "Hebrew"
//                   },
//                   {
//                       "id": 38,
//                       "label": "Hindi"
//                   },
//                   {
//                       "id": 36,
//                       "label": "Indonesian"
//                   },
//                   {
//                       "id": 7,
//                       "label": "Italian"
//                   },
//                   {
//                       "id": 33,
//                       "label": "Japanese"
//                   },
//                   {
//                       "id": 28,
//                       "label": "Kazakh"
//                   },
//                   {
//                       "id": 35,
//                       "label": "Korean"
//                   },
//                   {
//                       "id": 30,
//                       "label": "Kyrgyz"
//                   },
//                   {
//                       "id": 14,
//                       "label": "Latvian"
//                   },
//                   {
//                       "id": 15,
//                       "label": "Lithuanian"
//                   },
//                   {
//                       "id": 12,
//                       "label": "Norwegian"
//                   },
//                   {
//                       "id": 19,
//                       "label": "Polish"
//                   },
//                   {
//                       "id": 6,
//                       "label": "Portuguese"
//                   },
//                   {
//                       "id": 21,
//                       "label": "Romanian"
//                   },
//                   {
//                       "id": 16,
//                       "label": "Serbian"
//                   },
//                   {
//                       "id": 18,
//                       "label": "Slovene"
//                   },
//                   {
//                       "id": 5,
//                       "label": "Spanish"
//                   },
//                   {
//                       "id": 10,
//                       "label": "Swedish"
//                   },
//                   {
//                       "id": 41,
//                       "label": "Thai"
//                   },
//                   {
//                       "id": 40,
//                       "label": "Turkish"
//                   },
//                   {
//                       "id": 20,
//                       "label": "Ukrainian"
//                   },
//                   {
//                       "id": 29,
//                       "label": "Uzbek"
//                   },
//                   {
//                       "id": 37,
//                       "label": "Vietnamese"
//                   }
//               ],
//               "target_list": [
//                   {
//                       "id": 1,
//                       "label": "Words & combinations"
//                   }
//               ]
//           }
//       },
//       "required-settings": {
//           "locale": {
//               "button_next": "Check your level",
//               "subtitle": "Let's start with a quick test to check your language level. Please confirm your target and native languages",
//               "title": "Language settings"
//           }
//       },
//       "tasks": {
//           "locale": {
//               "subtitle": "Complete tasks and earn even more Bolts and Nuts",
//               "title": "Tasks"
//           }
//       },
//       "tutorial": {
//           "locale": {
//               "button_back": "Back",
//               "button_finish": "Start",
//               "button_next": "Next",
//               "button_skip": "Skip"
//           },
//           "store": {
//               "slides": [
//                   {
//                       "bg-color": "#1f2937",
//                       "bg-image": "tutorial-0",
//                       "id": 0,
//                       "subtitle": "<b>TapSmart</b> - Smart multiplayer battles. Your can earn real services using your brains",
//                       "title": "Welcome to TapSmart",
//                       "topic": "Profitable"
//                   },
//                   {
//                       "bg-color": "#281f37",
//                       "bg-image": "tutorial-1",
//                       "id": 1,
//                       "subtitle": "Practice <b>500+ words</b> in just 10 minutes. The word selection is based on the spaced repetition method",
//                       "title": "Fast practice",
//                       "topic": "Useful"
//                   },
//                   {
//                       "bg-color": "#27396d",
//                       "bg-image": "tutorial-2",
//                       "id": 2,
//                       "subtitle": "Challenge your friends, accept chalenges from other clans. Prove, that you deserved to be a member of \"Kings of Savannah\" league",
//                       "title": "Adrenaline at maximum",
//                       "topic": "Funny"
//                   }
//               ]
//           }
//       }
//   },
//   "entryPoint": "/home/relax",
//   "service": {
//       "c": "4aa5237032eb9640d545fc47638e106d",
//       "s": {
//           "a": 1,
//           "ac": 1,
//           "aex": null,
//           "ag": {
//               "0": 2,
//               "64": 0,
//               "128": 0,
//               "192": 8,
//               "256": 1,
//               "512": 1,
//               "768": 2,
//               "1024": 0,
//               "1280": 1,
//               "1536": 22
//           },
//           "al": 1,
//           "am": 1,
//           "as": 1,
//           "at": 1,
//           "bg": "387582177476610",
//           "bp": null,
//           "bt": 2,
//           "cc": 22,
//           "cg": 3,
//           "ci": 0,
//           "dq": 0,
//           "em": null,
//           "en": 10,
//           "et": null,
//           "fe": 0,
//           "hh": null,
//           "ld": 277,
//           "le": 1,
//           "lh": 1500000,
//           "ll": 1,
//           "lm": 0,
//           "lv": 11,
//           "nl": 2,
//           "o": 1,
//           "os": 0,
//           "rf": 1,
//           "rg": 268,
//           "sr": 0,
//           "t": 23977756,
//           "ta": 23977756,
//           "tg": 1,
//           "tl": 1,
//           "tz": "Europe/Moscow",
//           "u": "1098776746",
//           "um": "1098776746"
//       }
//   }
// }

// battle init
// {
//   "data": {
//       "battles": {
//           "locale": {
//               "button_boost": "🚀 2.9",
//               "button_challenge": "Multiplayer",
//               "button_challenge_tooltip": ""
//           },
//           "store": {
//               "battle_duration": 40000,
//               "battle_mode": "relax",
//               "battle_type": 2,
//               "boosters": {
//                   "extra_mistake": {
//                       "price": 0
//                   },
//                   "extra_time": {
//                       "price": 0
//                   }
//               },
//               "breakpoint": 3000,
//               "button_boost": {
//                   "disabled": true
//               },
//               "button_challenge": {
//                   "disabled": false
//               },
//               "calc_points": [
//                   1,
//                   2,
//                   4,
//                   8,
//                   16
//               ],
//               "challenge_breakpoint": 0,
//               "challenge_multiplicator": 41.8,
//               "cleanAnswers": true,
//               "data": [
//                   {
//                       "api": null,
//                       "correct": "ты",
//                       "id": 1,
//                       "key": "22",
//                       "task": {
//                           "answer": "ты",
//                           "question": "you",
//                           "variants": [
//                               "ты",
//                               "маленький",
//                               "работа",
//                               "все"
//                           ]
//                       }
//                   },
//                   {
//                       "api": null,
//                       "correct": "прощай",
//                       "id": 2,
//                       "key": "3",
//                       "task": {
//                           "answer": "Удачи!",
//                           "question": "goodbye",
//                           "variants": [
//                               "Удачи!",
//                               "прощай",
//                               "Доброе утро",
//                               "Спасибо"
//                           ]
//                       }
//                   },
//                   {
//                       "api": null,
//                       "correct": "отец",
//                       "id": 3,
//                       "key": "43",
//                       "task": {
//                           "answer": "мир",
//                           "question": "father",
//                           "variants": [
//                               "мир",
//                               "друг",
//                               "дерево",
//                               "отец"
//                           ]
//                       }
//                   },
//                   {
//                       "api": null,
//                       "correct": "нет",
//                       "id": 4,
//                       "key": "89",
//                       "task": {
//                           "answer": "нет",
//                           "question": "no",
//                           "variants": [
//                               "нет",
//                               "возможно",
//                               "здесь",
//                               "сейчас"
//                           ]
//                       }
//                   },
//                   {
//                       "api": null,
//                       "correct": "мужчина",
//                       "id": 5,
//                       "key": "83",
//                       "task": {
//                           "answer": "сестра",
//                           "question": "man",
//                           "variants": [
//                               "сестра",
//                               "люди",
//                               "мужчина",
//                               "книга"
//                           ]
//                       }
//                   },
//                   {
//                       "api": null,
//                       "correct": "ночь",
//                       "id": 6,
//                       "key": "28",
//                       "task": {
//                           "answer": "мир",
//                           "question": "night",
//                           "variants": [
//                               "мир",
//                               "ночь",
//                               "имя",
//                               "фермер"
//                           ]
//                       }
//                   },
//                   {
//                       "api": null,
//                       "correct": "их",
//                       "id": 7,
//                       "key": "107",
//                       "task": {
//                           "answer": "их",
//                           "question": "their",
//                           "variants": [
//                               "их",
//                               "Как?",
//                               "всегда",
//                               "автомобиль"
//                           ]
//                       }
//                   },
//                   {
//                       "api": null,
//                       "correct": "сейчас",
//                       "id": 8,
//                       "key": "15",
//                       "task": {
//                           "answer": "готовить",
//                           "question": "now",
//                           "variants": [
//                               "готовить",
//                               "часто",
//                               "сейчас",
//                               "год"
//                           ]
//                       }
//                   },
//                   {
//                       "api": null,
//                       "correct": "число",
//                       "id": 9,
//                       "key": "4578",
//                       "task": {
//                           "answer": "доска",
//                           "question": "number",
//                           "variants": [
//                               "доска",
//                               "язык",
//                               "число",
//                               "работа"
//                           ]
//                       }
//                   },
//                   {
//                       "api": null,
//                       "correct": "готовить",
//                       "id": 10,
//                       "key": "13",
//                       "task": {
//                           "answer": "хотел бы",
//                           "question": "make",
//                           "variants": [
//                               "хотел бы",
//                               "готовить",
//                               "жить",
//                               "спать"
//                           ]
//                       }
//                   },
//                   {
//                       "api": null,
//                       "correct": "новый",
//                       "id": 11,
//                       "key": "87",
//                       "task": {
//                           "answer": "впервые",
//                           "question": "new",
//                           "variants": [
//                               "впервые",
//                               "зеленый",
//                               "маленький",
//                               "новый"
//                           ]
//                       }
//                   },
//                   {
//                       "api": null,
//                       "correct": "ничего",
//                       "id": 12,
//                       "key": "92",
//                       "task": {
//                           "answer": "отправиться",
//                           "question": "nothing",
//                           "variants": [
//                               "отправиться",
//                               "что",
//                               "это...",
//                               "ничего"
//                           ]
//                       }
//                   },
//                   {
//                       "api": null,
//                       "correct": "делать",
//                       "id": 13,
//                       "key": "82",
//                       "task": {
//                           "answer": "сказать",
//                           "question": "make",
//                           "variants": [
//                               "сказать",
//                               "нравиться",
//                               "делать",
//                               "выходить"
//                           ]
//                       }
//                   },
//                   {
//                       "api": null,
//                       "correct": "это",
//                       "id": 14,
//                       "key": "11",
//                       "task": {
//                           "answer": "где",
//                           "question": "it",
//                           "variants": [
//                               "где",
//                               "ночь",
//                               "все",
//                               "это"
//                           ]
//                       }
//                   },
//                   {
//                       "api": null,
//                       "correct": "слушать",
//                       "id": 15,
//                       "key": "45",
//                       "task": {
//                           "answer": "слушать",
//                           "question": "listen",
//                           "variants": [
//                               "слушать",
//                               "ударить",
//                               "пойти",
//                               "закрыть"
//                           ]
//                       }
//                   },
//                   {
//                       "api": null,
//                       "correct": "покупать",
//                       "id": 16,
//                       "key": "25",
//                       "task": {
//                           "answer": "дверь",
//                           "question": "buy",
//                           "variants": [
//                               "дверь",
//                               "пить",
//                               "покупать",
//                               "слушать"
//                           ]
//                       }
//                   },
//                   {
//                       "api": null,
//                       "correct": "читать",
//                       "id": 17,
//                       "key": "31",
//                       "task": {
//                           "answer": "лететь",
//                           "question": "read",
//                           "variants": [
//                               "лететь",
//                               "слушать",
//                               "читать",
//                               "сказать"
//                           ]
//                       }
//                   },
//                   {
//                       "api": null,
//                       "correct": "лететь",
//                       "id": 18,
//                       "key": "54",
//                       "task": {
//                           "answer": "сказать",
//                           "question": "fly",
//                           "variants": [
//                               "сказать",
//                               "ударить",
//                               "бегать",
//                               "лететь"
//                           ]
//                       }
//                   },
//                   {
//                       "api": null,
//                       "correct": "стена",
//                       "id": 19,
//                       "key": "56",
//                       "task": {
//                           "answer": "дерево",
//                           "question": "wall",
//                           "variants": [
//                               "дерево",
//                               "стена",
//                               "школа",
//                               "игра"
//                           ]
//                       }
//                   },
//                   {
//                       "api": null,
//                       "correct": "чувствовать",
//                       "id": 20,
//                       "key": "68",
//                       "task": {
//                           "answer": "чувствовать",
//                           "question": "feel",
//                           "variants": [
//                               "чувствовать",
//                               "покупать",
//                               "приходить",
//                               "есть"
//                           ]
//                       }
//                   },
//                   {
//                       "api": null,
//                       "correct": "день",
//                       "id": 21,
//                       "key": "1",
//                       "task": {
//                           "answer": "растение",
//                           "question": "day",
//                           "variants": [
//                               "растение",
//                               "море",
//                               "ноябрь",
//                               "день"
//                           ]
//                       }
//                   },
//                   {
//                       "api": null,
//                       "correct": "дверь",
//                       "id": 22,
//                       "key": "40",
//                       "task": {
//                           "answer": "адрес",
//                           "question": "door",
//                           "variants": [
//                               "адрес",
//                               "дверь",
//                               "книга",
//                               "стол"
//                           ]
//                       }
//                   },
//                   {
//                       "api": null,
//                       "correct": "этот",
//                       "id": 23,
//                       "key": "109",
//                       "task": {
//                           "answer": "этот",
//                           "question": "this",
//                           "variants": [
//                               "этот",
//                               "автомобиль",
//                               "видеть",
//                               "месяц"
//                           ]
//                       }
//                   },
//                   {
//                       "api": "battle_data_set",
//                       "correct": "иметь",
//                       "id": 24,
//                       "key": "76",
//                       "task": {
//                           "answer": "лететь",
//                           "question": "have",
//                           "variants": [
//                               "лететь",
//                               "чистить",
//                               "думать",
//                               "иметь"
//                           ]
//                       }
//                   },
//                   {
//                       "api": null,
//                       "correct": "работа",
//                       "id": 25,
//                       "key": "37",
//                       "task": {
//                           "answer": "цвет",
//                           "question": "work",
//                           "variants": [
//                               "цвет",
//                               "работа",
//                               "имя",
//                               "день"
//                           ]
//                       }
//                   },
//                   {
//                       "api": null,
//                       "correct": "наш",
//                       "id": 26,
//                       "key": "18",
//                       "task": {
//                           "answer": "закончить",
//                           "question": "our",
//                           "variants": [
//                               "закончить",
//                               "больше",
//                               "наш",
//                               "маленький"
//                           ]
//                       }
//                   },
//                   {
//                       "api": null,
//                       "correct": "сказать",
//                       "id": 27,
//                       "key": "101",
//                       "task": {
//                           "answer": "закончить",
//                           "question": "say",
//                           "variants": [
//                               "закончить",
//                               "сказать",
//                               "слушать",
//                               "начать"
//                           ]
//                       }
//                   },
//                   {
//                       "api": "battle_data_get",
//                       "correct": "деньги",
//                       "id": 28,
//                       "key": "85",
//                       "task": {
//                           "answer": "деньги",
//                           "question": "money",
//                           "variants": [
//                               "деньги",
//                               "год",
//                               "супермаркет",
//                               "цена"
//                           ]
//                       }
//                   },
//                   {
//                       "api": null,
//                       "correct": "делать",
//                       "id": 29,
//                       "key": "64",
//                       "task": {
//                           "answer": "закончить",
//                           "question": "do",
//                           "variants": [
//                               "закончить",
//                               "делать",
//                               "посетить",
//                               "продавать"
//                           ]
//                       }
//                   },
//                   {
//                       "api": null,
//                       "correct": "имя",
//                       "id": 30,
//                       "key": "27",
//                       "task": {
//                           "answer": "письмо",
//                           "question": "name",
//                           "variants": [
//                               "письмо",
//                               "дверь",
//                               "учитель",
//                               "имя"
//                           ]
//                       }
//                   },
//                   {
//                       "api": null,
//                       "correct": "заглавная буква",
//                       "id": 31,
//                       "key": "52",
//                       "task": {
//                           "answer": "заглавная буква",
//                           "question": "capital",
//                           "variants": [
//                               "заглавная буква",
//                               "цвет",
//                               "учитель",
//                               "мужчина"
//                           ]
//                       }
//                   },
//                   {
//                       "api": null,
//                       "correct": "не",
//                       "id": 32,
//                       "key": "91",
//                       "task": {
//                           "answer": "никогда",
//                           "question": "not",
//                           "variants": [
//                               "никогда",
//                               "не",
//                               "всегда",
//                               "мир"
//                           ]
//                       }
//                   }
//               ],
//               "energy": 10,
//               "mechanics": {
//                   "4answers": {
//                       "bolts_bonus": 0,
//                       "disabled": false,
//                       "id": 2,
//                       "order": 2,
//                       "timeout": 5000
//                   },
//                   "audio_question": {
//                       "bolts_bonus": 0,
//                       "disabled": true,
//                       "id": 4,
//                       "league": 3,
//                       "order": 4,
//                       "timeout": 5000
//                   },
//                   "bubble_pairs": {
//                       "bolts_bonus": 0,
//                       "disabled": true,
//                       "id": 3,
//                       "league": 3,
//                       "order": 6,
//                       "timeout": 3000
//                   },
//                   "match_pairs": {
//                       "bolts_bonus": 0,
//                       "disabled": true,
//                       "id": 5,
//                       "league": 2,
//                       "order": 3,
//                       "timeout": 3000
//                   },
//                   "work_on_mistakes": {
//                       "bolts_bonus": 0,
//                       "disabled": true,
//                       "id": 6,
//                       "league": 4,
//                       "order": 5,
//                       "timeout": 0
//                   },
//                   "yesno": {
//                       "bolts_bonus": 0,
//                       "disabled": false,
//                       "id": 1,
//                       "order": 1,
//                       "timeout": 3000
//                   }
//               },
//               "multiplicator": 2.9,
//               "questions_left": 0,
//               "waiting_breakpoint": 2000
//           }
//       },
//       "menu": {
//           "store": {
//               "badges": [
//                   {
//                       "id": 1,
//                       "value": null
//                   },
//                   {
//                       "id": 0,
//                       "value": null
//                   }
//               ]
//           }
//       },
//       "profile": {
//           "store": {
//               "bolts": 36999,
//               "league_progress": "2.5",
//               "nuts": 0
//           }
//       }
//   },
//   "service": {
//       "c": "b37a099c9b8512d450deebadd4344e78",
//       "s": {
//           "a": 1,
//           "ac": 1,
//           "aex": null,
//           "ag": {
//               "0": 2,
//               "64": 0,
//               "128": 0,
//               "192": 8,
//               "256": 1,
//               "512": 1,
//               "768": 2,
//               "1024": 0,
//               "1280": 1,
//               "1536": 22
//           },
//           "al": 1,
//           "am": 1,
//           "as": 1,
//           "at": 1,
//           "be": 0,
//           "bg": "387582177476610",
//           "bp": null,
//           "bt": 2,
//           "cc": 22,
//           "cg": 3,
//           "ci": 0,
//           "cr": 0,
//           "dq": 0,
//           "em": null,
//           "en": 0,
//           "et": null,
//           "fe": 0,
//           "hh": null,
//           "iq": 0,
//           "ld": 277,
//           "le": 1,
//           "lh": 1500000,
//           "ll": 1,
//           "lm": 0,
//           "lv": 11,
//           "md": "relax",
//           "nl": 2,
//           "nt": 23977982,
//           "o": 1,
//           "os": 0,
//           "q": [
//               "1_22",
//               "2_3",
//               "3_43",
//               "4_89",
//               "5_83",
//               "6_28",
//               "7_107",
//               "8_15",
//               "9_4578",
//               "10_13",
//               "11_87",
//               "12_92",
//               "13_82",
//               "14_11",
//               "15_45",
//               "16_25",
//               "17_31",
//               "18_54",
//               "19_56",
//               "20_68",
//               "21_1",
//               "22_40",
//               "23_109",
//               "24_76",
//               "25_37",
//               "26_18",
//               "27_101",
//               "28_85",
//               "29_64",
//               "30_27",
//               "31_52",
//               "32_91"
//           ],
//           "rd": {},
//           "rf": 1,
//           "rg": 268,
//           "sr": 0,
//           "t": 23977982,
//           "ta": 23977979,
//           "tg": 1,
//           "tl": 1,
//           "tu": 23977982,
//           "tz": "Europe/Moscow",
//           "u": "1098776746",
//           "um": "1098776746"
//       }
//   }
// }
