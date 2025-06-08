<template>
  <div>
    <Header />
    <!-- Hero Section -->
    <div class="w-full md:w-[calc(100%-224px)] mx-auto aspect-[13/5] mt-2">
      <img src="/heroSection.png" alt="" class="object-contain w-full h-full" />
    </div>

    <!-- Flash sale -->
    <div class="w-full mx-auto bg-[#fe645f] md:mt-14 mt-3 overflow-x-hidden">
      <!-- Flash sale bar -->
      <div class="flex items-center bg-white px-[5vw] shadow">
        <span
          class="text-red-500 font-bold italic flex items-center md:text-[40px] text-[15px] mr-3"
        >
          FLASH <span class="mx-1">⚡</span> SALE
        </span>
        <span class="ml-2 text-gray-700 md:text-lg text-[8px]"
          >Kết thúc trong</span
        >
        <div class="flex ml-2 space-x-1 my-2">
          <div class="bg-black text-white rounded px-2">
            {{ formatTime(hours) }}
          </div>
          <span class="text-black">:</span>
          <div class="bg-black text-white rounded px-2">
            {{ formatTime(minutes) }}
          </div>
          <span class="text-black">:</span>
          <div class="bg-black text-white rounded px-2">
            {{ formatTime(seconds) }}
          </div>
        </div>
      </div>
      <!-- Flash sale carousel -->
      <n-carousel
        :space-between="5"
        :loop="true"
        :slides-per-view="getSlidesPerView"
        draggable
        show-arrow
        class="mx-auto w-[95%] md:w-[90%] h-[260px] md:h-[375px] mt-6"
      >
        <n-carousel-item v-for="(data, index) in flashSale" :key="index">
          <ProdCard
            :imgSrc="data.imgURL"
            :discount="data.discountPercent"
            :oldPrice="data.price"
            :price="data.price * ((100 - data.discountPercent) / 100)"
            :title="data.title"
            :to="
              buildProductUrl(
                data.categoryPath?.map((c) =>
                  encodeURIComponent(c.categoryName)
                ),
                data.bookID
              )
            "
            :scale="prodCardScaling"
          />
        </n-carousel-item>

        <!-- Custom arrow -->
        <template #arrow="{ prev, next }">
          <div class="absolute bottom-6 right-4 flex">
            <button
              type="button"
              @click="prev"
              class="mr-3 flex h-7 w-7 items-center justify-center rounded-lg bg-[#d9d9d9] text-[#cd6d5f] hover:scale-105 active:scale-95"
            >
              <n-icon><ArrowBack /></n-icon>
            </button>
            <button
              type="button"
              @click="next"
              class="flex h-7 w-7 items-center justify-center rounded-lg bg-[#d9d9d9] text-[#cd6d5f] hover:scale-105 active:scale-95"
            >
              <n-icon><ArrowForward /></n-icon>
            </button>
          </div>
        </template>
      </n-carousel>
    </div>

    <!-- Best Seller -->
    <div
      class="font-itim font-normal sm:text-[40px] text-[20px] w-[90%] mx-auto text-[#b22222] md:mt-7 mt-3"
    >
      BEST SELLER
    </div>
    <n-carousel
      :space-between="20"
      :loop="true"
      slides-per-view="3"
      draggable
      show-arrow
      class="mx-auto w-[90%] h-[400px] md:h-[700px] md:mt-6 mt-2"
    >
      <n-carousel-item v-for="(data, index) in bestSellingBooks" :key="index">
        <AdCard
          :imgSrc="data.imgURL"
          :desc="data.description"
          :title="data.title"
          :to="
            buildProductUrl(
              data.categoryPath?.map((c) => encodeURIComponent(c.categoryName)),
              data.bookID
            )
          "
        />
      </n-carousel-item>

      <!-- Custom arrow -->
      <template #arrow="{ prev, next }">
        <div class="absolute bottom-6 right-4 flex">
          <button
            type="button"
            @click="prev"
            class="mr-3 flex h-7 w-7 items-center justify-center rounded-lg bg-[#d9d9d9] text-[#cd6d5f] hover:scale-105 active:scale-95"
          >
            <n-icon><ArrowBack /></n-icon>
          </button>
          <button
            type="button"
            @click="next"
            class="flex h-7 w-7 items-center justify-center rounded-lg bg-[#d9d9d9] text-[#cd6d5f] hover:scale-105 active:scale-95"
          >
            <n-icon><ArrowForward /></n-icon>
          </button>
        </div>
      </template>
    </n-carousel>

    <!-- Highlight section -->
    <div
      class="md:mt-14 mt-7 w-full md:w-[calc(100%-224px)] mx-auto flex flex-col-reverse max-md:items-center md:flex-row md:gap-16 gap-6 md:pb-40 pb-6 md:relative max-md:justify-center"
    >
      <!-- Text Section -->
      <div class="flex-1 max-md:mx-8">
        <div class="flex items-center max-md:justify-center gap-2">
          <h2
            class="text-[#B22222] font-inkut font-normal text-[28px] sm:text-[34px] md:text-[40px]"
          >
            MUST-TRY!
          </h2>
          <div class="w-auto md:h-[80px] h-[60px]">
            <img src="/NEW.png" alt="" class="object-contain w-full h-full" />
          </div>
        </div>

        <h3
          class="text-[#680e0e] font-inter font-medium text-[18px] max-md:mb-2 sm:text-[26px] md:text-[32px] uppercase max-md:text-center"
        >
          Đắc Nhân Tâm - Cuốn sách thay đổi cuộc đời bạn!
        </h3>
        <p
          class="text-[#828282] text-[12px] pt-1 sm:text-[16px] sm:pt-2 md:text-[24px] md:pt-4 leading-relaxed font-inter font-normal max-md:text-center"
        >
          "Đắc Nhân Tâm" là cuốn sách kỹ năng sống kinh điển, đã giúp hàng triệu
          người trên thế giới thấu hiểu nghệ thuật giao tiếp và chạm đến trái
          tim người khác. Với những bài học thực tiễn, lối viết chân thành và
          sâu sắc, cuốn sách không chỉ thay đổi cách bạn nhìn nhận bản thân mà
          còn cải thiện mối quan hệ với mọi người xung quanh. Một lựa chọn không
          thể bỏ qua nếu bạn muốn phát triển bản thân và sống một cuộc đời trọn
          vẹn hơn.
        </p>
      </div>

      <!-- Image Section -->
      <div class="flex-1 aspect-square md::w-[594px] w-60 relative md:static">
        <img
          src="/goatedBook.png"
          alt="Đắc Nhân Tâm"
          class="w-full h-full object-cover rounded-md"
        />

        <!-- Button -->
        <n-button
          color="#CD6D5F"
          class="absolute bottom-2 right-2 md:bottom-20 md:right-0 font-inter text-sm md:text-2xl md:py-8 md:px-6 px-3 py-4"
          :size="buttonSize"
          @click="navigateToGOAT"
          >Mua ngay</n-button
        >
      </div>
    </div>

    <!-- Feedback Section -->
    <div class="mb-6 w-[90%] mx-auto">
      <div
        class="font-itim font-normal md:text-[40px] text-[20px] w-[90%] mx-auto text-[#b22222] mt-7 text-center"
      >
        FEEDBACK
      </div>

      <div class="flex flex-wrap justify-around gap-7 items-start mt-5">
        <TestimonalCard
          v-for="(testimonal, index) in testimonials"
          :key="index"
          :avatar="testimonal.avatar"
          :name="testimonal.name"
          :role="testimonal.role"
          :testimonial="testimonal.testimonial"
          class="w-full sm:w-[45%] lg:w-[22%]"
        ></TestimonalCard>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import axios from "../utils/axios";
