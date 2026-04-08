<template>
  <router-view />
</template>

<script setup>
import { ref } from 'vue'


</script>

<style lang="scss">
@import "@/assets/scss/variables";

:root {
  font-family: v.$font-family-base;
}

body {
  background: v.$vieshow-gradient-dark;
}
</style>