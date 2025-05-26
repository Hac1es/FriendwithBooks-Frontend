<template>
  <div class="p-4 rounded-lg shadow-sm font-instrument">
    <!-- Header with name, location and date -->
    <div class="flex justify-between items-center mb-1 flex-wrap">
      <div class="font-medium text-gray-800">{{ name }}</div>
      <div class="text-gray-500 text-sm">{{ date }}</div>
    </div>

    <!-- Star rating -->
    <div class="flex mb-3">
      <StarIcon
        v-for="index in 5"
        :key="index"
        :class="[
          'w-5 h-5 fill-current',
          index <= rating ? 'text-[#9b0505]' : 'text-gray-200',
        ]"
      />
    </div>

    <!-- Review content -->
    <p class="text-gray-700">{{ content }}</p>
  </div>
</template>

<script setup>
import { StarIcon } from "lucide-vue-next";

// Define props with default values matching the example
const props = defineProps({
  name: String,
  date: String,
  rating: Number,
  content: String,
});
</script>
