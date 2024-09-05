import { Ref, ref } from "vue";
import { storeToRefs } from "pinia";

// stores
import { useDataStore } from "@/store/data";

// types
import { Task, Bonus } from "@/types";

export const useBattle = (defineCorrect: (answer: string, currentTask: Task, options?: {}) => boolean, el?: Ref<HTMLElement>) => {
  const dataStore = useDataStore();

  const { currentTask } = storeToRefs(dataStore.battles);
  const { onAnswer, onVibrate, onAnswerNew, fullStopTaskTimeout } = dataStore.battles;

  const bonuses = ref<Bonus[]>([]);
  let answerInProgress = false;

  const handleAnswer = async (answer: string, { clientX, clientY }: MouseEvent, options?: { [key: string]: any }) => {
    if (answerInProgress) return;

    fullStopTaskTimeout();

    answerInProgress = true;

    const correct = defineCorrect(answer, currentTask.value!, options);

    if (correct) {
      onVibrate("correct");
      await drawBonus({ x: clientX, y: clientY });
      await animateCorrect();
    } else {
      onVibrate("wrong");
      await animateWrong();
    }

    onAnswerNew({ isCorrect: correct, answerString: answer });

    answerInProgress = false;
  };

  const animateCorrect = () => {
    if (!el) return;

    return new Promise((res) => {
      el.value.classList.add("animate__heartBeat");

      setTimeout(() => {
        el.value.classList.remove("animate__heartBeat");
        res(true);
      }, 500);
    });
  };

  const animateWrong = () => {
    if (!el) return;

    return new Promise((res) => {
      el.value.classList.add("animate__headShake");

      setTimeout(() => {
        el.value.classList.remove("animate__headShake");
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

  return { bonuses, handleAnswer };
};
