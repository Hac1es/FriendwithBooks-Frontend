<template>
  <div>
    <!-- Nút Lọc -->
    <button
      @click="isOpen = true"
      class="flex items-center space-x-1 text-[#661C1C] text-sm font-semibold"
    >
      <FilterIcon />
      <span>Lọc</span>
    </button>

    <!-- Overlay -->
    <transition name="fade">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-40 bg-black/40"
        @click.self="isOpen = false"
      />
    </transition>

    <!-- Sidebar trượt -->
    <transition name="slide">
      <div
        v-if="isOpen"
        class="fixed top-0 left-0 w-4/5 max-w-xs h-full bg-[#f8f5e9] z-50 shadow-lg p-4 overflow-y-auto"
      >
        <!-- Đóng -->
        <div class="flex justify-end mb-2">
          <button @click="isOpen = false" class="text-[#400b0b] text-lg">
            ✕
          </button>
        </div>

        <!-- Nội dung Filter -->
        <Filter @change="emit('change', $event)" />
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref } from "vue";
import Filter from "./Filter.vue";
import { Filter as FilterIcon } from "lucide-vue-next";

const isOpen = ref(false);
const emit = defineEmits(["change"]);
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}
.slide-enter-from {
  transform: translateX(-100%);
}
.slide-leave-to {
  transform: translateX(-100%);
}
</style>
