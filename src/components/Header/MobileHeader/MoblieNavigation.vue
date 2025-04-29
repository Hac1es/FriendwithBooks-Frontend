<template>
  <div class="font-instrument">
    <!-- Hamburger Button -->
    <button @click="toggleMenu" class="p-4 focus:outline-none">
      <svg
        v-if="!isOpen"
        class="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M4 6h16M4 12h16M4 18h16"
        />
      </svg>
      <svg
        v-else
        class="w-6 h-6 z-50"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>

    <!-- Slide-in Menu -->
    <transition name="slide-menu">
      <div
        v-if="isOpen"
        class="fixed top-0 right-0 w-3/4 max-w-sm bg-[#f8f8f8] shadow-lg p-6 z-50 overflow-y-auto flex flex-col h-full"
      >
        <nav class="space-y-4 flex-grow">
          <a
            href="#"
            class="block hover:text-[#a50202] font-semibold text-[#a50202]"
            >Trang chủ</a
          >

          <div>
            <button
              @click="toggleSubmenu"
              class="flex justify-between items-center w-full text-left hover:text-[#a50202]"
            >
              <span>Sản phẩm</span>
              <svg
                :class="{ 'transform rotate-90': submenuOpen }"
                class="w-4 h-4 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>

            <div
              v-if="submenuOpen"
              class="mt-2 ml-4 space-y-2 text-sm text-gray-700"
            >
              <p class="font-bold text-[#894a4a]">Sách Tiếng Việt</p>
              <ul class="pl-2">
                <li>Tiểu thuyết</li>
                <li>Sách giáo khoa – Tham khảo</li>
                <li>Khoa học – Kỹ thuật</li>
                <li>Lịch sử – Nghệ thuật</li>
                <li>Tôn giáo – Tâm linh</li>
                <li>Văn hóa – Địa lý – Du lịch</li>
                <li>Chính trị</li>
              </ul>

              <p class="font-bold text-[#894a4a] mt-4">Foreign Books</p>
              <ul class="pl-2">
                <li>Fantasy & Sci-Fi</li>
                <li>Novel</li>
                <li>Business & Management</li>
                <li>Science & Technology</li>
                <li>History & Politics</li>
              </ul>

              <p class="font-bold text-[#894a4a] mt-4">Văn phòng phẩm</p>
              <ul class="pl-2">
                <li>Bút – Viết các loại</li>
                <li>Sổ tay các loại</li>
                <li>Dụng cụ học sinh</li>
                <li>Dụng cụ văn phòng</li>
              </ul>

              <p class="font-bold text-[#894a4a] mt-4">
                Quà lưu niệm – Đồ chơi
              </p>
              <ul class="pl-2">
                <li>Thú nhồi bông</li>
                <li>Mô hình</li>
                <li>Đồ chơi theo phim</li>
                <li>Khác</li>
              </ul>
            </div>
          </div>

          <a href="#" class="block hover:text-[#a50202]">Chính sách</a>
          <a href="#" class="block hover:text-[#a50202]">Hỗ trợ</a>
        </nav>

        <div class="flex justify-between items-center mt-10 px-2 shrink-0">
          <!-- Tài khoản -->
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
    </transition>

    <!-- Overlay khi mở menu -->
    <transition name="fade">
      <div
        v-if="isOpen"
        @click="closeMenu"
        class="fixed inset-0 bg-black bg-opacity-30 z-40"
      ></div>
    </transition>
  </div>
</template>

<script setup>
import { ref } from "vue";

const isOpen = ref(false);
const submenuOpen = ref(false);

const toggleMenu = () => {
  isOpen.value = !isOpen.value;
  if (!isOpen.value) {
    submenuOpen.value = false;
  }
};

const toggleSubmenu = () => {
  submenuOpen.value = !submenuOpen.value;
};

const closeMenu = () => {
  isOpen.value = false;
  submenuOpen.value = false;
};
</script>

<style scoped>
.slide-menu-enter-active,
.slide-menu-leave-active {
  transition: transform 0.3s ease;
}
.slide-menu-enter-from {
  transform: translateX(100%);
}
.slide-menu-enter-to {
  transform: translateX(0);
}
.slide-menu-leave-from {
  transform: translateX(0);
}
.slide-menu-leave-to {
  transform: translateX(100%);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}
</style>
