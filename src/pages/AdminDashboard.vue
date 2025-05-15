<script setup>
import { ref } from 'vue';
import Header from "../components/HeaderAdmin/index.vue";
import Footer from "../components/Footer.vue";
import Stat from '../components/StatAdmin.vue';

</script>

<template>
  <div class="min-h-screen flex flex-col">
    <Header/>
    <Stat class="flex-grow" />
    <Footer/>
  </div>
</template>
