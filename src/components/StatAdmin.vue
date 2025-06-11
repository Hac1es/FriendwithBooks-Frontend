<template>
  <main class="container mx-auto px-4 py-6">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-[#5d4037] mb-2">THỐNG KÊ</h1>
      <p class="text-muted-foreground">
        Xem thống kê chi tiết về hoạt động kinh doanh của cửa hàng
      </p>
    </div>

    <!-- Phần đầu -->
    <div
      class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4"
    >
      <div class="tabs w-full sm:w-auto">
        <div
          class="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground"
        >
          <button
            v-for="tab in tabs"
            :key="tab.value"
            @click="activeTab = tab.value"
            :class="[
              'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
              activeTab === tab.value
                ? 'bg-background text-foreground shadow-sm'
                : '',
            ]"
          >
            {{ tab.label }}
          </button>
        </div>
      </div>

      <n-spin :show="isLoading">
        <!-- Bộ lọc thời gian -->
        <div class="flex items-center gap-2">
          <div class="relative">
            <select
              v-model="dateRange"
              @change="fetchRevenue"
              class="h-10 w-[180px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <option value="ngày">Hôm nay</option>
              <option value="tuần">Tuần này</option>
              <option value="tháng">Tháng này</option>
              <option value="năm">Năm nay</option>
              <option value="khoảng thời gian">Tùy chỉnh</option>
            </select>
            <div
              v-if="dateRange === 'khoảng thời gian'"
              class="flex gap-2 mt-2"
            >
              <Datepicker
                placeholder="Chọn ngày bắt đầu"
                v-model="customStart"
                class="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                @update:modelValue="fetchRevenue"
              />
              <span class="self-center text-muted-foreground">–</span>
              <Datepicker
                placeholder="Chọn ngày kết thúc"
                v-model="customEnd"
                class="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                @update:modelValue="fetchRevenue"
              />
            </div>
          </div>
        </div>
        <template #description> Đang tải... </template>
      </n-spin>
    </div>

    <div v-show="activeTab == 'overview' && !isLoading">
      <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <div
          v-for="(stat, index) in overviewStats"
          :key="index"
          class="rounded-lg border bg-card text-card-foreground shadow-sm"
        >
          <div class="flex flex-row items-center justify-between p-6 pb-2">
            <h3 class="text-sm font-medium text-muted-foreground">
              {{ stat.title }}
            </h3>
            <component :is="stat.icon" class="h-4 w-4 text-muted-foreground" />
          </div>
          <div class="p-6 pt-0">
            <div class="text-2xl font-bold">{{ stat.value }}</div>
            <div class="flex items-center pt-1 text-sm">
              <component
                v-if="stat.trend != 0"
                :is="stat.trend > 0 ? ArrowUp : ArrowDown"
                class="mr-1 h-4 w-4"
                :class="stat.trend > 0 ? 'text-green-500' : 'text-red-500'"
              />
              <span
                :class="
                  stat.trend > 0
                    ? 'text-green-500'
                    : stat.trend < 0
                    ? 'text-red-500'
                    : 'text-gray-500'
                "
              >
                {{
                  stat.trend > 0
                    ? "+" + stat.trend + "%"
                    : stat.trend < 0
                    ? stat.trend + "%"
                    : "Không thay đổi"
                }}
              </span>
              <span
                class="text-muted-foreground"
                :class="stat.trend != 0 ? 'ml-2' : 'ml-1'"
                >{{ `so với ${dateRange} trước` }}</span
              >
            </div>
          </div>
        </div>
      </div>

      <!-- Biểu đồ xu hướng -->
      <div
        class="rounded-lg border bg-card text-card-foreground shadow-sm mb-8"
        v-if="dateRange != 'ngày'"
      >
        <div class="flex flex-col space-y-1.5 p-6">
          <h3 class="text-lg font-semibold leading-none tracking-tight">
            XU HƯỚNG
          </h3>
          <p class="text-sm text-muted-foreground">
            Biểu đồ doanh thu theo {{ dateRange }}
          </p>

          <div class="tabs mt-2">
            <div
              class="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground w-full"
            >
              <button
                v-for="chart in chartTypes"
                :key="chart.value"
                @click="activeChartType = chart.value"
                :class="[
                  'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 flex-1',
                  activeChartType === chart.value
                    ? 'bg-background text-foreground shadow-sm'
                    : '',
                ]"
              >
                <component :is="chart.icon" class="h-4 w-4 mr-2" />
                {{ chart.label }}
              </button>
            </div>
          </div>
        </div>
        <div class="p-6 pt-0">
          <div
            class="h-[400px] w-full bg-muted/20 rounded-md flex items-center justify-center"
          >
            <div ref="chartRef" class="w-full h-full"></div>
          </div>
        </div>
      </div>

      <!-- Đơn hàng -->
      <div v-show="activeTab == 'orders' && !isLoading">
        <div class="grid gap-4 md:grid-cols-2 mb-8">
          <div
            v-for="(stat, index) in additionalStatsOrders"
            :key="index"
            class="rounded-lg border bg-card text-card-foreground shadow-sm"
          >
            <div class="flex flex-row items-center justify-between p-6 pb-2">
              <h3 class="text-sm font-medium">{{ stat.title }}</h3>
              <component
                :is="stat.icon"
                class="h-4 w-4 text-muted-foreground"
              />
            </div>
            <div class="p-6 pt-0">
              <div class="text-2xl font-bold">{{ stat.value }}</div>
              <div class="flex items-center pt-1 text-sm">
                <component
                  :is="stat.trend > 0 ? ArrowUp : ArrowDown"
                  class="mr-1 h-4 w-4"
                  :class="stat.trend > 0 ? 'text-green-500' : 'text-red-500'"
                />
                <span
                  :class="stat.trend > 0 ? 'text-green-500' : 'text-red-500'"
                  >{{ stat.trend > 0 ? "+" : "" }}{{ stat.trend }}%</span
                >
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Khách hàng -->
      <div v-show="activeTab == 'customers'">
        <div
          v-for="(stat, index) in topCustomers"
          :key="index"
          class="rounded-lg border bg-card text-card-foreground shadow-sm"
        >
          <div class="flex flex-row items-center justify-between p-6 pb-2">
            <h3 class="text-sm font-medium">{{ stat.title }}</h3>
            <component :is="stat.icon" class="h-4 w-4 text-muted-foreground" />
          </div>
          <div class="p-6 pt-0">
            <div class="text-2xl font-bold">{{ stat.value }}</div>
            <div class="flex items-center pt-1 text-sm">
              <component
                :is="stat.trend > 0 ? ArrowUp : ArrowDown"
                class="mr-1 h-4 w-4"
                :class="stat.trend > 0 ? 'text-green-500' : 'text-red-500'"
              />
              <span :class="stat.trend > 0 ? 'text-green-500' : 'text-red-500'"
                >{{ stat.trend > 0 ? "+" : "" }}{{ stat.trend }}%</span
              >
            </div>
          </div>
        </div>
      </div>

      <!-- Top 10 khách hàng mua sắm nhiều nhất -->
      <div
        v-show="activeTab == 'customers'"
        class="rounded-lg border bg-card text-card-foreground shadow-sm mb-8"
      >
        <div class="flex flex-col space-y-1.5 p-6">
          <h3 class="text-lg font-semibold leading-none tracking-tight">
            Khách hàng mua sắm nhiều nhất
          </h3>
          <p class="text-sm text-muted-foreground">
            Top 10 khách hàng chi tiêu cao nhất trong {{ dateRange }}
          </p>
        </div>
        <div class="p-6 pt-0">
          <div class="space-y-4">
            <div
              v-for="(customer, index) in topCustomers"
              :key="index"
              class="flex items-center justify-between"
            >
              <div class="flex items-center">
                <div
                  class="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3"
                >
                  <Users class="h-4 w-4 text-primary" />
                </div>
                <div>
                  <div class="font-medium">{{ customer.name }}</div>
                  <div class="text-sm text-muted-foreground">
                    {{ customer.orderCount }} đơn hàng
                  </div>
                </div>
              </div>
              <div class="font-medium">{{ customer.totalSpent }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Thống kê xu hướng -->
    <div v-show="activeTab == 'trends'">
      <!-- Thống kê chi tiết -->
      <div class="grid gap-4 md:grid-cols-2 mb-8">
        <!-- Sách bán chạy nhất -->
        <div class="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div class="flex flex-col space-y-1.5 p-6">
            <h3 class="text-lg font-semibold leading-none tracking-tight">
              Sách bán chạy nhất
            </h3>
            <p class="text-sm text-muted-foreground">
              Top 5 sách bán chạy trong {{ dateRange }}
            </p>
          </div>
          <div class="p-6 pt-0">
            <div class="space-y-4">
              <div
                v-for="(book, index) in topBooks"
                :key="index"
                class="flex items-center justify-between"
              >
                <div class="flex items-center">
                  <div
                    class="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3"
                  >
                    <BookOpen class="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <div class="font-medium">{{ book.name }}</div>
                    <div class="text-sm text-muted-foreground">
                      {{ book.sales }} cuốn
                    </div>
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
            <h3 class="text-lg font-semibold leading-none tracking-tight">
              Danh mục bán chạy
            </h3>
            <p class="text-sm text-muted-foreground">
              Phân bổ doanh thu theo danh mục
            </p>
          </div>
          <div class="p-6 pt-0">
            <div class="space-y-4">
              <div
                v-for="(category, index) in categories"
                :key="index"
                class="space-y-2"
              >
                <div class="flex items-center justify-between">
                  <div class="font-medium">{{ category.name }}</div>
                  <div class="text-sm text-muted-foreground">
                    {{ category.percentage }}%
                  </div>
                </div>
                <div class="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    class="h-full bg-primary"
                    :style="{ width: `${category.percentage}%` }"
                  ></div>
                </div>
                <div class="text-sm text-right text-muted-foreground">
                  {{ category.revenue }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Thống kê đơn hàng -->
    <div v-show="activeTab == 'orders'">
      <!-- Bảng đơn hàng gần đây -->
      <div class="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div class="flex flex-col space-y-1.5 p-6">
          <h3 class="text-lg font-semibold leading-none tracking-tight">
            Đơn hàng gần đây
          </h3>
          <p class="text-sm text-muted-foreground">
            Danh sách 10 đơn hàng mới nhất
          </p>
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
                <tr
                  v-for="(order, index) in recentOrders"
                  :key="index"
                  class="border-b"
                >
                  <td class="py-3 px-2">{{ order.id }}</td>
                  <td class="py-3 px-2">{{ order.customer }}</td>
                  <td class="py-3 px-2">{{ order.products }} sản phẩm</td>
                  <td class="py-3 px-2 text-right">{{ order.value }}</td>
                  <td class="py-3 px-2 text-center">
                    <span
                      :class="
                        `px-2 py-1 rounded-full text-xs ` +
                        (order.status === 'delivered'
                          ? 'bg-green-100 text-green-800'
                          : order.status === 'shipped'
                          ? 'bg-blue-100 text-blue-800'
                          : order.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800')
                      "
                    >
                      {{
                        order.status === "delivered"
                          ? "Đã giao"
                          : order.status === "shipped"
                          ? "Đang giao"
                          : order.status === "pending"
                          ? "Chờ xử lý"
                          : "Đã hủy"
                      }}
                    </span>
                  </td>
                  <td class="py-3 px-2 text-right">{{ order.date }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from "vue";
import {
  BarChart,
  LineChart,
  ArrowDown,
  ArrowUp,
  FileText,
  Package,
  Users,
  BookOpen,
  DollarSign,
  ShoppingCart,
} from "lucide-vue-next";
import Datepicker from "vue3-datepicker";
import axios from "../utils/axios";
import * as echarts from "echarts";

const isLoading = ref(false);
const dateRange = ref("tháng");
const activeTab = ref("overview");
const activeChartType = ref("line");
const customStart = ref(null);
const customEnd = ref(null);
const chartRef = ref(null);
const chartData = ref([]);
let chartInstance = null;

const tabs = [
  { label: "Tổng quan", value: "overview" },
  { label: "Xu hướng", value: "trends" },
  { label: "Đơn hàng", value: "orders" },
  { label: "Khách hàng", value: "customers" },
];

const chartTypes = [
  { label: "Đường", value: "line", icon: LineChart },
  { label: "Cột", value: "bar", icon: BarChart },
];

const overviewStats = ref([
  {
    title: "Doanh thu tháng",
    value: "",
    trend: 0,
    icon: FileText,
  },
  {
    title: "Tổng số đơn hàng",
    value: "",
    trend: 0,
    icon: Package,
  },
  {
    title: "Giá trị trung bình mỗi đơn",
    value: "",
    trend: 0,
    icon: Users,
  },
]);

const topBooks = ref([]);
const categories = ref([]);

const additionalStatsOrders = [
  {
    title: "Tỷ lệ hoàn thành đơn hàng",
    value: "98.3%",
    trend: 0.7,
    icon: ShoppingCart,
  },
];
const additionalStatsCustomers = [
  {
    title: "Khách hàng mới",
    value: "1.245",
    trend: 12.3,
    icon: Users,
  },
];

const recentOrders = ref([]);
const topCustomers = ref([]);

const getDateRange = () => {
  const now = new Date();
  let start, end;
  switch (dateRange.value) {
    case "ngày": // Hôm nay
      start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      end = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      break;
    case "tuần": // Tuần này
      const day = now.getDay() || 7;
      start = new Date(now);
      start.setDate(now.getDate() - day + 1);
      start.setHours(0, 0, 0, 0);
      end = new Date(start);
      end.setDate(start.getDate() + 7);
      break;
    case "tháng": // Tháng này
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      end = new Date(now.getFullYear(), now.getMonth() + 1, 1);
      break;
    case "năm": // Năm nay
      start = new Date(now.getFullYear(), 0, 1);
      end = new Date(now.getFullYear() + 1, 0, 1);
      break;
    case "khoảng thời gian":
      start = customStart.value ? new Date(customStart.value) : null;
      end = customEnd.value ? new Date(customEnd.value) : null;
      break;
    default:
      start = null;
      end = null;
  }
  return {
    startTime: start ? start.toISOString() : null,
    endTime: end ? end.toISOString() : null,
  };
};

const fetchRevenue = async () => {
  if (
    dateRange.value === "khoảng thời gian" &&
    (!customStart.value || !customEnd.value)
  ) {
    isLoading.value = false;
    return;
  }
  isLoading.value = true;
  const { startTime, endTime } = getDateRange();
  const params = {};
  if (startTime) params.startTime = startTime;
  if (endTime) params.endTime = endTime;
  const res = await axios.get("admin/statistics/revenue", { params });
  console.log(res.data);
  overviewStats.value[0].value = res.data.totalRevenue.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });
  overviewStats.value[0].trend = res.data.revenuePercent.toFixed(2);
  overviewStats.value[1].value = res.data.orderCount;
  overviewStats.value[1].trend = res.data.orderPercent.toFixed(2);
  overviewStats.value[2].value = res.data.averageOrderValue.toLocaleString(
    "vi-VN",
    { style: "currency", currency: "VND" }
  );
  overviewStats.value[2].trend = res.data.avgOrderPercent.toFixed(2);
  isLoading.value = false;
};

const fetchTopBooksAndCategories = async () => {
  const { startTime, endTime } = getDateRange();
  const params = {};
  if (startTime) params.startTime = startTime;
  if (endTime) params.endTime = endTime;
  // Top 10 books
  const booksRes = await axios.get("admin/statistics/top5books", { params });
  topBooks.value = booksRes.data.map((b) => ({
    name: b.title || b.Title,
    sales: b.totalSold || b.TotalSold,
    revenue: (b.totalRevenue || b.TotalRevenue).toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    }),
  }));
  // Top 10 categories
  const catRes = await axios.get("admin/statistics/top5categories", {
    params,
  });
  categories.value = catRes.data.map((c) => ({
    name: c.categoryName || c.CategoryName,
    percentage: c.revenuePercent || c.RevenuePercent,
    revenue: (c.totalRevenue || c.TotalRevenue).toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    }),
  }));
};

