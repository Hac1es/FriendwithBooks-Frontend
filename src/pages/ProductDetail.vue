<template>
  <div>
    <Header />
    <Breadcrumb :crumbs="crumbs" />
    <div v-if="!isLoading">
      <div
        class="w-[90%] md:w-[calc(100%-200px)] font-instrument mx-auto mt-8 max-md:mt-4 relative pb-16 max-md:flex justify-center flex-wrap"
      >
        <!-- Product Section -->
        <div
          class="flex flex-col md:flex-row md:gap-28 gap-4 mb-8 md:items-stretch items-center"
        >
          <!-- Left Column -->
          <div
            class="flex max-md:flex-row-reverse md:gap-12 gap-6 items-stretch justify-center w-full md:w-auto"
          >
            <!-- Thumbnails Sub-column -->
            <div class="flex flex-col md:gap-16 gap-4">
              <div
                class="md:w-36 w-16 p-1 bg-white border border-gray-300 rounded cursor-pointer h-full"
              >
                <img
                  :src="productData.imgURL2"
                  alt="Thumbnail"
                  class="w-full h-full object-cover rounded"
                />
              </div>
              <div
                class="md:w-36 w-16 p-1 bg-white border border-gray-300 rounded cursor-pointer h-full"
              >
                <img
                  :src="productData.imgURL3"
                  alt="Thumbnail"
                  class="w-full h-full object-cover rounded"
                />
              </div>
            </div>

            <!-- Main Product Image -->
            <div
              class="w-full md:w-[350px] aspect-[2/3] max-md:max-w-[150px] h-full bg-white border border-gray-300 p-2 rounded overflow-hidden"
            >
              <img
                :src="productData.imgURL1"
                alt="Main product image"
                class="w-full h-full object-cover"
              />
            </div>
          </div>

          <!-- Right Column -->
          <div class="h-full w-full flex-1">
            <div class="flex max-md:scale-[0.7] max-md:gap-4">
              <div class="flex flex-col gap-4 w-full md:w-auto flex-1">
                <h1 class="text-[#661c1c] font-semibold text-lg">
                  {{ productData.title }}
                </h1>
                <div class="text-[#9b0505] font-semibold text-lg">
                  {{ productData.price }} đ
                </div>
                <button
                  class="bg-[#cd6d5f] text-white py-2 px-4 rounded hover:bg-red-800 transition-colors w-48"
                >
                  Thêm vào giỏ hàng
                </button>
              </div>

              <div class="flex flex-col items-center text-center flex-1">
                <h3 class="text-[#661c1c] font-medium mb-1">Đánh giá</h3>

                <div class="text-5xl font-bold mb-2">
                  {{ productData.avgRating.toFixed(1) }}
                </div>

                <div class="flex mb-1">
                  <StarIcon
                    v-for="index in 5"
                    :key="index"
                    :class="[
                      'w-6 h-6 fill-current',
                      index <= Math.round(productData.avgRating)
                        ? 'text-orange-400'
                        : 'text-gray-200',
                    ]"
                  />
                </div>

                <p class="text-[#9b0505] text-sm">
                  {{ productData.totalRating }} lượt đánh giá
                </p>
              </div>
            </div>

            <div>
              <h2 class="text-lg font-bold mb-4 text-gray-800 mt-5">
                Thông tin chi tiết
              </h2>

              <div class="md:text-sm text-xs">
                <div class="grid grid-cols-3 gap-4 md:py-3 py-1">
                  <div class="col-span-1 text-gray-600">Mã hàng</div>
                  <div class="col-span-2 text-gray-800">
                    {{ productData.bookID }}
                  </div>
                </div>

                <div class="grid grid-cols-3 gap-4 md:py-3 py-1">
                  <div class="col-span-1 text-gray-600">Tác giả</div>
                  <div class="col-span-2 text-gray-800">
                    {{ productData.author }}
                  </div>
                </div>

                <div class="grid grid-cols-3 gap-4 md:py-3 py-1">
                  <div class="col-span-1 text-gray-600">
                    Nhà cung cấp/Nhà xuất bản
                  </div>
                  <div class="col-span-2 text-gray-800">
                    {{ productData.supplier }}
                  </div>
                </div>

                <div class="grid grid-cols-3 gap-4 md:py-3 py-1">
                  <div class="col-span-1 text-gray-600">Năm XB</div>
                  <div class="col-span-2 text-gray-800">
                    {{ new Date(productData.publishYear).getFullYear() }}
                  </div>
                </div>

                <div class="grid grid-cols-3 gap-4 md:py-3 py-1">
                  <div class="col-span-1 text-gray-600">Ngôn Ngữ</div>
                  <div class="col-span-2 text-gray-800">
                    {{ productData.language }}
                  </div>
                </div>

                <div class="grid grid-cols-3 gap-4 md:py-3 py-1">
                  <div class="col-span-1 text-gray-600">Số trang</div>
                  <div class="col-span-2 text-gray-800">
                    {{ productData.pageNum }}
                  </div>
                </div>

                <div class="grid grid-cols-3 gap-4 md:py-3 py-1">
                  <div class="col-span-1 text-gray-600">Độ tuổi</div>
                  <div class="col-span-2 text-gray-800">
                    {{ ageMapping[productData.ageGroup] }}
                  </div>
                </div>

                <div class="grid grid-cols-3 gap-4 md:pt-3 pt-1">
                  <div class="col-span-1 text-gray-600">Hình thức</div>
                  <div class="col-span-2 text-gray-800">
                    {{ productData.binding }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Description Section -->
        <div class="mt-3 md:mt-6">
          <h1
            class="text-[18px] md:text-[27px] text-[#661c1c] font-semibold font-instrument"
          >
            Mô tả
          </h1>
          <div class="font-instrument">{{ productData.description }}</div>
        </div>

        <!-- Review Section -->
        <div class="mt-3 md:mt-6">
          <div
            class="w-full flex flex-col gap-4 md:mb-6 mb-3"
            v-if="isLoggedIn"
          >
            <!-- Add review -->
            <div class="flex items-center gap-4">
              <span
                class="text-[18px] md:text-[27px] text-[#661c1c] font-semibold font-instrument"
                >Thêm bình luận</span
              >
              <div class="flex gap-2 ml-4">
                <button
                  v-for="rating in 5"
                  :key="rating"
                  class="border rounded-full px-3 py-1 flex items-center gap-1 transition-colors"
                  :class="{
                    'border-red-500 text-red-500': selectedRating === rating,
                    'border-gray-300': selectedRating !== rating,
                  }"
                  @click="handleRatingClick(rating)"
                >
                  {{ rating }} <span>★</span>
                </button>
              </div>
            </div>
            <div class="flex flex-col items-end gap-2 w-full">
              <textarea
                rows="4"
                class="w-full border border-gray-300 px-4 py-2 outline-none text-white"
                placeholder="Nhập nội dung bình luận..."
                maxlength="3000"
                v-model="reviewContent"
              />
              <button
                class="bg-black text-white px-6 py-2 font-semibold"
                @click="sendReview"
              >
                Gửi bình luận
              </button>
            </div>
          </div>

          <!-- Reviews header with count and filters -->
          <div class="mb-6">
            <div class="flex items-baseline justify-between mb-4">
              <h2 class="md:text-2xl text-lg text-[#661c1c] font-bold">
                Đánh giá
                <span class="text-[#400b0b] ml-1">{{
                  reviewsData.length
                }}</span>
              </h2>
            </div>

            <div class="flex gap-4 max-md:text-sm">
              <!-- Rating filter -->
              <div class="relative">
                <button
                  class="flex items-center text-gray-800 hover:text-gray-600"
                  :class="{
                    'text-[#661c1c] font-semibold': filterType !== 'all',
                  }"
                  @click="showRatingDropdown = !showRatingDropdown"
                >
                  {{
                    ratingOptions.find((opt) => opt.value === filterType)
                      ?.label || "Tất cả"
                  }}
                  <ChevronDownIcon class="w-4 h-4 ml-1" />
                </button>
                <!-- Rating dropdown -->
                <div
                  v-if="showRatingDropdown"
                  class="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 md:w-32"
                >
                  <button
                    v-for="option in ratingOptions"
                    :key="option.value"
                    class="block w-full px-4 py-2 text-left hover:bg-gray-50"
                    :class="{
                      'text-[#661c1c] font-semibold':
                        filterType === option.value,
                    }"
                    @click="
                      handleFilterChange(option.value);
                      showRatingDropdown = false;
                    "
                  >
                    {{ option.label }}
                  </button>
                </div>
              </div>

              <!-- Sort by rating -->
              <div class="relative">
                <button
                  class="flex items-center text-gray-800 hover:text-gray-600"
                  :class="{
                    'text-[#661c1c] font-semibold':
                      sortType === 'highest' || sortType === 'lowest',
                  }"
                  @click="showSortDropdown = !showSortDropdown"
                >
                  {{
                    sortOptions.find((opt) => opt.value === sortType)?.label ||
                    "Từ cao tới thấp"
                  }}
                  <ChevronDownIcon class="w-4 h-4 ml-1" />
                </button>
                <!-- Sort dropdown -->
                <div
                  v-if="showSortDropdown"
                  class="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10"
                >
                  <button
                    v-for="option in sortOptions"
                    :key="option.value"
                    class="block w-full px-4 py-2 text-left hover:bg-gray-50"
                    :class="{
                      'text-[#661c1c] font-semibold': sortType === option.value,
                    }"
                    @click="
                      handleSortChange(option.value);
                      showSortDropdown = false;
                    "
                  >
                    {{ option.label }}
                  </button>
                </div>
              </div>

              <!-- Sort by date -->
              <div class="relative">
                <button
                  class="flex items-center text-gray-800 hover:text-gray-600"
                  :class="{
                    'text-[#661c1c] font-semibold':
                      sortType === 'newest' || sortType === 'oldest',
                  }"
                  @click="showDateDropdown = !showDateDropdown"
                >
                  {{
                    dateOptions.find((opt) => opt.value === sortType)?.label ||
                    "Mới nhất"
                  }}
                  <ChevronDownIcon class="w-4 h-4 ml-1" />
                </button>
                <!-- Date dropdown -->
                <div
                  v-if="showDateDropdown"
                  class="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10"
                >
                  <button
                    v-for="option in dateOptions"
                    :key="option.value"
                    class="block w-full px-4 py-2 text-left hover:bg-gray-50"
                    :class="{
                      'text-[#661c1c] font-semibold': sortType === option.value,
                    }"
                    @click="
                      handleSortChange(option.value);
                      showDateDropdown = false;
                    "
                  >
                    {{ option.label }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Grid of reviews -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Review
              v-for="(review, index) in displayedReviews"
              :key="review.reviewID"
              :name="review.fullName"
              :date="formatDate(review.reviewDate)"
              :rating="review.rating"
              :content="review.comment"
              class="bg-white"
            />
          </div>

          <!-- Load more button -->
          <div class="mt-6 text-center" v-if="hasMore">
            <button
              class="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              @click="loadMoreReviews"
              :disabled="isLoadingMore"
            >
              {{ isLoadingMore ? "Đang tải..." : "Tải thêm đánh giá" }}
            </button>
          </div>
        </div>

        <!-- Related Products Section -->
        <div class="mt-6 mb-6">
          <h2
            class="text-[#661c1c] font-instrument text-[27px] mb-4 font-semibold"
          >
            Sản phẩm liên quan
          </h2>
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            <ProdCard
              v-for="data in relatedProducts"
              :key="data.bookID"
              @click="() => goToDetail(data.bookID)"
              :product-id="data.bookID"
              :img-src="data.imgURL1"
              :title="data.title"
              :price="
                data.discount === 0
                  ? data.price
                  : ((data.price * (100 - data.discount)) / 100).toFixed(0)
              "
            />
          </div>
        </div>

        <BackButton label="QUAY LẠI" class="absolute bottom-8 right-10" />
      </div>
    </div>
    <Footer />
  </div>
</template>

<script setup>
import Footer from "../components/Footer.vue";
import Breadcrumb from "../components/Breadcrumb.vue";
import Header from "../components/Header/index.vue";
import { buildProductUrl, convertToSlug } from "../utils/urlHelper";
import { useRoute, useRouter } from "vue-router";
import { StarIcon } from "lucide-vue-next";
import { ChevronDownIcon } from "lucide-vue-next";
import ProdCard from "../components/ProdCard.vue";
import BackButton from "../components/BackButton.vue";
import Review from "../components/Review.vue";
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import axios from "../utils/axios";
import { useStore } from "vuex";

const productData = ref({
  title: "",
  price: 0,
  imgURL: "",
  avgRating: 0,
  totalRating: 0,
  bookID: "",
  supplier: "",
  author: "",
  publishYear: "",
  language: "",
  pageNum: 0,
  binding: "",
  description: "",
});

const ageMapping = {
  12: "Trên 12 tuổi",
  18: "Trên 18 tuổi",
  all: "Mọi lứa tuổi",
};

const relatedProducts = ref([]);
const reviewsData = ref([]);
const selectedRating = ref(0);
const reviewContent = ref("");

const crumbs = ref([{ name: "Sản phẩm", link: "/products" }]);

const isLoading = ref(true);
const route = useRoute();
const router = useRouter();
const productId = route.params.id;
const filterType = ref("all"); // all, positive, negative
const sortType = ref("newest"); // newest, highest, lowest
const page = ref(1);
const perPage = ref(8);
const isLoadingMore = ref(false);
const hasMore = ref(true);

const showRatingDropdown = ref(false);
const showSortDropdown = ref(false);
const showDateDropdown = ref(false);

const ratingOptions = [
  { label: "Tất cả", value: "all" },
  { label: "5 sao", value: "5" },
  { label: "4 sao", value: "4" },
  { label: "3 sao", value: "3" },
  { label: "2 sao", value: "2" },
  { label: "1 sao", value: "1" },
];

const sortOptions = [
  { label: "Từ cao tới thấp", value: "highest" },
  { label: "Từ thấp tới cao", value: "lowest" },
];

const dateOptions = [
  { label: "Mới nhất", value: "newest" },
  { label: "Cũ nhất", value: "oldest" },
];

const store = useStore();
const isLoggedIn = computed(() => store.state.isAuthenticated);

const handleRatingClick = (rating) => {
  selectedRating.value = rating;
};

const fetchReviews = async () => {
  try {
    const [response, reviewsResp] = await Promise.all([
      axios.get("/Book/" + productId),
      axios.get(`/Book/${productId}/reviews`, {
        params: {
          page: 1,
          perPage: perPage.value,
          filter: filterType.value,
          sort: sortType.value,
        },
      }),
    ]);
    productData.value = response.data.book;
    relatedProducts.value = response.data.relatedBooks;
    reviewsData.value = reviewsResp.data;

    // Set hasMore based on initial response
    hasMore.value = reviewsResp.data.length === perPage.value;

    // Update URL to include category path
    const categoryPath = response.data.categoryPath || [];
    const sluggedPath = categoryPath
      .map((c) => convertToSlug(c.categoryName))
      .join("/");

    // Only update URL if coming from direct access
    if (!route.path.includes(sluggedPath)) {
      router.replace(`/products/${sluggedPath}/${productId}`);
    }

    // Update breadcrumbs
    crumbs.value = [
      { name: "Sản phẩm", link: "/products" },
      ...categoryPath.map((category, index) => ({
        name: category.categoryName,
        link: `/products/${categoryPath
          .slice(0, index + 1)
          .map((c) => convertToSlug(c.categoryName))
          .join("/")}`,
      })),
      { name: productData.value.title },
    ];

    isLoading.value = false;
  } catch (error) {
    console.error("Error fetching product data:", error);
  }
};

const sendReview = async () => {
  if (!selectedRating.value || !reviewContent.value) {
    alert("Vui lòng chọn số sao và nhập nội dung bình luận!");
    return;
  }

  const reviewData = {
    userID: store.state.userInfo.id,
    bookID: productId,
    rating: selectedRating.value,
    comment: reviewContent.value,
  };

  console.log(reviewData);

  try {
    const response = await axios.put("/Book/addReview", reviewData);
    console.log("Review added successfully:", response.data);
    // Cập nhật lại danh sách review nếu cần
    reviewContent.value = ""; // Reset nội dung bình luận
    selectedRating.value = 0; // Reset số sao
    fetchReviews();
  } catch (error) {
    console.error("Error adding review:", error);
  }
};

onMounted(() => {
  // Add click outside listener
  document.addEventListener("click", closeDropdowns);
  fetchReviews();
});

onUnmounted(() => {
  document.removeEventListener("click", closeDropdowns);
});

const closeDropdowns = (event) => {
  if (!event.target.closest(".relative")) {
    showRatingDropdown.value = false;
    showSortDropdown.value = false;
    showDateDropdown.value = false;
  }
};

const formatDate = (date) => {
  return new Date(date).toLocaleString("vi-VN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const displayedReviews = computed(() => {
  let filtered = [...reviewsData.value];

  // Apply rating filter
  if (filterType.value !== "all") {
    const rating = parseInt(filterType.value);
    filtered = filtered.filter((review) => review.rating === rating);
  }

  // Apply sorting
  if (sortType.value === "highest") {
    filtered.sort((a, b) => b.rating - a.rating);
  } else if (sortType.value === "lowest") {
    filtered.sort((a, b) => a.rating - b.rating);
  } else if (sortType.value === "newest") {
    filtered.sort((a, b) => new Date(b.reviewDate) - new Date(a.reviewDate));
  } else if (sortType.value === "oldest") {
    filtered.sort((a, b) => new Date(a.reviewDate) - new Date(b.reviewDate));
  }

  return filtered;
});

const loadMoreReviews = async () => {
  if (isLoadingMore.value || !hasMore.value) return;

  isLoadingMore.value = true;
  try {
    const nextPage = page.value + 1;
    const response = await axios.get(`/Book/${productId}/reviews`, {
      params: {
        page: nextPage,
        perPage: perPage.value,
        filter: filterType.value,
        sort: sortType.value,
      },
    });

    if (response.data.length === 0 || response.data.length < perPage.value) {
      hasMore.value = false;
    }

    // Only add new reviews that aren't already in the list
    const newReviews = response.data.filter(
      (newReview) =>
        !reviewsData.value.some(
          (existing) => existing.reviewID === newReview.reviewID
        )
    );

    reviewsData.value = [...reviewsData.value, ...newReviews];
    page.value = nextPage;
  } catch (error) {
    console.error("Error loading more reviews:", error);
  } finally {
    isLoadingMore.value = false;
  }
};

// Add handler functions for filters and sorting
const handleFilterChange = (type) => {
  filterType.value = type;
  reviewsData.value = []; // Reset reviews
  page.value = 1; // Reset pagination
  hasMore.value = true; // Reset hasMore flag
  loadMoreReviews(); // Reload with new filter
};

const handleSortChange = (type) => {
  sortType.value = type;
  reviewsData.value = []; // Reset reviews
  page.value = 1; // Reset pagination
  hasMore.value = true; // Reset hasMore flag
  loadMoreReviews(); // Reload with new sort
};

function goToDetail(id) {
  router.push(`/Products/${id}`);
}
</script>
