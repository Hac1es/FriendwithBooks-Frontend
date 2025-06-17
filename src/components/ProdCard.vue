<template>
  <div class="relative w-[45vw] sm:w-[30vw] md:w-48">
    <component
      :is="to ? 'router-link' : 'div'"
      :to="to"
      class="inline-block"
      :style="{ zoom: scale }"
    >
      <div
        class="w-[45vw] sm:w-[28vw] md:w-48 overflow-hidden shadow-sm hover:shadow-lg hover:scale-[1.02] transition-shadow duration-300 bg-white"
        @click="$emit('click', productId)"
      >
        <div class="relative w-full">
          <img
            :src="imgSrc"
            :alt="title"
            class="w-full aspect-square object-cover"
          />
          <div
            v-if="isFlashSale"
            class="text-white font-bold italic flex items-center md:text-[15px] text-[10px] px-2 py-1 absolute bottom-2 left-2 bg-[#661c1c]"
          >
            FLASH <span>⚡</span> SALE
          </div>
        </div>

        <div class="p-2">
          <div
            class="text-lg font-semibold text-[#661c1c] uppercase max-md:truncate line-clamp-2 font-itim md:min-h-[3em] md:flex md:items-center"
          >
            {{ title }}
          </div>

          <h3
            class="text-[14px] font-semibold text-[#5D4037] uppercase truncate font-inter mt-1"
          >
            {{ author }}
          </h3>

          <div class="space-x-3 flex items-center flex-nowrap">
            <div class="text-[#661c1c] font-semibold font-inter text-lg mt-1">
              {{ formatPrice(price) }} đ
            </div>

            <span
              v-if="discount"
              class="bg-[#661c1c] text-white text-xs font-semibold ml-2 mt-0.5 px-1.5 py-0.5 rounded font-inter"
            >
              -{{ discount }}%
            </span>
          </div>

          <div class="flex items-center mt-1 min-h-[1.25rem]">
            <span
              v-if="oldPrice"
              class="text-gray-400 line-through text-sm font-semibold font-inter"
            >
              {{ formatPrice(oldPrice) }}
              đ
            </span>
            <span v-else style="visibility: hidden" class="text-sm font-inter"
              >0 đ</span
            >
          </div>
        </div>
      </div>
    </component>
    <button
      class="absolute top-2 right-2 cart-button"
      @click="addToCart"
      title="Thêm vào giỏ hàng"
    >
      <ShoppingCart class="h-15 w-15 text-[#680e0e] cart-icon" />
      <span class="cart-text">Thêm vào giỏ</span>
    </button>
  </div>
</template>

<script setup>
import { ShoppingCart } from "lucide-vue-next";
import axios from "../utils/axios";

const props = defineProps({
  productId: Number,
  imgSrc: String,
  title: String,
  flashSale: Boolean,
  price: String,
  oldPrice: String,
  discount: String,
  author: String,
  to: {
    type: [String, Object],
    default: null,
  },
  scale: {
    type: Number,
    default: 1,
  },
  isFlashSale: Boolean,
});

const addToCart = async () => {
  try {
    await axios.post("/cart", {
      bookID: props.productId,
      quantity: 1,
    });
    alert("Đã thêm vào giỏ hàng!");
  } catch (error) {
    console.error(error.response?.data || error.message);
    alert("Thêm vào giỏ hàng thất bại!");
  }
};

function formatPrice(price) {
  // Làm tròn đến hàng nghìn gần nhất
  const rounded = Math.round(Number(price) / 1000) * 1000;
  // Thêm dấu chấm ngăn cách
  return rounded.toLocaleString("vi-VN");
}
</script>

<style scoped>
.cart-button {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50px;
  padding: 8px;
  transition: all 0.3s ease;
  overflow: hidden;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 8px;
  max-width: 50px;
  width: 50px;
  z-index: 10;
}

.cart-button:hover {
  max-width: 70%;
  width: 70%;
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transform: scale(1.05);
}

.cart-icon {
  flex-shrink: 0;
  transition: transform 0.3s ease;
}

.cart-button:hover .cart-icon {
  transform: scale(1.1);
}

.cart-text {
  opacity: 0;
  transform: translateX(10px);
  transition: all 0.3s ease;
  font-size: 14px;
  font-weight: 500;
  color: #680e0e;
  white-space: nowrap;
}

.cart-button:hover .cart-text {
  opacity: 1;
  transform: translateX(0);
}

/* Responsive */
@media (max-width: 768px) {
  .cart-button {
    max-width: 50px;
    width: 50px;
    padding: 6px;
  }

  .cart-button:hover {
    max-width: 60%;
    width: 60%;
  }

  .cart-text {
    font-size: 12px;
  }
}
</style>
