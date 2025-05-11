<template>
  <div class="w-full max-w-[320px] flex flex-col items-start gap-3">
    <div class="w-full max-w-[320px] md:h-[400px] rounded-lg">
      <img
        :src="imgSrc"
        :alt="title || null"
        class="w-full h-full object-cover"
      />
    </div>
    <div
      class="font-inder font-medium sm:text-[30px] text-[12px] text-[#661C1C]"
    >
      {{ title }}
    </div>
    <div
      class="font-inter font-normal sm:text-[14px] text-[7px] text-[#828282]"
    >
      {{ desc }}
    </div>
  </div>
</template>

<script setup>
defineProps({
  imgSrc: String,
  title: String,
  desc: String,
});
</script>