import { useCountdown } from "../composables/useCountdown";
import { ArrowBack, ArrowForward } from "@vicons/ionicons5";
import { buildProductUrl } from "../utils/urlHelper";
import { useRouter } from "vue-router";

// Components
import Header from "../components/Header/index.vue";
import Footer from "../components/Footer.vue";
import AdCard from "../components/AdCard.vue";
import TestimonalCard from "../components/TestimonalCard.vue";
import ProdCard from "../components/ProdCard.vue";

/** =========================
 * 📦 Static & Mock Data
 * ========================= */
const bestSellingBooks = ref([]);
const flashSale = ref([]);
const router = useRouter();

const testimonials = [
  {
    testimonial:
      "Mình tìm được cuốn sách tham khảo đúng lúc chuẩn bị thi cuối kỳ. Giao diện dễ dùng, đặt hàng cũng nhanh nữa!",
    name: "Nguyễn Thị Mai",
    role: "Sinh viên",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    testimonial:
      "Rất thích tính năng lọc sách theo thể loại và mức giá. Tìm được cuốn đúng gu cực nhanh luôn!",
    name: "Trần Quốc Huy",
    role: "Lập trình viên",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    testimonial:
      "Tôi dùng trang này để nhập thêm sách mới về cho cửa hàng. Nguồn sách phong phú, nhiều đầu sách hiếm.",
    name: "Phạm Thùy Dương",
    role: "Chủ cửa hàng sách cũ",
    avatar: "https://randomuser.me/api/portraits/women/65.jpg",
  },
  {
    testimonial:
      "Mình đặt sách ‘Đắc Nhân Tâm’ ở đây, giao hàng nhanh, sách đóng gói cẩn thận. Rất hài lòng!",
    name: "Daniel Nguyễn",
    role: "Designer",
    avatar: "https://randomuser.me/api/portraits/men/41.jpg",
  },
];

/** =========================
 * 📡 Fetch Data
 * ========================= */
const fetchHomeData = async () => {
  try {
    const [bestSellersRes, flashSaleRes] = await Promise.all([
      axios.get("/Home/BestSellers"),
      axios.get("/Home/FlashSale"),
    ]);

    bestSellingBooks.value = bestSellersRes.data;
    flashSale.value = flashSaleRes.data;
  } catch (err) {
    console.error("Failed to fetch home data:", err);
  }
};

/** =========================
 * 🕒 Countdown Timer
 * ========================= */
const timeLeftInSeconds = ref(0);
const { hours, minutes, seconds, formatTime, start } =
  useCountdown(timeLeftInSeconds);

watch(flashSale, (list) => {
  if (list.length) {
    const maxEndTime = Math.max(
      ...list.map((item) => new Date(item.endTime).getTime())
    );
    const now = Date.now();
    timeLeftInSeconds.value = Math.max(
      Math.floor((maxEndTime - now) / 1000),
      0
    );
    start();
  }
});

/** =========================
 * 📱 Responsive Logic
 * ========================= */
const windowWidth = ref(window.innerWidth);

const handleResize = () => {
  windowWidth.value = window.innerWidth;
};

const buttonSize = computed(() =>
  windowWidth.value < 768 ? "small" : "large"
);
const prodCardScaling = computed(() => (windowWidth.value < 768 ? 0.7 : 1));
const getSlidesPerView = computed(() => (windowWidth.value < 768 ? 3 : 5));

/** =========================
 * 🚀 Lifecycle
 * ========================= */
onMounted(() => {
  console.log("Component mounted ✅");
  fetchHomeData();
  window.addEventListener("resize", handleResize);
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
});

const navigateToGOAT = () => {
  router.push("/Products/357");
};
</script>
