<template>
  <div class="bg-gray-100 dark:bg-gray-900 min-h-screen text-gray-800 dark:text-gray-200 p-4 sm:p-6 lg:p-8">
    <div class="max-w-7xl mx-auto">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-6">Quản lý Đơn hàng</h1>

      <!-- BỘ LỌC VÀ TÌM KIẾM -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 mb-6">
        <h2 class="text-xl font-semibold mb-4 flex items-center gap-2">
          <Filter class="w-6 h-6" />
          Tìm kiếm & Lọc
        </h2>
        <form @submit.prevent="handleSearch">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            <div class="xl:col-span-2">
              <label for="searchTerm" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tìm kiếm</label>
              <input id="searchTerm" type="text" v-model.trim="searchFilters.searchTerm" placeholder="Mã đơn, tên, email, SĐT..." class="form-input" />
            </div>
            <div>
              <label for="status" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Trạng thái</label>
              <select id="status" v-model="searchFilters.status" class="form-input">
                <option value="">Tất cả</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="shipping">Shipping</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div>
              <label for="dateFrom" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Từ ngày</label>
              <input id="dateFrom" type="date" v-model="searchFilters.dateFrom" class="form-input" />
            </div>
            <div>
              <label for="dateTo" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Đến ngày</label>
              <input id="dateTo" type="date" v-model="searchFilters.dateTo" class="form-input" />
            </div>
          </div>
          <div class="flex justify-end gap-3 mt-5 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button type="button" @click="resetFilters" :disabled="isLoading" class="btn btn-secondary">
              <RotateCcw class="w-4 h-4" /> Đặt lại
            </button>
            <button type="submit" :disabled="isLoading" class="btn btn-primary">
              <Search class="w-4 h-4" />
              {{ isLoading ? 'Đang tìm...' : 'Tìm kiếm' }}
            </button>
          </div>
        </form>
      </div>

      <!-- BẢNG DỮ LIỆU -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div class="flex flex-wrap items-center justify-between gap-4 p-4 border-b border-gray-200 dark:border-gray-700">
          <p class="text-sm font-medium">Tổng số: <span class="font-bold">{{ pagination.totalItems }}</span> đơn hàng</p>
          <div class="flex items-center gap-2">
            <button @click="openBulkUpdateModal" :disabled="selectedOrders.length === 0 || isLoading" class="btn btn-secondary text-sm">
              <ListChecks class="w-4 h-4" />
              Cập nhật ({{ selectedOrders.length }})
            </button>
            <button @click="() => loadOrders(true)" :disabled="isLoading" class="btn btn-secondary text-sm">
              <RefreshCw class="w-4 h-4" :class="{'animate-spin': isLoading}" />
              Làm mới
            </button>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" class="p-4">
                  <input type="checkbox" @change="toggleSelectAll" :checked="isAllSelected" class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500">
                </th>
                <th scope="col" class="th-cell">Mã Đơn</th>
                <th scope="col" class="th-cell">Khách Hàng</th>
                <th scope="col" class="th-cell">Ngày Đặt</th>
                <th scope="col" class="th-cell text-right">Tổng Tiền</th>
                <th scope="col" class="th-cell text-center">PMTT ID</th>
                <th scope="col" class="th-cell text-center">Trạng Thái</th>
                <th scope="col" class="th-cell text-center">Thao Tác</th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-if="isLoading">
                <td :colspan="8" class="text-center p-12"><LoaderCircle class="w-8 h-8 animate-spin mx-auto text-gray-500" /></td>
              </tr>
              <tr v-else-if="error">
                <td :colspan="8" class="text-center p-12">
                  <div class="flex flex-col items-center gap-3 text-red-500">
                    <AlertTriangle class="w-10 h-10"/>
                    <p class="font-semibold">Không thể tải dữ liệu</p>
                    <p class="text-sm">{{ error }}</p>
                    <button @click="() => loadOrders(true)" class="btn btn-primary mt-2">Thử lại</button>
                  </div>
                </td>
              </tr>
              <tr v-else-if="orders.length === 0">
                 <td :colspan="8" class="text-center p-12">
                  <div class="flex flex-col items-center gap-3 text-gray-500">
                    <PackageSearch class="w-12 h-12"/>
                    <p class="font-semibold text-lg">Không tìm thấy đơn hàng</p>
                  </div>
                </td>
              </tr>
              <tr v-for="order in orders" :key="order.orderId" class="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td class="p-4">
                  <input type="checkbox" v-model="selectedOrders" :value="order.orderId" class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500">
                </td>
                <td class="td-cell font-mono font-bold text-indigo-600 dark:text-indigo-400">#{{ order.orderId }}</td>
                <td class="td-cell">
                  <div class="font-medium text-gray-900 dark:text-white">{{ order.customerName || 'N/A' }}</div>
                  <div class="text-sm text-gray-500">{{ order.customerEmail || 'N/A' }}</div>
                </td>
                <td class="td-cell">{{ formatDate(order.orderDate) }}</td>
                <td class="td-cell text-right font-medium">{{ formatPrice(order.totalAmount) }}đ</td>
                <td class="td-cell text-center font-mono">{{ order.paymentMethodId }}</td>
                <td class="td-cell text-center">
                  <span :class="['status-badge', `status-${order.status}`]">{{ order.status }}</span>
                </td>
                <td class="td-cell">
                  <div class="flex justify-center items-center gap-2">
                    <button @click="openEditModal(order.orderId)" class="text-gray-400 hover:text-indigo-600 p-1"><Pencil class="w-5 h-5" /></button>
                    <button @click="deleteOrder(order)" class="text-gray-400 hover:text-red-600 p-1"><Trash2 class="w-5 h-5" /></button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div v-if="!isLoading && !error && pagination.totalPages > 1" class="flex items-center justify-between p-4 border-t border-gray-200 dark:border-gray-700">
             <p class="text-sm text-gray-700 dark:text-gray-400">
                Hiển thị
                <span class="font-medium">{{ (pagination.currentPage - 1) * pagination.pageSize + 1 }}</span>
                -
                <span class="font-medium">{{ Math.min(pagination.currentPage * pagination.pageSize, pagination.totalItems) }}</span>
                trên
                <span class="font-medium">{{ pagination.totalItems }}</span>
            </p>
            <div class="flex gap-2">
                <button @click="pagination.currentPage--" :disabled="pagination.currentPage <= 1" class="btn btn-secondary"><ChevronLeft class="w-4 h-4"/> Trước</button>
                <button @click="pagination.currentPage++" :disabled="pagination.currentPage >= pagination.totalPages" class="btn btn-secondary">Sau <ChevronRight class="w-4 h-4"/></button>
            </div>
        </div>
      </div>
    </div>

    <!-- Edit Order Modal -->
    <div v-if="showEditModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Chỉnh sửa đơn hàng #{{ selectedOrder?.orderId }}</h2>
            <button @click="closeEditModal" class="text-gray-500 hover:text-gray-700">
              <X class="w-6 h-6" />
            </button>
          </div>

          <div v-if="isLoadingOrder" class="flex justify-center items-center p-12">
            <LoaderCircle class="w-8 h-8 animate-spin text-gray-500" />
          </div>

          <div v-else-if="error" class="text-center p-12">
            <div class="flex flex-col items-center gap-3 text-red-500">
              <AlertTriangle class="w-10 h-10"/>
              <p class="font-semibold">Không thể tải thông tin đơn hàng</p>
              <p class="text-sm">{{ error }}</p>
              <button @click="loadSelectedOrder" class="btn btn-primary mt-2">Thử lại</button>
            </div>
          </div>

          <div v-else class="space-y-6">
            <!-- Customer Info -->
            <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
              <h3 class="text-lg font-semibold mb-3">Thông tin khách hàng</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Họ tên</label>
                  <input v-model="editedOrder.customer.fullName" type="text" class="form-input mt-1" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                  <input v-model="editedOrder.customer.email" type="email" class="form-input mt-1" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Số điện thoại</label>
                  <input v-model="editedOrder.customer.phone" type="tel" class="form-input mt-1" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Địa chỉ</label>
                  <input v-model="editedOrder.customer.address" type="text" class="form-input mt-1" />
                </div>
              </div>
            </div>

            <!-- Order Details -->
            <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
              <div class="flex justify-between items-center mb-3">
                <h3 class="text-lg font-semibold">Chi tiết đơn hàng</h3>
                <button @click="addOrderDetail" class="btn btn-secondary text-sm">
                  <Plus class="w-4 h-4" /> Thêm sách
                </button>
              </div>

              <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead class="bg-gray-100 dark:bg-gray-700">
                    <tr>
                      <th class="th-cell">Sách</th>
                      <th class="th-cell text-right">Đơn giá</th>
                      <th class="th-cell text-right">Số lượng</th>
                      <th class="th-cell text-right">Thành tiền</th>
                      <th class="th-cell text-center">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                    <tr v-for="(detail, index) in editedOrder.orderDetails" :key="index">
                      <td class="td-cell">
                        <select v-model="detail.bookId" class="form-input">
                          <option v-for="book in availableBooks" :key="book.id" :value="book.id">
                            {{ book.title }} - {{ book.author }}
                          </option>
                        </select>
                      </td>
                      <td class="td-cell text-right">
                        <input v-model.number="detail.unitPrice" type="number" class="form-input text-right" />
                      </td>
                      <td class="td-cell text-right">
                        <input v-model.number="detail.quantity" type="number" min="1" class="form-input text-right" />
                      </td>
                      <td class="td-cell text-right font-medium">
                        {{ formatPrice(detail.unitPrice * detail.quantity) }}đ
                      </td>
                      <td class="td-cell text-center">
                        <button @click="removeOrderDetail(index)" class="text-red-500 hover:text-red-700">
                          <Trash2 class="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  </tbody>
                  <tfoot class="bg-gray-50 dark:bg-gray-700/50">
                    <tr>
                      <td colspan="3" class="td-cell text-right font-bold">Tổng cộng:</td>
                      <td class="td-cell text-right font-bold text-lg text-indigo-600 dark:text-indigo-400">
                        {{ formatPrice(calculateTotal()) }}đ
                      </td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            <!-- Payment Info -->
            <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
              <h3 class="text-lg font-semibold mb-3">Thông tin thanh toán</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Phương thức thanh toán</label>
                  <select v-model="editedOrder.paymentMethodId" class="form-input mt-1">
                    <option v-for="method in paymentMethods" :key="method.id" :value="method.id">
                      {{ method.name }}
                    </option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Trạng thái</label>
                  <select v-model="editedOrder.status" class="form-input mt-1">
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="shipping">Shipping</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button @click="closeEditModal" class="btn btn-secondary">Hủy</button>
              <button @click="saveOrderChanges" :disabled="isSaving" class="btn btn-primary">
                <LoaderCircle v-if="isSaving" class="w-4 h-4 animate-spin" />
                <span v-else>Lưu thay đổi</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bulk Update Modal -->
    <div v-if="showBulkUpdateModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
        <div class="p-6">
          <h3 class="text-lg font-semibold mb-4">Cập nhật trạng thái hàng loạt</h3>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Trạng thái mới</label>
              <select v-model="bulkUpdateStatus" class="form-input">
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="shipping">Shipping</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div class="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button @click="closeBulkUpdateModal" class="btn btn-secondary">Hủy</button>
              <button @click="handleBulkUpdate" :disabled="isUpdating" class="btn btn-primary">
                <LoaderCircle v-if="isUpdating" class="w-4 h-4 animate-spin" />
                <span v-else>Cập nhật</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch, computed } from 'vue';
