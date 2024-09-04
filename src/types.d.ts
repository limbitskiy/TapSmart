export interface ResponseData {
  battles: {};
  profile: {};
  tutorial: {};
  notification: NotificationProps;
}

export interface ResponseObject {
  data: ResponseData;
  entryPoint?: string | null;
  service: {};
  apiUrl?: string;
}

export interface MainState {
  entryPoint?: string | null;
  service?: {};
  apiUrl?: string | null;
}

export interface DataState {
  tutorial?: {};
  profile?: {
    bolts?: number;
  };
  menu?: {};
  friends?: {};
  tasks?: {};
  leaders?: {};
  market?: {};
  settings: Settings;
}

export interface BattleState {
  data?: Task[];
  mechanics?: {
    [key: string]: Mechanic;
  };
  battle_button_challenge?: {};
  energy: number;
  multiplicator?: number;
  calc_points?: number[];
  questions_left?: number;
}

export interface NotificationProps {
  title: string | null;
  subtitle: string | null;
  buttons: {};
  timeout?: number | undefined;
  isShown: boolean;
}

export interface Settings {
  sound: boolean;
  music: boolean;
  vibro: boolean;
}

export type LocaleSections = "tutorial" | "profile" | "battles" | "menu" | "friends" | "required-settings" | "leaders" | "market" | "tasks";

export type SettingsKeys = "sound" | "music" | "vibro";

export type DataSections = "tutorial" | "profile" | "battles" | "menu" | "friends" | "leaders" | "market" | "tasks";

export type BattleTypes = {
  readonly [x: number]: "yesno" | "4answers" | "bubble_pairs" | "audio_question";
};

export type Task = {
  correct: string;
  id: number;
  key: string;
  task: {
    answer: string;
    question: string;
    variants: string[];
  };
};

export type Mechanic = {
  bolts_bonus: number;
  disabled: boolean;
  id: number;
  league: number;
  nuts: number;
  timeout: number;
};
