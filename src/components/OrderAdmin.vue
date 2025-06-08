<template>
  <main class="container mx-auto px-4 py-6">
    <!-- Header -->
    <div class="mb-8">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-[#5d4037] mb-2">QUẢN LÝ ĐƠN HÀNG</h1>
          <p class="text-muted-foreground">Chỉnh sửa và quản lý thông tin đơn hàng</p>
        </div>
        <div class="flex items-center gap-2">
          <button 
            @click="saveOrder"
            class="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <Save class="mr-2 h-4 w-4" />
            Lưu thay đổi
          </button>
          <button 
            @click="cancelEdit"
            class="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <X class="mr-2 h-4 w-4" />
            Hủy
          </button>
        </div>
      </div>
    </div>

    <!-- Bộ lọc và tìm kiếm -->
    <div class="mb-6 p-4 rounded-lg border bg-card">
      <div class="grid gap-4 md:grid-cols-4">
        <div>
          <label class="text-sm font-medium mb-2 block">Tìm kiếm đơn hàng</label>
          <div class="relative">
            <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input 
              v-model="searchQuery"
              type="text" 
              placeholder="Mã đơn, tên khách hàng..."
              class="flex h-10 w-full rounded-md border border-input bg-background px-10 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </div>
        </div>
        
        <div>
          <label class="text-sm font-medium mb-2 block">Trạng thái</label>
          <select 
            v-model="filterStatus"
            class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="pending">Chờ xử lý</option>
            <option value="confirmed">Đã xác nhận</option>
            <option value="shipping">Đang giao</option>
            <option value="delivered">Đã giao</option>
            <option value="cancelled">Đã hủy</option>
          </select>
        </div>

        <div>
          <label class="text-sm font-medium mb-2 block">Từ ngày</label>
          <input 
            v-model="dateFrom"
            type="date"
            class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
        </div>

        <div>
          <label class="text-sm font-medium mb-2 block">Đến ngày</label>
          <input 
            v-model="dateTo"
            type="date"
            class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
        </div>
      </div>
    </div>

    <!-- Danh sách đơn hàng -->
    <div class="rounded-lg border bg-card text-card-foreground shadow-sm mb-6">
      <div class="flex flex-col space-y-1.5 p-6">
        <h3 class="text-lg font-semibold leading-none tracking-tight">Danh sách đơn hàng</h3>
        <p class="text-sm text-muted-foreground">{{ filteredOrders.length }} đơn hàng được tìm thấy</p>
      </div>
      <div class="p-6 pt-0">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b">
                <th class="text-left py-3 px-2">
                  <input type="checkbox" @change="toggleSelectAll" class="rounded border-gray-300" />
                </th>
                <th class="text-left py-3 px-2">Mã đơn</th>
                <th class="text-left py-3 px-2">Khách hàng</th>
                <th class="text-left py-3 px-2">Ngày đặt</th>
                <th class="text-right py-3 px-2">Tổng tiền</th>
                <th class="text-center py-3 px-2">Trạng thái</th>
                <th class="text-center py-3 px-2">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              <tr 
                v-for="order in paginatedOrders" 
                :key="order.id" 
                class="border-b hover:bg-muted/50 cursor-pointer"
                @click="selectOrder(order)"
                :class="{ 'bg-muted/30': selectedOrder?.id === order.id }"
              >
                <td class="py-3 px-2">
                  <input 
                    type="checkbox" 
                    :checked="selectedOrderIds.includes(order.id)"
                    @change="toggleOrderSelection(order.id)"
                    @click.stop
                    class="rounded border-gray-300" 
                  />
                </td>
                <td class="py-3 px-2 font-medium">{{ order.id }}</td>
                <td class="py-3 px-2">
                  <div>
                    <div class="font-medium">{{ order.customer.name }}</div>
                    <div class="text-sm text-muted-foreground">{{ order.customer.email }}</div>
                  </div>
                </td>
                <td class="py-3 px-2">{{ formatDate(order.createdAt) }}</td>
                <td class="py-3 px-2 text-right font-medium">{{ formatCurrency(order.total) }}</td>
                <td class="py-3 px-2 text-center">
                  <span :class="getStatusClass(order.status)">
                    {{ getStatusText(order.status) }}
                  </span>
                </td>
                <td class="py-3 px-2 text-center">
                  <div class="flex items-center justify-center gap-2">
                    <button 
                      @click.stop="editOrder(order)"
                      class="inline-flex items-center justify-center rounded-md h-8 w-8 border border-input bg-background text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <Edit class="h-4 w-4" />
                    </button>
                    <button 
                      @click.stop="deleteOrder(order.id)"
                      class="inline-flex items-center justify-center rounded-md h-8 w-8 border border-input bg-background text-sm font-medium ring-offset-background transition-colors hover:bg-destructive hover:text-destructive-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <Trash2 class="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="flex items-center justify-between mt-4">
          <div class="text-sm text-muted-foreground">
            Hiển thị {{ (currentPage - 1) * itemsPerPage + 1 }} - {{ Math.min(currentPage * itemsPerPage, filteredOrders.length) }} 
            trong tổng số {{ filteredOrders.length }} đơn hàng
          </div>
          <div class="flex items-center gap-2">
            <button 
              @click="currentPage--"
              :disabled="currentPage === 1"
              class="inline-flex items-center justify-center rounded-md h-8 w-8 border border-input bg-background text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
            >
              <ChevronLeft class="h-4 w-4" />
            </button>
            <span class="text-sm">{{ currentPage }} / {{ totalPages }}</span>
            <button 
              @click="currentPage++"
              :disabled="currentPage === totalPages"
              class="inline-flex items-center justify-center rounded-md h-8 w-8 border border-input bg-background text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
            >
              <ChevronRight class="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Chi tiết đơn hàng -->
    <div v-if="selectedOrder" class="grid gap-6 lg:grid-cols-3">
      <!-- Thông tin đơn hàng -->
      <div class="lg:col-span-2">
        <div class="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div class="flex flex-col space-y-1.5 p-6">
            <h3 class="text-lg font-semibold leading-none tracking-tight">
              Chi tiết đơn hàng {{ selectedOrder.id }}
            </h3>
          </div>
          <div class="p-6 pt-0">
            <div class="grid gap-4 md:grid-cols-2 mb-6">
              <div>
                <label class="text-sm font-medium mb-2 block">Trạng thái đơn hàng</label>
                <select 
                  v-model="selectedOrder.status"
                  class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="pending">Chờ xử lý</option>
                  <option value="confirmed">Đã xác nhận</option>
                  <option value="shipping">Đang giao</option>
                  <option value="delivered">Đã giao</option>
                  <option value="cancelled">Đã hủy</option>
                </select>
              </div>
              
              <div>
                <label class="text-sm font-medium mb-2 block">Phương thức thanh toán</label>
                <select 
                  v-model="selectedOrder.paymentMethod"
                  class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="cod">Thanh toán khi nhận hàng</option>
                  <option value="bank">Chuyển khoản ngân hàng</option>
                  <option value="momo">Ví MoMo</option>
                  <option value="vnpay">VNPay</option>
                </select>
              </div>
            </div>

            <!-- Sản phẩm trong đơn hàng -->
            <div class="mb-6">
              <h4 class="text-md font-semibold mb-4">Sản phẩm đã đặt</h4>
              <div class="space-y-4">
                <div 
                  v-for="(item, index) in selectedOrder.items" 
                  :key="index"
                  class="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div class="flex items-center gap-4">
                    <img 
                      :src="item.image" 
                      :alt="item.name"
                      class="w-16 h-16 object-cover rounded-md"
                    />
                    <div>
                      <h5 class="font-medium">{{ item.name }}</h5>
                      <p class="text-sm text-muted-foreground">{{ formatCurrency(item.price) }}</p>
                    </div>
                  </div>
                  <div class="flex items-center gap-4">
                    <div class="flex items-center gap-2">
                      <button 
                        @click="updateQuantity(index, item.quantity - 1)"
                        class="inline-flex items-center justify-center rounded-md h-8 w-8 border border-input bg-background text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground"
                      >
                        <Minus class="h-4 w-4" />
                      </button>
                      <input 
                        v-model.number="item.quantity"
                        type="number"
                        min="1"
                        class="w-16 text-center h-8 rounded-md border border-input bg-background px-2 text-sm"
                      />
                      <button 
                        @click="updateQuantity(index, item.quantity + 1)"
                        class="inline-flex items-center justify-center rounded-md h-8 w-8 border border-input bg-background text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground"
                      >
                        <Plus class="h-4 w-4" />
                      </button>
                    </div>
                    <div class="text-right">
                      <div class="font-medium">{{ formatCurrency(item.price * item.quantity) }}</div>
                    </div>
                    <button 
                      @click="removeItem(index)"
                      class="inline-flex items-center justify-center rounded-md h-8 w-8 border border-input bg-background text-sm font-medium ring-offset-background transition-colors hover:bg-destructive hover:text-destructive-foreground"
                    >
                      <X class="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Ghi chú đơn hàng -->
            <div>
              <label class="text-sm font-medium mb-2 block">Ghi chú đơn hàng</label>
              <textarea 
                v-model="selectedOrder.notes"
                rows="3"
                placeholder="Thêm ghi chú cho đơn hàng..."
                class="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              ></textarea>
            </div>
          </div>
        </div>
      </div>

      <!-- Thông tin khách hàng và thanh toán -->
      <div class="space-y-6">
        <!-- Thông tin khách hàng -->
        <div class="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div class="flex flex-col space-y-1.5 p-6">
            <h3 class="text-lg font-semibold leading-none tracking-tight">Thông tin khách hàng</h3>
          </div>
          <div class="p-6 pt-0 space-y-4">
            <div>
              <label class="text-sm font-medium mb-2 block">Họ và tên</label>
              <input 
                v-model="selectedOrder.customer.name"
                type="text"
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
            </div>
            <div>
              <label class="text-sm font-medium mb-2 block">Email</label>
              <input 
                v-model="selectedOrder.customer.email"
                type="email"
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
            </div>
            <div>
              <label class="text-sm font-medium mb-2 block">Số điện thoại</label>
              <input 
                v-model="selectedOrder.customer.phone"
                type="tel"
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
            </div>
            <div>
              <label class="text-sm font-medium mb-2 block">Địa chỉ giao hàng</label>
              <textarea 
                v-model="selectedOrder.shippingAddress"
                rows="3"
                class="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              ></textarea>
            </div>
          </div>
        </div>

        <!-- Tóm tắt thanh toán -->
        <div class="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div class="flex flex-col space-y-1.5 p-6">
            <h3 class="text-lg font-semibold leading-none tracking-tight">Tóm tắt thanh toán</h3>
          </div>
          <div class="p-6 pt-0 space-y-3">
            <div class="flex justify-between">
              <span>Tạm tính:</span>
              <span>{{ formatCurrency(calculateSubtotal()) }}</span>
            </div>
            <div class="flex justify-between">
              <span>Phí vận chuyển:</span>
              <span>{{ formatCurrency(selectedOrder.shippingFee || 0) }}</span>
            </div>
            <div class="flex justify-between">
              <span>Giảm giá:</span>
              <span class="text-red-500">-{{ formatCurrency(selectedOrder.discount || 0) }}</span>
            </div>
            <hr />
            <div class="flex justify-between font-semibold text-lg">
              <span>Tổng cộng:</span>
              <span>{{ formatCurrency(calculateTotal()) }}</span>
            </div>
          </div>
        </div>

        <!-- Lịch sử đơn hàng -->
        <div class="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div class="flex flex-col space-y-1.5 p-6">
            <h3 class="text-lg font-semibold leading-none tracking-tight">Lịch sử đơn hàng</h3>
          </div>
          <div class="p-6 pt-0">
            <div class="space-y-4">
              <div 
                v-for="(history, index) in selectedOrder.history" 
                :key="index"
                class="flex items-start gap-3"
              >
                <div class="w-2 h-2 rounded-full bg-primary mt-2"></div>
                <div class="flex-1">
                  <div class="font-medium">{{ history.action }}</div>
                  <div class="text-sm text-muted-foreground">{{ formatDate(history.timestamp) }}</div>
                  <div v-if="history.note" class="text-sm text-muted-foreground mt-1">{{ history.note }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { 
  Search, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  Plus, 
  Minus, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-vue-next'

export default {
  components: {
    Search,
    Edit,
    Trash2,
    Save,
    X,
    Plus,
    Minus,
    ChevronLeft,
    ChevronRight
  },
  setup() {
    const searchQuery = ref('')
    const filterStatus = ref('')
    const dateFrom = ref('')
    const dateTo = ref('')
    const selectedOrder = ref(null)
    const selectedOrderIds = ref([])
    const currentPage = ref(1)
    const itemsPerPage = ref(10)

    // Dữ liệu mẫu đơn hàng
    const orders = ref([
      {
        id: 'ĐH-12345',
        customer: {
          name: 'Nguyễn Văn A',
          email: 'nguyenvana@email.com',
          phone: '0123456789'
        },
        createdAt: '2023-03-29T10:30:00Z',
        status: 'confirmed',
        paymentMethod: 'cod',
        shippingAddress: '123 Đường ABC, Phường XYZ, Quận 1, TP.HCM',
        shippingFee: 30000,
        discount: 50000,
        total: 450000,
        notes: 'Giao hàng trong giờ hành chính',
        items: [
          {
            name: 'Đắc Nhân Tâm',
            price: 120000,
            quantity: 2,
            image: '/placeholder.svg?height=64&width=64'
          },
          {
            name: 'Nhà Giả Kim',
            price: 150000,
            quantity: 1,
            image: '/placeholder.svg?height=64&width=64'
          }
        ],
        history: [
          {
            action: 'Đơn hàng được tạo',
            timestamp: '2023-03-29T10:30:00Z',
            note: 'Khách hàng đặt hàng online'
          },
          {
            action: 'Đã xác nhận đơn hàng',
            timestamp: '2023-03-29T11:00:00Z',
            note: 'Admin xác nhận đơn hàng'
          }
        ]
      },
      {
        id: 'ĐH-12344',
        customer: {
          name: 'Trần Thị B',
          email: 'tranthib@email.com',
          phone: '0987654321'
        },
        createdAt: '2023-03-28T14:20:00Z',
        status: 'shipping',
        paymentMethod: 'bank',
        shippingAddress: '456 Đường DEF, Phường UVW, Quận 2, TP.HCM',
        shippingFee: 25000,
        discount: 0,
        total: 320000,
        notes: '',
        items: [
          {
            name: 'Tư Duy Phản Biện',
            price: 180000,
            quantity: 1,
            image: '/placeholder.svg?height=64&width=64'
          },
          {
            name: 'Đọc Vị Bất Kỳ Ai',
            price: 115000,
            quantity: 1,
            image: '/placeholder.svg?height=64&width=64'
          }
        ],
        history: [
          {
            action: 'Đơn hàng được tạo',
            timestamp: '2023-03-28T14:20:00Z'
          },
          {
            action: 'Đã xác nhận đơn hàng',
            timestamp: '2023-03-28T15:00:00Z'
          },
          {
            action: 'Đang giao hàng',
            timestamp: '2023-03-29T09:00:00Z'
          }
        ]
      }
    ])

    // Computed properties
    const filteredOrders = computed(() => {
      let filtered = orders.value

      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        filtered = filtered.filter(order => 
          order.id.toLowerCase().includes(query) ||
          order.customer.name.toLowerCase().includes(query) ||
          order.customer.email.toLowerCase().includes(query)
        )
      }

      if (filterStatus.value) {
        filtered = filtered.filter(order => order.status === filterStatus.value)
      }

      if (dateFrom.value) {
        filtered = filtered.filter(order => 
          new Date(order.createdAt) >= new Date(dateFrom.value)
        )
      }

      if (dateTo.value) {
        filtered = filtered.filter(order => 
          new Date(order.createdAt) <= new Date(dateTo.value)
        )
      }

      return filtered
    })

    const paginatedOrders = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage.value
      const end = start + itemsPerPage.value
      return filteredOrders.value.slice(start, end)
    })

    const totalPages = computed(() => {
      return Math.ceil(filteredOrders.value.length / itemsPerPage.value)
    })

    // Methods
    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    const formatCurrency = (amount) => {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
      }).format(amount)
    }

    const getStatusClass = (status) => {
      const classes = {
        pending: 'px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800',
        confirmed: 'px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800',
        shipping: 'px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800',
        delivered: 'px-2 py-1 rounded-full text-xs bg-green-100 text-green-800',
        cancelled: 'px-2 py-1 rounded-full text-xs bg-red-100 text-red-800'
      }
      return classes[status] || classes.pending
    }

    const getStatusText = (status) => {
      const texts = {
        pending: 'Chờ xử lý',
        confirmed: 'Đã xác nhận',
        shipping: 'Đang giao',
        delivered: 'Đã giao',
        cancelled: 'Đã hủy'
      }
      return texts[status] || 'Không xác định'
    }

    const selectOrder = (order) => {
      selectedOrder.value = { ...order }
    }

    const editOrder = (order) => {
      selectedOrder.value = { ...order }
    }

    const toggleOrderSelection = (orderId) => {
      const index = selectedOrderIds.value.indexOf(orderId)
      if (index > -1) {
        selectedOrderIds.value.splice(index, 1)
      } else {
        selectedOrderIds.value.push(orderId)
      }
    }

    const toggleSelectAll = (event) => {
      if (event.target.checked) {
        selectedOrderIds.value = paginatedOrders.value.map(order => order.id)
      } else {
        selectedOrderIds.value = []
      }
    }

    const updateQuantity = (index, newQuantity) => {
      if (newQuantity > 0) {
        selectedOrder.value.items[index].quantity = newQuantity
      }
    }

    const removeItem = (index) => {
      selectedOrder.value.items.splice(index, 1)
    }

    const calculateSubtotal = () => {
      if (!selectedOrder.value) return 0
      return selectedOrder.value.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    }

    const calculateTotal = () => {
      if (!selectedOrder.value) return 0
      const subtotal = calculateSubtotal()
      const shipping = selectedOrder.value.shippingFee || 0
      const discount = selectedOrder.value.discount || 0
      return subtotal + shipping - discount
    }

    const saveOrder = () => {
      if (selectedOrder.value) {
        // Cập nhật tổng tiền
        selectedOrder.value.total = calculateTotal()
        
        // Thêm vào lịch sử
        selectedOrder.value.history.push({
          action: 'Đơn hàng được cập nhật',
          timestamp: new Date().toISOString(),
          note: 'Admin cập nhật thông tin đơn hàng'
        })

        // Cập nhật trong danh sách
        const index = orders.value.findIndex(order => order.id === selectedOrder.value.id)
        if (index > -1) {
          orders.value[index] = { ...selectedOrder.value }
        }

        alert('Đã lưu thay đổi thành công!')
      }
    }

    const cancelEdit = () => {
      selectedOrder.value = null
    }

    const deleteOrder = (orderId) => {
      if (confirm('Bạn có chắc chắn muốn xóa đơn hàng này?')) {
        const index = orders.value.findIndex(order => order.id === orderId)
        if (index > -1) {
          orders.value.splice(index, 1)
          if (selectedOrder.value?.id === orderId) {
            selectedOrder.value = null
          }
        }
      }
    }

    onMounted(() => {
      // Chọn đơn hàng đầu tiên khi load trang
      if (orders.value.length > 0) {
        selectOrder(orders.value[0])
      }
    })

    return {
      searchQuery,
      filterStatus,
      dateFrom,
      dateTo,
      selectedOrder,
      selectedOrderIds,
      currentPage,
      itemsPerPage,
      orders,
      filteredOrders,
      paginatedOrders,
      totalPages,
      formatDate,
      formatCurrency,
      getStatusClass,
      getStatusText,
      selectOrder,
      editOrder,
      toggleOrderSelection,
      toggleSelectAll,
      updateQuantity,
      removeItem,
      calculateSubtotal,
      calculateTotal,
      saveOrder,
      cancelEdit,
      deleteOrder
    }
  }
}
</script>

