<template>
  <Header />
  <div class="bg-[#f9f5ea] min-h-screen py-10 px-32 w-full">
    <div class="flex flex-row items-start gap-32 w-full">
      <!-- Profile Section -->
      <aside class="w-[260px] flex flex-col items-center pt-2">
        <div
          class="w-40 h-40 rounded-full overflow-hidden border border-gray-300 mb-8"
        >
          <img
            :src="userProfile.avatar"
            alt="Avatar"
            class="w-full h-full object-cover"
          />
        </div>
        <h2 class="text-xl font-semibold text-[#7a3c1a] mb-6 text-center">
          {{ userProfile.fullName }}
        </h2>
        <button
          v-if="!isEditing"
          @click="isEditing = true"
          class="text-xs border border-gray-400 bg-white hover:bg-gray-100 py-2 px-6 rounded-full text-[#7a3c1a] transition"
        >
          Chỉnh sửa thông tin
        </button>
        <!-- Edit Form nhỏ gọn, không khung ngoài -->
        <div v-if="isEditing" class="w-full flex justify-center">
          <form
            class="w-full flex flex-col gap-3"
            @submit.prevent="saveProfile"
          >
            <div>
              <label class="block text-xs text-[#7a3c1a] mb-1 font-semibold"
                >Họ và tên</label
              >
              <input
                type="text"
                v-model="userProfile.fullName"
                class="w-full px-2 py-1 border border-gray-400 rounded-md bg-black text-white text-sm"
              />
            </div>
            <div>
              <label class="block text-xs text-[#7a3c1a] mb-1 font-semibold"
                >Số điện thoại</label
              >
              <input
                type="tel"
                v-model="userProfile.phone"
                class="w-full px-2 py-1 border border-gray-400 rounded-md bg-black text-white text-sm"
              />
            </div>
            <div>
              <label class="block text-xs text-[#7a3c1a] mb-1 font-semibold"
                >Địa chỉ</label
              >
              <input
                type="text"
                v-model="userProfile.address"
                class="w-full px-2 py-1 border border-gray-400 rounded-md bg-black text-white text-sm"
              />
            </div>
            <div>
              <label class="block text-xs text-[#7a3c1a] mb-1 font-semibold"
                >Đường dẫn avatar</label
              >
              <input
                type="text"
                v-model="userProfile.avatar"
                class="w-full px-2 py-1 border border-gray-400 rounded-md bg-black text-white text-sm"
              />
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
        <!-- ĐƠN HÀNG ĐANG GIAO -->
        <div class="mb-12">
          <h3 class="text-xl font-bold text-[#8b0000] mb-6 uppercase">ĐANG GIAO</h3>
          <div v-if="pendingOrders.length > 0">
            <div v-for="order in pendingOrders" :key="order.orderID" class="mb-4 p-4 bg-white rounded shadow">
              <div>Mã đơn: {{ order.orderID }}</div>
              <div>Ngày đặt: {{ order.orderDate }}</div>
              <div>Tổng tiền: {{ order.totalAmount }}đ</div>
              <!-- ...thêm thông tin khác nếu muốn... -->
            </div>
          </div>
          <div v-else class="text-gray-500">Không có thông tin.</div>
        </div>

        <!-- ĐƠN HÀNG ĐÃ GIAO -->
        <div class="mb-12">
          <h3 class="text-xl font-bold text-[#8b0000] mb-6 uppercase">ĐÃ GIAO</h3>
          <div v-if="deliveredOrders.length > 0">
            <div v-for="order in deliveredOrders" :key="order.orderID" class="mb-4 p-4 bg-white rounded shadow">
              <div>Mã đơn: {{ order.orderID }}</div>
              <div>Ngày đặt: {{ order.orderDate }}</div>
              <div>Tổng tiền: {{ order.totalAmount }}đ</div>
            </div>
          </div>
          <div v-else class="text-gray-500">Không có thông tin.</div>
        </div>

        <!-- ĐƠN HÀNG ĐÃ HỦY -->
        <div class="mb-12">
          <h3 class="text-xl font-bold text-[#8b0000] mb-6 uppercase">ĐỔI HÀNG & TRẢ HÀNG</h3>
          <div v-if="cancelledOrders.length > 0">
            <div v-for="order in cancelledOrders" :key="order.orderID" class="mb-4 p-4 bg-white rounded shadow">
              <div>Mã đơn: {{ order.orderID }}</div>
              <div>Ngày đặt: {{ order.orderDate }}</div>
              <div>Tổng tiền: {{ order.totalAmount }}đ</div>
            </div>
          </div>
          <div v-else class="text-gray-500">Không có thông tin.</div>
        </div>
      </section>
    </div>
  </div>
  <Footer />
