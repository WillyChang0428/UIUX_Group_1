<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import Header from './Parts/Header/Header.vue';
import SignUpStepHeader from './Parts/SignUpStepHeader.vue';

// ── 判斷是否為桌機的響應式變數 ──────────────────────────────
const isDesktop = ref(false);

const checkScreenSize = () => {
  isDesktop.value = window.innerWidth >= 768; // md 斷點
};

onMounted(() => {
  checkScreenSize(); 
  window.addEventListener('resize', checkScreenSize);
});

onUnmounted(() => {
  window.removeEventListener('resize', checkScreenSize);
});
</script>

<template>
  <div class="default-layout container">
    <Header />

    <SignUpStepHeader />

    <main 
      class="layout-main" 
      :class="isDesktop ? 'other-wrapper' : 'main-wrapper'"
    >
      <router-view />
    </main>

  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/scss/variables";

.default-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh; 
  background: $vieshow-gradient-dark; 
}

/* 讓中間內容區自動撐開，把 Footer 推到底部 */
.layout-main {
  flex: 1; 
  display: flex;
  flex-direction: column; /* 如果裡面的 Step 需要置中，這行很實用 */
}

/* 預留給你的 wrapper 樣式 */
.main-wrapper {
  // 手機版樣式
}

.other-wrapper {
  // 電腦版樣式
}
</style>