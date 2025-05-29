<template></template>
<script setup>
import { onMounted } from "vue";
import { supabase } from "../utils/supabase";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

const store = useStore();
const router = useRouter();

onMounted(async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    const email = user.email;
    const { data: userInfo } = await supabase
      .from("Users")
      .select("Role")
      .eq("Email", email)
      .single();

    if (!userInfo) {
      alert("Tài khoản Google chưa được đăng ký trong hệ thống. Vui lòng đăng ký.");
      await supabase.auth.signOut();
      router.push("/register");
      return;
    }

    store.dispatch("login", userInfo.Role);
    alert("Đăng nhập với Google thành công!");
  }
});
</script>