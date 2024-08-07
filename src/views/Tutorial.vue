<template>
  <div>
    <KeepAlive>
      <Suspense>
        <TutorialContent />
      </Suspense>
    </KeepAlive>
  </div>
</template>

<script setup lang="ts">
import TutorialContent from "../components/TutorialContent.vue";
</script>
