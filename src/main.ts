import { createApp } from "vue";
import "./style.scss";
import "@/assets/css/animation.scss";
import "@/assets/css/fonts.scss";
import { createPinia } from "pinia";
import router from "./router";
import App from "./App.vue";

// components
import BackgroundImage from "@/components/UI/BackgroundImage.vue";
import ProfileWidget from "@/components/ProfileWidget.vue";
import Button from "@/components/UI/Button.vue";
import Modal from "@/components/Modal.vue";
import VolumeControl from "@/components/VolumeControl.vue";
import TaskCountdown from "@/components/TaskCountdown.vue";
import ChallengeButton from "@/components/UI/ChallengeButton.vue";
import Loader from "@/components/UI/Loader.vue";
import Navigation from "@/components/Navigation.vue";
import Profile from "@/components/ProfileWidget.vue";
import Pill from "@/components/UI/Pill.vue";
import Ad from "@/components/UI/Ad.vue";
import BackgroundPill from "@/components/UI/BackgroundPill.vue";
import CircleProgress from "@/components/UI/CircleProgress.vue";
import ChallengeStatus from "@/components/ChallengeStatus.vue";
import ChallengeProgressBar from "@/components/ChallengeProgressBar.vue";
import LanguageSettings from "@/components/LanguageSettings.vue";
import LeagueProgress from "@/components/LeagueProgress.vue";
import Notification from "@/components/Notification.vue";
import BattleMechanic from "@/components/BattleMechanic.vue";
import Tooltip from "@/components/Tooltip.vue";
import BackendModal from "@/components/UI/BackendModal.vue";
import CircleCountdown from "@/components/UI/CircleCountdown.vue";
import MechanicCard from "@/components/MechanicCard.vue";
import IconPill from "@/components/UI/IconPill.vue";
import FriendPill from "@/components/UI/FriendPill.vue";
import Badge from "@/components/UI/Badge.vue";
import Toggle from "@/components/UI/Toggle.vue";
import RouteSubtitle from "@/components/UI/RouteSubtitle.vue";
import BattleHeader from "@/components/UI/BattleHeader.vue";
import Countdown from "@/components/UI/Countdown.vue";
import BattleCompleteAnimation from "@/components/animations/BattleCompleteAnimation.vue";
import BattleStartAnimation from "@/components/animations/BattleStartAnimation.vue";

// modals
import ChangeMechanic from "@/components/modals/ChangeMechanic.vue";
import NoEnergy from "@/components/modals/NoEnergy.vue";
import Errors from "@/components/modals/Errors.vue";
import BoosterSelect from "@/components/modals/BoosterSelect.vue";
import AFK from "@/components/modals/AFK.vue";
import TaskModal from "@/components/modals/TaskModal.vue";
import PrizeModal from "@/components/modals/PrizeModal.vue";

const pinia = createPinia();
const app = createApp(App);

app.use(pinia);
app.use(router);

// global component registration
app
  .component("BackgroundImage", BackgroundImage)
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
  .component("Ad", Ad)
  .component("CircleProgress", CircleProgress)
  .component("Errors", Errors)
  .component("ChallengeStatus", ChallengeStatus)
  .component("ChallengeProgressBar", ChallengeProgressBar)
  .component("LanguageSettings", LanguageSettings)
  .component("LeagueProgress", LeagueProgress)
  .component("Notification", Notification)
  .component("Tooltip", Tooltip)
  .component("TaskCountdown", TaskCountdown)
  .component("BattleMechanic", BattleMechanic)
  .component("CircleCountdown", CircleCountdown)
  .component("MechanicCard", MechanicCard)
  .component("TaskModal", TaskModal)
  .component("IconPill", IconPill)
  .component("Badge", Badge)
  .component("FriendPill", FriendPill)
  .component("BattleCompleteAnimation", BattleCompleteAnimation)
  .component("BattleStartAnimation", BattleStartAnimation)
  .component("BattleHeader", BattleHeader)
  .component("BackendModal", BackendModal)
  .component("RouteSubtitle", RouteSubtitle)
  .component("PrizeModal", PrizeModal)
  .component("Countdown", Countdown)
  .component("Toggle", Toggle);

app.mount("#app");
