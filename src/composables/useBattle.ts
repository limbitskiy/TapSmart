import { Ref, ref } from "vue";
import { storeToRefs } from "pinia";

// stores
import { useDataStore } from "@/store/data";
import { useMainStore } from "@/store/main";

// types
import { Task, Bonus } from "@/types";

export const useBattle = (type: "relax" | "challenge", el?: Ref<HTMLElement>) => {
  const dataStore = useDataStore();
  const mainStore = useMainStore();

  const { onVibrate } = mainStore;
  const { data } = storeToRefs(dataStore.battles);
  const { handleRelaxAnswer, handleChallengeAnswer, stopTaskTimeout } = dataStore.battles;

  const bonuses = ref<Bonus[]>([]);
  let answerInProgress = false;

  const onAnswer = async (isCorrect: boolean, { clientX, clientY }: MouseEvent, answer: string) => {
    if (data.value.battle_mode === "relax" && data.value.energy == 0) return;
    if (answerInProgress) return;

    stopTaskTimeout();

    answerInProgress = true;

    if (isCorrect) {
      onVibrate("correct");
      await drawBonus({ x: clientX, y: clientY });
      await animateCorrect();
    } else {
      onVibrate("wrong");
      await animateWrong();
    }

    if (type === "relax") {
      handleRelaxAnswer({ isCorrect, answerString: answer });
    } else if (type === "challenge") {
      handleChallengeAnswer({ isCorrect, answerString: answer });
    }

    answerInProgress = false;
  };

  const animateCorrect = () => {
    if (!el?.value) return;

    return new Promise((res) => {
      el.value.classList.add("animate__heartBeat");

      setTimeout(() => {
        if (el.value) {
          el.value.classList.remove("animate__heartBeat");
        }
        res(true);
      }, 500);
    });
  };

  const animateWrong = () => {
    if (!el) return;

    return new Promise((res) => {
      el.value.classList.add("animate__headShake");

      setTimeout(() => {
        if (el.value) {
          el.value.classList.remove("animate__headShake");
        }
        res(true);
      }, 500);
    });
  };

  const drawBonus = ({ x, y }: { x: number; y: number }) => {
    const id = Date.now();

    bonuses.value.push({
      id,
      x: x - 20,
      y: y - 60,
    });

    setTimeout(() => {
      const idx = bonuses.value.findIndex((item) => item.id === id);
      bonuses.value.splice(idx, 1);
    }, 700);

    return true;
  };

  return { bonuses, onAnswer };
};
