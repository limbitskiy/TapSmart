<template>
  <div></div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { inviteFriend } from "@/api/telegram";

// store
import { useLocaleStore } from "@/store/locale";

const localeStore = useLocaleStore();

const { friends: locale } = storeToRefs(localeStore);

inviteFriend(locale.value?.["invite_message"] || "Invite message");
</script>