import { 
    Filter, RotateCcw, Search, RefreshCw, ListChecks, LoaderCircle, AlertTriangle, 
    PackageSearch, Pencil, Trash2, ChevronLeft, ChevronRight, X, Plus
} from 'lucide-vue-next';
import axios from '../utils/axios';

const API_BASE_URL = ''; 

// --- STATE MANAGEMENT ---
const orders = ref([]);
const isLoading = ref(false);
const error = ref(null);
const pagination = reactive({ currentPage: 1, pageSize: 10, totalItems: 0, totalPages: 1 });
const initialSearchFilters = { searchTerm: '', status: '', dateFrom: '', dateTo: '' };
const searchFilters = reactive({ ...initialSearchFilters });
const selectedOrders = ref([]);

// Modal state
const showEditModal = ref(false);
const selectedOrder = ref(null);
const isLoadingOrder = ref(false);
const isSaving = ref(false);
const editedOrder = reactive({
  status: '',
  paymentMethodId: null,
  customer: {
    fullName: '',
    email: '',
    phone: '',
    address: ''
  },
  orderDetails: []
});

const availableBooks = ref([]);
const paymentMethods = ref([]);

// Modal state
const showBulkUpdateModal = ref(false);
const bulkUpdateStatus = ref('');
const isUpdating = ref(false);

