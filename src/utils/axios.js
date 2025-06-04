// src/utils/axios.js
import axios from "axios";
import router from "../router/index.js";

const instance = axios.create({
  baseURL: "http://localhost:5240/api",
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Xóa token
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      store.dispatch("logout");
      router.push("/login");
      alert("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại!");
    }
    return Promise.reject(error);
  }
);

export default instance;
