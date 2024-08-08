const tg = window.Telegram?.WebApp;

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
