<template>
  <div class="w-full max-w-[369px] flex flex-col justify-center gap-3">
    <div class="w-full max-w-[369px] rounded-lg">
      <img
        :src="imgSrc"
        :alt="title || null"
        class="w-full h-full object-contain"
      />
    </div>
    <div
      class="font-inder font-medium sm:text-[30px] text-[12px] text-[#661C1C]"
    >
      {{ title }}
    </div>
    <div
      class="font-inter font-normal sm:text-[20px] text-[7px] text-[#828282]"
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
