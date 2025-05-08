<template>
  <div class="testimonial-card rounded-2xl shadow p-4 bg-white max-w-sm">
    <p class="text-gray-800 text-base mb-4 font-inter">
      {{ testimonial }}
    </p>
    <div class="flex items-center">
      <div class="mr-3">
        <p class="font-semibold text-gray-900">{{ name }}</p>
        <p class="text-sm text-gray-500">{{ role }}</p>
      </div>
      <img
        :src="avatar"
        alt="Avatar"
        class="w-10 h-10 rounded-full object-cover ml-auto"
      />
    </div>
  </div>
</template>

<script setup>
defineProps({
  testimonial: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    required: true,
  },
});
</script>

<style scoped>
.testimonial-card {
  box-sizing: border-box;
}
</style>
