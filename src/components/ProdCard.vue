<template>
  <component
    :is="to ? 'router-link' : 'div'"
    :to="to"
    class="inline-block"
    :style="{ zoom: scale }"
  >
    <div
      class="w-[45vw] sm:w-[30vw] md:w-48 overflow-hidden shadow-sm hover:shadow-lg hover:scale-[1.02] transition-shadow duration-300 bg-white"
      @click="$emit('click', productId)"
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
            v-if="discount"
            class="bg-[#661c1c] text-white text-xs font-semibold ml-2 px-1.5 py-0.5 rounded font-inter"
          >
            -{{ discount }}%
          </span>
        </div>

        <div class="flex items-center mt-1 min-h-[1.25rem]" v-if="oldPrice">
          <span
            class="text-gray-400 line-through text-sm font-semibold font-inter"
          >
            {{ oldPrice }} đ
          </span>
        </div>
      </div>
    </div>
  </component>
</template>

<script setup>
defineProps({
  productId: Number,
  imgSrc: String,
  title: String,
  price: String,
  oldPrice: String,
  discount: String,
  to: {
    type: [String, Object],
    default: null,
  },
  scale: {
    type: Number,
    default: 1,
  },
});
</script>
