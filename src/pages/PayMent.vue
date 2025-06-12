<template>
  <Header />
  <div
    class="bg-[#f5f0e1] min-h-screen py-8 flex justify-center font-instrument"
  >
    <div class="w-full max-w-[850px] px-2">
      <!-- Header -->
      <div class="flex items-center mb-7">
        <button
          @click="router.go(-1)"
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
        v-if="userInfo"
        class="bg-white rounded-xl border border-gray-300 shadow-[0_2px_8px_0_rgba(0,0,0,0.05)] p-4 mb-7"
      >
        <div class="font-semibold flex items-center mb-1 text-sm">
          {{ userInfo.fullName }}
          <span class="ml-2 text-gray-600 font-normal">{{
            userInfo.phoneNumber
          }}</span>
        </div>
        <div class="text-gray-600 text-sm">{{ userInfo.address }}</div>
        <div class="text-gray-600 text-sm">
          {{ userInfo.city }}, {{ userInfo.province }}
        </div>
      </div>
      <div v-else-if="loading" class="text-center text-gray-500 mb-7">
        Đang tải thông tin người dùng...
      </div>
      <div v-else-if="error" class="text-center text-red-500 mb-7">
        {{ error }}
      </div>

      <!-- Order List -->
      <div class="mb-7">
        <h2 class="text-xl font-extrabold text-[#6b3a2a] mb-3">ĐƠN HÀNG</h2>
        <div v-if="orderItems && orderItems.length > 0">
          <div
            v-for="(item, idx) in orderItems"
            :key="item.cartID"
            class="bg-white rounded-xl border border-gray-300 shadow-[0_2px_8px_0_rgba(0,0,0,0.05)] p-4 mb-3 flex items-center"
          >
            <img
              :src="item.book?.imgURL1"
              alt="Sách"
              class="w-16 h-20 object-cover rounded-lg border border-gray-200 mr-4"
            />
            <div class="flex-1 flex justify-between items-center">
              <div>
                <div class="font-semibold text-base leading-tight">
                  {{ item.book?.title }}
                </div>
                <div class="text-gray-600 text-sm font-bold leading-tight">
                  {{ item.book?.author }}
                </div>
              </div>
              <div class="text-right">
                <div class="font-semibold text-base">
                  {{ formatPrice(item.book?.price) }}
                </div>
                <div class="text-gray-500 text-xs">SL: {{ item.quantity }}</div>
              </div>
            </div>
          </div>
        </div>
        <div v-else-if="loading" class="text-center text-gray-500">
          Đang tải đơn hàng...
        </div>
        <div v-else class="text-center text-gray-500">
          Không có sản phẩm nào trong đơn hàng.
        </div>
      </div>

      <!-- Payment Methods -->
      <div class="mb-8">
        <h2 class="text-base font-extrabold text-[#6b3a2a] mb-3">
          PHƯƠNG THỨC THANH TOÁN
        </h2>
        <div class="flex gap-4">
          <label
            v-for="method in paymentMethods"
            :key="method.id"
            class="flex-1"
          >
            <input
              type="radio"
              name="payment"
              :value="method.id"
              v-model="selectedPaymentMethod"
              class="hidden"
            />
            <div
              class="flex items-center h-14 rounded-xl border cursor-pointer bg-white px-4 transition-all shadow-[0_2px_8px_0_rgba(0,0,0,0.05)]"
              :class="
                selectedPaymentMethod === method.id
                  ? 'border-[#d97c5e] ring-2 ring-[#f2cfc1]'
                  : 'border-gray-300'
              "
            >
              <span
                class="w-5 h-5 rounded-full border flex items-center justify-center mr-2"
                :class="
                  selectedPaymentMethod === method.id
                    ? 'border-[#d97c5e]'
                    : 'border-gray-300'
                "
              >
                <span
                  v-if="selectedPaymentMethod === method.id"
                  class="w-3 h-3 rounded-full bg-[#d97c5e]"
                ></span>
              </span>
              <span class="flex-1 text-sm">{{ method.name }}</span>
              <img
                :src="method.img"
                :alt="method.name"
                class="w-8 h-8 ml-2 rounded-full object-contain bg-white border border-gray-200"
                :class="{ rounded: method.id !== 'momo' }"
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
            <div class="font-bold text-base">
              {{ formatPrice(totalAmount) }}
            </div>
          </div>
          <button
            @click.once="placeOrder"
            class="bg-[#d97c5e] hover:bg-[#c56e52] text-white font-semibold py-3 px-8 rounded-md transition duration-200 text-base min-w-[140px]"
            :disabled="loading || orderItems.length === 0"
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
import { ref, onMounted, computed } from "vue";
import axios from "../utils/axios";
import { useRouter, useRoute } from "vue-router";
import Footer from "../components/Footer.vue";
import Header from "../components/Header/index.vue";
import { useStore } from "vuex";

const router = useRouter();
const route = useRoute();
const store = useStore();

const userInfo = ref(null);
const orderItems = ref([]);
const paymentMethods = ref([]);
const selectedPaymentMethod = ref(null);
const loading = ref(true);
const error = ref(null);

const orderIdFromRoute = ref(route.params.orderId || null);

