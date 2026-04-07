<script setup>
import SocialMediaBtn from "./SocialMediaBtn.vue";
import FooterMenu from "./FooterMenu.vue";
</script>

<template>
  <footer class="footer-section py-5 pb-6">
    <div class="container">
      <div class="row gy-5 gy-lg-0 align-items-lg-start">
        <div
          class="col-12 col-lg-4 d-flex flex-column align-items-center align-items-lg-start order-3 order-lg-1"
        >
          <div class="logo mb-5">
            <img src="../../../../assets/images/LOGO.png" alt="威秀LOGO" />
          </div>
          <SocialMediaBtn />
        </div>

        <div class="col-12 col-lg-8 order-1 order-lg-2">
          <FooterMenu />
        </div>
      </div>
    </div>
  </footer>
</template>

<style lang="scss" scoped>
footer {
  border-top: 1px solid v.$vieshow-secondary-emp;
  .logo img {
    width: 100%;
    max-width: 200px;
    height: auto;
    opacity: 0.4;
  }
}
</style>
