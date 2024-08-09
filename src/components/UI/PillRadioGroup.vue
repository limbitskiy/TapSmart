<template>
  <div class="pill-radio-group-cnt">
    <Pill v-for="item in data" :key="item.id" v-bind="$attrs" @click="emit('pick', item.id)">
      <div class="pill-content flex items-center justify-between gap-2">
        <div class="pill-start">
          <span>{{ item.text }}</span>
        </div>
        <div class="pill-end flex items-center gap-4">
          <input type="radio" :value="item.text" v-model="picked" />
        </div>
      </div>
    </Pill>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Pill from "@/components/UI/Pill.vue";

const props = defineProps<{
  data: [];
  picked: string;
}>();

const emit = defineEmits<{
  pick: [string];
}>();

const picked = ref(props.picked);
</script>
