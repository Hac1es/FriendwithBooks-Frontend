<template>
  <router-view :key="$route.fullPath" />
  <ChatPopup />
</template>

<script setup>
import { onMounted, computed, watch } from "vue";
import { useStore } from "vuex";
import { useRouter, RouterView } from "vue-router";
import ChatPopup from "./components/ChatPopup.vue";
import { jwtDecode } from "jwt-decode";

const store = useStore();
const router = useRouter();

const isAuthenticated = computed(() => store.state.isAuthenticated);
const role = computed(() => store.state.role);

onMounted(() => {
  const token = localStorage.getItem("token");
  if (token) {
    try {
      const decoded = jwtDecode(token);
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      store.dispatch("login", decoded.role);
      store.dispatch("setUserInfo", userInfo);
    } catch (e) {
      // Token lỗi, xóa đi
      localStorage.removeItem("token");
    }
  }

  if (isAuthenticated.value && role.value === "admin") {
    router.push("/admin/chat");
  }
});

watch([isAuthenticated, role], ([newAuth, newRole]) => {
  if (newAuth && newRole === "admin") {
    router.push("/admin/chat");
  } else if (newAuth && newRole === "user") {
    router.push("/");
  }
  else {
    router.push("/");
  }
});
</script>
