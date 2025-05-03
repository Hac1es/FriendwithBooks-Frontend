<template>
  <div>
    <div class="hidden md:block">
      <desktopIndex />
    </div>

    <div class="block md:hidden">
      <mobileIndex />
    </div>
  </div>
</template>

<script setup>
import desktopIndex from "./DesktopHeader/desktopIndex.vue";
import mobileIndex from "./MobileHeader/mobileIndex.vue";
</script>
