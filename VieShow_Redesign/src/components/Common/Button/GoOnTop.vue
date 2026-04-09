<template>
  <Transition name="fade">
    <button 
      v-show="isShown" 
      class="go-on-top-btn clickable-icon shadow-lg" 
      @click="scrollToTop"
      aria-label="回到頂部"
    >
      <i class="fa-solid fa-chevron-up"></i>
    </button>
  </Transition>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const isShown = ref(false);

// 滾動監聽邏輯
const handleScroll = () => {
  // 當捲動超過 300px 時顯示按鈕
  isShown.value = window.scrollY > 300;
};

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped lang="scss">
/* 💡 引入變數地基以調用 v.$ 語法 [cite: 125] */
@import "@/assets/scss/variables";

.go-on-top-btn {
  /* 固定定位在右下角 */
  position: fixed;
  bottom: var(--gap-lg); // 手機 24px / 電腦 48px [cite: 131]
  right: var(--gap-lg);
  z-index: 1000;

  /* 💡 尺寸規範：使用手冊中 45px 的觸控熱區規範 [cite: 116] */
  width: $touch-target-size;
  height: $touch-target-size;
  
  /* 背景與邊框：使用品牌主色與語意化名稱 [cite: 159, 160] */
  background: v.$vieshow-primary;
  color: v.$white;
  border: none;
  
  /* 圓角：使用 Normal 等級，隨螢幕自動縮放 (8px / 16px)  */
  border-radius: var(--app-radius);
  
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;

  /* 💡 Hover 預防針：只在桌機端觸發縮放感 [cite: 121] */
  @include hover-focus {
    background: v.$vieshow-primary-dark;
    transform: translateY(-5px);
  }

  i {
    /* 💡 圖示尺寸：隨螢幕縮放 (16px / 32px) [cite: 156] */
    font-size: var(--icon-sm);
  }
}

/* 淡入淡出動畫 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>