// --- API CALLS ---
const loadOrders = async (forceRefresh = false) => {
  if (isLoading.value && !forceRefresh) return;
  isLoading.value = true;
  error.value = null;
  
  try {
    const params = {
      page: pagination.currentPage,
      pageSize: pagination.pageSize,
      ...searchFilters
    };
    // Xóa các filter rỗng
    Object.keys(params).forEach(key => {
      if (params[key] === '' || params[key] === null || params[key] === undefined) {
        delete params[key];
      }
    });
    const response = await axios.get('/admin/orders', { params });
    const data = response.data;
    orders.value = data.items;
    pagination.totalItems = data.totalItems;
    pagination.totalPages = data.totalPages;
    pagination.currentPage = data.currentPage;
  } catch (err) {
    console.error('Lỗi khi tải đơn hàng:', err);
    error.value = err.response?.data?.message || err.message;
  } finally {
    isLoading.value = false;
  }
};

const deleteOrder = async (order) => {
  if (!confirm(`Bạn có chắc chắn muốn xóa đơn hàng #${order.orderId}?`)) return;
  try {
    await axios.delete(`/admin/orders/${order.orderId}`);
    alert('Đã xóa đơn hàng thành công!');
    loadOrders(true);
  } catch (err) {
    console.error('Lỗi khi xóa đơn hàng:', err);
    alert(`Lỗi: ${err.response?.data?.message || err.message}`);
  }
};

