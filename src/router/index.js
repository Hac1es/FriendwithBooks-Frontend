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
import OrderSuccess from "../pages/OrderSuccess.vue";
import store from "../store/index.js";
import LoginGoogle from "../pages/LoginGoogle.vue";
import AdminOrders from "../pages/AdminOrders.vue";
const routes = [
  // Public routes
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: { title: "Đăng nhập" },
  },
  {
    path: "/loginGoogle",
    name: "LoginGoogle",
    component: LoginGoogle,
    meta: { title: "Đăng nhập với Google" },
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
    meta: { title: "Đăng ký" },
  },
  {
    path: "/forgot-password",
    name: "ForgotPass",
    component: ForgotPass,
    meta: { title: "Quên mật khẩu" },
  },
  {
    path: "/",
    name: "LandingPage",
    component: LandingPage,
    meta: { title: "FriendwithBooks - Books and Chill" },
  },
  {
    path: "/products",
    name: "Products",
    component: Products,
    meta: { title: "Danh mục sản phẩm" },
  },
  {
    path: "/products/:categories*/:id",
    name: "ProductDetail",
    component: ProductDetail,
    props: true, // Để truyền params vào component
  },
  {
    path: "/CartView",
    name: "CartView",
    component: CartView,
    meta: { title: "Giỏ hàng" },
  },
  {
    path: "/PayMent",
    name: "PayMent",
    component: PayMent,
    meta: { title: "Thanh toán" },
  },
  {
    path: "/UserProfile",
    name: "UserProfile",
    component: UserProfile,
    meta: { title: "Hồ sơ người dùng" },
  },
  {
    path: "/order-success/:orderId",
    name: "OrderSuccess",
    component: OrderSuccess,
    props: true,
    meta: { title: "Đặt hàng thành công" },
  },
  {
    path: "/License",
    name: "License",
    component: License,
    meta: { title: "Điều khoản sử dụng" },
  },
  // Admin routes (protected)
  {
    path: "/admin/chat",
    name: "LandingAdmin",
    component: LandingAdmin,
    meta: { requiresAuth: true, role: "admin", title: "Chăm sóc khách hàng" },
  },
  {
    path: "/admin/orders",
    name: "AdminOrders",
    component: AdminOrders,
    meta: { requiresAuth: true, role: "admin", title: "Quản lý đơn hàng" },
  },
  {
    path: "/admin/products",
    name: "AdminProducts",
    component: AdminProducts,
    meta: { requiresAuth: true, role: "admin", title: "Quản lý sản phẩm" },
  },
  {
    path: "/admin/stats",
    name: "AdminDashboard",
    component: AdminDashboard,
    meta: { requiresAuth: true, role: "admin", title: "Thống kê" },
  },

];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.afterEach((to) => {
  const defaultTitle = "FriendwithBooks - Books and Chill";
  document.title = to.meta.title || defaultTitle;
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
