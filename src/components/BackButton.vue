<template>
  <div>
    <button
      @click="handleClick"
      class="flex items-center space-x-2 text-[#400b0b] font-semibold hover:underline transition text-xl font-itim"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M15 19l-7-7 7-7"
        />
      </svg>
      <span>{{ label }}</span>
    </button>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";

const router = useRouter();
const props = defineProps({
  to: {
    type: String,
    default: null,
  },
  label: {
    type: String,
    default: "TRANG CHỦ",
  },
});

function handleClick() {
  if (props.to) {
    router.push(props.to);
  } else {
    router.back();
  }
}
</script>
