<template>
  <div>
    <Header />
    <Breadcrumb :crumbs="crumbs" />
    <div class="relative pb-16">
      <div
        class="md:mt-10 mt-3 w-full md:w-[calc(100%-224px)] mx-auto flex md:gap-16 max-md:flex-col"
      >
        <Filter @filterChange="handleFilterChange" />

        <!-- Error state -->
        <div v-if="error" class="text-red-600 text-center w-full p-4">
          {{ error }}
        </div>

        <!-- Loading state -->
        <div
          v-else-if="isLoading"
          class="flex justify-center items-center w-full h-64"
        >
          <n-spin size="large" />
        </div>

        <!-- Products grid -->
        <div
          v-else-if="products.length > 0"
          class="grid md:grid-cols-3 grid-cols-2 md:gap-x-24 gap-x-5 gap-y-10 grow shrink max-md:w-full max-md:mx-auto px-5 mb-10"
        >
          <ProdCard
            v-for="data in products"
            :key="data.id"
            :productId="data.id"
            :imgSrc="data.image"
            :title="data.name"
            :price="data.price"
            :oldPrice="data.oldPrice"
            :discount="data.discount"
            :scale="respScaling"
            @click="() => goToDetail(data.id)"
          />
        </div>

        <!-- No results -->
        <div v-else class="text-center w-full p-4">
          Không tìm thấy sản phẩm nào.
        </div>
      </div>

      <!--Pagination-->
      <div class="flex justify-center mb-6 max-md:w-[80%] max-md:mx-auto">
        <n-config-provider :theme-overrides="themeOverride">
          <n-pagination
            v-if="totalPages > 0"
            :page="currentPage"
            :default-page="1"
            :page-count="totalPages"
            :page-slot="respPageSlot"
            @update:page="handlePageChange"
          />
        </n-config-provider>
      </div>
      <BackButton class="absolute bottom-8 right-10" />
    </div>
    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from "vue";
import axios from "../utils/axios";
import Header from "../components/Header/index.vue";
import Breadcrumb from "../components/Breadcrumb.vue";
import Filter from "../components/Filter/index.vue";
import ProdCard from "../components/ProdCard.vue";
import Footer from "../components/Footer.vue";
import { NConfigProvider } from "naive-ui";
import BackButton from "../components/BackButton.vue";
import { useRoute, useRouter } from "vue-router";

// State variables for pagination and product data
const currentPage = ref(1);
const pageSize = ref(12);
const totalItems = ref(0);
const totalPages = ref(0);
const products = ref([]);
const isLoading = ref(true);
const currentFilters = ref({});
const error = ref(null);
const route = useRoute();

// Fetch products with pagination
const fetchProducts = async (params = {}) => {
  try {
    isLoading.value = true;
    error.value = null; // Reset error state
    const queryParams = new URLSearchParams();

    // Add page parameter
    queryParams.append("page", params.page || 1);

    // Add filters only if they have values
    if (params.promo) {
      queryParams.append("promo", params.promo);
    }
    if (params.price) {
      queryParams.append("price", params.price);
    }
    if (params.priceMin) {
      queryParams.append("priceMin", params.priceMin);
    }
    if (params.priceMax) {
      queryParams.append("priceMax", params.priceMax);
    }
    if (params.age) {
      queryParams.append("age", params.age);
    }
    if (params.type) {
      queryParams.append("type", params.type);
    }

    if (params.selectedCategoryId) {
      queryParams.append("category", params.selectedCategoryId);
    }

    if (params.name) {
      queryParams.append("name", params.name);
    }

    console.log(
      "API URL:",
      `https://localhost:7129/api/Book/query?${queryParams.toString()}`
    );

    const response = await axios.get(`/Book/query?${queryParams.toString()}`);
    const data = response.data;

    products.value = data.items.map((book) => ({
      id: book.bookID,
      name: book.title,
      image: book.imgURL1,
      price: book.price,
      oldPrice: book.price,
      discount: book.discount === 0 ? null : book.discount,
      author: book.author,
    }));

    currentPage.value = data.currentPage;
    pageSize.value = data.pageSize;
    totalItems.value = data.totalItems;
    totalPages.value = data.totalPages;
  } catch (err) {
    console.error("Error fetching products:", err);
    error.value = "Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại sau.";
  } finally {
    isLoading.value = false;
  }
};

