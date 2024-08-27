<template>
  <div id="change-mechanic" class="flex-1">
    <span class="pill-title">{{ locale["select_mechanic"] }}</span>

    <div class="pill-grid grid grid-cols-2 gap-4 pt-4">
      <Pill class="flex flex-col justify-between" color="light">
        <div class="content flex flex-col gap-2 items-center justify-between text-center">
          <div class="pill-img">
            <img />
          </div>
          <span>{{ locale["yesno_title"] }}</span>
          <span>{{ locale["yesno_desc"] }}</span>
        </div>
        <button class="w-full bg-[var(--accent-color)] text-black" @click="() => onMechSelect(1)">{{ locale["button_yesno"] }}</button>
      </Pill>

      <Pill class="flex flex-col justify-between" color="light">
        <div class="content flex flex-col gap-2 items-center justify-between text-center">
          <div class="pill-img">
            <img />
          </div>
          <span>{{ locale["4answers_title"] }}</span>
          <span>{{ locale["4answers_desc"] }}</span>
        </div>
        <button class="w-full bg-[var(--accent-color)] text-black" @click="() => onMechSelect(2)">{{ locale["button_4answers"] }}</button>
      </Pill>

      <Pill class="flex flex-col justify-between" color="light">
        <div class="content flex flex-col gap-2 items-center justify-between text-center">
          <div class="pill-img">
            <img />
          </div>
          <span>{{ locale["bubble_pairs_title"] }}</span>
          <span>{{ locale["bubble_pairs_desc"] }}</span>
        </div>
        <button class="w-full bg-[var(--accent-color)] text-black" @click="() => onMechSelect(3)">{{ locale["button_bubble_pairs"] }}</button>
      </Pill>

      <Pill class="flex flex-col justify-between" color="light">
        <div class="content flex flex-col gap-2 items-center justify-between text-center">
          <div class="pill-img">
            <img />
          </div>
          <span>{{ locale["audio_question_title"] }}</span>
          <span>{{ locale["audio_question_desc"] }}</span>
        </div>
        <button class="w-full bg-[var(--accent-color)] text-black" @click="() => onMechSelect(4)">{{ locale["button_audio_question"] }}</button>
      </Pill>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";

// stores
import { useBattleStore } from "@/store/battle.ts";
import { useLocaleStore } from "@/store/locale.ts";

// components
import Pill from "@/components/UI/Pill.vue";

const emit = defineEmits<{
  close: [];
}>();

const battleStore = useBattleStore();
const localeStore = useLocaleStore();

const { changeMechanic } = battleStore;
const { battleTypes } = storeToRefs(battleStore);
const { battles: locale } = storeToRefs(localeStore);

const onMechSelect = (mechanic) => {
  changeMechanic(mechanic);
  emit("close");
};
</script>
