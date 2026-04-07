<script setup>
import { ref } from "vue";

// 狀態控制：true 顯示電影名稱，false 顯示「選擇電影」
const isMovieSelected = ref(true);

const handleClose = () => {
  isMovieSelected.value = false;
};

const handleOpen = () => {
  isMovieSelected.value = true;
};
</script>

<template>
  <div class="container">
    <div class="serach-ticket d-flex justify-content-center align-items-center">
      <div class="selector-group">
        <template v-if="isMovieSelected">
          <div
            class="selector-movie d-flex justify-content-between align-items-center .mb-2"
          >
            <div class="movie-title">極限返航 PROJECT HAIL MARY</div>
            <div class="icon-close d-flex justify-content-center align-items-center" @click="handleClose">
              <i class="fa-solid fa-xmark"></i>
            </div>
          </div>
        </template>
        <template v-else>
          <div
            class="selector-movie d-flex justify-content-between align-items-center .mb-2"
            @click="handleOpen"
          >
            <div class="placeholder-text">選擇電影</div>
            <div class="icon-arrow d-flex justify-content-center align-items-center">
              <i class="fa-solid fa-chevron-down"></i>
            </div>
          </div>
        </template>
        <div class="bottom-line"></div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
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
  padding: 24px 30px 36px 30px;
  // display: inline-block; // 根據內容寬度調整
}

.selector-group {
  width: 100%;
  cursor: pointer;
}
.selector-movie {
  // gap: 8px;
  margin-bottom: v.$spacer;
}
.movie-title {
  color: v.$vieshow-primary;
  font-size: v.$font-size-base;
}

.placeholder-text {
  color: rgba(255, 255, 255, 0.5); // 沒選電影時的灰色字
  font-size: v.$font-size-base;
}

.icon-close,
.icon-arrow {
  color: v.$light;
  font-size: v.$font-size-base;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 30px;
  cursor: pointer;

  &:hover {
    color: v.$vieshow-primary;
  }
}
.bottom-line {
  width: 100%;
  height: 1px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}
</style>
