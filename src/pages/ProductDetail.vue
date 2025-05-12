<template>
  <div>
    <Header />
    <Breadcrumb :crumbs="crumbs" />
    <div>
      <div
        class="w-[90%] md:w-[calc(100%-200px)] font-instrument mx-auto mt-8 max-md:mt-4 relative pb-16 max-md:flex justify-center flex-wrap"
      >
        <!-- Product Section -->
        <div
          class="flex flex-col md:flex-row md:gap-20 gap-4 mb-8 md:items-stretch items-center"
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
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-hMFf1i8eduaYIVAVSXJAHVFSqjx4ZO.png"
                  alt="Thumbnail"
                  class="w-full h-full object-contain rounded"
                />
              </div>
              <div
                class="md:w-36 w-16 p-1 bg-white border border-gray-300 rounded cursor-pointer h-full"
              >
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-hMFf1i8eduaYIVAVSXJAHVFSqjx4ZO.png"
                  alt="Thumbnail"
                  class="w-full h-full object-contain rounded"
                />
              </div>
            </div>

            <!-- Main Product Image -->
            <div
              class="w-full md:max-w-[350px] max-w-[150px] h-full bg-white border border-gray-300 p-2 rounded overflow-hidden"
            >
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-hMFf1i8eduaYIVAVSXJAHVFSqjx4ZO.png"
                alt="Main product image"
                class="w-full h-full object-contain"
              />
            </div>
          </div>

          <!-- Right Column -->
          <div class="h-full w-full flex-1">
            <div class="flex max-md:scale-[0.7] max-md:gap-4">
              <div class="flex flex-col gap-4 w-full md:w-auto flex-1">
                <h1 class="text-[#661c1c] font-semibold text-lg">
                  ĐẮC NHÂN TÂM
                </h1>
                <div class="text-[#9b0505] font-semibold text-lg">
                  100,000 VND
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
                  {{ GOATrating.rating.toFixed(1) }}
                </div>

                <div class="flex mb-1">
                  <StarIcon
                    v-for="index in 5"
                    :key="index"
                    :class="[
                      'w-6 h-6 fill-current',
                      index <= Math.round(GOATrating.rating)
                        ? 'text-orange-400'
                        : 'text-gray-200',
                    ]"
                  />
                </div>

                <p class="text-[#9b0505] text-sm">
                  {{ GOATrating.reviewCount }} lượt đánh giá
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
                    {{ GOATinfo.ma_hang }}
                  </div>
                </div>

                <div class="grid grid-cols-3 gap-4 md:py-3 py-1">
                  <div class="col-span-1 text-gray-600">Tên Nhà Cung Cấp</div>
                  <div class="col-span-2 text-gray-800">
                    {{ GOATinfo.nha_cung_cap }}
                  </div>
                </div>

                <div class="grid grid-cols-3 gap-4 md:py-3 py-1">
                  <div class="col-span-1 text-gray-600">Tác giả</div>
                  <div class="col-span-2 text-gray-800">
                    {{ GOATinfo.tac_gia }}
                  </div>
                </div>

                <div class="grid grid-cols-3 gap-4 md:py-3 py-1">
                  <div class="col-span-1 text-gray-600">NXB</div>
                  <div class="col-span-2 text-gray-800">{{ GOATinfo.nxb }}</div>
                </div>

                <div class="grid grid-cols-3 gap-4 md:py-3 py-1">
                  <div class="col-span-1 text-gray-600">Năm XB</div>
                  <div class="col-span-2 text-gray-800">
                    {{ GOATinfo.nam_xb }}
                  </div>
                </div>

                <div class="grid grid-cols-3 gap-4 md:py-3 py-1">
                  <div class="col-span-1 text-gray-600">Ngôn Ngữ</div>
                  <div class="col-span-2 text-gray-800">
                    {{ GOATinfo.ngon_ngu }}
                  </div>
                </div>

                <div class="grid grid-cols-3 gap-4 md:py-3 py-1">
                  <div class="col-span-1 text-gray-600">Số trang</div>
                  <div class="col-span-2 text-gray-800">
                    {{ GOATinfo.so_trang }}
                  </div>
                </div>

                <div class="grid grid-cols-3 gap-4 md:py-3 py-1">
                  <div class="col-span-1 text-gray-600">Độ tuổi</div>
                  <div class="col-span-2 text-gray-800">
                    {{ GOATinfo.do_tuoi }}
                  </div>
                </div>

                <div class="grid grid-cols-3 gap-4 md:pt-3 pt-1">
                  <div class="col-span-1 text-gray-600">Hình thức</div>
                  <div class="col-span-2 text-gray-800">
                    {{ GOATinfo.hinh_thuc }}
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
          <div class="font-instrument">{{ GOAT }}</div>
        </div>

        <!-- Review Section -->
        <div class="mt-3 md:mt-6">
          <!-- Reviews header with count and filters -->
          <div class="mb-6">
            <div class="flex items-baseline justify-between mb-4">
              <h2 class="md:text-2xl text-lg text-[#661c1c] font-bold">
                Đánh giá
                <span class="text-[#400b0b] ml-1">{{ reviews.length }}</span>
              </h2>
            </div>

            <div class="flex gap-4 max-md:text-sm">
              <div class="relative">
                <button
                  class="flex items-center text-gray-800 hover:text-gray-600"
                >
                  Tất cả
                  <ChevronDownIcon class="w-4 h-4 ml-1" />
                </button>
              </div>

              <div class="relative">
                <button
                  class="flex items-center text-gray-800 hover:text-gray-600"
                >
                  Từ cao tới thấp
                  <ChevronDownIcon class="w-4 h-4 ml-1" />
                </button>
              </div>

              <div class="relative">
                <button
                  class="flex items-center text-gray-800 hover:text-gray-600"
                >
                  Mới nhất
                  <ChevronDownIcon class="w-4 h-4 ml-1" />
                </button>
              </div>
            </div>
          </div>

          <!-- Grid of reviews -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Review
              v-for="(review, index) in reviews"
              :key="index"
              :name="review.name"
              :location="review.location"
              :date="review.date"
              :rating="review.rating"
              :title="review.title"
              :content="review.content"
              class="bg-white"
            />
          </div>

          <!-- Load more button -->
          <div class="mt-6 text-center">
            <button
              class="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              @click="loadMoreReviews"
            >
              Tải thêm đánh giá
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
              :key="data.productId"
              :product-id="data.productId"
              :img-src="data.imgSrc"
              :title="data.title"
              :price="data.price"
              :old-price="data.oldPrice"
              :discount="data.discount"
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
import { useRoute } from "vue-router";
import { StarIcon } from "lucide-vue-next";
import { ChevronDownIcon } from "lucide-vue-next";
import ProdCard from "../components/ProdCard.vue";
import BackButton from "../components/BackButton.vue";
import Review from "../components/Review.vue";
import { ref } from "vue";

