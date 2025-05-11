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
        <n-carousel-item v-for="(data, index) in fakeBooks" :key="index">
          <ProdCard
            :imgSrc="data.imgSrc"
            :discount="data.discount"
            :oldPrice="data.oldPrice"
            :price="data.price"
            :title="data.title"
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
      class="mx-auto w-[90%] h-[300px] md:h-[700px] mt-6"
    >
      <n-carousel-item v-for="(data, index) in fakeData" :key="index">
        <AdCard :imgSrc="data.imgSrc" :desc="data.desc" :title="data.title" />
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
          class="text-[#828282] text-[12px] sm:text-[16px] md:text-[24px] leading-relaxed font-inter font-normal max-md:text-center"
        >
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry's standard dummy text ever
          since the 1500s, when an unknown printer took a galley of type and
          scrambled it to make a type specimen book. It has survived not only
          five centuries, but also the leap into electronic typesetting,
          remaining essentially unchanged.
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
import { ref, computed, onMounted, onUnmounted } from "vue";
import { ArrowBack, ArrowForward } from "@vicons/ionicons5";
import Header from "../components/Header/index.vue";
import Footer from "../components/Footer.vue";
import AdCard from "../components/AdCard.vue";
import TestimonalCard from "../components/TestimonalCard.vue";
import ProdCard from "../components/ProdCard.vue";

/** =========================
 *  📦 Static & Mock Data
 *  ========================= */
const fakeData = Array.from({ length: 10 }, (_, i) => ({
  imgSrc: `https://picsum.photos/seed/book${i}/300/400`,
  title: `Sách ${i + 1}`,
  desc: `Mô tả ngắn gọn cho cuốn sách ${i + 1}.`,
}));

const testimonials = [
  {
    testimonial:
      "This platform made building my first website incredibly easy! The drag-and-drop interface is super intuitive...",
    name: "Sarah Thompson",
    role: "Blogger",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    testimonial:
      "I've tried several website builders, but this one stands out...",
    name: "Michael Lee",
    role: "Freelancer",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    testimonial: "As a small business owner, I need tools that just work...",
    name: "Emily Davis",
    role: "Small Business Owner",
    avatar: "https://randomuser.me/api/portraits/women/65.jpg",
  },
  {
    testimonial:
      "Amazing experience! I set up my portfolio in under an hour...",
    name: "Daniel Kim",
    role: "Designer",
    avatar: "https://randomuser.me/api/portraits/men/41.jpg",
  },
];

const fakeBooks = [
  {
    imgSrc: "https://picsum.photos/200/300?random=11",
    title: "Tiệm sách của nàng",
    price: "100.000",
    oldPrice: "125.000",
    discount: "20",
  },
  {
    imgSrc: "https://picsum.photos/200/300?random=12",
    title: "Nhà giả kim",
    price: "85.000",
    oldPrice: "100.000",
    discount: "15",
  },
  {
    imgSrc: "https://picsum.photos/200/300?random=13",
    title: "Dám bị ghét",
    price: "120.000",
    oldPrice: "150.000",
    discount: "20",
  },
  {
    imgSrc: "https://picsum.photos/200/300?random=14",
    title: "Tôi thấy hoa vàng trên cỏ xanh",
    price: "90.000",
    oldPrice: "120.000",
    discount: "25",
  },
  {
    imgSrc: "https://picsum.photos/200/300?random=15",
    title: "Muôn kiếp nhân sinh",
    price: "130.000",
    oldPrice: "160.000",
    discount: "18",
  },
  {
    imgSrc: "https://picsum.photos/200/300?random=16",
    title: "Trên đường băng",
    price: "95.000",
    oldPrice: "120.000",
    discount: "21",
  },
  {
    imgSrc: "https://picsum.photos/200/300?random=17",
    title: "Đắc nhân tâm",
    price: "110.000",
    oldPrice: "140.000",
    discount: "21",
  },
  {
    imgSrc: "https://picsum.photos/200/300?random=18",
    title: "Bí mật của may mắn",
    price: "80.000",
    oldPrice: "100.000",
    discount: "20",
  },
  {
    imgSrc: "https://picsum.photos/200/300?random=19",
    title: "Đi tìm lẽ sống",
    price: "100.000",
    oldPrice: "130.000",
    discount: "23",
  },
  {
    imgSrc: "https://picsum.photos/200/300?random=20",
    title: "Tuổi trẻ đáng giá bao nhiêu",
    price: "90.000",
    oldPrice: "115.000",
    discount: "22",
  },
];

/** =========================
 *  🕒 Countdown Timer
 *  ========================= */
import { useCountdown } from "../composables/useCountdown";

const countdownDataFromBE = { timeLeftInSeconds: 26 * 60 + 8 };

const { hours, minutes, seconds, formatTime, start } = useCountdown(
  countdownDataFromBE.timeLeftInSeconds
);

onMounted(() => {
  start();
});

/** =========================
 *  📱 Responsive Logic
 *  ========================= */
const windowWidth = ref(window.innerWidth);

const handleResize = () => {
  windowWidth.value = window.innerWidth;
};

onMounted(() => {
  window.addEventListener("resize", handleResize);
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
});

const buttonSize = computed(() =>
  windowWidth.value < 768 ? "small" : "large"
);
const prodCardScaling = computed(() => (windowWidth.value < 768 ? 0.7 : 1));
const getSlidesPerView = computed(() => (windowWidth.value < 768 ? 3 : 5));
</script>