const crumbs = ref([
  { name: "Trang chủ", link: "/" },
  { name: "Sản phẩm", link: "/Products" },
]);

const handleFilterChange = ({ filters, categoryTree }) => {
  console.log("handleFilterChange received:", filters, categoryTree);
  currentFilters.value = filters;

  // Cập nhật breadcrumb dựa trên category được chọn
  if (categoryTree) {
    crumbs.value = [
      { name: "Trang chủ", link: "/" },
      { name: "Sản phẩm", link: "/Products" },
    ];

    // Thêm parent category
    if (categoryTree.parent) {
      const parentPath = `/Products/${encodeURIComponent(categoryTree.parent)}`;
      crumbs.value.push({
        name: categoryTree.parent,
        link: parentPath,
      });
    }
    if (categoryTree.sub) {
      crumbs.value.push({
        name: categoryTree.sub,
        link: `/Products/${encodeURIComponent(
          categoryTree.parent
        )}/${encodeURIComponent(categoryTree.sub)}`,
      });
    }
  }

  fetchProducts({ ...filters, page: 1 });
};

// Handle page change
const handlePageChange = (page) => {
  fetchProducts({ ...currentFilters.value, page });
};

// Fetch initial data on mount
onMounted(() => {
  window.addEventListener("resize", handleResize);

  // Ưu tiên lấy category từ query nếu có
  if (route.query.category) {
    handleFilterChange({
      filters: {
        ...currentFilters.value,
        selectedCategoryId: Number(route.query.category),
      },
      categoryTree: getCategoryTreeById(route.query.category),
    });
  } else {
    fetchProducts({ name: route.query.name || undefined });
  }
});

let windowWidth = ref(window.innerWidth);

const handleResize = () => {
  windowWidth.value = window.innerWidth;
};

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
});

let respScaling = computed(() => (windowWidth.value < 768 ? 0.9 : 1));
let respPageSlot = computed(() => (windowWidth.value < 768 ? 5 : 10));

const themeOverride = {
  Pagination: {
    itemTextColorHover: "#400b0b",
    itemTextColorPressed: "#400b0b",
    itemTextColorActive: "#400b0b",
    buttonBorder: "1px solid #400b0b",
    buttonBorderHover: "1px solid #400b0b",
    buttonBorderPressed: "1px solid #400b0b",
    itemBorderActive: "1px solid #400b0b",
  },
};

const router = useRouter();
function goToDetail(id) {
  router.push(`/Products/${id}`);
}

watch(
  () => route.query.name,
  (newName) => {
    fetchProducts({
      ...currentFilters.value,
      name: newName || undefined,
      page: 1,
    });
  }
);

watch(
  () => route.query.category,
  (categoryId) => {
    if (categoryId) {
      const tree = getCategoryTreeById(categoryId);
      handleFilterChange({
        filters: {
          ...currentFilters.value,
          selectedCategoryId: Number(categoryId),
        },
        categoryTree: tree,
      });
    }
  },
  { immediate: true }
);

function getCategoryTreeById(categoryId) {
  // Copy từ useFilter.js
  const categoryMappings = {
    "Sách Tiếng Việt": {
      "Tiểu thuyết": 3,
      "Sách giáo khoa – Tham khảo": 4,
      "Khoa học – Kỹ thuật": 5,
      "Lịch sử – Nghệ thuật - Tôn giáo": 6,
      "Kinh tế": 7,
      "Văn hóa – Địa lý – Du lịch": 8,
      "Chính trị": 9,
    },
    "Foreign Books": {
      "Fantasy & Sci-Fi": 10,
      Novel: 11,
      "Business & Management": 12,
      "Science & Technology": 13,
      "History & Politics": 14,
    },
  };
  for (const parent in categoryMappings) {
    for (const sub in categoryMappings[parent]) {
      if (categoryMappings[parent][sub] === Number(categoryId)) {
        return { parent, sub };
      }
    }
  }
  return { parent: null, sub: null };
}
</script>
