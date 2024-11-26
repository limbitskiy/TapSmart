<template>
  <Transition name="fade" mode="out-in">
    <component
      v-if="mountedMechanic"
      :is="mountedMechanic"
      :type="currentBattleMode"
      :locales="locale"
      :startTaskTimeout="startTaskTimeout"
      :getNextTask="getNextTask"
      @answer="onAnswer"
      @changeMech="() => emit('changeMech')"
    />
    <Loader v-else />
  </Transition>

  <!-- bolt bonuses -->
  <div v-for="bonus in bonuses" :key="bonus.id" class="bonus bonus-animate z-20 flex gap-2 items-center absolute" :style="{ left: bonus.x + 'px', top: bonus.y + 'px' }">
    <img class="h-4 scale-150" :src="getAsset('bolt')" />
    <span class="font-bold text-xl">+{{ bonus.amount }}</span>
  </div>

  <!-- onscreen booster usage -->
  <div v-if="currentBattleMode === 'challenge'" class="boosters-cnt">
    <Transition name="challenge-bonus-1">
      <div v-if="boosterState.isShown" class="booster absolute top-[40dvh] left-0 right-0 grid place-items-center z-30">
        <div class="bonus">
          <span
            class="text-[8vw] exo-black text-[#edaa38]"
            style="
              background: linear-gradient(to top left, #ff75c3, #ffa647, #ffe83f, #9fff5b, #70e2ff, #cd93ff);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
            "
            >{{ boosterState.text }}</span
          >
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { getAsset } from "@/utils";

// types
import { Bonus, Task } from "@/types";

// stores
import { useMainStore } from "@/store/main";

// battle mechanics
import YesNo from "@/components/battles/YesNo/YesNo.vue";
import FourAnswers from "@/components/battles/FourAnswers.vue";
import MatchPairs from "@/components/battles/MatchPairs/MatchPairs.vue";

console.log(`Battle Mech created`);

interface MechanicAnswerProps {
  isCorrect: boolean;
  answerString: string;
  task: Task;
  event?: MouseEvent;
  drawBonus?: boolean;
  autoAnswer?: boolean;
}

const emit = defineEmits<{
  answer: [payload: {}];
  startChallenge: [];
  changeMech: [];
}>();

const store = useMainStore();

// const { useFetch, redirectTo } = store;
const { battles: locale } = storeToRefs(store.localeStore);
const { сurrentMechanicName, currentBattleMode, boostersUsed } = storeToRefs(store.battleStore);
const { handleAnswer, calculateRelaxMultiplierAmount, getNextTask, startTaskTimeout } = store.battleStore;

const bonuses = ref<Bonus[]>([]);
const mountedMechanic = ref();

const boosterState = ref({
  text: "",
  isShown: false,
  used: {},
});

const mechMap = {
  yesno: YesNo,
  "4answers": FourAnswers,
  match_pairs: MatchPairs,
};

watch(
  сurrentMechanicName,
  (val) => {
    if (val) {
      mountedMechanic.value = mechMap[val];
    }
  },
  {
    immediate: true,
  }
);

const onAnswer = async ({ isCorrect, answerString, event, drawBonus = true, task, autoAnswer = false }: MechanicAnswerProps) => {
  if (isCorrect && drawBonus) {
    drawBonusAnimation(event);
  }

  if (task.settings?.isAds && task.api) {
    const res = await handleAnswer({ isCorrect, answerString, task });

    if (res.action === "start-challenge") {
      emit("startChallenge");
    }
  } else {
    handleAnswer({ isCorrect, answerString, task, autoAnswer });
  }

  emit("answer", { isCorrect, answerString, task });
};

const drawBonusAnimation = ({ x, y }: { x: number; y: number }) => {
  const multiplier = calculateRelaxMultiplierAmount();
  const id = Date.now();

  bonuses.value.push({
    id,
    x: x - 20,
    y: y - 60,
    amount: Math.round(multiplier),
  });

  setTimeout(() => {
    const idx = bonuses.value.findIndex((item) => item.id === id);
    bonuses.value.splice(idx, 1);
  }, 700);

  return true;
};

const onBoosterUsed = (bonusName: string) => {
  const bonusLocale = locale?.value[`${bonusName}_title`];
  console.log(bonusLocale);

  boosterState.value.text = bonusLocale;
  boosterState.value.isShown = true;

  setTimeout(() => {
    boosterState.value.text = "";
    boosterState.value.isShown = false;

    boosterState.value.used[bonusName] = true;
  }, 1000);
};

if (currentBattleMode.value === "challenge") {
  // watch boosters
  watch(
    boostersUsed,
    (val) => {
      if (Object.keys(val).length) {
        Object.keys(val).forEach((bonus) => {
          if (!boosterState.value.used[bonus]) {
            onBoosterUsed(bonus);
          }
        });
      }
    },
    {
      deep: true,
    }
  );
}

onMounted(() => {
  console.log(`Battle Mech mounted`);
});
</script>
