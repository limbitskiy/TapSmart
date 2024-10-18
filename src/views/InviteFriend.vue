<template>
  <div></div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { inviteFriend } from "@/api/telegram";

// store
import { useMainStore } from "@/store/main";

const store = useMainStore();

const { friends: locale } = storeToRefs(store.localeStore);

inviteFriend(locale.value?.["invite_message"] || "Invite message");
</script>
