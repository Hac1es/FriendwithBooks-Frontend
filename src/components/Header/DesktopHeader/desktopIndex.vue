<template>
  <div class="w-full md:w-[calc(100%-224px)] mx-auto py-4 flex justify-between">
    <div class="w-[214px] h-[77px]">
      <img src="/Logo.png" class="object-cover w-full h-full" />
    </div>
    <div class="flex gap-4 justify-between items-center">
      <SearchBar placeholder="Tìm kiếm sản phẩm" />
      <button
        class="flex flex-col items-center text-[#3b3b3b] hover:text-[#a50202]"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-6 h-6 mb-1"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            d="M12 12c2.7 0 4.9-2.2 4.9-4.9S14.7 2.2 12 2.2 7.1 4.4 7.1 7.1 9.3 12 12 12Zm0 2.4c-3.1 0-9.3 1.6-9.3 4.7v1.6h18.6v-1.6c0-3.1-6.2-4.7-9.3-4.7Z"
          />
        </svg>
        <span class="text-xs">Tài khoản</span>
      </button>

      <!-- Giỏ hàng -->
      <button
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
      </button>
    </div>
  </div>
  <Navigation />
</template>

<script setup>
import { ref } from "vue";
import Navigation from "./Navigation.vue";
import SearchBar from "../../SearchBar.vue";
</script>
