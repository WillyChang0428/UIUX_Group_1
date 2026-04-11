<template>
  <div id="app">
    <SplashLoading />
    <Transition name="fade">
      <div v-if="appStore.isRouting" class="global-loading-overlay">
        <div class="spinner-border text-primary" role="status"></div>
      </div>
    </Transition>

    <router-view />
    <HomeVideo />
  </div>
</template>

<script setup>
import { useAppStore } from "@/store/appStore";
import SplashLoading from "@/components/Common/SplashLoading.vue";
import HomeVideo from "@/components/Home/HomeVideo.vue";
const appStore = useAppStore();
</script>

<style lang="scss">
html,
body,
#app {
  height: fit-content;
  background: v.$vieshow-gradient-dark;
}

/* 💡 將原本的 fade 動畫放在全域 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 💡 全域 Loading 遮罩樣式 */
.global-loading-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999; /* 確保它在最高層，蓋住 Navbar 與 BottomBar */
  background-color: #0f1115; /* 威秀深色底 */
  display: flex;
  justify-content: center;
  align-items: center;
}

.tracking-wide {
  letter-spacing: 2px;
}
</style>
