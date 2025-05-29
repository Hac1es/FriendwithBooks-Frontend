<template>
  <Header />
  <div class="min-h-screen bg-[#fdf9e5] flex items-center justify-center px-4">
    <div class="bg-white p-8 rounded-xl shadow-lg w-full max-w-2xl md:flex gap-8">
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
          class="w-full mb-4 p-4 rounded-xl bg-gray-200 outline-none"
          v-model="password"
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
      </div>

      <!-- Google Sign-in bên phải -->
      <div class="flex items-center justify-center mt-7">
        <button
          class="flex items-center gap-2 px-6 py-3 border border-gray-400 rounded-xl hover:bg-gray-100"
          @click="registerWithGoogle"
        >
          <img src="/Google.png" alt="Google" class="w-6 h-6" />
          <span class="text-gray-600 font-medium">Đăng ký với Google</span>
        </button>
      </div>
    </div>
  </div>
  <Footer />
</template>

<script setup>
import Footer from "../components/Footer.vue";
import Header from "../components/Header/index.vue";
import bcrypt from "bcryptjs";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { supabase } from "../utils/supabase";

const router = useRouter();
const email = ref("");
const password = ref("");

const registerWithEmail = async () => {
  if (!email.value || !password.value) {
    alert("Vui lòng nhập đầy đủ thông tin.");
    return;
  }

  // Kiểm tra email đã tồn tại trong bảng Users chưa
  const { data: existingUser, error: checkError } = await supabase
    .from("Users")
    .select("UserID")
    .eq("Email", email.value)
    .single();

  if (existingUser) {
    alert("Email này đã được đăng ký. Vui lòng dùng email khác.");
    return;
  }

  // Đăng ký với Supabase Auth
  const { data, error } = await supabase.auth.signUp({
    email: email.value,
    password: password.value,
  });

  if (error) {
    alert("Đăng ký thất bại: " + error.message);
    return;
  }

  // Hash mật khẩu
  const hashedPassword = await bcrypt.hash(password.value, 10);

  alert("Đăng ký thành công! Vui lòng nhập thông tin và xác nhận email.");
  router.push({
    path: "/register-info",
    query: { email: email.value, password: hashedPassword },
  });
};

// Đăng ký bằng Google
const registerWithGoogle = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: window.location.origin + "/register-info",
    },
  });
  if (error) {
    alert("Đăng ký với Google thất bại: " + error.message);
  }
};

const goToLogin = () => {
  router.push("/login");
};
</script>
