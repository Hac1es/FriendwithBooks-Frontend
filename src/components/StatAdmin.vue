<template>
  <main class="container mx-auto px-4 py-6">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-[#5d4037] mb-2">THỐNG KÊ</h1>
      <p class="text-muted-foreground">Xem thống kê chi tiết về hoạt động kinh doanh của cửa hàng</p>
    </div>

    <!-- Bộ lọc thời gian -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
      <div class="tabs w-full sm:w-auto">
        <div class="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground">
          <button 
            v-for="tab in tabs" 
            :key="tab.value" 
            @click="activeTab = tab.value"
            :class="[
              'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
              activeTab === tab.value ? 'bg-background text-foreground shadow-sm' : ''
            ]"
          >
            {{ tab.label }}
          </button>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <div class="relative">
          <select 
            v-model="dateRange" 
            class="h-10 w-[180px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            <option value="ngay">Hôm nay</option>
            <option value="tuan">Tuần này</option>
            <option value="thang">Tháng này</option>
            <option value="quy">Quý này</option>
            <option value="nam">Năm nay</option>
            <option value="custom">Tùy chỉnh</option>
          </select>
        </div>

        <button class="inline-flex items-center justify-center rounded-md border border-input h-10 w-10 bg-background text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
          <Filter class="h-4 w-4" />
        </button>
      </div>
    </div>

    <!-- Thẻ thống kê tổng quan -->
    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
      <div v-for="(stat, index) in overviewStats" :key="index" class="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div class="flex flex-row items-center justify-between p-6 pb-2">
          <h3 class="text-sm font-medium text-muted-foreground">{{ stat.title }}</h3>
          <component :is="stat.icon" class="h-4 w-4 text-muted-foreground" />
        </div>
        <div class="p-6 pt-0">
          <div class="text-2xl font-bold">{{ stat.value }}</div>
          <div class="flex items-center pt-1 text-sm">
            <component :is="stat.trend > 0 ? ArrowUp : ArrowDown" class="mr-1 h-4 w-4" :class="stat.trend > 0 ? 'text-green-500' : 'text-red-500'" />
            <span :class="stat.trend > 0 ? 'text-green-500' : 'text-red-500'">{{ stat.trend > 0 ? '+' : '' }}{{ stat.trend }}%</span>
            <span class="text-muted-foreground ml-2">so với tháng trước</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Biểu đồ xu hướng -->
    <div class="rounded-lg border bg-card text-card-foreground shadow-sm mb-8">
      <div class="flex flex-col space-y-1.5 p-6">
        <h3 class="text-lg font-semibold leading-none tracking-tight">XU HƯỚNG</h3>
        <p class="text-sm text-muted-foreground">Biểu đồ doanh thu theo ngày trong tháng 3/2023</p>
        
        <div class="tabs mt-2">
          <div class="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground w-full">
            <button 
              v-for="chart in chartTypes" 
              :key="chart.value" 
              @click="activeChartType = chart.value"
              :class="[
                'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 flex-1',
                activeChartType === chart.value ? 'bg-background text-foreground shadow-sm' : ''
              ]"
            >
              <component :is="chart.icon" class="h-4 w-4 mr-2" />
              {{ chart.label }}
            </button>
          </div>
        </div>
      </div>
      <div class="p-6 pt-0">
        <div class="h-[400px] w-full bg-muted/20 rounded-md flex items-center justify-center">
          <div class="text-muted-foreground">Biểu đồ xu hướng doanh thu sẽ hiển thị ở đây</div>
        </div>
      </div>
    </div>

    <!-- Thống kê chi tiết -->
    <div class="grid gap-4 md:grid-cols-2 mb-8">
      <!-- Sách bán chạy nhất -->
      <div class="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div class="flex flex-col space-y-1.5 p-6">
          <h3 class="text-lg font-semibold leading-none tracking-tight">Sách bán chạy nhất</h3>
          <p class="text-sm text-muted-foreground">Top 5 sách bán chạy trong tháng</p>
        </div>
        <div class="p-6 pt-0">
          <div class="space-y-4">
            <div v-for="(book, index) in topBooks" :key="index" class="flex items-center justify-between">
              <div class="flex items-center">
                <div class="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                  <BookOpen class="h-4 w-4 text-primary" />
                </div>
                <div>
                  <div class="font-medium">{{ book.name }}</div>
                  <div class="text-sm text-muted-foreground">{{ book.sales }} cuốn</div>
                </div>
              </div>
              <div class="font-medium">{{ book.revenue }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Danh mục bán chạy -->
      <div class="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div class="flex flex-col space-y-1.5 p-6">
          <h3 class="text-lg font-semibold leading-none tracking-tight">Danh mục bán chạy</h3>
          <p class="text-sm text-muted-foreground">Phân bổ doanh thu theo danh mục</p>
        </div>
        <div class="p-6 pt-0">
          <div class="space-y-4">
            <div v-for="(category, index) in categories" :key="index" class="space-y-2">
              <div class="flex items-center justify-between">
                <div class="font-medium">{{ category.name }}</div>
                <div class="text-sm text-muted-foreground">{{ category.percentage }}%</div>
              </div>
              <div class="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div class="h-full bg-primary" :style="{ width: `${category.percentage}%` }"></div>
              </div>
              <div class="text-sm text-right text-muted-foreground">{{ category.revenue }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Thống kê bổ sung -->
    <div class="grid gap-4 md:grid-cols-3 mb-8">
      <div v-for="(stat, index) in additionalStats" :key="index" class="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div class="flex flex-row items-center justify-between p-6 pb-2">
          <h3 class="text-sm font-medium">{{ stat.title }}</h3>
          <component :is="stat.icon" class="h-4 w-4 text-muted-foreground" />
        </div>
        <div class="p-6 pt-0">
          <div class="text-2xl font-bold">{{ stat.value }}</div>
          <div class="flex items-center pt-1 text-sm">
            <component :is="stat.trend > 0 ? ArrowUp : ArrowDown" class="mr-1 h-4 w-4" :class="stat.trend > 0 ? 'text-green-500' : 'text-red-500'" />
            <span :class="stat.trend > 0 ? 'text-green-500' : 'text-red-500'">{{ stat.trend > 0 ? '+' : '' }}{{ stat.trend }}%</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Bảng đơn hàng gần đây -->
    <div class="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div class="flex flex-col space-y-1.5 p-6">
        <h3 class="text-lg font-semibold leading-none tracking-tight">Đơn hàng gần đây</h3>
        <p class="text-sm text-muted-foreground">Danh sách 10 đơn hàng mới nhất</p>
      </div>
      <div class="p-6 pt-0">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b">
                <th class="text-left py-3 px-2">Mã đơn</th>
                <th class="text-left py-3 px-2">Khách hàng</th>
                <th class="text-left py-3 px-2">Sản phẩm</th>
                <th class="text-right py-3 px-2">Giá trị</th>
                <th class="text-center py-3 px-2">Trạng thái</th>
                <th class="text-right py-3 px-2">Ngày đặt</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(order, index) in recentOrders" :key="index" class="border-b">
                <td class="py-3 px-2">{{ order.id }}</td>
                <td class="py-3 px-2">{{ order.customer }}</td>
                <td class="py-3 px-2">{{ order.products }} sản phẩm</td>
                <td class="py-3 px-2 text-right">{{ order.value }}</td>
                <td class="py-3 px-2 text-center">
                  <span
                    :class="`px-2 py-1 rounded-full text-xs ${
                      order.status === 'Đã giao'
                        ? 'bg-green-100 text-green-800'
                        : order.status === 'Đang giao'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-red-100 text-red-800'
                    }`"
                  >
                    {{ order.status }}
                  </span>
                </td>
                <td class="py-3 px-2 text-right">{{ order.date }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import { ref } from 'vue'
import { 
  BarChart, 
  LineChart, 
  CandlestickChart, 
  ArrowDown, 
  ArrowUp, 
  FileText, 
  Package, 
  Users, 
  BookOpen, 
  DollarSign, 
  ShoppingCart, 
  Filter 
} from 'lucide-vue-next'

export default {
  components: {
    BarChart,
    LineChart,
    CandlestickChart,
    ArrowDown,
    ArrowUp,
    FileText,
    Package,
    Users,
    BookOpen,
    DollarSign,
    ShoppingCart,
    Filter
  },
  setup() {
    const dateRange = ref('thang')
    const activeTab = ref('overview')
    const activeChartType = ref('candlestick')

    const tabs = [
      { label: 'Tổng quan', value: 'overview' },
      { label: 'Doanh số', value: 'sales' },
      { label: 'Sản phẩm', value: 'products' },
      { label: 'Khách hàng', value: 'customers' }
    ]

    const chartTypes = [
      { label: 'Nến', value: 'candlestick', icon: CandlestickChart },
      { label: 'Đường', value: 'line', icon: LineChart },
      { label: 'Cột', value: 'bar', icon: BarChart }
    ]

    const overviewStats = [
      {
        title: 'Doanh thu tháng',
        value: '80.000.000 đ',
        trend: -4.66,
        icon: FileText
      },
      {
        title: 'Tổng số đơn hàng',
        value: '50.000',
        trend: -4.66,
        icon: Package
      },
      {
        title: 'Số lượt truy cập',
        value: '50.000',
        trend: 0.45,
        icon: Users
      }
    ]

    const topBooks = [
      { name: 'Đắc Nhân Tâm', sales: 1250, revenue: '125.000.000 đ' },
      { name: 'Nhà Giả Kim', sales: 980, revenue: '98.000.000 đ' },
      { name: 'Tư Duy Phản Biện', sales: 840, revenue: '84.000.000 đ' },
      { name: 'Người Giàu Có Nhất Thành Babylon', sales: 720, revenue: '72.000.000 đ' },
      { name: 'Đọc Vị Bất Kỳ Ai', sales: 650, revenue: '65.000.000 đ' }
    ]

    const categories = [
      { name: 'Kỹ năng sống', percentage: 35, revenue: '28.000.000 đ' },
      { name: 'Kinh tế', percentage: 25, revenue: '20.000.000 đ' },
      { name: 'Văn học', percentage: 20, revenue: '16.000.000 đ' },
      { name: 'Thiếu nhi', percentage: 12, revenue: '9.600.000 đ' },
      { name: 'Ngoại ngữ', percentage: 8, revenue: '6.400.000 đ' }
    ]

    const additionalStats = [
      {
        title: 'Giá trị đơn hàng trung bình',
        value: '1.600.000 đ',
        trend: 2.5,
        icon: DollarSign
      },
      {
        title: 'Tỷ lệ hoàn thành đơn hàng',
        value: '98.3%',
        trend: 0.7,
        icon: ShoppingCart
      },
      {
        title: 'Khách hàng mới',
        value: '1.245',
        trend: 12.3,
        icon: Users
      }
    ]

    const recentOrders = [
      {
        id: 'ĐH-12345',
        customer: 'Nguyễn Văn A',
        products: 3,
        value: '450.000 đ',
        status: 'Đã giao',
        date: '29/03/2023'
      },
      {
        id: 'ĐH-12344',
        customer: 'Trần Thị B',
        products: 2,
        value: '320.000 đ',
        status: 'Đang giao',
        date: '29/03/2023'
      },
      {
        id: 'ĐH-12343',
        customer: 'Lê Văn C',
        products: 1,
        value: '150.000 đ',
        status: 'Đã giao',
        date: '28/03/2023'
      },
      {
        id: 'ĐH-12342',
        customer: 'Phạm Thị D',
        products: 4,
        value: '680.000 đ',
        status: 'Đã giao',
        date: '28/03/2023'
      },
      {
        id: 'ĐH-12341',
        customer: 'Hoàng Văn E',
        products: 2,
        value: '290.000 đ',
        status: 'Đã hủy',
        date: '27/03/2023'
      }
    ]

    return {
      dateRange,
      activeTab,
      activeChartType,
      tabs,
      chartTypes,
      overviewStats,
      topBooks,
      categories,
      additionalStats,
      recentOrders,
      ArrowDown,
      ArrowUp
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
</style>