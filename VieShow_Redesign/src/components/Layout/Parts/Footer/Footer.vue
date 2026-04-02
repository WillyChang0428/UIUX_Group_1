<script setup>
import SocialMediaBtn from "./SocialMediaBtn.vue";
import FooterMenu from "./FooterMenu.vue";
</script>

<template>
  <div>
    <div class="container d-flex flex-column align-items-center gap-6 py-5 pb-6">
      <SocialMediaBtn />
      <FooterMenu />
      <div class="logo"><img src="../../../../assets/images/LOGO.png" alt="威秀LOGO"></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.logo img{
  width: 100%;
  max-width: 250px;
  height: auto;
  opacity: 0.4;
};
</style>