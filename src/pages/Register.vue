<template>
  <Header />
  <div class="min-h-screen bg-[#fdf9e5] flex items-center justify-center px-4">
    <div
      class="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm flex gap-8 mt-8 mb-8"
    >
      <div class="flex-1">
        <p class="block text-gray-600 mb-2">Email</p>
        <input
          type="email"
          class="w-full mb-4 p-4 rounded-xl bg-gray-200 outline-none"
          v-model="email"
        />

        <p class="block text-gray-600 mb-2">Mật khẩu</p>
        <input
          type="password"
          class="w-full mb-4 p-4 rounded-xl bg-gray-200 outline-none"
          v-model="password"
        />

        <p class="block text-gray-600 mb-2">Họ và tên</p>
        <input
          type="text"
          class="w-full mb-4 p-4 rounded-xl bg-gray-200 outline-none"
          v-model="fullName"
        />

        <p class="block text-gray-600 mb-2">Số điện thoại</p>
        <input
          type="tel"
          class="w-full mb-4 p-4 rounded-xl bg-gray-200 outline-none"
          v-model="phone"
        />

        <p class="block text-gray-600 mb-2">Địa chỉ</p>
        <input
          type="text"
          class="w-full mb-4 p-4 rounded-xl bg-gray-200 outline-none"
          v-model="address"
        />

        <button
          class="bg-yellow-300 font-semibold py-3 mt-6 w-full rounded-xl hover:bg-yellow-400"
          @click="registerWithEmail"
        >
          Đăng ký
        </button>

        <div class="text-center mt-4 text-gray-600 text-sm">
          Đã có tài khoản?
          <a
            @click="goToLogin"
            class="text-black font-medium cursor-pointer hover:underline"
            >Đăng nhập</a
          >
        </div>

        <div class="flex items-center justify-center mt-7">
          <button
            class="bg-white border border-gray-300 rounded-xl px-4 py-3 flex items-center gap-2 hover:bg-gray-100"
            @click="loginWithGoogle"
          >
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" class="w-6 h-6" />
            Đăng nhập với Google
          </button>
        </div>
      </div>
    </div>
  </div>
  <Footer />
</template>

<script setup>
import Footer from "../components/Footer.vue";
import Header from "../components/Header/index.vue";
import { ref } from "vue";
import { useRouter } from "vue-router";
import axios from "../utils/axios";
import { useStore } from "vuex";
import { jwtDecode } from "jwt-decode";
import { supabase } from "../utils/supabase";

const store = useStore();
const router = useRouter();
const email = ref("");
const password = ref("");
const fullName = ref("");
const phone = ref("");
const address = ref("");

const registerWithEmail = async () => {
  if (
    !email.value ||
    !password.value ||
    !fullName.value ||
    !phone.value ||
    !address.value
  ) {
    alert("Vui lòng nhập đầy đủ thông tin.");
    return;
  }

  // Kiểm tra định dạng email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.value)) {
    alert("Email không hợp lệ.");
    return;
  }
  // Kiểm tra độ dài mật khẩu
  if (password.value.length < 6) {
    alert("Mật khẩu phải có ít nhất 6 ký tự.");
    return;
  }
  // Kiểm tra số điện thoại: bắt đầu bằng 0, có 10 chữ số
  const phoneRegex = /^0\d{9}$/;
  if (!phoneRegex.test(phone.value)) {
    alert("Số điện thoại phải bắt đầu bằng số 0 và có đúng 10 chữ số.");
    return;
  }

  try {
    // Gọi API đăng ký phía back-end
    const response = await axios.post("/Auth/register", {
      Email: email.value,
      Password: password.value,
      FullName: fullName.value,
      Phone: phone.value,
      Address: address.value,
    });

    if (response.status === 200) {
      // Giải mã token để lấy role
      const decoded = jwtDecode(response.data.token);
      // Lưu token vào localStorage (hoặc sessionStorage)
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userInfo", JSON.stringify(decoded));
      alert("Đăng ký thành công!");
      store.dispatch("login", decoded.role); // Gọi action login của store
      // Lưu thông tin user vào store
      store.dispatch("setUserInfo", decoded); 
    } else {
      alert(response.data.message || "Đăng ký thất bại.");
    }
  } catch (error) {
    alert(
      error.response?.data?.message || "Đăng ký thất bại. Vui lòng thử lại sau."
    );
  }
};

const loginWithGoogle = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin + "/loginGoogle" // hoặc URL callback mong muốn
    }
  });
  if (error) {
    alert("Đăng nhập Google thất bại.");
    console.log(error);
  }
};

const goToLogin = () => {
  router.push("/login");
};
</script>