const crumbs = [
  { name: "Trang chủ", link: "/" },
  { name: "Sản phẩm", link: "/Products" },
  { name: "Lịch sử - Nghệ thuật - Kinh tế", link: "/" },
  { name: "Đắc Nhân Tâm" },
];
const GOATrating = {
  rating: 5,
  reviewCount: 120,
};

const GOAT =
  "Đắc Nhân Tâm không đơn thuần là một quyển sách – nó là tấm gương soi lại chính mình. Mỗi trang sách như một lời thì thầm dịu dàng nhưng sắc bén, nhắc nhở mình rằng sự chân thành, lắng nghe và thấu hiểu chưa bao giờ là lỗi thời. Có lúc đọc đến đoạn nào đó, tim mình khựng lại – không phải vì quá cao siêu, mà vì nó chạm đến những điều giản dị mà mình đã lãng quên trong cách cư xử hàng ngày. Quyển sách này không thay đổi bạn ngay lập tức, nhưng nó gieo một hạt giống – để từ đó bạn tự thay đổi chính mình.";

const GOATinfo = {
  ma_hang: "9786044059761",
  nha_cung_cap: "Công Ty Cổ Phần Time Books",
  tac_gia: "Dale Carnegie",
  nxb: "Dân Trí",
  nam_xb: 2024,
  ngon_ngu: "Tiếng Việt",
  so_trang: 208,
  do_tuoi: "Mọi lứa tuổi",
  hinh_thuc: "Bìa mềm",
};

