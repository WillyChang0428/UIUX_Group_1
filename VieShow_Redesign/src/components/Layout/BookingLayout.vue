<script setup>
import BookingStepHeader from './Parts/BookingStepHeader.vue';
import BottomBar from '../Booking/BottomBar.vue';
</script>

<template>
  <div class="default-layout ">
    <BookingStepHeader />

    <main class="layout-main main-wrapper">
      <router-view />
    </main>

    <BottomBar />
  </div>
</template>

<style lang="scss" scoped>
.default-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh; // 確保佈局至少跟螢幕一樣高
  background: v.$vieshow-gradient-dark;
}

.layout-main {
  flex: 1; // 讓中間內容區自動撐開，把 Footer 推到底部
}
</style>