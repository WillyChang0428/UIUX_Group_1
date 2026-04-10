<template>
  <div class="default-layout">
    
    <div class="d-none d-md-block">
      <Header />
    </div>
    
    <BookingStepHeader />

    <main 
      class="layout-main" 
      :class="isMobile ? 'main-wrapper' : 'other-wrapper'"
    >
      <router-view />
    </main>

    <BookingBottomBar />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import BookingStepHeader from './Parts/BookingStepHeader.vue';
import BookingBottomBar from './Parts/BookingBottomBar.vue';
import Header from './Parts/Header/Header.vue';

// ── 判斷是否為手機版的響應式變數 ──────────────────────────────
const isMobile = ref(true); // 預設先給 true

// 檢查視窗寬度是否小於 Bootstrap 的 md 斷點 (768px)
const checkScreenSize = () => {
  isMobile.value = window.innerWidth < 768;
};

// 進入畫面時，執行初始檢查並掛載 resize 監聽器
onMounted(() => {
  checkScreenSize(); 
  window.addEventListener('resize', checkScreenSize);
});

// 離開畫面時，務必移除監聽器，避免消耗記憶體效能
onUnmounted(() => {
  window.removeEventListener('resize', checkScreenSize);
});
</script>

<style lang="scss" scoped>
@import "@/assets/scss/variables";

.default-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: $vieshow-gradient-dark; 
}

.layout-main {
  flex: 1;
}
</style>