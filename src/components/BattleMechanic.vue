<template>
  <Transition name="fade" mode="out-in">
    <component
      v-if="mountedMechanic"
      :is="mountedMechanic"
      :type="currentBattleMode"
      :task="currentTask"
      :locales="locale"
      :energy="data?.energy"
      :buttonsBlocked="buttonsBlocked"
      @answer="onAnswer"
    />
    <Loader v-else />
  </Transition>

  <!-- bolt bonuses -->
  <div v-for="bonus in bonuses" :key="bonus.id" class="bonus bonus-animate z-20 flex gap-2 items-center absolute" :style="{ left: bonus.x + 'px', top: bonus.y + 'px' }">
    <img class="h-4 scale-150" :src="getAsset('bolt')" />
    <span class="font-bold text-xl">+2</span>
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
import { Bonus } from "@/types";

// stores
import { useMainStore } from "@/store/main";

// battle mechanics
import YesNo from "@/components/battles/YesNo.vue";
import FourAnswers from "@/components/battles/FourAnswers.vue";

console.log(`Battle Mech created`);

interface AnswerProps {
  isCorrect: boolean;
  answer: string;
  event: MouseEvent;
  drawBonus?: boolean;
}

const store = useMainStore();

// const { useFetch, redirectTo } = store;
const { battles: locale } = storeToRefs(store.localeStore);
const { data, сurrentMechanicName, currentTask, currentBattleMode, boostersUsed } = storeToRefs(store.battleStore);
const { handleBattleAnswer } = store.battleStore;

const bonuses = ref<Bonus[]>([]);

const boosterState = ref({
  text: "",
  isShown: false,
  used: {},
});

const mechMap = {
  yesno: YesNo,
  "4answers": FourAnswers,
};

const buttonsBlocked = ref(false);

const mountedMechanic = computed(() => mechMap[сurrentMechanicName.value]);

const onAnswer = async ({ isCorrect, answer, event, drawBonus = true, nextTaskDelay }: AnswerProps) => {
  if (isCorrect && drawBonus) {
    drawBonusAnimation(event);
  }
  handleBattleAnswer({ isCorrect, answerString: answer, nextTaskDelay });
};

const drawBonusAnimation = ({ x, y }: { x: number; y: number }) => {
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

  // watch(challengeTimer, (val) => {
  // if (val === 0) {
  //   setTimeout(() => {
  //     onEndChallenge();
  //   }, 500);
  // }
  // block buttons before challenge end
  // if (val === 1000) {
  //   buttonsBlocked.value = true;
  // }
  // });
}

if (currentBattleMode.value === "relax") {
  watch(currentTask, (val) => {
    if (val) {
      buttonsBlocked.value = true;
      setTimeout(() => {
        buttonsBlocked.value = false;
      }, 500);
    }
  });
}

onMounted(() => {
  console.log(`Battle Mech mounted`);
});
</script>
