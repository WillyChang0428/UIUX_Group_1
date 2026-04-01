<script setup></script>

<template>
  <div class="container fixed-top pt-5">
    <div
      class="navigation-bar d-flex justify-content-between align-items-center"
    >
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
.container {
  background: v.$vieshow-gradient-dark;
  height: 133px;
  width: 100%;
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
  font-size: 20px;
}
</style>
