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

onMounted(() => {
  // 💡 僅限手機版 (中斷點 768px 以下) 顯示
  if (window.innerWidth < 768) {
    
    // 💡 設定計時器：等待 1000 毫秒 (1秒) 後，才將 isVisible 設為 true
    setTimeout(() => {
      isVisible.value = true;
    }, 4300);
    
  }
});

const closeVideo = () => {
  isVisible.value = false;
};
</script>

<style scoped lang="scss">
@import "@/assets/scss/variables"; // 💡 調用地基變數

.mobile-video-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 9999;
  /* 💡 修正編譯錯誤：移除 v. 前綴，直接使用 $black */
  background: rgba($black, 0.65); 
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--gap-md); 
}

.video-modal-container {
  position: relative;
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--gap-sm); 
}

.close-btn {
  position: absolute;
  z-index: 10; 
  top: 10px;
  right: 10px;
  align-self: flex-end;
  /* 💡 修正編譯錯誤：移除 v. 前綴 */
  color:rgba($white, 0.5);
  border-radius: 50%;
  width: var(--icon-sm); 
  height: var(--icon-sm);
  display: flex;
  align-items: center;
  justify-content: center;
}

.video-content-wrapper {
  position: relative;
  width: 100%;
  max-width: 350px;
  aspect-ratio: 9 / 16; 
  /* 💡 修正編譯錯誤：移除 v. 前綴 */
  background: $black;
  border: 1px solid $vieshow-primary; 
  border-radius: var(--app-radius-lg); 
  box-shadow: 0 0 30px rgba($vieshow-primary, 0.5); 
}

.video-element {
  width: 100%;
  height: 100%;
  object-fit: cover; 
}

.bottom-glow {
  width: 80%;
  height: 20px;
  margin: 0 auto;
  /* 💡 修正編譯錯誤：移除 v. 前綴 */
  background: $vieshow-primary;
  filter: blur(25px);
  opacity: 0.6;
}
</style>