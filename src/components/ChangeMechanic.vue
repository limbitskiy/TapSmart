<template>
  <div id="change-mechanic" class="flex-1">
    <span class="pill-title">Select a mechanic:</span>

    <div class="pill-grid grid grid-cols-2 gap-4 pt-4">
      <Pill class="flex flex-col justify-between" color="light">
        <div class="content flex flex-col gap-2 items-center justify-between text-center">
          <div class="pill-img">
            <img />
          </div>
          <span>Yes/no battle</span>
          <span>A battle with yes or no questions. The easiest battle.</span>
        </div>
        <button class="w-full bg-[var(--accent-color)] text-black" @click="() => onMechSelect('yes-no')">Active</button>
      </Pill>

      <Pill class="flex flex-col justify-between" color="light">
        <div class="content flex flex-col gap-2 items-center justify-between text-center">
          <div class="pill-img">
            <img />
          </div>
          <span>4 answers battle</span>
          <span>You’ll have to choose between four answers.</span>
        </div>
        <button class="w-full bg-[var(--accent-color)] text-black" @click="() => onMechSelect('4-answers')">Select</button>
      </Pill>
    </div>
  </div>
</template>

<script setup lang="ts">
import Pill from "@/components/UI/Pill.vue";
import { useBattleStore } from "@/store/battle.ts";

const emit = defineEmits<{
  close: [];
}>();

const battleStore = useBattleStore();
const { changeMechanic } = battleStore;

const onMechSelect = (mechanic) => {
  changeMechanic(mechanic);
  emit("close");
};
</script>
