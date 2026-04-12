<template>
  <header class="header-wrapper fixed-top">
    <div class="container">
      <div class="navigation-bar d-flex justify-content-between align-items-center">
        
        <div
          class="arrow_back d-flex justify-content-center align-items-center clickable-icon"
          :class="{ 'is-hidden': !showBack }"
          @click="handleBack"
        >
          <i class="fa-solid fa-angle-left"></i>
        </div>

        <div class="title fw-bold">
          {{ isStep5 ? '註冊成功' : '加入會員' }}
        </div>

        <div
          class="close_icon d-flex justify-content-center align-items-center clickable-icon"
          @click="handleClose"
        >
          <i class="fa-solid fa-xmark"></i>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter, useRoute } from 'vue-router'; // 🌟 引入 useRoute 來監聽目前在哪一頁

const router = useRouter();
const route = useRoute();

// ── 邏輯判斷 ──────────────────────────────────────────

// 🌟 1. 判斷現在是不是在 Step 5 (路徑名稱請依你實際的路由名稱修改)
const isStep5 = computed(() => {
  return route.path.includes('SignUpStep5') || route.name === 'SignUpStep5';
});

// 🌟 2. 如果是 Step 5，就不顯示返回鍵
const showBack = computed(() => !isStep5.value);

const handleBack = () => {
  if (!showBack.value) return; // 擋掉點擊動作
  router.back();
};

const handleClose = () => {
  router.push('/'); // 回到首頁
};
</script>

<style scoped lang="scss">
@import "@/assets/scss/variables";

.header-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  z-index: 1030;
  background-color: $vieshow-dark;
  border-bottom: 1px solid rgba($white, 0.05);
  
  @include media-breakpoint-up(md) {
    // 💡 幫組長把 v. 拔掉了
    top: $web-top-padding-pc;
  }
}

.navigation-bar {
  width: 100%;
  padding: 48px 0 var(--gap-lg);
  @include media-breakpoint-up(md) {
    padding: 16px 0;
  }
}

.arrow_back,
.close_icon {
  width: $touch-target-size;
  height: $touch-target-size;
  font-size: 24px;
  color: $vieshow-secondary;
  cursor: pointer;
  transition: opacity 0.2s ease;

  @include hover-focus {
    opacity: 0.7;
  }
}

// 🌟 核心樣式：隱藏按鈕但保留空間，標題才不會歪掉
.is-hidden {
  visibility: hidden;
  pointer-events: none;
}

.title {
  font-size: var(--app-font-size-base);
  font-weight: $font-weight-bold;
  letter-spacing: $letter-spacing-wide;
  color: $white; // 💡 拔掉 v. 了
}
</style>