<template>
  <div
    class="badge rounded px-[4px] h-[16px] text-[12px] grid place-items-center"
    :class="dark ? 'bg-black text-white' : grey ? 'bg-[var(--grey-light)] text-white' : 'bg-[var(--accent-color)] text-black'"
  >
    <span class="block leading-[14px] exo-black">{{ data }}</span>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  data: string | number;
  dark?: boolean;
  grey?: boolean;
}>();
</script>
