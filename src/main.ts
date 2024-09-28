import { createApp } from "vue";
import "./style.scss";
import "@/assets/css/animation.scss";
import "@/assets/css/fonts.scss";
import { createPinia } from "pinia";
import router from "./router";
import App from "./App.vue";
import Vue3Lottie from "vue3-lottie";

// components
import Backlight from "@/components/UI/Backlight.vue";
import ProfileWidget from "@/components/ProfileWidget.vue";
import Button from "@/components/UI/Button.vue";
import Modal from "@/components/Modal.vue";
import ChangeMechanic from "@/components/modals/ChangeMechanic.vue";
import VolumeControl from "@/components/VolumeControl.vue";
import NoEnergy from "@/components/modals/NoEnergy.vue";
import ChallengeButton from "@/components/UI/ChallengeButton.vue";
import BoosterSelect from "@/components/modals/BoosterSelect.vue";
import Loader from "@/components/UI/Loader.vue";
import Navigation from "@/components/Navigation.vue";
import Profile from "@/components/ProfileWidget.vue";
import Pill from "@/components/UI/Pill.vue";
import Ad from "@/components/UI/Ad.vue";
import BackgroundPill from "@/components/UI/BackgroundPill.vue";

// modals
import AFK from "@/components/modals/AFK.vue";

const pinia = createPinia();
const app = createApp(App);

app.use(pinia);
app.use(router);
app.use(Vue3Lottie);

// global component registration
app
  .component("Backlight", Backlight)
  .component("ProfileWidget", ProfileWidget)
  .component("Button", Button)
  .component("Modal", Modal)
  .component("ChangeMechanic", ChangeMechanic)
  .component("VolumeControl", VolumeControl)
  .component("NoEnergy", NoEnergy)
  .component("ChallengeButton", ChallengeButton)
  .component("BoosterSelect", BoosterSelect)
  .component("Loader", Loader)
  .component("Navigation", Navigation)
  .component("AFK", AFK)
  .component("Profile", Profile)
  .component("Pill", Pill)
  .component("BackgroundPill", BackgroundPill)
  .component("Profile", Profile)
  .component("Ad", Ad);

app.mount("#app");
