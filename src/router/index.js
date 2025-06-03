import { createRouter, createWebHistory } from "vue-router";
import Login from "../pages/Login.vue";
import Register from "../pages/Register.vue";
import ForgotPass from "../pages/ForgotPass.vue";
import License from "../pages/License.vue";
import LandingPage from "../pages/LandingPage.vue";
import Products from "../pages/Products.vue";
import ProductDetail from "../pages/ProductDetail.vue";
import AdminDashboard from "../pages/AdminDashboard.vue";
import AdminProducts from "../pages/AdminProducts.vue";
import LandingAdmin from "../pages/LandingAdmin.vue";
import CartView from "../pages/CartView.vue";
import PayMent from "../pages/PayMent.vue";
import UserProfile from "../pages/UserProfile.vue";
import store from "../store/index.js";

const routes = [
  // Public routes
  { path: "/login", name: "Login", component: Login },
  { path: "/register", name: "Register", component: Register },
  { path: "/forgot-password", name: "ForgotPass", component: ForgotPass },
  { path: "/license", name: "License", component: License },
  { path: "/", name: "LandingPage", component: LandingPage },
  { path: "/products", name: "Products", component: Products },
  {
    path: "/products/:categories*/:id",
    name: "ProductDetail",
    component: ProductDetail,
    props: true, // Để truyền params vào component
  },
  { path: "/CartView", name: "CartView", component: CartView },
  { path: "/PayMent", name: "PayMent", component: PayMent },
  { path: "/UserProfile", name: "UserProfile", component: UserProfile },
  { path: "/License", name: "License", component: License },
  // Admin routes (protected)
  {
    path: "/admin/chat",
    name: "LandingAdmin",
    component: LandingAdmin,
    meta: { requiresAuth: true, role: "admin" },
  },
  {
    path: "/admin/products",
    name: "AdminProducts",
    component: AdminProducts,
    meta: { requiresAuth: true, role: "admin" },
  },
  {
    path: "/admin/stats",
    name: "AdminDashboard",
    component: AdminDashboard,
    meta: { requiresAuth: true, role: "admin" },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Middleware để bảo vệ route
router.beforeEach((to, from, next) => {
  const isAuthenticated = store.state.isAuthenticated;
  const userRole = store.state.role;

  if (to.meta.requiresAuth) {
    if (!isAuthenticated) {
      return next("/login");
    } else if (to.meta.role && to.meta.role !== userRole) {
      alert("Bạn không có quyền truy cập!");
      return next("/");
    }
  }

  next();
});

export default router;
