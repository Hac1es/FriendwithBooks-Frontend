<template>
  <div>
    <!-- Nút Lọc -->
    <button
      @click="isOpen = true"
      class="flex items-center space-x-1 text-[#661C1C] text-sm font-semibold font-itim"
    >
      <FilterIcon />
      <span>Lọc</span>
    </button>

    <!-- Overlay -->
    <transition name="fade">
      <div
        v-show="isOpen"
        class="fixed inset-0 z-40 bg-black/40"
        @click.self="isOpen = false"
      />
    </transition>

    <!-- Sidebar trượt -->
    <transition name="slide">
      <div
        v-show="isOpen"
        class="fixed top-0 left-0 w-4/5 max-w-xs h-full bg-[#f8f5e9] z-50 shadow-lg p-4 overflow-y-auto"
      >
        <!-- Đóng -->
        <div class="flex justify-end mb-2">
          <button @click="isOpen = false" class="text-[#400b0b] text-lg">
            ✕
          </button>
        </div>

        <!-- SearchBar UI (giống SearchBar.vue) -->
        <div class="mb-4 relative flex items-center">
          <input
            v-model="searchText"
            @input="handleSearch"
            @keyup.enter="handleFind(searchText)"
            type="text"
            placeholder="Tìm kiếm sản phẩm"
            class="px-4 py-2 rounded-md border-2 border-black bg-[#f3f0f0] text-left outline-none flex-1"
          />
          <button class="ml-2" @click="handleFind(searchText)">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
              />
            </svg>
          </button>
          <!-- Suggestion List -->
          <div
            v-if="showSuggestions"
            class="absolute left-0 right-0 bg-white shadow-lg z-10 mt-1 rounded"
            style="top: 110%"
          >
            <div
              v-if="suggestionList.length != 0"
              v-for="item in suggestionList"
              :key="item.bookID"
              class="p-2 hover:bg-gray-100 cursor-pointer flex items-center"
              @click="handleSuggestionClick(item)"
            >
              <img :src="item.imgURL1" class="w-8 h-12 mr-2 object-cover" />
              <div class="flex-1">
                <div class="text-[#3b3b3b] text-sm">{{ item.title }}</div>
                <div class="text-[#a50202] text-xs">{{ item.author }}</div>
              </div>
              <div class="text-xs text-right">{{ `${item.price} đ` }}</div>
            </div>
            <div v-else class="p-2 text-gray-400 text-sm">Không có gợi ý</div>
          </div>
        </div>

        <!-- Nội dung Filter -->
        <Filter @filterChange="(payload) => $emit('filterChange', payload)" />
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { Filter as FilterIcon } from "lucide-vue-next";
import Filter from "./Filter.vue";
import axios from "../../utils/axios";
import { useRouter } from "vue-router";

const isOpen = ref(false);

// SearchBar logic (giống DesktopHeader)
const searchText = ref("");
const suggestionList = ref([]);
const showSuggestions = ref(false);
const router = useRouter();
let searchTimeout = null;

function handleSearch(e) {
  const val = typeof e === "string" ? e : searchText.value;
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

function handleFind(val) {
  if (val && val.trim() !== "") {
    isOpen.value = false;
    router.push({ path: "/Products", query: { name: val.trim() } });
  }
}

function handleSuggestionClick(item) {
  isOpen.value = false;
  router.push(`/Products/${item.bookID}`);
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}
.slide-enter-from {
  transform: translateX(-100%);
}
.slide-leave-to {
  transform: translateX(-100%);
}
</style>
