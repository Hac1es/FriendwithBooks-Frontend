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
import DesktopIndex from "./DesktopHeader/DesktopIndex.vue";
import MobileIndex from "./MobileHeader/MobileIndex.vue";
</script>
