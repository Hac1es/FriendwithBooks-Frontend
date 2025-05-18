<template>
  <div>
    <div class="hidden md:block">
      <DesktopIndexcp />
    </div>

    <div class="block md:hidden">
      <MobileIndexcp />
    </div>
  </div>
</template>

<script setup>
import DesktopIndexcp from "./DesktopHeader/desktopIndexcp.vue";
import MobileIndexcp from "./MobileHeader/MobileIndexcp.vue";
</script>
