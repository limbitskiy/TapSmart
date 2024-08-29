export interface ResponseData {
  battles: Record<string, {}>;
  profile: Record<string, {}>;
  tutorial: Record<string, {}>;
  notification: Record<string, NotificationProps>;
}

export interface NotificationProps {
  title: string;
  subtitle: string;
  buttons: {};
  timeout: number;
}

export type LocaleSections = "tutorial" | "profile" | "battles" | "menu" | "friends" | "required-settings";

export type SettingsKeys = "sound" | "music" | "vibro";

export type DataSections = "tutorial" | "profile" | "battles" | "menu" | "friends";
