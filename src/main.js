import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import "./assets/main.css";
import router from "./router";
import naive from "naive-ui";
import store from "./store";

const app = createApp(App).use(store).use(router).use(naive);

app.config.warnHandler = () => {};
app.mount("#app");
