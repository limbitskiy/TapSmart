<template>
  <div v-if="color === 'green'" class="backlight absolute inset-0 pointer-events-none">
    <svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:svgjs="http://svgjs.dev/svgjs" viewBox="0 0 800 800" opacity="0.39">
      <defs>
        <filter
          id="bbblurry-filter"
          x="-100%"
          y="-100%"
          width="400%"
          height="400%"
          filterUnits="objectBoundingBox"
          primitiveUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <feGaussianBlur stdDeviation="130" x="0%" y="0%" width="100%" height="100%" in="SourceGraphic" edgeMode="none" result="blur"></feGaussianBlur>
        </filter>
      </defs>
      <g filter="url(#bbblurry-filter)"><ellipse rx="277.5" ry="277.5" cx="630.5030070200016" cy="159.2365291255931" fill="#7afd3c"></ellipse></g>
    </svg>
  </div>

  <div v-else-if="color === 'red'" class="backlight absolute inset-0 pointer-events-none">
    <svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:svgjs="http://svgjs.dev/svgjs" viewBox="0 0 800 800" opacity="0.26">
      <defs>
        <filter
          id="bbblurry-filter"
          x="-100%"
          y="-100%"
          width="400%"
          height="400%"
          filterUnits="objectBoundingBox"
          primitiveUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <feGaussianBlur stdDeviation="130" x="0%" y="0%" width="100%" height="100%" in="SourceGraphic" edgeMode="none" result="blur"></feGaussianBlur>
        </filter>
      </defs>
      <g filter="url(#bbblurry-filter)"><ellipse rx="277.5" ry="277.5" cx="724.2387545121278" cy="71.68735987478527" fill="hsla(0, 83%, 54%, 1.00)"></ellipse></g>
    </svg>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  color: string;
}>();
</script>
