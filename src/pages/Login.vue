<template>
  <Header />
  <div class="min-h-screen bg-[#fdf9e5] flex items-center justify-center px-4">
    <div class="bg-white p-8 rounded-xl shadow-lg w-full max-w-2xl flex gap-8">
      <!-- Form bên trái -->
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
      </div>

      <!-- Google Sign-in bên phải -->
      <div class="flex items-center justify-center">
        <button
          class="flex items-center gap-2 px-6 py-3 border border-gray-400 rounded-xl hover:bg-gray-100"
        >
          <img src="/Google.png" alt="Google" class="w-6 h-6" />
          <span class="text-gray-600 font-medium">Đăng nhập với Google</span>
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
import { useRouter } from "vue-router";

const router = useRouter();
const email = ref("");
const password = ref("");

const login = () => {
  // Thực hiện logic đăng nhập
  console.log("Đăng nhập với", email.value, password.value);
};

const goToRegister = () => {
  router.push("/Register");
};

const goToForgot = () => {
  router.push("/forgot-password");
};
</script>
