import constants from "@/constants";

const { botName, appName } = constants;

export const tg = window.Telegram?.WebApp;

export const showMainButton = ({ text, color, text_color }) => {
  tg?.MainButton.setParams({
    text,
    color,
    text_color,
  });

  tg?.MainButton.show();
};

export const hideMainButton = () => {
  tg?.MainButton.hide();
};

export const getUserId = () => {
  return tg?.initDataUnsafe?.user?.id;
};

export const getUserName = () => {
  return tg?.initDataUnsafe?.user?.username;
};

export const generateShareLink = () => {
  const userId = getUserId();
  return `https://t.me/${botName}/${appName}?startapp=fr${userId}`;
};

export const inviteFriend = (inviteMessage?: string) => {
  const link = generateShareLink();
  tg.openTelegramLink(`https://t.me/share/url?url=${link}&text=${inviteMessage}`);
};

export const followExternalLink = (url: string) => {
  tg.openLink(url, { try_instant_view: false });
};

export const setThemeColor = (color: string) => {
  tg?.setHeaderColor(color);
  tg?.setBackgroundColor(color);
  tg?.setBottomBarColor(color);
};

export const addToHomescreen = () => {
  tg.checkHomeScreenStatus((status) => {
    if (status !== "unsupported" || status !== "added") {
      tg.addToHomeScreen();
    }
  });
};
