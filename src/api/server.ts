import axios from "axios";
import { RequestParams } from "@/types";
import { waitFor } from "@/utils";
import constants from "@/constants";

const { apiUrl: defaultApiUrl } = constants;

let lastCall = Date.now();

export const makeRequest = async ({ apiUrl, payload }: RequestParams) => {
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

  return await axios.post(`${apiUrl ?? defaultApiUrl}/main`, payload);
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
