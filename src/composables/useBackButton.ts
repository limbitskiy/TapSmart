import { tg } from "@/api/telegram";
import { useRouter } from "vue-router";

const router = useRouter();

export const useBackButton = () => {
  tg.BackButton.show();
  tg.BackButton.onClick(() => {
    tg.BackButton.hide();
    router.back();
  });
};
