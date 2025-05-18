<template>
<Header />
  <div class="bg-[#f9f5ea] min-h-screen py-10 px-32 w-full">
    <div class="flex flex-row items-start gap-32 w-full">
      <!-- Profile Section -->
      <aside class="w-[260px] flex flex-col items-center pt-2">
        <div class="w-40 h-40 rounded-full overflow-hidden border border-gray-300 mb-8">
          <img
            src="/Picture3.png"
            alt="Avatar"
            class="w-full h-full object-cover"
          />
        </div>
        <h2 class="text-xl font-semibold text-[#7a3c1a] mb-6 text-center">{{ userProfile.name }}</h2>
        <button
          v-if="!isEditing"
          @click="isEditing = true"
          class="text-xs border border-gray-400 bg-white hover:bg-gray-100 py-2 px-6 rounded-full text-[#7a3c1a] transition"
        >
          Chỉnh sửa thông tin
        </button>
        <!-- Edit Form nhỏ gọn, không khung ngoài -->
        <div v-if="isEditing" class="w-full flex justify-center">
          <form class="w-full flex flex-col gap-3" @submit.prevent="saveProfile">
            <div>
              <label class="block text-xs text-[#7a3c1a] mb-1 font-semibold">Tên</label>
              <input
                type="text"
                v-model="userProfile.name"
                class="w-full px-2 py-1 border border-gray-400 rounded-md bg-black text-white text-sm"
              />
            </div>
            <div>
              <label class="block text-xs text-[#7a3c1a] mb-1 font-semibold">Email</label>
              <input
                type="email"
                v-model="userProfile.email"
                class="w-full px-2 py-1 border border-gray-400 rounded-md bg-black text-white text-sm"
              />
            </div>
            <div>
              <label class="block text-xs text-[#7a3c1a] mb-1 font-semibold">Số điện thoại</label>
              <input
                type="tel"
                v-model="userProfile.phone"
                class="w-full px-2 py-1 border border-gray-400 rounded-md bg-black text-white text-sm"
              />
            </div>
            <div>
              <label class="block text-xs text-[#7a3c1a] mb-1 font-semibold">Địa chỉ nhận hàng</label>
              <div v-for="(addr, idx) in userProfile.address" :key="idx" class="mb-2">
                <input
                  type="text"
                  v-model="userProfile.address[idx]"
                  class="w-full px-2 py-1 border border-gray-400 rounded-md bg-black text-white text-sm"
                />
              </div>
              <a href="#" class="text-xs text-[#8b0000] hover:text-red-800 flex items-center transition" @click.prevent="addAddress">
                <span>+ Thêm...</span>
              </a>
            </div>
            <div class="flex gap-2 mt-2 justify-center">
              <button
                type="submit"
                class="bg-[#8b0000] text-white px-4 py-1 rounded-md text-xs hover:bg-[#7a0000] transition"
              >
                Lưu
              </button>
              <button
                type="button"
                @click="cancelEdit"
                class="bg-gray-800 text-white px-4 py-1 rounded-md text-xs hover:bg-gray-900 transition"
              >
                Thoát
              </button>
            </div>
          </form>
        </div>
      </aside>

      <!-- Main Content -->
      <section class="flex-1 flex flex-col">
        <!-- ĐÃ GIAO -->
        <div class="mb-12">
          <h3 class="text-xl font-bold text-[#8b0000] mb-6 uppercase">Đã giao</h3>
          <div class="flex flex-row gap-32">
            <article
              v-for="(book, index) in deliveredBooks"
              :key="'delivered-' + index"
              class="w-[180px] flex flex-col items-center"
            >
              <img
                :src="book.image"
                :alt="book.title"
                class="w-[120px] h-[160px] object-cover rounded mb-3"
              />
              <h4 class="font-medium text-base mb-1 leading-tight break-words text-center">{{ book.title }}</h4>
              <p class="text-sm text-gray-600 leading-tight break-words text-center">{{ book.author }}</p>
              <!-- "Xem thêm" chỉ dưới cuốn cuối cùng -->
              <template v-if="index === deliveredBooks.length - 1">
                <a
                  href="#"
                  class="text-base text-[#8b0000] hover:text-red-800 flex items-center transition mt-2"
                >
                  <span>Xem thêm</span>
                  <span class="ml-1">→</span>
                </a>
              </template>
            </article>
          </div>
        </div>

        <!-- ĐANG GIAO -->
        <div class="mb-12">
          <h3 class="text-xl font-bold text-[#8b0000] mb-6 uppercase">Đang giao</h3>
          <div class="flex flex-row gap-32">
            <article
              v-for="(book, index) in deliveringBooks"
              :key="'delivering-' + index"
              class="w-[180px] flex flex-col items-center"
            >
              <img
                :src="book.image"
                :alt="book.title"
                class="w-[120px] h-[160px] object-cover rounded mb-3"
              />
              <h4 class="font-medium text-base mb-1 leading-tight break-words text-center">{{ book.title }}</h4>
              <p class="text-sm text-gray-600 leading-tight break-words text-center">{{ book.author }}</p>
            </article>
          </div>
        </div>

        <!-- ĐỔI HÀNG & TRẢ HÀNG -->
        <div class="mb-12">
          <h3 class="text-xl font-bold text-[#8b0000] mb-4 uppercase">Đổi hàng & Trả hàng</h3>
          <p class="text-base text-gray-600">Không có thông tin.</p>
        </div>
      </section>
    </div>

    <!-- Nút TRANG CHỦ ở góc phải dưới -->
<router-link
  to="/"
  class="absolute right-16 flex items-center cursor-pointer hover:scale-105 transition-transform z-50"
  style="bottom: -245px;"  
  title="Về trang chủ"
>
  <span
    class="flex items-center justify-center bg-white rounded-full shadow-sm p-3 text-[#8b0000] mr-3 border border-[#8b0000]"
  >
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <polyline points="15 8 10 12 15 16"></polyline>
    </svg>
  </span>
  <span class="font-semibold text-xl text-[#8b0000] tracking-wide">TRANG CHỦ</span>
</router-link>

  </div>
    <Footer />
</template>
<script setup>
import { ref, reactive } from 'vue'
import Footer from "../components/Footer.vue";
import Header from "../components/Header/indexcp.vue";

const isEditing = ref(false)

const userProfile = reactive({
  name: 'Anh Liêm',
  email: 'europequalitowc@goat.com',
  phone: '0123645987',
  address: ['151 Linh Trung, Thủ Đức, TPHCM', '125 Ngô Gia Tự, Quận 10, TPHCM']
})

const deliveredBooks = ref([
  {
    title: 'Điều kỳ diệu của tiệm tạp hóa Namiya',
    author: 'Higashino Keigo',
    image: '/Picture4.png',
  },
  {
    title: 'What is the World Cup?',
    author: 'Bonnie Bader',
    image: '/Picture4.png',
  },
  {
    title: 'Cristiano Ronaldo – All About Him',
    author: 'Michael Part – Dịch Trần Giáp',
    image: '/Picture4.png',
  },
])

const deliveringBooks = ref([
  {
    title: 'Cây cam ngọt của tôi',
    author: 'José Mauro de Vasconcelos',
    image: '/Picture4.png',
  },
])

function saveProfile() {
  isEditing.value = false
}

function cancelEdit() {
  isEditing.value = false
}

function addAddress() {
  userProfile.address.push('')
}
</script>
