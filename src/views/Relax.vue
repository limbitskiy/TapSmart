<template>
  <div id="relax" class="p-4 flex-1 flex flex-col gap-2 overflow-hidden">
    <!-- bg image -->
    <BackgroundImage />

    <!-- create gif button -->
    <!-- <Button class="z-10" @click="() => $router.push('/gif-creator')">Create gif</Button> -->

    <!-- profile widget -->
    <ProfileWidget />

    <ChallengeButton @challenge="openBoosterModal" />

    <!-- battle mechanic -->
    <BattleMechanic @changeMech="onChangeMech" @answer="onAnswer" @startChallenge="openBoosterModal" />

    <!-- mechanic change modal -->
    <Teleport to="#modals">
      <Modal id="mechanic-change-modal" v-model:visible="isChangeMechModalVisible">
        <ChangeMechanic @close="() => closeModal('changeMechanic')" />
      </Modal>
    </Teleport>

    <!-- no energy modal -->
    <!-- <Teleport to="#modals">
      <Modal id="no-energy-modal" v-model:visible="isNoEnergyVisible" sticky>
        <NoEnergy @challenge="openBoosterModal" @close="() => closeModal('noEnergy')" />
      </Modal>
    </Teleport> -->

    <!-- booster select modal -->
    <Teleport to="#modals">
      <Modal id="booster-select-modal" v-model:visible="isBoostersModalVisible">
        <BoosterSelect />
      </Modal>
    </Teleport>

    <!-- afk modal -->
    <Teleport to="#modals">
      <Modal id="afk-modal" v-model:visible="isAFKModalVisible" sticky>
        <AFK @close="onAfkModalClose" />
      </Modal>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted, onBeforeMount, onUnmounted } from "vue";
import { storeToRefs } from "pinia";
import { getAsset } from "@/utils";
import { tg, setThemeColor } from "@/api/telegram";
import { useWindowSize } from "@vueuse/core";

// stores
import { useMainStore } from "@/store/main";

console.log(`relax created`);

const store = useMainStore();

const { fetchRelaxPageData, useFetch } = store;
const { debugMessages, bgColor, HTMLSnapshots } = storeToRefs(store);
const { battles: locale } = storeToRefs(store.localeStore);
const { data, afkCounter } = storeToRefs(store.battleStore);
const { startRelax, stopRelax, setRelaxModal } = store.battleStore;

const isChangeMechModalVisible = ref(false);
const isNoEnergyVisible = ref(false);
const isBoostersModalVisible = ref(false);

setThemeColor("#222");
bgColor.value = "linear-gradient(180deg, #000B14 17.5%, #035DA9 100%)";
HTMLSnapshots.value = [];

await fetchRelaxPageData();

const isAFKModalVisible = computed(() => afkCounter.value >= 3);

const onAnswer = ({ isCorrect, answerString, nextTaskDelay, task }) => {
  // console.log(task);
  // console.log(answerString);
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
      // isNoEnergyVisible.value = true;
      onNoEnergy();
    }
  }
);

const { width } = useWindowSize();

const onNoEnergy = () => {
  useFetch({ key: "option_activate", data: { type: "extra_energy", showModal: 1 } });
};

const onChangeMech = () => {
  isChangeMechModalVisible.value = true;
};

const closeModal = (modalName: string) => {
  const modals = {
    changeMechanic: isChangeMechModalVisible,
    noEnergy: isNoEnergyVisible,
  };

  modals[modalName].value = false;
};

const openBoosterModal = () => {
  isNoEnergyVisible.value = false;
  isBoostersModalVisible.value = true;
};

const onAfkModalClose = () => {
  afkCounter.value = 0;
};

onMounted(() => {
  console.log(`relax mounted`);

  startRelax();
  debugMessages.value = [];
});

onUnmounted(() => {
  stopRelax();
});
</script>
