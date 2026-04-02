<script setup>
import Header from "@/components/Layout/Parts/Header/Header.vue";
import Footer from "@/components/Layout/Parts/Footer/Footer.vue";
import HomeBanner from "@/components/Home/HomeBanner.vue";
import HomeHotMovie from "@/components/Home/HomeHotMovie.vue";
import HomeLiveConcert from "@/components/Home/HomeLiveConcert.vue";
</script>

<template>
  <div class="main-wrapper">
    <Header />
    <HomeBanner />
    <HomeHotMovie />
    <HomeLiveConcert />
    <Footer />
  </div>
</template>

<style lang="scss">
body {
  height: fit-content;
  background: v.$vieshow-gradient-dark;
}
</style>
