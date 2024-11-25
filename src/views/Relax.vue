<template>
  <div id="relax" class="p-4 flex-1 flex flex-col gap-2 overflow-hidden">
    <!-- bg image -->
    <BackgroundImage />

    <!-- profile widget -->
    <ProfileWidget />

    <ChallengeButton @challenge="openBoosterModal" />

    <!-- battle mechanic -->
    <BattleMechanic @changeMech="onChangeMech" @answer="onAnswer" @startChallenge="openBoosterModal" />

    <!-- mechanic change modal -->
    <Teleport to="#modals">
      <Modal id="mechanic-change-modal" v-model:visible="isChangeMechModalVisible">
        <ChangeMechanic />
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

// stores
import { useMainStore } from "@/store/main";

console.log(`relax created`);

const store = useMainStore();

const { fetchRelaxPageData, useFetch } = store;
const { debugMessages, bgColor, HTMLSnapshots } = storeToRefs(store);
const { battles: locale } = storeToRefs(store.localeStore);
const { data, afkCounter } = storeToRefs(store.battleStore);
const { stopRelax, setRelaxModal } = store.battleStore;

const isChangeMechModalVisible = ref(false);
const isNoEnergyVisible = ref(false);
const isBoostersModalVisible = ref(false);
const isAFKModalVisible = ref(false);

setThemeColor("#222");
bgColor.value = "linear-gradient(180deg, #000B14 17.5%, #035DA9 100%)";
HTMLSnapshots.value = [];

await fetchRelaxPageData();

const onAnswer = ({ isCorrect, answerString, nextTaskDelay, task }) => {
  if (data.value.energy === 0) {
    onNoEnergy();
  }
};

// watch opened modals
watch([isChangeMechModalVisible, isNoEnergyVisible, isBoostersModalVisible, isAFKModalVisible], (val) => {
  if (val.some((modal) => modal)) {
    setRelaxModal("open");
  } else {
    setRelaxModal("closed");
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
  if (val >= 1) {
    isAFKModalVisible.value = true;
  }
});

const onNoEnergy = () => {
  useFetch({ key: "option_activate", data: { type: "extra_energy", showModal: 1 } });
};

const onChangeMech = () => {
  isChangeMechModalVisible.value = true;
};

const openBoosterModal = () => {
  isBoostersModalVisible.value = true;
};

onMounted(() => {
  // startRelax();
  debugMessages.value = [];
});

onUnmounted(() => {
  stopRelax();
});
</script>
