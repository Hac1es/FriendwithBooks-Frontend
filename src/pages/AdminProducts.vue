<script setup>
import { ref } from 'vue';
import Header from "../components/HeaderAdmin/index.vue";
import Footer from "../components/Footer.vue";
import adminCRUD from '../components/adminCRUD.vue';

</script>

<template>
  <div class="min-h-screen flex flex-col">
    <Header/>
    <adminCRUD class="flex-grow" />
    <Footer/>
  </div>
</template>