const handleBulkUpdate = async () => {
  if (!bulkUpdateStatus.value) {
    alert('Vui lòng chọn trạng thái mới');
    return;
  }
  isUpdating.value = true;
  try {
    const response = await axios.post('/admin/orders/bulk-update', {
      orderIds: selectedOrders.value,
      status: bulkUpdateStatus.value
    });
    alert(response.data.message || 'Cập nhật thành công!');
    closeBulkUpdateModal();
    loadOrders(true);
  } catch (err) {
    console.error('Lỗi khi cập nhật trạng thái:', err);
    alert(`Lỗi: ${err.response?.data?.message || err.message}`);
  } finally {
    isUpdating.value = false;
  }
};

// --- EVENT HANDLERS & WATCHERS ---
const handleSearch = () => { pagination.currentPage = 1; loadOrders(); };
const resetFilters = () => { Object.assign(searchFilters, initialSearchFilters); pagination.currentPage = 1; loadOrders(); };

watch(() => pagination.currentPage, loadOrders);

const isAllSelected = computed(() => orders.value.length > 0 && selectedOrders.value.length === orders.value.length);
const toggleSelectAll = (event) => {
    selectedOrders.value = event.target.checked ? orders.value.map(o => o.orderId) : [];
};

// Modal handlers
const openEditModal = async (orderId) => {
  selectedOrder.value = { orderId };
  showEditModal.value = true;
  await loadSelectedOrder();
};

const closeEditModal = () => {
  showEditModal.value = false;
  selectedOrder.value = null;
  error.value = null;
};

const loadSelectedOrder = async () => {
  if (!selectedOrder.value) return;
  isLoadingOrder.value = true;
  error.value = null;
  try {
    const response = await axios.get(`/admin/orders/${selectedOrder.value.orderId}`);
    const orderData = response.data;
    selectedOrder.value = orderData;
    resetEditedOrder();
  } catch (err) {
    console.error('Error loading order:', err);
    error.value = err.response?.data?.message || err.message;
  } finally {
    isLoadingOrder.value = false;
  }
};

const resetEditedOrder = () => {
  if (!selectedOrder.value) return;
  editedOrder.status = selectedOrder.value.status;
  editedOrder.paymentMethodId = selectedOrder.value.paymentMethodId;
  editedOrder.customer = { ...selectedOrder.value.customer };
  editedOrder.orderDetails = selectedOrder.value.orderDetails.map(detail => ({
    ...detail,
    book: { ...detail.book }
  }));
};

const calculateTotal = () => {
  return editedOrder.orderDetails.reduce((total, detail) => {
    return total + (detail.unitPrice * detail.quantity);
  }, 0);
};

const addOrderDetail = () => {
  editedOrder.orderDetails.push({
    bookId: null,
    quantity: 1,
    unitPrice: 0,
    book: { title: '', author: '', imgUrl1: '', price: 0 }
  });
};

const removeOrderDetail = (index) => {
  editedOrder.orderDetails.splice(index, 1);
};

