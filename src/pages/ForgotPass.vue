<template>
  <Header />
  <div class="min-h-screen bg-[#fdf9e5] flex items-center justify-center px-4">
    <div class="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm flex gap-8 mt-8 mb-8">
      <div class="flex-1">
        <p class="block text-gray-600 mb-2">Email</p>
        <input
          v-model="email"
          type="email"
          class="w-full mb-4 p-4 rounded-xl bg-gray-200 outline-none"
        />

        <p class="block text-gray-600 mb-2">Mã OTP</p>
        <input
          v-model="inputOtp"
          type="text"
          class="w-full mb-4 p-4 rounded-xl bg-gray-200 outline-none"
        />

        <p class="block text-gray-600 mb-2">Mật khẩu mới</p>
        <input
          v-model="newPassword"
          type="password"
          class="w-full mb-4 p-4 rounded-xl bg-gray-200 outline-none"
        />

        <div class="text-sm font-medium mt-2">
          <a class="cursor-pointer hover:underline" @click="sendOtp">Gửi mã OTP</a>
        </div>

        <button
          class="bg-yellow-300 font-semibold py-3 mt-6 w-full rounded-xl hover:bg-yellow-400"
          @click="handleConfirm"
        >
          Xác nhận
        </button>
      </div>
    </div>
  </div>
  <Footer />
</template>

<script setup>
import Footer from "../components/Footer.vue";
import Header from "../components/Header/index.vue";
import { ref } from "vue";
import axios from "../utils/axios";
import { jwtDecode } from "jwt-decode";
import { useStore } from "vuex";

const email = ref("");
const inputOtp = ref("");
const newPassword = ref("");
const otp = ref("");
const store = useStore();

function sendOtp() {
  // Tạo chuỗi số ngẫu nhiên 6 chữ số
  otp.value = Math.floor(100000 + Math.random() * 900000).toString();
  alert("Mã OTP của bạn là: " + otp.value);
}

async function handleConfirm() {
  if (!otp.value) {
    alert("Bạn chưa nhận mã OTP.");
    return;
  }
  if (inputOtp.value !== otp.value) {
    alert("Mã OTP không đúng.");
    return;
  }
  if (!email.value || !newPassword.value || !inputOtp.value) {
    alert("Vui lòng nhập đầy đủ thông tin.");
    return;
  }
  try {
    // Gửi API kiểm tra email và đổi mật khẩu
    const response = await axios.post("/Auth/forgotPassword", {
      Email: email.value,
      Password: newPassword.value,
    });
    if (response.status === 200) {
      const decoded = jwtDecode(response.data.token);
      store.dispatch("login", decoded.role);
      store.dispatch("setUserInfo", decoded);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userInfo", JSON.stringify(decoded));
      alert("Đổi mật khẩu thành công!");
    } else {
      alert(response.data.message || "Có lỗi xảy ra, vui lòng thử lại.");
    }
  } catch (error) {
    alert(
      error.response?.data?.message ||
        "Không thể kết nối tới máy chủ."
    );
  }
}
</script>
