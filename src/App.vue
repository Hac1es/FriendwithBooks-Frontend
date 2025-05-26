<template>
  <router-view :key="$route.fullPath" />
  <ChatPopup />
</template>

<script setup>
import { onMounted, computed } from "vue";
import { useStore } from "vuex";
import { useRouter, RouterView } from "vue-router";
import ChatPopup from "./components/ChatPopup.vue";

const store = useStore();
const router = useRouter();

const isAuthenticated = computed(() => store.state.isAuthenticated);
const role = computed(() => store.state.role);

onMounted(() => {
  if (isAuthenticated.value && role.value === "admin") {
    router.push("/admin/chat");
  }
});
</script>
