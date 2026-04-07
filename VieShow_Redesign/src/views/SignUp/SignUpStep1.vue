<script setup>
import SignUpStart from './components/Auth/SignUpStart.vue';
</script>

<template>
  <div class="container d-flex flex-column justify-content-center align-items-center gap-3">
    <img src="./assets/images/hero.png" alt="">
      <div class="outer-wrapper border border-light rounded p-3 w-100">
        <div class="inner-scroll-box">
          <SignUpStart></SignUpStart>
        </div>

      </div>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/scss/variables"; // 💡 確保引入地基

html, body , #app {
  height: 100vh;
  background: v.$vieshow-gradient-dark;
}

/* --- 外層容器：只管背景和白線邊框 --- */
.outer-wrapper {
  background: rgba(v.$black, 0.3);
  border-color: rgba(v.$light, 0.2) !important;
}

/* --- 內層容器：負責高度與所有捲軸行為 --- */
.inner-scroll-box {
  height: 30vh; // 🌟 高度限制移到這裡，讓藍框固定高度
  overflow-y: auto; // 🌟 捲軸只在這裡產生
  overflow-x: hidden;
  
  /* 客製化捲軸 (現在只會依附在藍線上) */
  &::-webkit-scrollbar {
    width: 10px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background-color: rgba(v.$light, 0.3);
    border-radius: 10px;
    
    &:hover {
      background-color: rgba(v.$light, 0.5);
    }
  }
}
</style>
