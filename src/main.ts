import { createApp } from "vue";
import "./style.scss";
import "@/assets/css/animation.scss";
import router from "./router";
import { createPinia } from "pinia";
import App from "./App.vue";

const pinia = createPinia();
const app = createApp(App);

app.use(router);
app.use(pinia);

app.mount("#app");