const fetchUserInfo = async () => {
  try {
    // Ưu tiên lấy từ store nếu đã có và xác thực
    if (
      store.state.isAuthenticated &&
      store.state.userInfo &&
      store.state.userInfo.fullName
    ) {
      userInfo.value = store.state.userInfo;
      console.log("User info from store:", userInfo.value);
    } else {
      // Nếu không có trong store hoặc chưa đầy đủ, gọi API để lấy profile người dùng
      const token = localStorage.getItem("token");
      if (token) {
        const response = await axios.get("/Profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        userInfo.value = response.data;
        console.log("User info from API:", userInfo.value);
        // Có thể cập nhật store nếu cần
        // store.commit('setUserInfo', response.data);
        error.value = null;
      } else {
        error.value = "Bạn chưa đăng nhập. Vui lòng đăng nhập lại.";
      }
    }
  } catch (err) {
    console.error(
      "Error fetching user info:",
      err.response?.data || err.message
    );
    error.value = "Lỗi khi tải thông tin người dùng.";
    userInfo.value = null;
  }
};

const totalAmount = computed(() => {
  if (orderItems.value && orderItems.value.length > 0) {
    return orderItems.value.reduce(
      (total, item) => total + (item.book?.price || 0) * item.quantity,
      0
    );
  } else {
    return 0;
  }
});

const getMyCart = async () => {
  try {
    const res = await axios.get("/cart/my", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    orderItems.value = res.data.data.items || [];
    console.log("Cart items:", orderItems.value);
    orderItems.value.forEach((item) => {
      console.log(
        `Book ID: ${item.book?.bookID}, Price: ${item.book?.price}, Quantity: ${item.quantity}`
      );
    });
    error.value = null;
  } catch (err) {
    error.value = "Không thể tải giỏ hàng";
    console.error("Error fetching cart for payment:", err);
    orderItems.value = [];
  }
};

const getPaymentMethods = async () => {
  try {
    const res = await axios.get("/payment/methods", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    paymentMethods.value = res.data.data || [];
    console.log("Payment methods loaded:", paymentMethods.value);
    if (paymentMethods.value.length > 0) {
      selectedPaymentMethod.value = paymentMethods.value[0].id;
    }
    error.value = null;
  } catch (err) {
    error.value = "Không thể tải phương thức thanh toán";
    console.error("Error fetching payment methods:", err);
  }
};

const placeOrder = async () => {
  try {
    loading.value = true;
    // Bước 1: Tạo Order
    // API tạo order mong đợi một DTO với paymentMethodId và danh sách các sản phẩm trong giỏ hàng
    const orderDetails = orderItems.value.map((item) => ({
      bookId: item.book?.bookID, // Đảm bảo trường này khớp với backend
      quantity: item.quantity,
    }));

    console.log("Order details being sent:", JSON.stringify(orderDetails));

    const orderResponse = await axios.post(
      "/Order",
      {
        paymentMethodId: selectedPaymentMethod.value,
        cartItems: orderDetails, // Gửi chi tiết các mặt hàng trong giỏ hàng
      },
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    );

    console.log("Order creation response:", orderResponse.data);

    const orderID = orderResponse.data.data.orderID; // Changed from OrderID to orderID

    console.log("Order ID before payment processing:", orderID);
    console.log("Selected payment method ID:", selectedPaymentMethod.value);

    // Tìm phương thức thanh toán tiền mặt từ danh sách đã tải
    // Giả sử 'tiền mặt' là tên phương thức bạn muốn kiểm tra
    const cashPaymentMethod = paymentMethods.value.find(
      (m) => m.name === "tiền mặt"
    );
    console.log(
      "Cash payment method object from loaded methods:",
      cashPaymentMethod
    );
    console.log("Cash payment method ID from object:", cashPaymentMethod?.id);

    if (selectedPaymentMethod.value !== cashPaymentMethod?.id) {
      console.log(
        "Selected method is NOT cash. Attempting to process online payment (Momo/VnPay)..."
      );
      const paymentRes = await axios.post(
        `/payment/process/${String(orderID)}`,
        {}, // Changed from null to an empty object
        {
          headers: {
            "Content-Type": "application/json", // Indicate JSON content
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      console.log("Payment API response:", paymentRes.data);

      // Kiểm tra xem paymentRes.data và paymentRes.data.data có tồn tại không
      if (
        paymentRes.data &&
        paymentRes.data.data &&
        paymentRes.data.data.paymentUrl
      ) {
        console.log(
          "Redirecting to payment URL:",
          paymentRes.data.data.paymentUrl
        );
        window.location.href = paymentRes.data.data.paymentUrl;
      } else {
        // Nếu không có paymentUrl (ví dụ: backend không trả về hoặc có lỗi khác)
        console.error(
          "Error: paymentUrl is undefined or not found in response for online payment. Redirecting to order success page as a fallback."
        );
        router.push(`/order-success/${orderID}`); // Chuyển hướng đến trang thành công nếu không có paymentUrl
      }
    } else {
      console.log(
        "Selected method IS cash. Redirecting directly to order success page."
      );
      router.push(`/order-success/${orderID}`);
    }
  } catch (err) {
    error.value = "Không thể đặt hàng";
    console.error("Error placing order:", err.response?.data || err.message);
  } finally {
    loading.value = false;
  }
};
const formatPrice = (price) => {
  return (
    new Intl.NumberFormat("vi-VN", {
      style: "decimal",
      maximumFractionDigits: 0,
    }).format(price) + " VND"
  );
};

onMounted(async () => {
  loading.value = true;
  await Promise.all([fetchUserInfo(), getMyCart(), getPaymentMethods()]);
  loading.value = false;
});
</script>
