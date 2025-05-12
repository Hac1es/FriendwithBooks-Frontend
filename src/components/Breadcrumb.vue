<template>
  <nav
    aria-label="Breadcrumb"
    class="text-[9px] md:text-[14px] bg-[#f8f8f8] w-full md:w-[calc(100%-224px)] mx-auto font-instrument font-normal px-6 py-2"
  >
    <ol class="flex items-center flex-wrap">
      <li
        v-for="(crumb, index) in crumbs"
        :key="index"
        class="flex items-center"
      >
        <router-link
          v-if="crumb.link && index < crumbs.length - 1"
          :to="crumb.link"
          class="text-[#400b0b] hover:underline"
        >
          {{ crumb.name }}
        </router-link>

        <!-- Nếu là phần tử cuối hoặc không có link -->
        <span v-else class="text-[#b22222] cursor-default select-none">
          {{ crumb.name }}
        </span>

        <!-- Dấu phân cách -->
        <span
          v-if="index < crumbs.length - 1"
          class="md:mx-5 mx-2 text-[#3b1d1d]"
        >
          /
        </span>
      </li>
    </ol>
  </nav>
</template>

<script setup>
defineProps({
  crumbs: {
    type: Array,
    required: true,
  },
  selected(crumb) {
    this.$emit("selected", crumb);
  },
});
</script>
