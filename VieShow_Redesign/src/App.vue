<script setup>
import Header from "@/components/Layout/Parts/Header/Header.vue";
import Footer from "@/components/Layout/Parts/Footer/Footer.vue";
import SocialMediaBtn from "@/components/Layout/Parts/Footer/SocialMediaBtn.vue";
import FooterMenu from "@/components/Layout/Parts/Footer/FooterMenu.vue";
</script>

<template>
  <Header />
  <Footer />

</template>

<style lang="scss">
body {
  height: 100vh;
  background: v.$vieshow-gradient-dark;
  padding: 133px 0 0;
  /* 預留 Header 的高度 */
}
</style>
