import { tg } from "@/api/telegram";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();

export const useBackButton = () => {
  tg.BackButton.show();
  tg.BackButton.onClick(() => {
    tg.BackButton.hide();
    if (route.query.from) {
      router.push(route.query.from);
    }
  });
};
