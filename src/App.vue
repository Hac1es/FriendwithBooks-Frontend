<script setup>
import Header from "./components/Header/index.vue";
import Footer from "./components/Footer.vue";
import ChatInterface from "./components/ChatInterface.vue";
import ChatPopup from "./components/ChatPopup.vue";
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <Header/>
    <router-view/>
    <Footer/>
  </div>
</template>
