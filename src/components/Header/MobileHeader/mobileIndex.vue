<template>
  <div
    class="w-full mx-auto bg-[#f2f6f8] h-16 font-instrument flex items-center justify-between"
  >
    <div class="h-[200%] ml-3 flex-shrink-0">
      <img src="/Logo.png" class="h-[100%] w-auto object-cover" alt="Logo" />
    </div>

    <MoblieNavigation />
  </div>
</template>

<script setup>
import MoblieNavigation from "./mobileNavigation.vue";
</script>
