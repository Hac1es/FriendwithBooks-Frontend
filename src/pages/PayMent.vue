<template>
  <Header />
  <div
    class="bg-[#f5f0e1] min-h-screen py-8 flex justify-center font-instrument"
  >
    <div class="w-full max-w-[850px] px-2">
      <!-- Header -->
      <div class="flex items-center mb-7">
        <button
          class="relative w-10 h-10 flex items-center justify-center mr-3"
        >
          <span
            class="absolute inset-0 rounded-full border-2 border-[#d97c5e] bg-white shadow-md"
          ></span>
          <span
            class="relative z-10 w-7 h-7 rounded-full bg-white flex items-center justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#d97c5e"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </span>
        </button>
        <h1 class="text-xl font-extrabold text-[#d97c5e] tracking-wide">
          TRANG CHỦ
        </h1>
      </div>

      <!-- Customer Info -->
      <div
        class="bg-white rounded-xl border border-gray-300 shadow-[0_2px_8px_0_rgba(0,0,0,0.05)] p-4 mb-7"
      >
        <div class="font-semibold flex items-center mb-1 text-sm">
          Viết Tùng
          <span class="ml-2 text-gray-600 font-normal">0905022089</span>
        </div>
        <div class="text-gray-600 text-sm">Bcons Green View, Quốc lộ 1K</div>
        <div class="text-gray-600 text-sm">Đông Hòa, Dĩ An, Bình Dương</div>
      </div>

      <!-- Order List -->
      <div class="mb-7">
        <h2 class="text-xl font-extrabold text-[#6b3a2a] mb-3">ĐƠN HÀNG</h2>
        <div
          v-for="(item, idx) in orderItems"
          :key="idx"
          class="bg-white rounded-xl border border-gray-300 shadow-[0_2px_8px_0_rgba(0,0,0,0.05)] p-4 mb-3 flex items-center"
        >
          <img
            :src="item.img"
            alt="Sách"
            class="w-16 h-20 object-cover rounded-lg border border-gray-200 mr-4"
          />
          <div class="flex-1 flex justify-between items-center">
            <div>
              <div class="font-semibold text-base leading-tight">Tên sách</div>
              <div class="text-gray-600 text-sm font-bold leading-tight">
                Tác giả
              </div>
            </div>
            <div class="text-right">
              <div class="font-semibold text-base">100.000 VND</div>
              <div class="text-gray-500 text-xs">Phí vận chuyển: 25.000 đ</div>
              <div class="text-gray-500 text-xs">SL: 1</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Payment Methods -->
      <div class="mb-8">
        <h2 class="text-base font-extrabold text-[#6b3a2a] mb-3">
          PHƯƠNG THỨC THANH TOÁN
        </h2>
        <div class="flex gap-4">
          <label class="flex-1">
            <input
              type="radio"
              name="payment"
              value="momo"
              v-model="paymentMethod"
              class="hidden"
            />
            <div
              class="flex items-center h-14 rounded-xl border cursor-pointer bg-white px-4 transition-all shadow-[0_2px_8px_0_rgba(0,0,0,0.05)]"
              :class="
                paymentMethod === 'momo'
                  ? 'border-[#d97c5e] ring-2 ring-[#f2cfc1]'
                  : 'border-gray-300'
              "
            >
              <span
                class="w-5 h-5 rounded-full border flex items-center justify-center mr-2"
                :class="
                  paymentMethod === 'momo'
                    ? 'border-[#d97c5e]'
                    : 'border-gray-300'
                "
              >
                <span
                  v-if="paymentMethod === 'momo'"
                  class="w-3 h-3 rounded-full bg-[#d97c5e]"
                ></span>
              </span>
              <span class="flex-1 text-sm">MoMo</span>
              <img
                src="https://static.mservice.io/img/logo-momo.png"
                alt="MoMo"
                class="w-8 h-8 ml-2 rounded-full object-contain bg-white border border-gray-200"
              />
            </div>
          </label>
          <label class="flex-1">
            <input
              type="radio"
              name="payment"
              value="vnpay"
              v-model="paymentMethod"
              class="hidden"
            />
            <div
              class="flex items-center h-14 rounded-xl border cursor-pointer bg-white px-4 transition-all shadow-[0_2px_8px_0_rgba(0,0,0,0.05)]"
              :class="
                paymentMethod === 'vnpay'
                  ? 'border-[#2b6cb0] ring-2 ring-blue-100'
                  : 'border-gray-300'
              "
            >
              <span
                class="w-5 h-5 rounded-full border flex items-center justify-center mr-2"
                :class="
                  paymentMethod === 'vnpay'
                    ? 'border-[#2b6cb0]'
                    : 'border-gray-300'
                "
              >
                <span
                  v-if="paymentMethod === 'vnpay'"
                  class="w-3 h-3 rounded-full bg-[#2b6cb0]"
                ></span>
              </span>
              <span class="flex-1 text-sm">VNPAY</span>
              <img
                src="/Picture.png"
                alt="VNPAY"
                class="w-8 h-8 ml-2 object-contain bg-white border border-gray-200 rounded"
              />
            </div>
          </label>
          <label class="flex-1">
            <input
              type="radio"
              name="payment"
              value="cash"
              v-model="paymentMethod"
              class="hidden"
            />
            <div
              class="flex items-center h-14 rounded-xl border cursor-pointer bg-white px-4 transition-all shadow-[0_2px_8px_0_rgba(0,0,0,0.05)]"
              :class="
                paymentMethod === 'cash'
                  ? 'border-[#4caf50] ring-2 ring-green-100'
                  : 'border-gray-300'
              "
            >
              <span
                class="w-5 h-5 rounded-full border flex items-center justify-center mr-2"
                :class="
                  paymentMethod === 'cash'
                    ? 'border-[#4caf50]'
                    : 'border-gray-300'
                "
              >
                <span
                  v-if="paymentMethod === 'cash'"
                  class="w-3 h-3 rounded-full bg-[#4caf50]"
                ></span>
              </span>
              <span class="flex-1 text-sm">Tiền mặt</span>
              <img
                src="/Picture1.png"
                alt="tiền mặtt"
                class="w-8 h-8 ml-2 object-contain bg-white border border-gray-200 rounded"
              />
            </div>
          </label>
        </div>
      </div>

      <!-- Order Summary -->
      <div class="flex justify-end items-center">
        <div class="flex flex-col items-end w-full max-w-xs">
          <div class="flex items-center mb-3 w-full justify-between">
            <div class="font-semibold text-sm">Tổng cộng:</div>
            <div class="font-bold text-base">300.000 VND</div>
          </div>
          <button
            class="bg-[#d97c5e] hover:bg-[#c56e52] text-white font-semibold py-3 px-8 rounded-md transition duration-200 text-base min-w-[140px]"
          >
            Thanh toán
          </button>
        </div>
      </div>
    </div>
  </div>
  <Footer />
</template>

<script setup>
import { ref } from "vue";
import Footer from "../components/Footer.vue";
import Header from "../components/Header/index.vue";
const paymentMethod = ref("momo");
const orderItems = [
  {
    img: "https://salt.tikicdn.com/cache/w1200/ts/product/df/7d/da/d340edda2b0eacb7ddc47537cddb5e08.jpg",
  },
  {
    img: "https://salt.tikicdn.com/cache/w1200/ts/product/df/7d/da/d340edda2b0eacb7ddc47537cddb5e08.jpg",
  },
];
</script>
