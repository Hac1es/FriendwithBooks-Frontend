<template>
  <div>
    <Header />
    <!-- Hero Section -->
    <div class="w-full md:w-[calc(100%-224px)] mx-auto aspect-[13/5] mt-2">
      <img src="/heroSection.png" alt="" class="object-contain w-full h-full" />
    </div>

    <!-- Best Seller -->
    <div
      class="font-itim font-normal sm:text-[40px] text-[20px] w-[90%] mx-auto text-[#b22222] mt-7"
    >
      BEST SELLER
    </div>
    <n-carousel
      :space-between="20"
      :loop="true"
      slides-per-view="3"
      draggable
      show-arrow
      class="mx-auto w-[90%] h-[300px] md:h-[400px] mt-6"
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
          src="/DacNhanTam.png"
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

<script setup lang="ts">
import Header from "../components/Header/index.vue";
import Footer from "../components/Footer.vue";
import AdCard from "../components/AdCard.vue";
import { ArrowBack, ArrowForward } from "@vicons/ionicons5";
import { ref, onMounted } from "vue";
import TestimonalCard from "../components/TestimonalCard.vue";

const fakeData = [
  {
    imgSrc: "/images/ly-thuyet-tro-choi.png",
    title: "Lý Thuyết Trò Chơi",
    desc: "Đời người giống như trò chơi, mỗi bước đều phải cân nhắc xem đi như thế nào, đi về đâu, phải kết hợp nhiều yếu tố lại chúng ta mới có thể đưa ra được lựa chọn.",
  },
  {
    imgSrc: "/images/security-analysis.png",
    title: "Security Analysis - Phân Tích Chứng Khoán",
    desc: "Phân tích chứng khoán của tác giả Benjamin Graham và David Dodd được ví như 'cuốn kinh thánh của đầu tư giá trị'",
  },
  {
    imgSrc: "/images/khi-moi-dieu-khong-nhu.png",
    title: "Khi Mọi Điều Không Như Ý",
    desc: "Khi cuộc sống trở nên bận rộn và khó khăn, hãy tặng cho bản thân món quà đặc biệt là dừng lại.",
  },
  {
    imgSrc: "/images/nha-gia-kim.png",
    title: "Nhà Giả Kim",
    desc: "Cuốn tiểu thuyết nổi tiếng của Paulo Coelho kể về hành trình tìm kiếm kho báu và ý nghĩa cuộc sống.",
  },
  {
    imgSrc: "/images/dac-nhan-tam.png",
    title: "Đắc Nhân Tâm",
    desc: "Cuốn sách kinh điển về nghệ thuật giao tiếp, ứng xử và phát triển bản thân của Dale Carnegie.",
  },
  {
    imgSrc: "/images/nang-luc-tu-hoc.png",
    title: "Năng Lực Tự Học",
    desc: "Giúp bạn xây dựng thói quen học tập hiệu quả và làm chủ tri thức trong thời đại số.",
  },
  {
    imgSrc: "/images/tu-duy-nhanh-va-cham.png",
    title: "Tư Duy Nhanh Và Chậm",
    desc: "Daniel Kahneman phân tích hai hệ thống tư duy: trực giác và lý trí, ảnh hưởng đến cách chúng ta ra quyết định.",
  },
  {
    imgSrc: "/images/khoi-nghiep-tinh-gon.png",
    title: "Khởi Nghiệp Tinh Gọn",
    desc: "Eric Ries giới thiệu mô hình Lean Startup giúp các doanh nghiệp phát triển bền vững và linh hoạt.",
  },
  {
    imgSrc: "/images/suc-manh-cua-hien-tai.png",
    title: "Sức Mạnh Của Hiện Tại",
    desc: "Eckhart Tolle chỉ ra cách sống trọn vẹn với hiện tại để đạt được sự bình an và giác ngộ.",
  },
  {
    imgSrc: "/images/thu-vien-ban-dem.png",
    title: "Thư Viện Ban Đêm",
    desc: "Matt Haig kể về một thư viện bí ẩn nơi bạn có thể sống thử những cuộc đời khác nhau nếu chọn lối rẽ khác.",
  },
];

const testimonials = [
  {
    testimonial:
      "This platform made building my first website incredibly easy! The drag-and-drop interface is super intuitive, and the templates look amazing. I had my blog up and running in no time!",
    name: "Sarah Thompson",
    role: "Blogger",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    testimonial:
      "I've tried several website builders, but this one stands out. The speed and flexibility are unmatched, and the support team is always ready to help!",
    name: "Michael Lee",
    role: "Freelancer",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    testimonial:
      "As a small business owner, I need tools that just work. This platform lets me focus on my customers without worrying about tech headaches.",
    name: "Emily Davis",
    role: "Small Business Owner",
    avatar: "https://randomuser.me/api/portraits/women/65.jpg",
  },
  {
    testimonial:
      "Amazing experience! I set up my portfolio in under an hour, and the design options are stunning.",
    name: "Daniel Kim",
    role: "Designer",
    avatar: "https://randomuser.me/api/portraits/men/41.jpg",
  },
];

const buttonSize = ref("medium");

onMounted(() => {
  const updateSize = () => {
    buttonSize.value = window.innerWidth < 768 ? "small" : "large";
  };
  updateSize();
  window.addEventListener("resize", updateSize);
});
</script>
