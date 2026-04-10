<script setup></script>

<template>
  <div class="container fixed-top pt-5">
    <div class="navigation-bar d-flex justify-content-between align-items-center">
      <div class="arrow_back d-flex justify-content-center align-items-center">
        <i class="fa-solid fa-angle-left"></i>
      </div>
      <div class="title">分頁標題</div>
      <div class="close_icon d-flex justify-content-center align-items-center">
        <i class="fa-solid fa-xmark"></i>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "@/assets/scss/variables";


.container {
  position: fixed;
  top: v.$web-top-padding-mobile;
  left: 0;
  right: 0;
  height: fit-content;
  z-index: 1000;
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgba($white, 0.05);
  background-color: v.$vieshow-dark;
  padding: 0 var(--gap-lg);

  @include v.media-breakpoint-up(md) {
    top: v.$web-top-padding-pc;
  }

}

.navigation-bar{
  width: 100%;
  list-style: none;
  margin: 0;
  padding: 16pt 0;
}

.arrow_back,
.close_icon {
  width: 45px;
  height: 45px;
  font-size: 25px;
  color: v.$vieshow-secondary;
}

.title {
  color: v.$light;
  font-size: v.$h5-font-size;
}
</style>
