<template>
  <div
    class="ad-card relative flex flex-col gap-2 items-center px-4 py-4 text-center w-[70vw] border-2 border-[var(--accent-color)] rounded-2xl bg-[var(--grey-light)]"
  >
    <div
      v-if="tooltip"
      ref="el"
      class="info-btn absolute top-2 right-2"
      @click="onTooltipClick"
    >
      <svg
        width="23"
        height="23"
        viewBox="0 0 23 23"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M11.5 21.5625C8.83126 21.5625 6.27182 20.5023 4.38474 18.6153C2.49765 16.7282 1.4375 14.1687 1.4375 11.5C1.4375 8.83126 2.49765 6.27182 4.38474 4.38474C6.27182 2.49765 8.83126 1.4375 11.5 1.4375C14.1687 1.4375 16.7282 2.49765 18.6153 4.38474C20.5023 6.27182 21.5625 8.83126 21.5625 11.5C21.5625 14.1687 20.5023 16.7282 18.6153 18.6153C16.7282 20.5023 14.1687 21.5625 11.5 21.5625ZM11.5 23C14.55 23 17.4751 21.7884 19.6317 19.6317C21.7884 17.4751 23 14.55 23 11.5C23 8.45001 21.7884 5.52494 19.6317 3.36827C17.4751 1.2116 14.55 0 11.5 0C8.45001 0 5.52494 1.2116 3.36827 3.36827C1.2116 5.52494 0 8.45001 0 11.5C0 14.55 1.2116 17.4751 3.36827 19.6317C5.52494 21.7884 8.45001 23 11.5 23Z"
          fill="#CFCFCF"
        />
        <path
          d="M12.8368 9.47025L9.54493 9.88281L9.42706 10.4291L10.0739 10.5484C10.4966 10.649 10.5799 10.8014 10.4879 11.2226L9.42706 16.2078C9.14818 17.4972 9.57799 18.1039 10.5886 18.1039C11.372 18.1039 12.2819 17.7416 12.6945 17.2443L12.821 16.6462C12.5335 16.8993 12.1137 16.9999 11.8349 16.9999C11.4396 16.9999 11.2958 16.7224 11.3979 16.2337L12.8368 9.47025ZM12.9374 6.46875C12.9374 6.85 12.786 7.21563 12.5164 7.48522C12.2468 7.7548 11.8812 7.90625 11.4999 7.90625C11.1187 7.90625 10.753 7.7548 10.4835 7.48522C10.2139 7.21563 10.0624 6.85 10.0624 6.46875C10.0624 6.0875 10.2139 5.72187 10.4835 5.45228C10.753 5.1827 11.1187 5.03125 11.4999 5.03125C11.8812 5.03125 12.2468 5.1827 12.5164 5.45228C12.786 5.72187 12.9374 6.0875 12.9374 6.46875Z"
          fill="#CFCFCF"
        />
      </svg>
    </div>
    <div v-if="image === 'progress'" class="w-20 h-20">
      <CircleProgress :size="80" :progress="progressValue" />
    </div>
    <img v-else-if="image" class="h-12 my-3" :src="getAsset(image)" />
    <span class="fira-bold text-lg text-[var(--accent-color)]">{{
      title
    }}</span>
    <span
      class="inline-svg"
      v-html="
        replaceWithSpecialSymbols(text) ||
        'Ad text is located around here somewhere'
      "
    ></span>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { getAsset, replaceWithSpecialSymbols } from "@/utils";
import { storeToRefs } from "pinia";

// store
import { useMainStore } from "@/store/main";

// cool gradient
// style="background: linear-gradient(to top left, #ff75c3, #ffa647, #ffe83f, #9fff5b, #70e2ff, #cd93ff); -webkit-background-clip: text; -webkit-text-fill-color: transparent"

const store = useMainStore();

const { data } = storeToRefs(store.battleStore);
const { showTooltip } = store;

const el = ref();

const props = defineProps<{
  image?: string;
  title?: string;
  text?: string;
  tooltip?: string;
}>();

const progressValue = ref(0);

setTimeout(() => {
  progressValue.value = data?.value?.["battle_results_ad_percent"];
}, 500);

// const textWithSpecialSymbols = computed(() =>
//   replaceWithSpecialSymbols(props.text)
// );

const onTooltipClick = () => {
  if (props.tooltip?.length) {
    showTooltip({
      element: el.value,
      text: props.tooltip,
    });
  }
};
</script>
