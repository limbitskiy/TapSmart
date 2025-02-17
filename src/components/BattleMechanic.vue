<template>
  <Transition name="fade" mode="out-in">
    <component
      v-if="mountedMechanic"
      :is="mountedMechanic"
      :type="currentBattleMode"
      :locales="locale"
      :energy="data.energy"
      :taskTimeoutStatus="taskTimeoutStatus"
      :startTaskTimeout="startTaskTimeout"
      :pauseTaskTimeout="pauseTaskTimeout"
      :getNextTask="getNextTask"
      :relaxModalOpen="relaxModalOpen"
      :settings="settings"
      @answer="onAnswer"
      @changeMech="() => emit('changeMech')"
      @startChallenge="() => emit('startChallenge')"
    />
    <Loader v-else />
  </Transition>
</template>

<script setup lang="ts">
import { ref, Ref, computed, watch, onMounted, shallowRef, onUpdated } from "vue";
import { storeToRefs } from "pinia";
import { getAsset } from "@/utils";

// types
import { Task, AnswerProps } from "@/types";

// stores
import { useMainStore } from "@/store/main";

// battle mechanics
import YesNo from "@/components/battles/YesNo/YesNo.vue";
import FourAnswers from "@/components/battles/FourAnswers/FourAnswers.vue";
import MatchPairs from "@/components/battles/MatchPairs/MatchPairs.vue";
import AudioQuestion from "@/components/battles/AudioQuestion/AudioQuestion.vue";

console.log(`Battle Mech created`);

const emit = defineEmits<{
  answer: [payload: {}];
  startChallenge: [];
  changeMech: [];
}>();

defineProps<{
  taskTimeoutStatus: {};
  energy: Ref<number>;
  relaxModalOpen: Ref<boolean>;
  startTaskTimeout: () => void;
  pauseTaskTimeout: () => void;
}>();

const store = useMainStore();

// const { useFetch } = store;
const { battles: locale } = storeToRefs(store.localeStore);
const { settings } = storeToRefs(store.dataStore);
const { data, сurrentMechanicName, currentBattleMode } = storeToRefs(store.battleStore);
const { handleAnswer, getNextTask, resetBattleStats, resetBattleProcessor } = store.battleStore;

const mountedMechanic = shallowRef();

const mechMap = {
  yesno: YesNo,
  "4answers": FourAnswers,
  match_pairs: MatchPairs,
  audio_question: AudioQuestion,
};

// watching mechanic changes
watch(
  сurrentMechanicName,
  (val) => {
    if (val) {
      mountedMechanic.value = mechMap[val];
      resetBattleStats();
      resetBattleProcessor();
    }
  },
  {
    immediate: true,
  }
);

const onAnswer = async (props: AnswerProps) => {
  // if (task.settings?.isAds && task.api) {
  //   const res = await useFetch({ key: task.api, handleResponse: false });

  //   if (res?.action === "start-challenge") {
  //     emit("startChallenge");
  //   }
  //   return;
  // }

  handleAnswer(props);

  emit("answer", props);
};

onMounted(() => {
  console.log(`Battle Mech mounted`);
});

onUpdated(() => {
  console.log(`Battle Mech updated`);
});
</script>
