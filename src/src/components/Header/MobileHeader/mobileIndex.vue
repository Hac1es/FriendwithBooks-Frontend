<template>
  <div
    class="w-full mx-auto bg-[#f2f6f8] h-16 font-instrument flex items-center justify-between"
  >
    <div class="h-[200%] ml-3 flex-shrink-0">
      <img src="/Logo.png" class="h-[100%] w-auto object-cover" alt="Logo" />
    </div>

    <MoblieNavigation @toggle="$emit('toggle')"/>
  </div>
</template>

<script setup>
import MoblieNavigation from "./MoblieNavigation.vue";

defineEmits(['toggle']);
</script>
