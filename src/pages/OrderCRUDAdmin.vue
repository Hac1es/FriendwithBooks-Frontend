<script setup>
import { ref } from 'vue';
import Header from "../components/HeaderAdmin/index.vue";
import Footer from "../components/Footer.vue";
import Order from '../components/OrderAdmin.vue';

</script>

<template>
  <div class="min-h-screen flex flex-col">
    <Header/>
    <Order class="flex-grow" />
    <Footer/>
  </div>
</template>