</template>
<script setup>
import { ref, reactive, onMounted, computed } from "vue";
import { useStore } from "vuex";
import { jwtDecode } from "jwt-decode";
import Footer from "../components/Footer.vue";
import Header from "../components/Header/index.vue";
import axios from "../utils/axios.js";

const isEditing = ref(false);
const store = useStore();

// Lấy userInfo từ localStorage (đã lưu khi đăng nhập)
function getUserInfoFromToken() {
  try {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (userInfo) {
      return {
        fullName: userInfo.fullName,
        phone: userInfo.phone,
        address: userInfo.address,
        avatar: userInfo.avatar,
      };
    }
  } catch (e) {
    // Nếu lỗi thì trả về mặc định
  }
  return {
    fullName: "",
    phone: "",
    address: "",
    avatar: "",
  };
}

const userProfile = reactive(getUserInfoFromToken());

// Thêm biến lưu đơn hàng
const allOrders = ref([]);

// Lọc đơn hàng theo trạng thái
const pendingOrders = computed(() =>
  allOrders.value.filter((order) => order.status === "pending" || order.status === "paid")
);
const deliveredOrders = computed(() =>
  allOrders.value.filter((order) => order.status === "delivered" || order.status === "shipped")
);
const cancelledOrders = computed(() =>
  allOrders.value.filter((order) => order.status === "cancelled")
);

// Gọi API lấy đơn hàng khi trang load
onMounted(async () => {
  try {
    const res = await axios.get("/Order/my");
    console.log("Order API response:", res.data); // Thêm dòng này để kiểm tra dữ liệu trả về
    allOrders.value = res.data.data || [];
  } catch (err) {
    allOrders.value = [];
    // Có thể hiển thị thông báo lỗi nếu muốn
  }
});

async function saveProfile() {
  if (!userProfile.fullName || !userProfile.phone || !userProfile.address || !userProfile.avatar) {
    alert("Vui lòng điền đầy đủ thông tin.");
    return;
  }
  // Kiểm tra số điện thoại hợp lệ: bắt đầu bằng 0 và có đúng 10 chữ số
  const phoneRegex = /^0\d{9}$/;
  if (!phoneRegex.test(userProfile.phone)) {
    alert("Số điện thoại phải bắt đầu bằng số 0 và có đúng 10 chữ số.");
    return;
  }
  
  try {
    // Gửi request cập nhật thông tin lên server
    const response = await axios.put("/Auth/updateProfile", {
        FullName: userProfile.fullName,
        Phone: userProfile.phone,
        Address: userProfile.address,
        Avatar: userProfile.avatar,
      }
    );
    if (response.status === 200) {
      const decoded = jwtDecode(response.data.token);
      store.dispatch("setUserInfo", decoded);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userInfo", JSON.stringify(decoded));
      isEditing.value = false;
      alert("Cập nhật thông tin thành công!");
    } else {
      alert(response.data.message || "Cập nhật thất bại.");
    }
  } catch (error) {
    alert(
      error.response?.data?.message ||
        "Có lỗi xảy ra khi cập nhật. Vui lòng thử lại."
    );
  }
}

function cancelEdit() {
  isEditing.value = false;
  // Reset lại thông tin nếu hủy chỉnh sửa
  const info = getUserInfoFromToken();
  userProfile.fullName = info.fullName;
  userProfile.phone = info.phone;
  userProfile.address = info.address;
  userProfile.avatar = info.avatar;
}
</script>
