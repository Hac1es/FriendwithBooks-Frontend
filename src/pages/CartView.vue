<template>
  <Header />
  <Breadcrumb1 />
  <div class="min-h-screen bg-[#f5ecdd] py-8 px-2">
    <div class="max-w-6xl mx-auto">
      <!-- Header -->
      <div class="flex items-center mb-6">
        <button class="mr-3">
          <div
            class="w-10 h-10 rounded-full border-2 border-black flex items-center justify-center bg-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-5 h-5 stroke-[#d05749]"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="3"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </div>
        </button>
        <h1 class="text-xl font-semibold text-[#d05749] tracking-wide">
          TRANG CHỦ
        </h1>
      </div>

      <p class="text-gray-700 mb-4 font-medium">
        Có {{ cart && cart.length > 0 ? cart.length : 0 }} món trong giỏ hàng
      </p>

      <div class="flex flex-col md:flex-row gap-8">
        <!-- Cart items -->
        <div class="w-full md:w-2/3 space-y-5">
          <div v-if="loading">Đang tải...</div>
          <div v-else-if="error" class="text-red-500">{{ error }}</div>
          <div v-else>
            <div v-if="cart && cart.length > 0">
              <div
                v-for="(item, index) in cart"
                :key="item.cartID"
                class="bg-white rounded-xl border border-[#e0d6c3] shadow flex items-center justify-between px-5 py-4"
              >
                <div class="flex items-center">
                  <img
                    :src="item.book?.imgURL1"
                    alt="Book cover"
                    class="w-16 h-24 object-cover rounded-lg border border-[#e3dac9] bg-white mr-4"
                  />
                  <div>
                    <h3 class="font-bold text-base text-[#222]">
                      {{ item.book?.title }}
                    </h3>
                    <p class="text-gray-500 text-sm">{{ item.book?.author }}</p>
                  </div>
                </div>
                <div class="flex items-center gap-6">
                  <div
                    class="flex items-center border border-[#e3dac9] rounded-lg bg-[#faf7f2]"
                  >
                    <button
                      @click="decreaseQuantity(index)"
                      :disabled="item.quantity <= 1"
                      class="px-3 py-1 text-lg font-bold text-[#d05749] hover:bg-[#f9ece5] rounded-l-lg transition"
                    >
                      -
                    </button>
                    <span class="px-4 py-1 font-semibold text-[#222]">{{
                      item.quantity
                    }}</span>
                    <button
                      @click="increaseQuantity(index)"
                      class="px-3 py-1 text-lg font-bold text-[#d05749] hover:bg-[#f9ece5] rounded-r-lg transition"
                    >
                      +
                    </button>
                  </div>
                  <div class="flex flex-col items-end min-w-[90px]">
                    <p class="font-semibold text-[#222] text-base">
                      {{ formatPrice(item.book?.price) }}
                    </p>
                    <button
                      @click="removeItem(index)"
                      class="text-[#d05749] hover:text-[#b84a3d] mt-2 transition"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="2"
                      >
                        <rect
                          x="9"
                          y="3"
                          width="6"
                          height="2"
                          rx="1"
                          fill="#d05749"
                        />
                        <path
                          stroke="#d05749"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M10 5h4m-7 2h10m-1 0v10a2 2 0 01-2 2H9a2 2 0 01-2-2V7"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div v-else>
              <p>Không có sản phẩm nào trong giỏ hàng.</p>
            </div>
          </div>
        </div>

        <div class="w-full md:w-1/3">
          <div class="sticky top-6">
            <h2 class="text-lg font-bold mb-4 text-[#222]">
              PHƯƠNG THỨC THANH TOÁN
            </h2>
            <div class="space-y-4 mb-6">
              <label
                class="flex items-center justify-between bg-white rounded-lg border border-[#e0d6c3] shadow px-4 py-3 cursor-pointer"
                :class="paymentMethod === 'momo' ? 'ring-2 ring-[#d05749]' : ''"
              >
                <div class="flex items-center">
                  <input
                    type="radio"
                    name="payment"
                    value="momo"
                    v-model="paymentMethod"
                    class="mr-3 accent-[#d05749]"
                  />
                  <span class="font-medium text-[#222]">MoMo</span>
                </div>
                <span
                  class="w-9 h-9 rounded-full flex items-center justify-center bg-white border border-[#e0d6c3] shadow"
                >
                  <img
                    src="https://static.mservice.io/img/logo-momo.png"
                    alt="MoMo"
                    class="w-7 h-7"
                  />
                </span>
              </label>

              <label
                class="flex items-center justify-between bg-white rounded-lg border border-[#e0d6c3] shadow px-4 py-3 cursor-pointer"
                :class="
                  paymentMethod === 'vnpay' ? 'ring-2 ring-[#d05749]' : ''
                "
              >
                <div class="flex items-center">
                  <input
                    type="radio"
                    name="payment"
                    value="vnpay"
                    v-model="paymentMethod"
                    class="mr-3 accent-[#d05749]"
                  />
                  <span class="font-medium text-[#222]">VNPAY</span>
                </div>
                <span
                  class="w-9 h-9 rounded-full flex items-center justify-center bg-white border border-[#e0d6c3] shadow"
                >
                  <img src="/Picture.png" alt="VNPAY" class="w-7 h-7" />
                </span>
              </label>
            </div>

            <div
              class="flex justify-between items-center py-3 border-t border-b border-[#e0d6c3] bg-[#faf7f2] rounded-lg mb-4 shadow-inner px-3"
            >
              <span class="font-medium text-[#222]">Tổng cộng:</span>
              <span class="font-bold text-[#d05749] text-lg">{{
                formatPrice(totalAmount)
              }}</span>
            </div>

            <button
              @click="checkout"
              class="w-full bg-[#d05749] text-white py-3 rounded-lg mt-4 font-semibold text-lg shadow hover:bg-[#b84a3d] transition"
              :disabled="!cart || cart.length === 0"
            >
              Thanh toán
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <Footer />
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "../utils/axios";
import Footer from "../components/Footer.vue";
import Breadcrumb1 from "../components/Breadcrumb1.vue";
import Header from "../components/Header/index.vue";

