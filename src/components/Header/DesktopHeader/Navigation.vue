<template>
  <nav
    class="w-full md:w-[calc(100%-224px)] mx-auto bg-[#f2f6f8] border border-t-1 py-2 font-instrument relative"
  >
    <div class="flex justify-between items-center px-16">
      <!-- Trang chủ -->
      <router-link to="/" class="hover:text-[#a50202]"> Trang chủ </router-link>

      <!-- Sản phẩm -->
      <div @mouseenter="openMenu" @mouseleave="closeMenu">
        <router-link class="hover:text-[#a50202] cursor-pointer" to="/products"
          >Sản phẩm</router-link
        >
        <transition name="slide-fade">
          <div
            v-show="isOpen"
            class="absolute left-0 top-full w-full p-4 bg-[#f8f8f8] flex justify-between px-8 text-sm z-50"
          >
            <!-- Cột 1 và 2 -->
            <div v-for="(subCategories, parent) in categories" :key="parent">
              <h3 class="font-bold text-[#894a4a] mb-2">{{ parent }}</h3>
              <ul class="space-y-1">
                <li
                  v-for="sub in subCategories"
                  :key="sub"
                  class="cursor-pointer hover:text-[#a50202]"
                  @click.stop="goToCategory(parent, sub.name)"
                >
                  {{ sub.name }}
                </li>
              </ul>
            </div>

            <!-- Cột 3 -->
            <div>
              <h3 class="font-bold text-[#894a4a] mb-2">Văn phòng phẩm</h3>
              <ul class="space-y-1">
                <li class="cursor-pointer hover:text-[#a50202]">
                  Bút – Viết các loại
                </li>
                <li class="cursor-pointer hover:text-[#a50202]">
                  Sổ tay các loại
                </li>
                <li class="cursor-pointer hover:text-[#a50202]">
                  Dụng cụ học sinh
                </li>
                <li class="cursor-pointer hover:text-[#a50202]">
                  Dụng cụ văn phòng
                </li>
              </ul>
            </div>

            <!-- Cột 4 -->
            <div>
              <h3 class="font-bold text-[#894a4a] mb-2">
                Quà lưu niệm – Đồ chơi
              </h3>
              <ul class="space-y-1">
                <li class="cursor-pointer hover:text-[#a50202]">
                  Thú nhồi bông
                </li>
                <li class="cursor-pointer hover:text-[#a50202]">Mô hình</li>
                <li class="cursor-pointer hover:text-[#a50202]">
                  Đồ chơi theo phim
                </li>
                <li class="cursor-pointer hover:text-[#a50202]">Khác</li>
              </ul>
            </div>
          </div>
        </transition>
      </div>

      <!-- Chính sách -->
      <router-link to="/License" class="hover:text-[#a50202] cursor-pointer"
        >Chính sách</router-link
      >

      <!-- Hỗ trợ -->
      <button
        @click.stop="showChat"
        class="hover:text-[#a50202] cursor-pointer"
      >
        Hỗ trợ
      </button>
    </div>
  </nav>
</template>

<script setup>
import { ref, onBeforeUnmount } from "vue";
import { useStore } from "vuex";
import { useFilter } from "../../../composables/useFilter.js";
import { useRouter } from "vue-router";

const isOpen = ref(false);
const store = useStore();
let timeoutId = null;
const router = useRouter();
const { categories, getCategoryId } = useFilter(() => {}); // Không cần emit ở đây

const openMenu = () => {
  clearTimeout(timeoutId);
  isOpen.value = true;
};

const closeMenu = () => {
  timeoutId = setTimeout(() => {
    isOpen.value = false;
  }, 300);
};

const showChat = () => {
  store.commit("showChat");
};

const goToCategory = (parent, sub) => {
  const categoryId = getCategoryId(parent, sub);
  if (categoryId) {
    router.push({ path: "/products", query: { category: categoryId } });
    isOpen.value = false;
  }
};

onBeforeUnmount(() => {
  clearTimeout(timeoutId);
});
</script>

<style scoped>
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}
.slide-fade-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}
.slide-fade-enter-to {
  opacity: 1;
  transform: translateY(0);
}
.slide-fade-leave-from {
  opacity: 1;
  transform: translateY(0);
}
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
