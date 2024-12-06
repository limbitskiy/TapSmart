<template>
  <div class="flex-1 flex flex-col">
    <div class="bg flex-1 flex p-1 rounded-xl" :style="{ background: selected ? 'var(--green-gradient)' : color }">
      <Pill class="flex-1 flex flex-col !rounded-xl gap-2 !p-2" style="box-shadow: 0px 0px 1.6px 1px rgba(0, 0, 0, 0.25)">
        <div class="top flex gap-4 p-2">
          <div class="icon min-w-[50px] contain flex items-center">
            <img class="w-[50px]" :src="getAsset(icon)" />
          </div>
          <div class="text flex flex-col gap-2">
            <div class="title flex gap-2 justify-between">
              <span class="fira-semibold text-xl leading-5 w-fit">{{ title }}</span>
              <div class="info-btn relative -top-2 -right-2">
                <div class="btn" @click="(event) => emit('booster-tooltip', event)">
                  <svg width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M11.5 21.5625C8.83126 21.5625 6.27182 20.5023 4.38474 18.6153C2.49765 16.7282 1.4375 14.1687 1.4375 11.5C1.4375 8.83126 2.49765 6.27182 4.38474 4.38474C6.27182 2.49765 8.83126 1.4375 11.5 1.4375C14.1687 1.4375 16.7282 2.49765 18.6153 4.38474C20.5023 6.27182 21.5625 8.83126 21.5625 11.5C21.5625 14.1687 20.5023 16.7282 18.6153 18.6153C16.7282 20.5023 14.1687 21.5625 11.5 21.5625ZM11.5 23C14.55 23 17.4751 21.7884 19.6317 19.6317C21.7884 17.4751 23 14.55 23 11.5C23 8.45001 21.7884 5.52494 19.6317 3.36827C17.4751 1.2116 14.55 0 11.5 0C8.45001 0 5.52494 1.2116 3.36827 3.36827C1.2116 5.52494 0 8.45001 0 11.5C0 14.55 1.2116 17.4751 3.36827 19.6317C5.52494 21.7884 8.45001 23 11.5 23Z"
                      fill="#CFCFCF"
                    />
                    <path
                      d="M12.8368 9.47025L9.54493 9.88281L9.42706 10.4291L10.0739 10.5484C10.4966 10.649 10.5799 10.8014 10.4879 11.2226L9.42706 16.2078C9.14818 17.4972 9.57799 18.1039 10.5886 18.1039C11.372 18.1039 12.2819 17.7416 12.6945 17.2443L12.821 16.6462C12.5335 16.8992 12.1137 16.9999 11.8349 16.9999C11.4396 16.9999 11.2958 16.7224 11.3979 16.2337L12.8368 9.47025ZM12.9374 6.46875C12.9374 6.85 12.786 7.21563 12.5164 7.48522C12.2468 7.7548 11.8812 7.90625 11.4999 7.90625C11.1187 7.90625 10.753 7.7548 10.4835 7.48522C10.2139 7.21563 10.0624 6.85 10.0624 6.46875C10.0624 6.0875 10.2139 5.72187 10.4835 5.45228C10.753 5.1827 11.1187 5.03125 11.4999 5.03125C11.8812 5.03125 12.2468 5.1827 12.5164 5.45228C12.786 5.72187 12.9374 6.0875 12.9374 6.46875Z"
                      fill="#CFCFCF"
                    />
                  </svg>
                </div>
              </div>
            </div>
            <p class="text-gray-300 text-sm leading-5">
              {{ subtitle }}
            </p>
          </div>
        </div>
        <div class="bottom">
          <Button
            class="w-full bg-[var(--accent-color)] !py-2 text-base"
            style="transition: 0.5s ease"
            :style="{ background: selected ? 'var(--green-gradient)' : 'var(--grey-dark)', color: selected ? '#fff' : '#fff' }"
            activeColor="#fcdcb0"
            @click="() => emit('select')"
          >
            <span v-if="selected">{{ locale?.["button_active"] || "active" }}</span>
            <span v-else class="inline-svg leading-4" v-html="replaceWithSpecialSymbols(buttonLabel)"></span>
          </Button>
        </div>
      </Pill>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getAsset, replaceWithSpecialSymbols } from "@/utils";
import { storeToRefs } from "pinia";

// stores
import { useMainStore } from "@/store/main";

const store = useMainStore();

const { battles: locale } = storeToRefs(store.localeStore);

defineProps<{
  color: string;
  icon: string;
  title: string;
  subtitle: string;
  selected: boolean;
  buttonLabel: string;
}>();

const emit = defineEmits<{
  select: [];
  "booster-tooltip": [event: MouseEvent];
}>();
</script>