const router = useRouter();

// Cart state
const cart = ref([]);
const paymentMethod = ref("momo");
const loading = ref(true);
const error = ref(null);

// Fetch cart from backend API
const fetchCart = async () => {
  try {
    loading.value = true;
    const response = await axios.get("/cart/my", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    console.log("API Response for Cart:", response.data);
    cart.value = response.data.data.items || [];
    error.value = null;
  } catch (err) {
    error.value = "Không thể tải giỏ hàng";
    cart.value = [];
    console.error("Error fetching cart:", err);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchCart();
});

const totalAmount = computed(() => {
  return cart.value.reduce(
    (total, item) => total + (item.book?.price || 0) * item.quantity,
    0
  );
});

const formatPrice = (price) => {
  return (
    new Intl.NumberFormat("vi-VN", {
      style: "decimal",
      maximumFractionDigits: 0,
    }).format(price) + " VND"
  );
};

const increaseQuantity = async (index) => {
  const item = cart.value[index];
  const newQuantity = item.quantity + 1;
  try {
    await axios.put(
      `/cart/${item.cartID}`,
      {
        quantity: newQuantity,
      },
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    );
    await fetchCart();
  } catch (err) {
    error.value = "Không thể cập nhật số lượng";
    console.error("Error increasing quantity:", err);
  }
};

const decreaseQuantity = async (index) => {
  const item = cart.value[index];
  const newQuantity = item.quantity - 1;
  if (newQuantity > 0) {
    try {
      await axios.put(
        `/cart/${item.cartID}`,
        {
          quantity: newQuantity,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      await fetchCart();
    } catch (err) {
      error.value = "Không thể cập nhật số lượng";
      console.error("Error decreasing quantity:", err);
    }
  }
};

const removeItem = async (index) => {
  const item = cart.value[index];
  try {
    await axios.delete(`/cart/${item.cartID}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    await fetchCart();
  } catch (err) {
    error.value = "Không thể xóa sản phẩm";
    console.error("Error removing item:", err);
  }
};

const checkout = () => {
  router.push({ name: "PayMent" });
};
</script>
