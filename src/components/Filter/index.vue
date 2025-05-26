<template>
  <div class="max-md:flex justify-end max-md:px-5 max-md:py-3">
    <div class="hidden md:block">
      <Filter @filterChange="(payload) => $emit('filterChange', payload)" />
    </div>

    <div class="md:hidden block">
      <MobileFilter />
    </div>
  </div>
</template>

<script setup>
import Filter from "./Filter.vue";
import MobileFilter from "./MobileFilter.vue";
</script>
