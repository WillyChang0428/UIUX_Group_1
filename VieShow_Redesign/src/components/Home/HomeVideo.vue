<template>
  <div v-if="isVisible" class="mobile-video-overlay d-md-none">
    <div class="video-modal-container">
      <div class="video-content-wrapper rounded-lg overflow-hidden">
        <button class="close-btn clickable-icon" @click="closeVideo">
          <i class="fa-solid fa-xmark icon-lg"></i>
        </button>
        <video
          ref="videoPlayer"
          class="video-element"
          autoplay
          muted
          playsinline
          loop
        >
          <source src="@/assets/video/video.mp4" type="video/mp4" />
          您的瀏覽器不支援影片標籤。
        </video>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const isVisible = ref(false);
const videoPlayer = ref(null);

onMounted(() => {
  // 💡 僅限手機版 (中斷點 768px 以下) 顯示 [cite: 118]
  if (window.innerWidth < 768) {
    isVisible.value = true;
  }
});

const closeVideo = () => {
  isVisible.value = false;
};
</script>

<style scoped lang="scss">
@import "@/assets/scss/variables"; // 💡 調用地基變數 [cite: 1, 92]

.mobile-video-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 9999;
  background: rgba(v.$black, 0.65); // 增加背景遮罩深度 [cite: 93]
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--gap-md); // 手機版 16px 內距 [cite: 131]
}

.video-modal-container {
  position: relative;
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--gap-sm); // 元素間距 8px [cite: 130]
}

.close-btn {
  position: absolute;
  z-index: 10; // 💡 確保按鈕在影片之上
  top: 10px;
  right: 10px;
  align-self: flex-end;
  color:rgba(v.$white, 0.5);
  border-radius: 50%;
  width: var(--icon-sm); // 對齊響應式圖示尺寸 [cite: 156]
  height: var(--icon-sm);
  display: flex;
  align-items: center;
  justify-content: center;
}

.video-content-wrapper {
  position: relative;
  width: 100%;
  max-width: 350px;
  aspect-ratio: 9 / 16; // 維持直式預告片比例
  background: v.$black;
  border: 1px solid v.$vieshow-primary; // 威秀藍邊框 [cite: 160]
  border-radius: var(--app-radius-lg); // 手機版 12px 圓角 [cite: 148]
  box-shadow: 0 0 30px rgba(v.$vieshow-primary, 0.5); // 加強發光感
}

.video-element {
  width: 100%;
  height: 100%;
  object-fit: cover; // 確保影片填滿容器
}

.bottom-glow {
  width: 80%;
  height: 20px;
  margin: 0 auto;
  background: v.$vieshow-primary;
  filter: blur(25px);
  opacity: 0.6;
}
</style>
