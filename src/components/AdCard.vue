<template>
  <component
    :is="to ? 'router-link' : 'div'"
    :to="to"
    class="w-full max-w-[320px] flex flex-col items-start gap-3 hover:shadow-lg transition-shadow duration-300 cursor-pointer"
  >
    <div class="w-full max-w-[320px] md:h-[400px] rounded-lg">
      <img
        :src="imgSrc"
        :alt="title || null"
        class="w-full h-full object-cover"
      />
    </div>
    <div
      class="font-inder font-medium sm:text-[30px] text-[12px] text-[#661C1C] md:pl-4 md:pr-2"
    >
      {{ title }}
    </div>
    <div
      class="font-inter font-normal sm:text-[14px] text-[7px] text-[#828282] md:pl-4 md:pb-2 pb-1 md:pr-2"
    >
      {{ desc }}
    </div>
  </component>
</template>

<script setup>
defineProps({
  imgSrc: String,
  title: String,
  desc: String,
  to: {
    type: [String, Object],
    default: null,
  },
});
</script>
