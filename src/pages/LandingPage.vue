<template>
  <div>
    <Header />
    <!-- Hero Section -->
    <div class="w-full md:w-[calc(100%-224px)] mx-auto aspect-[13/5] mt-2">
      <img src="/heroSection.png" alt="" class="object-contain w-full h-full" />
    </div>

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
    <Footer />
  </div>
</template>

<script setup>
import Header from "../components/Header/index.vue";
import Footer from "../components/Footer.vue";
import { ref, onMounted } from "vue";

const buttonSize = ref("medium");

onMounted(() => {
  const updateSize = () => {
    buttonSize.value = window.innerWidth < 768 ? "small" : "large";
  };
  updateSize();
  window.addEventListener("resize", updateSize);
});
</script>
