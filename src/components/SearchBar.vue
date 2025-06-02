<template>
  <div class="flex items-center">
    <input
      type="text"
      :placeholder="placeholder"
      v-model="searchQuery"
      class="px-4 py-2 rounded-md border-2 border-black bg-[#f3f0f0] text-left outline-none"
      @input="onInput"
    />
    <button class="ml-2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        @click="onFind"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
        />
      </svg>
    </button>
  </div>
</template>

<script setup>
import { ref } from "vue";
defineProps({
  placeholder: String,
});
const searchQuery = ref("");
const emit = defineEmits(["search"]);
const onInput = () => {
  emit("search", searchQuery.value);
};
const onFind = () => {
  emit("find", searchQuery.value);
};
</script>
