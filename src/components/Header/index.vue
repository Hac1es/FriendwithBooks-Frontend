<template>
  <div>
    <div class="hidden md:block">
      <DesktopIndex />
    </div>

    <div class="block md:hidden">
      <MobileIndex />
    </div>
  </div>
</template>

<script setup>
import DesktopIndex from "./DesktopHeader/desktopIndex.vue";
import MobileIndex from "./MobileHeader/mobileIndex.vue";
</script>
