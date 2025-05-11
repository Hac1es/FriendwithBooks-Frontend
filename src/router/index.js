import { createRouter, createWebHistory } from "vue-router";
import Login from "../pages/Login.vue";
import Register from "../pages/Register.vue";
import ForgotPass from "../pages/ForgotPass.vue";
import License from "../pages/License.vue";
import LandingPage from "../pages/LandingPage.vue";
import Products from "../pages/Products.vue";

const routes = [
  { path: "/Login", name: "Login", component: Login },
  { path: "/Register", name: "Register", component: Register },
  { path: "/ForgotPassword", name: "ForgotPass", component: ForgotPass },
  { path: "/License", name: "License", component: License },
  { path: "/Products", name: "Products", component: Products },
  { path: "/", name: "LandingPage", component: LandingPage },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
