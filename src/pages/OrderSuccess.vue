<template>
  <Header />
  <div class="container mx-auto p-8 text-center min-h-[60vh]">
    <div v-if="orderId" class="bg-white p-6 rounded-lg shadow-lg">
      <h2 class="text-3xl font-semibold text-green-600 mb-4">Đặt hàng thành công!</h2>
      <p class="text-gray-700 text-lg mb-6">
        Cảm ơn bạn đã đặt hàng. Đơn hàng của bạn với mã
        <span class="font-bold text-[#d97c5e]">#{{ orderId }}</span> đã được tiếp nhận.
      </p>
      <p class="text-gray-600 mb-8">
        Chúng tôi sẽ xử lý đơn hàng của bạn trong thời gian sớm nhất.
      </p>
      <router-link
        to="/"
        class="bg-[#d97c5e] hover:bg-[#c56e52] text-white font-semibold py-3 px-6 rounded-md transition duration-200 inline-block"
      >
        Tiếp tục mua sắm
      </router-link>
    </div>
    <div v-else class="bg-white p-6 rounded-lg shadow-lg">
      <h2 class="text-2xl font-semibold text-red-600 mb-4">Lỗi</h2>
      <p class="text-gray-700 text-lg mb-6">
        Không tìm thấy thông tin đơn hàng.
      </p>
      <router-link
        to="/"
        class="bg-[#d97c5e] hover:bg-[#c56e52] text-white font-semibold py-3 px-6 rounded-md transition duration-200 inline-block"
      >
        Quay về trang chủ
      </router-link>
    </div>
  </div>
  <Footer />
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import Header from "../components/Header/index.vue";
import Footer from "../components/Footer.vue";

const route = useRoute();
const orderId = ref(null);

onMounted(() => {
  orderId.value = route.params.orderId;
});
</script>

<style scoped>
/* Có thể thêm các style tùy chỉnh nếu cần */
</style> 