const relatedProducts = [
  {
    productId: 1,
    imgSrc: "https://picsum.photos/seed/nile/300/400",
    title: "Án Mạng Trên Sông Nile",
    price: "89,000",
    scale: 1,
  },
  {
    productId: 2,
    imgSrc: "https://picsum.photos/seed/abc/300/400",
    title: "Chuỗi Tội Ác A.B.C",
    price: "100,000",
    scale: 1,
  },
  {
    productId: 3,
    imgSrc: "https://picsum.photos/seed/suncrime/300/400",
    title: "Tội Ác Dưới Ánh Mặt Trời",
    price: "120,000",
    scale: 1,
  },
  {
    productId: 4,
    imgSrc: "https://picsum.photos/seed/murder/300/400",
    title: "Vụ Án Bí Ẩn Ở Styles",
    price: "95,000",
    scale: 1,
  },
  {
    productId: 5,
    imgSrc: "https://picsum.photos/seed/death/300/400",
    title: "Cái Chết Trong Bóng Tối",
    price: "105,000",
    scale: 1,
  },
];

// Sample review data
const reviewsData = [
  {
    name: "Julia",
    location: "Berlin",
    date: "Jan 11",
    rating: 4,
    title: "Moved here from another insurance company",
    content:
      "Great car insurance company! Efficient and reliable service. Quick claims processing and excellent customer support. Affordable premiums and a wide range of coverage options",
  },
  {
    name: "Thomas",
    location: "Munich",
    date: "Feb 23",
    rating: 5,
    title: "Best service ever",
    content:
      "I had an amazing experience with this company. The customer service was outstanding and they helped me find the perfect insurance plan.",
  },
  {
    name: "Sophie",
    location: "Hamburg",
    date: "Dec 5",
    rating: 4,
    title: "Very satisfied with the coverage",
    content:
      "The coverage options are comprehensive and the premiums are reasonable. Customer service is responsive and helpful.",
  },
  {
    name: "Michael",
    location: "Frankfurt",
    date: "Mar 17",
    rating: 3,
    title: "Good but could be better",
    content:
      "The claims process was a bit slow, but overall the coverage is good and the prices are competitive.",
  },
  {
    name: "Anna",
    location: "Cologne",
    date: "Apr 2",
    rating: 5,
    title: "Saved me so much money",
    content:
      "Switching to this insurance saved me over €300 per year! The process was simple and the customer service team was very helpful.",
  },
  {
    name: "David",
    location: "Stuttgart",
    date: "Jan 30",
    rating: 4,
    title: "Quick and easy claims",
    content:
      "Had to file a claim after a minor accident and the process was surprisingly quick and hassle-free. Very satisfied with how it was handled.",
  },
];

// Reactive reviews array that can be updated
const reviews = ref(reviewsData);

// Function to simulate loading more reviews
const loadMoreReviews = () => {
  // In a real app, this would fetch more reviews from an API
  // For this demo, we'll just duplicate some existing reviews with modified names
  const newReviews = reviewsData.slice(0, 3).map((review, index) => ({
    ...review,
    name: review.name + " L.",
    date: "May " + (index + 5),
  }));

  reviews.value = [...reviews.value, ...newReviews];
};

const route = useRoute();
const productId = route.params.id;
</script>
