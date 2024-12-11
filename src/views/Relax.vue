<template>
  <div id="relax" class="p-4 flex-1 flex flex-col gap-2 overflow-hidden relative">
    <!-- bg image -->
    <BackgroundImage />

    <!-- profile widget -->
    <ProfileWidget />

    <ChallengeButton @challenge="openBoosterModal" />

    <!-- battle header -->
    <BattleHeader
      :taskTimeoutStatus="taskTimeoutStatus"
      :locale="locale"
      :title="headerTitle"
      :subtitle="сurrentMechanicName === 'audio_question'"
      @changeMech="onChangeMech"
      @subtitleClick="onSubtitleClick"
    />

    <!-- battle mechanic -->
    <BattleMechanic
      :startTaskTimeout="startTaskTimeout"
      :pauseTaskTimeout="pauseTaskTimeout"
      :taskTimeoutStatus="taskTimeoutStatus"
      :relaxModalOpen="relaxModalOpen"
      @changeMech="onChangeMech"
      @answer="onAnswer"
      @startChallenge="openBoosterModal"
    />

    <div class="html" v-html="html"></div>

    <!-- bolt bonuses -->
    <div v-for="bonus in bonuses" :key="bonus.id" class="bonus bonus-animate z-20 flex gap-2 items-center absolute" :style="{ left: bonus.x + 'px', top: bonus.y + 'px' }">
      <img class="h-4 scale-150" :src="getAsset('bolt')" />
      <span class="fira-bold text-xl">+{{ bonus.amount }}</span>
    </div>

    <!-- mechanic change modal -->
    <Teleport to="#modals">
      <Modal id="mechanic-change-modal" v-model:visible="isChangeMechModalVisible">
        <template v-slot="{ closeModal }">
          <ChangeMechanic @close="closeModal" />
        </template>
      </Modal>
    </Teleport>

    <!-- booster select modal -->
    <Teleport to="#modals">
      <Modal id="booster-select-modal" v-model:visible="isBoostersModalVisible">
        <BoosterSelect />
      </Modal>
    </Teleport>

    <!-- afk modal -->
    <Teleport to="#modals">
      <Modal id="afk-modal" v-model:visible="isAFKModalVisible" sticky>
        <template v-slot="{ closeModal }">
          <AFK @close="closeModal" />
        </template>
      </Modal>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted, onBeforeMount, onUnmounted } from "vue";
import { storeToRefs } from "pinia";
import { getAsset } from "@/utils";
import { tg, setThemeColor } from "@/api/telegram";

// types
import { Bonus, Task, AnswerProps } from "@/types";

// stores
import { useMainStore } from "@/store/main";
import { useTaskTimeout } from "@/composables/useTaskTimeout";

console.log(`relax created`);

const store = useMainStore();

const { fetchRelaxPageData, useFetch, hideTooltip, setBgColor } = store;
const { debugMessages, HTMLSnapshots } = storeToRefs(store);
const { battles: locale } = storeToRefs(store.localeStore);
const { toggleSetting } = store.dataStore;
const { data, afkCounter, сurrentMechanicName, backendModalOpen, relaxPaused, startChallengeModalOpened } = storeToRefs(store.battleStore);
const { startBreakpoint, stopBreakpoint, calculateRelaxMultiplierAmount } = store.battleStore;

const isChangeMechModalVisible = ref(false);
const isNoEnergyVisible = ref(false);
const isBoostersModalVisible = ref(false);
const isAFKModalVisible = ref(false);
const relaxModalOpen = ref(false);

const bonuses = ref<Bonus[]>([]);

const { taskTimeoutStatus, startTaskTimeout: _startTaskTimeout, stopTaskTimeout, pauseTaskTimeout, resumeTaskTimeout } = useTaskTimeout();

setThemeColor("#222");
setBgColor("linear-gradient(180deg, #000B14 17.5%, #035DA9 100%");
HTMLSnapshots.value = [];

const html = ref(``);

await fetchRelaxPageData();

// watch opened modals
watch([isChangeMechModalVisible, isNoEnergyVisible, isBoostersModalVisible, isAFKModalVisible, backendModalOpen, relaxPaused], (val) => {
  if (val.some((flag) => flag)) {
    stopBreakpoint();
    hideTooltip();
    pauseTaskTimeout();
    relaxModalOpen.value = true;
  } else {
    afkCounter.value = 0;
    startBreakpoint("battle");
    hideTooltip();
    resumeTaskTimeout();
    relaxModalOpen.value = false;
  }
});

// watch energy
watch(
  () => data.value.energy,
  (val) => {
    if (val === 0) {
      onNoEnergy();
    }
  }
);

// watch afk counter
watch(afkCounter, (val) => {
  if (val >= 3) {
    isAFKModalVisible.value = true;
  }
});

// watch for external opening of start challenge modal
watch(startChallengeModalOpened, () => {
  isBoostersModalVisible.value = true;
});

const headerTitle = computed(() => locale.value[`${сurrentMechanicName.value}_title`]);

const startTaskTimeout = (customTimeout?: number) => {
  if (afkCounter.value < 3) {
    _startTaskTimeout(customTimeout);
  }
};

const onAnswer = ({ isCorrect, answerString, drawBonus = true, task, event }: AnswerProps) => {
  if (data.value.energy === 0) {
    onNoEnergy();
  }

  if (isCorrect && drawBonus) {
    drawBonusAnimation(event);
  }

  // console.log(`✅ answer`);
};

const onNoEnergy = () => {
  useFetch({ key: "option_activate", data: { type: "extra_energy", showModal: 1 } });
};

const onChangeMech = () => {
  isChangeMechModalVisible.value = true;
};

const openBoosterModal = () => {
  isBoostersModalVisible.value = true;
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

const onSubtitleClick = () => {
  toggleSetting("subtitles");
};

onMounted(() => {
  startBreakpoint("battle");
  debugMessages.value = [];
});

onUnmounted(() => {
  stopBreakpoint();
});
</script>
