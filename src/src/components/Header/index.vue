<template>
  <div>
    <div class="hidden md:block">
      <desktopIndex @toggle="$emit('toggle-chat')"/>
    </div>

    <div class="block md:hidden">
      <mobileIndex @toggle="$emit('toggle-chat')"/>
    </div>
  </div>
</template>

<script setup>
import desktopIndex from "./DesktopHeader/desktopIndex.vue";
import mobileIndex from "./MobileHeader/mobileIndex.vue";

defineEmits(['toggle-chat']);
</script>
