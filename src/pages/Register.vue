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
          class="w-full p-4 rounded-xl bg-gray-200 outline-none"
          v-model="address"
        />

        <button
          class="bg-yellow-300 font-semibold py-3 mt-6 w-full rounded-xl hover:bg-yellow-400"
          @click="register"
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
          @click="signInWithGoogle"
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
import bcrypt from "bcryptjs";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { supabase } from "../utils/supabase";

const router = useRouter();
const email = ref("");
const password = ref("");
const fullName = ref("");
const phone = ref("");
const address = ref("");

const register = async () => {
  if (!email.value || !password.value || !fullName.value || !phone.value || !address.value) {
    alert("Vui lòng nhập đầy đủ thông tin.");
    return;
  }

  // Kiểm tra email đã tồn tại chưa
  const { data: existingUser, error: selectError } = await supabase
    .from("Users")
    .select("UserID")
    .eq("Email", email.value)
    .single();

  if (existingUser) {
    alert("Email đã được đăng ký.");
    return;
  }
  if (selectError && selectError.code !== "PGRST116") {
    alert("Lỗi kiểm tra email: " + selectError.message);
    return;
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password.value, 10);

  // Thêm user mới
  const { error: insertError } = await supabase
    .from("Users")
    .insert([{ Email: email.value, Password: hashedPassword, FullName: fullName.value, Phone: phone.value, Address: address.value }]);

  if (insertError) {
    alert("Đăng ký thất bại: " + insertError.message);
    return;
  }

  alert("Đăng ký thành công! Vui lòng đăng nhập.");
  router.push("/Login");
};

const signInWithGoogle = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: window.location.origin + "/", // hoặc trang bạn muốn chuyển hướng sau khi đăng nhập
    },
  });
  if (error) {
    alert("Đăng ký với Google thất bại: " + error.message);
  }
};

const goToLogin = () => {
  router.push("/Login");
};
</script>