const fetchChartData = async () => {
  let period;
  switch (dateRange.value) {
    case "ngày":
      period = "day";
      break;
    case "tuần":
      period = "week";
      break;
    case "tháng":
      period = "month";
      break;
    case "năm":
      period = "year";
      break;
    case "khoảng thời gian":
      period = "custom";
      break;
    default:
      period = "month";
  }

  const params = { period };
  if (
    dateRange.value === "khoảng thời gian" &&
    customStart.value &&
    customEnd.value
  ) {
    params.startTime = new Date(customStart.value).toISOString();
    params.endTime = new Date(customEnd.value).toISOString();
  }
  const res = await axios.get("admin/statistics/chartpoints", { params });
  chartData.value = res.data;
  renderChart();
};

const fetchLatestOrders = async () => {
  const res = await axios.get("admin/statistics/latestorders");
  recentOrders.value = res.data.map((o) => ({
    id: o.orderID || o.OrderID,
    customer: o.customerName || o.CustomerName,
    products: o.itemCount || o.ItemCount,
    value: (o.totalAmount || o.TotalAmount).toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    }),
    status: o.status || o.Status,
    date: new Date(o.orderDate || o.OrderDate).toLocaleDateString("vi-VN"),
  }));
};

const fetchTopCustomers = async () => {
  const { startTime, endTime } = getDateRange();
  const params = {};
  if (startTime) params.startTime = startTime;
  if (endTime) params.endTime = endTime;
  const res = await axios.get("admin/statistics/top10customers", { params });
  console.log("Top customers API:", res.data);
  topCustomers.value = res.data.topCustomers.map((c) => ({
    name: c.customerName,
    orderCount: c.totalOrders,
    totalSpent: c.totalSpent.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    }),
  }));
};

