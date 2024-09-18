import { computed } from "vue";
import constants from "@/constants";

const { botName, appName } = constants;

export const tg = window.Telegram?.WebApp;

export const showMainButton = () => {
  tg?.MainButton.setParams({
    text: "Invite friends",
    color: "#FD911E",
    text_color: "#222",
  });

  tg?.MainButton.show();
};

export const getUserId = () => {
  return tg?.initDataUnsafe?.user?.id;
};

export const getUserName = () => {
  return tg?.initDataUnsafe?.user?.username;
};

export const userId = computed(() => tg?.initDataUnsafe?.user?.id);

export const userName = computed(() => tg?.initDataUnsafe?.user?.username);

export const generateShareLink = () => {
  return `https://t.me/${botName}/${appName}?startapp=fr${userId.value}`;
};

export const inviteFriend = (inviteMessage?: string) => {
  const link = generateShareLink();
  tg.openTelegramLink(`https://t.me/share/url?url=${link}&text=${inviteMessage}`);
};