const saveOrderChanges = async () => {
  isSaving.value = true;
  try {
    await axios.put(`/admin/orders/${selectedOrder.value.orderId}`, {
      status: editedOrder.status,
      paymentMethodId: editedOrder.paymentMethodId,
      customerInfo: editedOrder.customer,
      orderDetails: editedOrder.orderDetails.map(detail => ({
        bookId: detail.bookId,
        quantity: detail.quantity,
        unitPrice: detail.unitPrice
      })),
      totalAmount: calculateTotal()
    });
    await loadOrders(true);
    closeEditModal();
  } catch (err) {
    console.error('Error saving changes:', err);
    alert('Failed to save changes: ' + (err.response?.data?.message || err.message));
  } finally {
    isSaving.value = false;
  }
};

// --- HELPERS ---
const formatDate = (dateString) => new Date(dateString).toLocaleString('vi-VN');
const formatPrice = (price) => new Intl.NumberFormat('vi-VN').format(price);

// --- LIFECYCLE HOOK ---
onMounted(async () => {
  await loadOrders();
  // Load available books and payment methods
  try {
    const [booksResponse, methodsResponse] = await Promise.all([
      axios.get('/admin/books'),
      axios.get('/admin/payment-methods')
    ]);
    availableBooks.value = booksResponse.data;
    paymentMethods.value = methodsResponse.data;
  } catch (err) {
    console.error('Error loading reference data:', err);
  }
});
</script>

<style scoped>
/* CSS cho các thành phần dùng chung */
.form-input {
  width: 100%;
  background-color: rgb(249 250 251);
  border: 1px solid rgb(209 213 219);
  border-radius: 0.375rem;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  font-size: 0.875rem;
  padding: 0.5rem;
  transition: all 0.15s ease-in-out;
}

.form-input:focus {
  outline: none;
  border-color: rgb(99 102 241);
  box-shadow: 0 0 0 3px rgb(99 102 241 / 0.1);
}

:global(.dark) .form-input {
  background-color: rgb(55 65 81 / 0.5);
  border-color: rgb(75 85 99);
  color: rgb(229 231 235);
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 600;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  transition: all 0.2s ease-in-out;
  cursor: pointer;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary {
  background-color: rgb(79 70 229);
  color: white;
  border: none;
}

.btn-primary:hover:not(:disabled) {
  background-color: rgb(67 56 202);
}

.btn-secondary {
  background-color: white;
  color: rgb(55 65 81);
  border: 1px solid rgb(209 213 219);
}

.btn-secondary:hover:not(:disabled) {
  background-color: rgb(249 250 251);
}

:global(.dark) .btn-secondary {
  background-color: rgb(55 65 81);
  color: rgb(229 231 235);
  border-color: rgb(75 85 99);
}

:global(.dark) .btn-secondary:hover:not(:disabled) {
  background-color: rgb(75 85 99);
}

.th-cell {
  padding: 0.75rem 1.5rem;
  text-align: left;
  font-size: 0.75rem;
  font-weight: 500;
  color: rgb(107 114 128);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

:global(.dark) .th-cell {
  color: rgb(209 213 219);
}

.td-cell {
  padding: 1rem 1.5rem;
  white-space: nowrap;
  font-size: 0.875rem;
  color: rgb(75 85 99);
}

:global(.dark) .td-cell {
  color: rgb(209 213 219);
}

.status-badge {
  padding: 0.25rem 0.625rem;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 9999px;
  display: inline-block;
  text-transform: capitalize;
}

.status-pending {
  background-color: rgb(254 240 138);
  color: rgb(146 64 14);
}

:global(.dark) .status-pending {
  background-color: rgb(146 64 14 / 0.5);
  color: rgb(253 224 71);
}

.status-confirmed {
  background-color: rgb(147 197 253);
  color: rgb(30 64 175);
}

:global(.dark) .status-confirmed {
  background-color: rgb(30 64 175 / 0.5);
  color: rgb(147 197 253);
}

.status-shipping {
  background-color: rgb(165 243 252);
  color: rgb(21 94 117);
}

:global(.dark) .status-shipping {
  background-color: rgb(21 94 117 / 0.5);
  color: rgb(165 243 252);
}

.status-delivered {
  background-color: rgb(187 247 208);
  color: rgb(22 101 52);
}

:global(.dark) .status-delivered {
  background-color: rgb(22 101 52 / 0.5);
  color: rgb(187 247 208);
}

.status-cancelled {
  background-color: rgb(229 231 235);
  color: rgb(31 41 55);
}

:global(.dark) .status-cancelled {
  background-color: rgb(75 85 99);
  color: rgb(243 244 246);
}
</style>