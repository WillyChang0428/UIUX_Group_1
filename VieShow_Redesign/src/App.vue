<script setup>
import SignUpStep1 from './views/HomePage.vue';
</script>

<template>
  <SignUpStep1 />
</template>

<style lang="scss" scoped>
@import "@/assets/scss/variables"; // 💡 確保引入地基

html, body , #app {
  height: 100vh;
  background: v.$vieshow-gradient-dark;
}
</style>
