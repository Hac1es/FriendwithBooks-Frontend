<template>
  <nav
    class="w-full md:w-[calc(100%-224px)] mx-auto bg-[#f2f6f8] border border-t-1 py-2 font-instrument relative"
  >
    <div class="flex justify-between items-center px-16">
      <router-link 
        to="/admin/chat" 
        :class="[
          'hover:text-[#a50202]', 
          isActive('/admin/chat') ? 'font-semibold text-[#a50202]' : ''
        ]"
      >
        Tin nhắn
      </router-link>
      
      <router-link 
        to="/admin/products" 
        :class="[
          'hover:text-[#a50202]', 
          isActive('/admin/products') ? 'font-semibold text-[#a50202]' : ''
        ]"
      >
        Kho hàng
      </router-link>
      
      <router-link 
        to="/admin/stats" 
        :class="[
          'hover:text-[#a50202]', 
          isActive('/admin/stats') ? 'font-semibold text-[#a50202]' : ''
        ]"
      >
        Thống kê
      </router-link>
    </div>
  </nav>
</template>

<script setup>
import { useRoute } from "vue-router";

const route = useRoute();

// Kiểm tra xem route hiện tại có khớp với path không
const isActive = (path) => {
  return route.path.startsWith(path);
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
