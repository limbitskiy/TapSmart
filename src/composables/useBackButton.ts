import { tg } from "@/api/telegram";
import { useRouter } from "vue-router";

const router = useRouter();

export const useBackButton = (callback) => {
  const show = () => {
    console.log(`showing btn`);

    tg.BackButton.show();
    tg.BackButton.onClick(() => {
      tg.BackButton.hide();
      callback();
    });
  };

  const hide = () => {
    console.log(`hiding btn`);

    tg.BackButton.hide();
  };

  return { show, hide };
};
