<template>
  <div class="w-full flex justify-center">
    <div
      class="bg-white rounded-md border border-[#ececec] px-12 py-3 flex items-center text-base font-medium text-[#3b3b3b] shadow-sm my-5 max-w-6xl w-full mx-auto"
    >
      <router-link to="/" class="hover:underline flex items-center breadcrumb-link">
        Trang chủ
      </router-link>
      <span class="mx-3 text-[#a50202] breadcrumb-separator">/</span>
      <span class="text-[#a50202] breadcrumb-current">{{ currentPage }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const currentPage = computed(() => {
  const path = route.path

  if (path.includes('thanh-toan')) return 'Thanh toán'
  if (path.includes('gio-hang')) return 'Giỏ hàng'
  if (path.includes('san-pham')) return 'Sản phẩm'
  if (path.includes('tai-khoan')) return 'Tài khoản'
  if (path.includes('don-hang')) return 'Đơn hàng'
  if (path === '/' || path === '') return 'Trang chủ'

  // Nếu không khớp, lấy segment cuối và chuyển sang Title Case
  const segments = path.split('/').filter(Boolean)
  if (segments.length > 0) {
    const last = segments[segments.length - 1]
    return last.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
  }
  return 'Trang chủ'
})
</script>

<style scoped>
.breadcrumb-link {
  color: #333;
  text-decoration: none;
  font-size: 16px;
}
.breadcrumb-separator {
  margin: 0 14px;
  color: #a50202;
}
.breadcrumb-current {
  color: #a50202;
  font-size: 16px;
}
</style>
