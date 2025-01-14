export interface RequestParams {
  apiUrl: string;
  endPoint?: string;
  payload: {
    data: {};
    service: {};
  };
}

export interface ResponseData {
  battles: {};
  profile: {};
  tutorial: {};
  notification: NotificationProps;
  modal: ModalProps;
}

export interface ResponseObject {
  data: ResponseData;
  entryPoint?: string | null;
  externalUrl?: string | null;
  service: {};
  apiUrl?: string;
  action: string;
}

export interface MainState {
  entryPoint?: string | null;
  service?: {};
  apiUrl?: string | null;
  routeData: any;
}

export interface DataState {
  tutorial?: {};
  battles?: {};
  profile?: {
    bolts?: number;
  };
  menu?: {
    // items: [{ id: number; title: string; icon: string; link: string }];
    // badges: [{ id: number; value: string }];
  };
  friends?: {};
  tasks?: {};
  leaders?: {};
  market?: {};
  loader?: {};
  settings: Settings;
}

export interface BattleState {
  data?: Task[];
  mechanics?: {
    [key: string]: Mechanic;
  };
  boosters?: {
    [key: string]: Booster;
  };
  cleanAnswers: boolean;
  battle_button_challenge?: {};
  battle_extra_mistake?: 1 | 0;
  energy?: number;
  multiplicator?: number;
  calc_points?: number[];
  questions_left?: number;
  friends_only_badge?: number;
  battle_type: number;
  battle_mode?: "relax" | "challenge";
  breakpoint?: number;
  players_waiting?: [];
  waiting_timer?: number;
  player_progress?: [];
  battle_duration?: number;
  display_ads?: boolean;
  challenge_breakpoint?: number;
  waiting_breakpoint?: number;
}

export interface NotificationProps {
  title: string;
  subtitle: string;
  buttons: {
    left?: BackendButton;
    right?: BackendButton;
  };
  timeout?: number;
  isShown: boolean;
  fn: ReturnType<typeof setTimeout> | null;
}

export interface TooltipProps {
  text: null | string;
  element: null | HTMLElement;
  isShown: boolean;
  timeout: ReturnType<typeof setTimeout>;
}

export interface ModalProps {
  id: number;
  isShown: boolean;
  title: string;
  subtitle: string;
  isClosable: boolean;
  image?: string;
  buttons: {
    left?: BackendButton;
    right?: BackendButton;
  };
}

export interface BackendButton {
  label: string;
  isClose: boolean;
  api?: string;
  data?: {}; // any object
  route?: string;
  hidden?: boolean;
  disabled?: boolean;
  accent?: "orange" | "purple" | "black" | "grey" | "green" | "red";
  action?: "invite" | "tg_story_editor" | "add_to_home_screen";
}

export interface Settings {
  sound: boolean;
  music: boolean;
  vibro: boolean;
  subtitles: boolean;
}

export type Task = {
  correct: string;
  id: number;
  key: string;
  task: {
    answer: string;
    question: string;
    variants: string[];
  };
  api?: string;
  settings?: {
    timeout?: number;
    style: {
      question?: {};
      answer?: {};
      background?: string;
    };
  };
  action: {
    api: string;
    wait: boolean;
  };
};

export type Mechanic = {
  bolts_bonus: number;
  disabled: boolean;
  id: number;
  league: number;
  nuts: number;
  timeout: number;
  order: number;
};

export type Booster = {
  price: number;
  active?: boolean;
  button: BackendButton;
};

export interface AnswerProps {
  isCorrect: boolean;
  answerString: string;
  autoAnswer?: boolean;
  task?: Task;
  drawBonus?: boolean;
  event?: MouseEvent;
}

export interface Answer {
  id: number;
  key: string | number;
  answer: string;
  msec?: number;
}

export interface Bonus {
  id: number;
  x: number;
  y: number;
  amount: number;
}

// export type LocaleSection = "tutorial" | "profile" | "battles" | "menu" | "friends" | "required-settings" | "leaders" | "market" | "tasks" | "loader" | "intro";

export type BattleType = "yesno" | "4answers" | "bubble_pairs" | "audio_question" | "match_pairs" | "work_on_mistakes" | "picture_question";
