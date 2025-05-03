<template>
  <nav
    class="w-full md:w-[calc(100%-224px)] mx-auto bg-[#f2f6f8] border border-t-1 py-2 font-instrument relative"
  >
    <div class="flex justify-between items-center px-16">
      <a href="#" class="hover:text-[#a50202] font-semibold text-[#a50202]">
        Tin nhắn
      </a>
      
      <a href="#" class="hover:text-[#a50202]">Kho hàng</a>
      <a href="#" class="hover:text-[#a50202]">Thống kê</a>
    </div>
  </nav>
</template>

<script setup>
import { ref } from "vue";
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
