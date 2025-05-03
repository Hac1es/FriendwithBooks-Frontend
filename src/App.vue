<script setup>
  import Header from "./components/Header/index.vue";
  import Footer from "./components/Footer.vue";
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <Header/>
    <main class="flex-1">
      <router-view/>
    </main>
    <Footer/>
  </div>
</template>
