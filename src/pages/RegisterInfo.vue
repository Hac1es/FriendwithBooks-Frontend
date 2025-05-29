<template>
  <Header />
  <div class="min-h-screen bg-[#fdf9e5] flex items-center justify-center px-4">
    <div class="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm flex gap-8">
      <div class="flex-1">
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
          @click="updateInfo"
        >
          Đăng ký
        </button>
      </div>
    </div>
  </div>
  <Footer />
</template>

<script setup>
import Footer from "../components/Footer.vue";
import Header from "../components/Header/index.vue";
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { supabase } from "../utils/supabase";

const router = useRouter();
const route = useRoute();

const fullName = ref("");
const phone = ref("");
const address = ref("");
const email = ref("");
const password = ref("");

onMounted(async () => {
  // Lấy email từ query hoặc từ user session
  if (route.query.email) {
    email.value = route.query.email;
    password.value = route.query.password;
  } else {
    const { data: { user } } = await supabase.auth.getUser();
    if (user && user.email) {
      email.value = user.email;
    }
  }
});

const updateInfo = async () => {
  if (!fullName.value || !phone.value || !address.value) {
    alert("Vui lòng nhập đầy đủ thông tin.");
    return;
  }

  if (!email.value) {
    alert("Không tìm thấy email tài khoản.");
    return;
  }

  if (!/^(0\d{9})$/.test(phone.value)) {
    alert("Số điện thoại không hợp lệ. Vui lòng nhập đúng định dạng.");
    return;
  }

  // Nếu có email, kiểm tra và thêm vào bảng Users nếu chưa có
  if (email.value) {
    const { data: existingUser } = await supabase
      .from("Users")
      .select("UserID")
      .eq("Email", email.value)
      .single();

    if (!existingUser) {
      // Thêm user mới với email, các trường khác để trống
      await supabase.from("Users").insert([{ Email: email.value }]);
    }
    else {
      alert("Email đã tồn tại trong hệ thống.");
      await supabase.auth.signOut();
      router.push("/login");
      return;
    }
  }

  const { error } = await supabase
    .from("Users")
    .update({
      Password: password.value,
      FullName: fullName.value,
      Phone: phone.value,
      Address: address.value,
    })
    .eq("Email", email.value);

  if (error) {
    alert("Cập nhật thông tin thất bại: " + error.message);
    return;
  }

  alert("Cập nhật thông tin thành công!");
  await supabase.auth.signOut();
  router.push("/login");
};
</script>
