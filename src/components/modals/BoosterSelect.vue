<template>
  <div id="booster-select" class="flex-1 py-1 flex flex-col gap-4">
    <div class="pill-header flex items-center justify-between">
      <span class="bg-pill-title">{{ locale?.["booster_select_title"] || "Challenge" }}</span>
    </div>

    <div class="battle-rewards text-center">
      <Pill class="!py-2 rounded-[10px]">
        <div class="rewards flex items-center justify-center">
          <div class="mult flex gap-4 items-baseline justify-between">
            <div class="label">
              <span class=""> {{ locale?.["multiplier_title"] || "Multiplier:" }}</span>
            </div>
            <div class="value flex gap-1 items-baseline">
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M11 8.85185C11 9.09877 10.9136 9.30864 10.7407 9.48148L9.48148 10.7407C9.30864 10.9136 9.09877 11 8.85185 11C8.60494 11 8.39506 10.9136 8.22222 10.7407L5.5 8.01852L2.77778 10.7407C2.60494 10.9136 2.39506 11 2.14815 11C1.90123 11 1.69136 10.9136 1.51852 10.7407L0.259259 9.48148C0.0864198 9.30864 0 9.09877 0 8.85185C0 8.60494 0.0864198 8.39506 0.259259 8.22222L2.98148 5.5L0.259259 2.77778C0.0864198 2.60494 0 2.39506 0 2.14815C0 1.90123 0.0864198 1.69136 0.259259 1.51852L1.51852 0.259259C1.69136 0.0864198 1.90123 0 2.14815 0C2.39506 0 2.60494 0.0864198 2.77778 0.259259L5.5 2.98148L8.22222 0.259259C8.39506 0.0864198 8.60494 0 8.85185 0C9.09877 0 9.30864 0.0864198 9.48148 0.259259L10.7407 1.51852C10.9136 1.69136 11 1.90123 11 2.14815C11 2.39506 10.9136 2.60494 10.7407 2.77778L8.01852 5.5L10.7407 8.22222C10.9136 8.39506 11 8.60494 11 8.85185Z"
                  fill="#23DE35"
                />
              </svg>
              <span class="text-lg exo-black"> {{ data?.["challenge_multiplicator"] || 0 }}</span>
            </div>
          </div>
        </div>
      </Pill>
    </div>

    <div class="boosters flex flex-col gap-2 px-[2px] overflow-auto" @scroll="onScroll">
      <span class="text-lg">{{ locale?.["available_boosters"] || "Available boosters" }}</span>
      <Pill>
        <div class="boosters-content flex flex-col gap-4">
          <!-- prize fund -->
          <BoosterPill
            :selected="pickedBonuses.prize_fund"
            :color="'var(--accent-color)'"
            icon="prize_fund"
            :title="locale?.['prize_fund_title'] || 'Prize fund'"
            :subtitle="locale?.['prize_fund_text'] || 'Prize fund text'"
            :buttonLabel="data.boosters?.prize_fund?.button?.label"
            @select="() => onBonusSelect('prize_fund')"
            @booster-tooltip="(event) => onBoosterTooltip('prize_fund', event)"
          />

          <!-- extra mistake -->
          <BoosterPill
            :selected="pickedBonuses.extra_mistake"
            :color="'var(--red-color)'"
            icon="times"
            :title="locale?.['extra_mistake_title'] || 'Extra mistake'"
            :subtitle="locale?.['extra_mistake_text'] || 'Extra mistake text'"
            :buttonLabel="data.boosters?.extra_mistake.button?.label"
            @select="() => onBonusSelect('extra_mistake')"
            @booster-tooltip="(event) => onBoosterTooltip('extra_mistake', event)"
          />

          <!-- extra time -->
          <BoosterPill
            :selected="pickedBonuses.extra_time"
            :color="'var(--blue-color)'"
            icon="clock"
            :title="locale?.['extra_battle_time_title'] || 'Extra time'"
            :subtitle="locale?.['extra_battle_time_text'] || 'Extra time text'"
            :buttonLabel="data.boosters?.extra_time?.button?.label"
            @select="() => onBonusSelect('extra_time')"
            @booster-tooltip="(event) => onBoosterTooltip('extra_time', event)"
          />
        </div>
      </Pill>
    </div>

    <div class="bottom-btns flex-1 flex flex-col gap-2">
      <Button
        :style="data?.['friends_online'] ? 'background-color: black; color: white' : 'background-color: var(--accent-color); color: black'"
        activeColor="#5a5a5a"
        @click="onStartBattle"
      >
        <div class="flex justify-center gap-1">
          <span>{{ locale?.["button_booster_select"] || "Challenge" }}</span>
        </div>
      </Button>
      <Button :class="data?.['friends_online'] ? '' : '!bg-black !text-white'" @click="() => onStartBattle({ friendsOnly: true })">
        <div class="flex gap-1 justify-center">
          <span>{{ locale?.["button_booster_friends"] || "Challenge friends" }}</span>
          <Badge class="bg-green-500" :data="data?.['friends_online'] || 0" grey />
        </div>
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
// import { tg, inviteFriend } from "@/api/telegram";
import { ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { getAsset } from "@/utils";

// booster pill component
import BoosterPill from "@/components/UI/BoosterPill.vue";

// stores
import { useMainStore } from "@/store/main";

const store = useMainStore();

const { getOnlineFriends, redirectTo, useFetch, showTooltip, hideTooltip } = store;
const { battles: locale } = storeToRefs(store.localeStore);
const { data } = storeToRefs(store.battleStore);

const pickedBonuses = ref({
  extra_mistake: false,
  extra_time: false,
  prize_fund: false,
});

getOnlineFriends();

// turn on bonus when active changes
watch(
  () => data.value.boosters.extra_mistake,
  (val) => {
    if (val.active) {
      pickedBonuses.value.extra_mistake = true;
    }
  },
  {
    deep: true,
  }
);

watch(
  () => data.value.boosters.extra_time,
  (val) => {
    if (val.active) {
      pickedBonuses.value.extra_time = true;
    }
  },
  {
    deep: true,
  }
);

watch(
  () => data.value.boosters.prize_fund,
  (val) => {
    if (val.active) {
      pickedBonuses.value.prize_fund = true;
    }
  },
  {
    deep: true,
  }
);

const onBonusSelect = async (selectedBonus) => {
  const bonus = data.value?.boosters?.[selectedBonus];

  if (pickedBonuses.value[selectedBonus] === false) {
    if (bonus?.price && !data.value.boosters?.[selectedBonus]?.active) {
      await useFetch({ key: bonus.button.api, data: bonus.button.data });
    } else {
      pickedBonuses.value[selectedBonus] = true;
    }
  } else {
    pickedBonuses.value[selectedBonus] = false;
  }
};

const onStartBattle = ({ friendsOnly }) => {
  const params = new URLSearchParams();

  // append selected bonuses to quesry string
  for (const pickedBonus in pickedBonuses.value) {
    if (pickedBonuses.value[pickedBonus]) {
      params.append(pickedBonus, "1");
    }
  }

  if (friendsOnly) {
    params.append("friends_only", "1");
  }

  const queryString = params.toString();

  redirectTo(`/waiting${queryString ? "?" + queryString : ""}`);
};

const onBoosterTooltip = (booster, event) => {
  showTooltip({
    element: event.target,
    text: locale.value?.[`tooltip_${booster}`],
  });
};

const onScroll = () => {
  hideTooltip();
};
</script>
