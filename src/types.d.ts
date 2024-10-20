export interface RequestParams {
  apiUrl: string;
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
}

export interface MainState {
  entryPoint?: string | null;
  service?: {};
  apiUrl?: string | null;
  routeData: any;
}

export interface DataState {
  tutorial?: {};
  profile?: {
    bolts?: number;
  };
  menu?: {
    items: [{ id: number; title: string; icon: string; link: string }];
    badges: [{ id: number; value: string }];
  };
  friends?: {};
  tasks?: {};
  leaders?: {};
  market?: {};
  settings: Settings;
}

export interface LocaleState {
  tutorial?: LocaleEntry;
  profile?: LocaleEntry;
  menu?: LocaleEntry;
  friends?: LocaleEntry;
  battles?: LocaleEntry;
  "required-settings"?: LocaleEntry;
  tasks?: LocaleEntry;
  leaders?: LocaleEntry;
  market?: LocaleEntry;
}

export interface BattleState {
  data?: Task[];
  mechanics?: {
    [key: string]: Mechanic;
  };
  boosters?: {
    [key: string]: Booster;
  };
  battle_button_challenge?: {};
  energy?: number;
  multiplicator?: number;
  calc_points?: number[];
  questions_left?: number;
  friends_only_badge?: number;
  battle_type?: number;
  breakpoint?: number;
  players_waiting?: [];
  waiting_timer?: number;
  player_progress?: [];
  battle_duration?: number;
}

export interface NotificationProps {
  title: string | null;
  subtitle: string | null;
  buttons: {
    [key in "left" | "right"]: { hidden?: boolean; route?: string; api?: string; data?: {}; label?: string };
  };
  timeout?: number | null;
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
  title: string | null;
  subtitle: string | null;
  image?: string | null;
  buttons?: {};
  isShown: boolean;
}

export interface Settings {
  sound: boolean;
  music: boolean;
  vibro: boolean;
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
};

export type LocaleEntry = {
  [key: string]: string;
};
export interface AnswerProps {
  isCorrect: boolean;
  answerString: string;
  subtractEnergyAmount?: number;
  nextTaskDelay?: number;
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
}

export type LocaleSections = "tutorial" | "profile" | "battles" | "menu" | "friends" | "required-settings" | "leaders" | "market" | "tasks";

export type SettingsKeys = "sound" | "music" | "vibro";

export type DataSections = "tutorial" | "profile" | "battles" | "menu" | "friends" | "leaders" | "market" | "tasks";

export type BattleTypes = {
  readonly [x: number]: "yesno" | "4answers" | "bubble_pairs" | "audio_question" | "match_pairs" | "work_on_mistakes";
};
