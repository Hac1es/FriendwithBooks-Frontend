<template>
  <div
    class="w-full md:w-[calc(100%-224px)] mx-auto py-0 flex justify-between items-center"
  >
    <div class="w-[214px] h-[77px]">
      <img src="/Logo.png" class="object-cover w-full h-full" />
    </div>
    <!-- Nút Log out, chỉ hiển thị khi đã đăng nhập -->
    <button
      v-if="auth && userInfo"
      class="flex flex-col items-center text-[#3b3b3b] hover:text-[#a50202] focus:outline-none"
      @click="logout"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="w-6 h-6 mb-1"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1"
        />
      </svg>
      <span class="text-xs">Log out</span>
    </button>
  </div>
  <Navigation />
</template>

<script setup>
import Navigation from "./Navigation.vue";
import { useStore } from "vuex";
import { computed } from "vue";
import { supabase } from "../../../utils/supabase";

const store = useStore();
const auth = computed(() => store.state.isAuthenticated);
const userInfo = computed(() => store.state.userInfo);

function logout() {
  supabase.auth.getSession().then(({ data }) => {
    if (data.session) {
      supabase.auth.signOut();
    }
  });
  localStorage.removeItem("token");
  localStorage.removeItem("userInfo");
  localStorage.removeItem("cart");
  store.dispatch("logout");
}
</script>
