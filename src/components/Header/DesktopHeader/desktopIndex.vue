<template>
  <div class="w-full md:w-[calc(100%-224px)] mx-auto py-4 flex justify-between">
    <div class="w-[214px] h-[77px]">
      <img src="/Logo.png" class="object-cover w-full h-full" />
    </div>
    <div class="flex gap-4 justify-between items-center relative">
      <SearchBar
        placeholder="Tìm kiếm sản phẩm"
        @search="handleSearch"
        @find="handleFind"
      />
      <div
        v-if="showSuggestions"
        class="absolute top-full left-0 w-full bg-white shadow-lg z-10 font-inter"
      >
        <div
          v-if="suggestionList.length != 0"
          v-for="item in suggestionList"
          :key="item.bookID"
          class="p-2 pb-4 hover:bg-gray-100 cursor-pointer flex relative"
          @click="handleSuggestionClick(item)"
        >
          <div>
            <img :src="item.imgURL1" class="w-8 h-12 mr-2 inline-block" />
          </div>
          <div>
            <div class="text-[#3b3b3b] text-sm">{{ item.title }}</div>
            <div class="text-[#a50202] text-xs">{{ item.author }}</div>
          </div>
          <div class="absolute bottom-2 right-4">{{ `${item.price} đ` }}</div>
        </div>
      </div>

      <!-- Trang cá nhân -->
      <router-link
        :to="dynamicRoute.profile"
        class="flex flex-col items-center text-[#3b3b3b] hover:text-[#a50202]"
      >
        <svg
          v-if="!auth || !userInfo"
          xmlns="http://www.w3.org/2000/svg"
          class="w-6 h-6 mb-1"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            d="M12 12c2.7 0 4.9-2.2 4.9-4.9S14.7 2.2 12 2.2 7.1 4.4 7.1 7.1 9.3 12 12 12Zm0 2.4c-3.1 0-9.3 1.6-9.3 4.7v1.6h18.6v-1.6c0-3.1-6.2-4.7-9.3-4.7Z"
          />
        </svg>
        <div v-else class="w-6 h-6 mb-1">
          <img :src="userInfo.avatar" class="rounded-full object-cover" />
        </div>
        <span class="text-xs" :class="auth && userInfo ? 'font-bold' : ''">{{
          auth && userInfo ? userInfo.name.trim().split(" ").pop() : "Tài khoản"
        }}</span>
      </router-link>

      <!-- Nút Log out, chỉ hiển thị khi đã đăng nhập -->
      <button
        v-if="auth && userInfo"
        class="flex flex-col items-center text-[#3b3b3b] hover:text-[#a50202] focus:outline-none"
        @click="logout"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1" />
        </svg>
        <span class="text-xs">Log out</span>
      </button>

      <!-- Giỏ hàng -->
      <router-link
        :to="dynamicRoute.cart"
        class="flex flex-col items-center text-[#3b3b3b] hover:text-[#a50202]"
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
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.3 5.3a1 1 0 001 .7h11.6a1 1 0 001-.7L17 13M7 13l1.3-5.3M10 21a1 1 0 11-2 0 1 1 0 012 0zm8 0a1 1 0 11-2 0 1 1 0 012 0z"
          />
        </svg>
        <span class="text-xs">Giỏ hàng</span>
      </router-link>
    </div>
  </div>
  <Navigation />
</template>

<script setup>
import { ref, watch, computed } from "vue";
import Navigation from "./Navigation.vue";
import SearchBar from "../../SearchBar.vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import axios from "../../../utils/axios";

let dynamicRoute = ref({
  profile: "/UserProfile",
  cart: "/CartView",
});
const searchText = ref("");
const suggestionList = ref([]);
const showSuggestions = ref(false);
const router = useRouter();
const store = useStore();
const auth = computed(() => store.state.isAuthenticated);
const userInfo = computed(() => store.state.userInfo);
let searchTimeout = null;

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("userInfo");
  store.dispatch("logout");
}

function handleSearch(val) {
  searchText.value = val;
  clearTimeout(searchTimeout);
  if (val.length > 0) {
    searchTimeout = setTimeout(() => {
      axios.get(`/Book/query?name=${val}`).then((res) => {
        suggestionList.value = (res.data.items || []).slice(0, 7);
        showSuggestions.value = suggestionList.value.length > 0;
      });
    }, 500);
  } else {
    showSuggestions.value = false;
  }
}

const handleFind = (val) => {
  if (val && val.trim() !== "") {
    router.push({ path: "/Products", query: { name: val.trim() } });
  }
};

watch(
  auth,
  (newVal) => {
    if (newVal) {
      dynamicRoute.value.profile = "/UserProfile";
      dynamicRoute.value.cart = "/CartView";
    } else {
      dynamicRoute.value.profile = "/login";
      dynamicRoute.value.cart = "/login";
    }
  },
  { immediate: true }
);
</script>
