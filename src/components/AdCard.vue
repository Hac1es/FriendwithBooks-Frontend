<template>
  <div class="relative w-full max-w-[270px] max-md:max-w-[180px] md:h-[300px]">
    <component
      :is="to ? 'router-link' : 'div'"
      :to="to"
      class="w-full max-w-[270px] max-md:max-w-[180px] flex flex-col items-start gap-1 hover:shadow-lg transition-shadow duration-300 cursor-pointer"
    >
      <div
        class="w-full max-w-[270px] max-md:max-w-[180px] h-[300px] max-md:h-[220px] rounded-lg"
      >
        <img
          :src="imgSrc"
          :alt="title || null"
          class="w-full h-full object-cover"
        />
      </div>
      <div
        class="font-inder font-medium sm:text-[24px] text-[12px] text-[#661C1C] md:pr-2 line-clamp-2"
      >
        {{ title }}
      </div>
      <div
        class="font-inder font-normal sm:text-[18px] text-[10px] text-[#828282] md:pr-2"
      >
        {{ author }}
      </div>
      <div
        class="font-inter font-normal sm:text-[14px] text-[7px] text-[#828282] md:pb-2 pb-1 md:pr-2 line-clamp-[9] max-md:line-clamp-4"
      >
        {{ desc }}
      </div>
    </component>
    <button
      class="absolute top-2 right-4 cart-button"
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
  id: String,
  imgSrc: String,
  title: String,
  author: String,
  desc: String,
  to: {
    type: [String, Object],
    default: null,
  },
});

const addToCart = async () => {
  try {
    await axios.post("/cart", {
      bookID: props.id,
      quantity: 1,
    });
    alert("Đã thêm vào giỏ hàng!");
  } catch (error) {
    console.error(error.response?.data || error.message);
    alert("Thêm vào giỏ hàng thất bại!");
  }
};
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
  max-width: 45%;
  width: 45%;
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
