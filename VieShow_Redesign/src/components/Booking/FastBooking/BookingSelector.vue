<script setup>
import { ref } from "vue";

// 如果需要處理關閉邏輯，可以在這裡定義
const handleClose = () => {
  console.log("關閉標籤");
};
</script>

<template>
  <div class="container">
    <div class="serach-ticket">
      <div
        class="selector-group d-flex justify-content-between align-items-center"
      >
        <div
          class="selector-movie d-flex justify-content-between align-items-center"
        >
          <div class="movie-title">極限返航 PROJECT HAIL MARY</div>
          <!-- <div class="title-en ms-2">PROJECT HAIL MARY</div> -->
          <button @click="handleClose" class="btn-close-custom"></button>
          <div class="icon"><i class="bi bi-x-lg"></i></div>
        </div>
      </div>
      <div class="bottom-line"></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
// 卡片主體
.container {
  background: v.$vieshow-gradient-dark;
  width: 100%;
  height: 159px;
  padding: v.$container-padding-mobile;
}

.serach-ticket {
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  height: 111px;
  width: 100%;
  // display: inline-block; // 根據內容寬度調整
}

.movie-title {
  color: v.$vieshow-primary;
}

.bottom-line {
  width: 100%;
  height: 1px;
  background: linear-gradient(90deg, #444 0%, #333 100%);
  opacity: 0.8;
}
</style>
