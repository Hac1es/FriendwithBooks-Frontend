import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import "./assets/main.css";
import router from "./router";
import naive from "naive-ui";
import store from "./store";
import Vue3GoogleLogin from 'vue3-google-login';


const app = createApp(App)
            .use(store)
            .use(router)
            .use(naive)
            .use(Vue3GoogleLogin, {
                clientId: '975931811781-6h7psjl3epjhhn4kv37v2tbg2pdpbs0t.apps.googleusercontent.com'
            });

app.config.warnHandler = () => {};
app.mount("#app");
