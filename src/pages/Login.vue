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
          class="w-full p-4 rounded-xl bg-gray-200 outline-none"
          v-model="password"
        />

        <div class="text-right text-sm font-medium mt-2">
          <a @click="goToForgot" class="cursor-pointer hover:underline"
            >Quên mật khẩu</a
          >
        </div>

        <button
          class="bg-yellow-300 font-semibold py-3 mt-6 w-full rounded-xl hover:bg-yellow-400"
          @click="login"
        >
          Đăng nhập
        </button>

        <div class="text-center mt-4 text-gray-600 text-sm">
          Chưa có tài khoản?
          <a
            @click="goToRegister"
            class="text-black font-medium cursor-pointer hover:underline"
            >Đăng ký</a
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
import axios from "../utils/axios";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { jwtDecode } from "jwt-decode";
import { supabase } from "../utils/supabase";

const router = useRouter();
const email = ref("");
const password = ref("");
const store = useStore();

const login = async () => {
  if (!email.value || !password.value) {
    alert("Vui lòng nhập đầy đủ thông tin.");
    return;
  }

  try {
    // Gọi API đăng nhập phía back-end
    const response = await axios.post("/Auth/login", {
      Email: email.value,
      Password: password.value,
    });

    if (response.status === 200) {
      // Giải mã token để lấy role
      const decoded = jwtDecode(response.data.token);
      alert("Đăng nhập thành công!");
      store.dispatch("login", decoded.role); // Gọi action login của store
      // Lưu thông tin user vào store
      store.dispatch("setUserInfo", decoded);
      // Lưu vào localStorage (hoặc sessionStorage)
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userInfo", JSON.stringify(decoded));
    } else {
      alert(response.data.message || "Đăng nhập thất bại.");
    }
  } catch (error) {
    alert(
      error.response?.data?.message ||
        "Đăng nhập thất bại. Vui lòng thử lại sau."
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

const goToRegister = () => {
  router.push("/register");
};

const goToForgot = () => {
  router.push("/forgot-password");
};
</script>
