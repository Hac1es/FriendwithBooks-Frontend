<template>
  <div class="inline-block" :style="{ zoom: scale }">
    <div
      class="w-[45vw] sm:w-[30vw] md:w-48 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 bg-white"
    >
      <img
        :src="imgSrc"
        :alt="title"
        class="w-full aspect-square object-cover"
      />

      <div class="p-2">
        <h3
          class="text-lg font-semibold text-[#661c1c] uppercase truncate font-itim"
        >
          {{ title }}
        </h3>

        <div class="space-x-3 flex items-center flex-nowrap">
          <div class="text-[#661c1c] font-semibold font-inter text-lg mt-1">
            {{ price }} đ
          </div>
          <span
            class="bg-[#661c1c] text-white text-xs font-semibold ml-2 px-1.5 py-0.5 rounded font-inter"
          >
            -{{ discount }}%
          </span>
        </div>

        <div class="flex items-center mt-1">
          <span
            class="text-gray-400 line-through text-sm font-semibold font-inter"
            >{{ oldPrice }} đ</span
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  imgSrc: String,
  title: String,
  price: String,
  oldPrice: String,
  discount: String,
  scale: {
    type: Number,
    default: 1,
  },
});
</script>
