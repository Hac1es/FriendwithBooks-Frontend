<script setup>
import { ref } from 'vue';
import Header from "./components/Header/index.vue";
import Footer from "./components/Footer.vue";
import ChatPopup from "./components/ChatPopup.vue";

// Control chat popup visibility
const isChatOpen = ref(false);

// Toggle chat popup visibility
const toggleChat = () => {
  isChatOpen.value = !isChatOpen.value;
};

// Close chat popup
const closeChat = () => {
  isChatOpen.value = false;
};
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <Header @toggle-chat="toggleChat"/>
    <ChatPopup :is-open="isChatOpen" @close="closeChat"/>
    <Footer/>
  </div>
</template>