const renderChart = () => {
  if (!chartRef.value || !chartData.value.length) return;

  // Đảm bảo DOM đã có kích thước
  const dom = chartRef.value;
  if (dom.clientWidth === 0 || dom.clientHeight === 0) {
    // Thử lại sau 100ms
    setTimeout(renderChart, 100);
    return;
  }

  if (chartInstance) {
    chartInstance.dispose();
  }
  chartInstance = echarts.init(dom);
  let chartType = activeChartType.value;

  chartInstance.setOption({
    title: { text: "Doanh thu" },
    tooltip: {},
    xAxis: {
      type: "category",
      data: chartData.value.map((item) => item.label || item.Label),
    },
    yAxis: { type: "value" },
    series: [
      {
        name: "Doanh thu",
        type: chartType,
        data: chartData.value.map((item) => item.revenue || item.Revenue),
        smooth: chartType === "line",
      },
    ],
  });

  chartInstance.resize();
};

onMounted(() => {
  fetchRevenue();
  fetchChartData();
  fetchTopBooksAndCategories();
  fetchLatestOrders();
  fetchTopCustomers();
  setTimeout(() => {
    if (chartInstance) chartInstance.resize();
  }, 100);
  window.addEventListener("resize", () => {
    if (chartInstance) chartInstance.resize();
  });
});

watch([dateRange, customStart, customEnd, activeChartType], () => {
  if (
    dateRange.value === "khoảng thời gian" &&
    (!customStart.value || !customEnd.value)
  )
    return;
  fetchChartData();
});

watch([dateRange, customStart, customEnd], () => {
  if (
    dateRange.value === "khoảng thời gian" &&
    (!customStart.value || !customEnd.value)
  )
    return;
  fetchTopBooksAndCategories();
  fetchTopCustomers();
});

watch(activeTab, (val) => {
  if (val === "overview") {
    nextTick(() => {
      renderChart();
      setTimeout(() => {
        if (chartInstance) chartInstance.resize();
      }, 100);
    });
  }
});
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
