// src/utils/axios.js
import axios from "axios";
import router from "../router/index.js";
import { useStore } from "vuex";

const store = useStore();
const instance = axios.create({
  baseURL: "https://friendwithbooks.id.vn/api",
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (config.url.includes("cloudinary.com")) {
    // Không thêm Authorization cho Cloudinary
    delete config.headers.Authorization;
  }
  return config;
});

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Xóa token
      localStorage.removeItem("token");
      localStorage.removeItem("userInfo");
      store.dispatch("logout");
      router.push("/login");
      alert("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại!");
    }
    return Promise.reject(error);
  }
);

export default instance;
