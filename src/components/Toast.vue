<template>
  <Transition name="toast-slide">
    <div v-if="toast.isShown" class="toast text-lg fixed top-0 bg-[--accent-color] p-5 rounded text-black w-full transition-transform">
      {{ toast.message }}
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { useUserStore } from "@/store/user.ts";
import { storeToRefs } from "pinia";

const userStore = useUserStore();
const { toast } = storeToRefs(userStore);
</script>
