<template>
  <nav
    class="w-full md:w-[calc(100%-224px)] mx-auto bg-[#f2f6f8] border border-t-1 py-2 font-instrument relative"
  >
    <div class="flex justify-between items-center px-16">
      <!-- Trang chủ -->
      <router-link
        to="/"
        class="hover:text-[#a50202] font-semibold text-[#a50202]"
      >
        Trang chủ
      </router-link>

      <!-- Sản phẩm -->
      <router-link
        to="/Products"
        @mouseenter="openMenu"
        @mouseleave="closeMenu"
      >
        <span class="hover:text-[#a50202] cursor-pointer">Sản phẩm</span>
        <transition name="slide-fade">
          <div
            v-if="isOpen"
            class="absolute left-0 top-full w-full p-4 bg-[#f8f8f8] flex justify-between px-8 text-sm"
          >
            <!-- Cột 1 -->
            <div>
              <h3 class="font-bold text-[#894a4a] mb-2">Sách Tiếng Việt</h3>
              <ul class="space-y-1">
                <li>Tiểu thuyết</li>
                <li>Sách giáo khoa – Tham khảo</li>
                <li>Khoa học – Kỹ thuật</li>
                <li>Lịch sử – Nghệ thuật</li>
                <li>Tôn giáo – Tâm linh</li>
                <li>Văn hóa – Địa lý – Du lịch</li>
                <li>Chính trị</li>
              </ul>
            </div>

            <!-- Cột 2 -->
            <div>
              <h3 class="font-bold text-[#894a4a] mb-2">Foreign Books</h3>
              <ul class="space-y-1">
                <li>Fantasy & Sci-Fi</li>
                <li>Novel</li>
                <li>Business & Management</li>
                <li>Science & Technology</li>
                <li>History & Politics</li>
              </ul>
            </div>

            <!-- Cột 3 -->
            <div>
              <h3 class="font-bold text-[#894a4a] mb-2">Văn phòng phẩm</h3>
              <ul class="space-y-1">
                <li>Bút – Viết các loại</li>
                <li>Sổ tay các loại</li>
                <li>Dụng cụ học sinh</li>
                <li>Dụng cụ văn phòng</li>
              </ul>
            </div>

            <!-- Cột 4 -->
            <div>
              <h3 class="font-bold text-[#894a4a] mb-2">
                Quà lưu niệm – Đồ chơi
              </h3>
              <ul class="space-y-1">
                <li>Thú nhồi bông</li>
                <li>Mô hình</li>
                <li>Đồ chơi theo phim</li>
                <li>Khác</li>
              </ul>
            </div>
          </div>
        </transition>
      </router-link>

      <!-- Chính sách -->
      <span class="hover:text-[#a50202] cursor-pointer">Chính sách</span>

      <!-- Hỗ trợ -->
      <span class="hover:text-[#a50202] cursor-pointer">Hỗ trợ</span>
    </div>
  </nav>
</template>

<script setup>
import { ref, onBeforeUnmount } from "vue";

const isOpen = ref(false);
let timeoutId = null;

const openMenu = () => {
  clearTimeout(timeoutId);
  isOpen.value = true;
};

const closeMenu = () => {
  timeoutId = setTimeout(() => {
    isOpen.value = false;
  }, 300);
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
