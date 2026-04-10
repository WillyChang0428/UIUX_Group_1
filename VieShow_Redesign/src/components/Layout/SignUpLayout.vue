<script setup>
import SignUpStepHeader from './Parts/SignUpStepHeader.vue';
import { ref, onMounted, onUnmounted } from 'vue';
import Header from './Parts/Header/Header.vue';
// ── 判斷是否為桌機的響應式變數 ──────────────────────────────
const isDesktop = ref(false); // Mobile First，預設先給 false

// 檢查視窗寬度是否大於等於 Bootstrap 的 md 斷點 (768px)
const checkScreenSize = () => {
  isDesktop.value = window.innerWidth >= 768;
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

<template>
  <div class="default-layout ">
    <Header />

    <SignUpStepHeader />

    <main :class="isDesktop ? 'other-wrapper' : 'main-wrapper'">
      <router-view />
    </main>

  </div>
</template>

<style lang="scss" scoped>
/* 💡 引入全域變數，並移除原本會報錯的 v. 前綴 */
@import "@/assets/scss/variables";

.default-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh; // 確保佈局至少跟螢幕一樣高
  background: $vieshow-gradient-dark; // 💡 使用正確的變數呼叫方式
}

.layout-main {
  flex: 1; // 讓中間內容區自動撐開，把 Footer 推到底部
}
</style>