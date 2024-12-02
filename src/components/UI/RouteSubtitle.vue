<template>
  <div class="page-subtitle text-gray-200" v-html="replaceTags(text)" @click="onSubtitleClick"></div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";

defineProps<{
  text: string;
}>();

const router = useRouter();

const replaceTags = (str: string) => {
  const replaced = str.replace(/\<link/gm, "<span class='custom-link'").replace(/\<\/link\>/gm, "</span>");

  return replaced;
};

const onSubtitleClick = (event: MouseEvent) => {
  const target = event.target;

  if (target?.classList?.contains("custom-link") && target?.getAttribute("to")) {
    router.push(target.getAttribute("to"));
  }
};
</script>