<style>
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --card: 0 0% 100%;
  --card-foreground: 222.2 84% 4.9%;
  --popover: 0 0% 100%;
  --popover-foreground: 222.2 84% 4.9%;
  --primary: 25 95% 53%;
  --primary-foreground: 210 40% 98%;
  --secondary: 210 40% 96.1%;
  --secondary-foreground: 222.2 47.4% 11.2%;
  --muted: 210 40% 96.1%;
  --muted-foreground: 215.4 16.3% 46.9%;
  --accent: 210 40% 96.1%;
  --accent-foreground: 222.2 47.4% 11.2%;
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 210 40% 98%;
  --border: 214.3 31.8% 91.4%;
  --input: 214.3 31.8% 91.4%;
  --ring: 222.2 84% 4.9%;
  --radius: 0.5rem;
}

.bg-background {
  background-color: hsl(var(--background));
}

.bg-card {
  background-color: hsl(var(--card));
}

.text-card-foreground {
  color: hsl(var(--card-foreground));
}

.bg-muted {
  background-color: hsl(var(--muted));
}

.text-muted-foreground {
  color: hsl(var(--muted-foreground));
}

.bg-primary {
  background-color: hsl(var(--primary));
}

.text-primary {
  color: hsl(var(--primary));
}

.text-primary-foreground {
  color: hsl(var(--primary-foreground));
}

.border {
  border-color: hsl(var(--border));
}

.border-input {
  border-color: hsl(var(--input));
}

.bg-accent {
  background-color: hsl(var(--accent));
}

.text-accent-foreground {
  color: hsl(var(--accent-foreground));
}

.text-foreground {
  color: hsl(var(--foreground));
}

.hover\:bg-primary\/90:hover {
  background-color: hsl(var(--primary) / 0.9);
}

.hover\:bg-destructive:hover {
  background-color: hsl(var(--destructive));
}

.hover\:text-destructive-foreground:hover {
  color: hsl(var(--destructive-foreground));
}
</style>