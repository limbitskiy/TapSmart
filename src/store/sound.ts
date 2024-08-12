import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const useSoundStore = defineStore("sound", () => {
  const state = ref({
    sounds: {},
  });

  const sounds = computed(() => state.value.sounds);

  const playSound = (soundId) => {
    state.value.sounds[soundId].play();
  };

  const addSound = (id, sound) => {
    state.value.sounds[id] = sound;
  };

  return { sounds, addSound, playSound };
});
