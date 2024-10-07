import { tg } from "@/api/telegram";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();

export const useBackButton = (callback) => {
  const show = () => {
    // console.log(`showing btn`);
    console.log(route);

    tg.BackButton.show();
    tg.BackButton.onClick(() => {
      tg.BackButton.hide();
      router.back();
    });
  };

  const hide = () => {
    console.log(`hiding btn`);

    tg.BackButton.hide();
  };

  return { show, hide };
};
