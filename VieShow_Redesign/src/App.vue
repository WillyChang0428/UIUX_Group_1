<script setup>
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
</script>

<template>
  <Header />
  <router-view />
  <router-link to="/">Home</router-link>
  <router-link to="/about">About</router-link>
  <Footer />
  
</template>
