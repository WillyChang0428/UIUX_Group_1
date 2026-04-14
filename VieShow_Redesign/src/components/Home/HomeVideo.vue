<template>
  <div v-if="isVisible" class="mobile-video-overlay d-md-none">
    <div class="video-modal-container">
      <div class="video-content-wrapper rounded-lg overflow-hidden">
        
        <button class="close-btn clickable-icon" @click="closeVideo">
          <i class="fa-solid fa-xmark fs-5"></i>
        </button>

        <button class="mute-btn clickable-icon" @click="toggleMute">
          <i :class="['fa-solid', isMuted ? 'fa-volume-xmark' : 'fa-volume-high']"></i>
        </button>

        <video
          ref="videoPlayer"
          class="video-element"
          autoplay
          :muted="isMuted"
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
import { ref, onMounted, watch } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const isVisible = ref(false);
let timer = null; 

// 💡 新增：控制靜音狀態的響應式變數 (預設必須為 true 才能讓瀏覽器自動播放)
const isMuted = ref(true);

const checkAndShowVideo = () => {
  if (route.path !== "/") return;
  if (window.innerWidth >= 768) return;

  const hasSeenVideo = sessionStorage.getItem("hasSeenHomeVideo");
  if (hasSeenVideo) return; 

  timer = setTimeout(() => {
    if (route.path === "/") {
      isVisible.value = true;
      sessionStorage.setItem("hasSeenHomeVideo", "true");
    }
  }, 4300);
};

onMounted(() => {
  checkAndShowVideo();
});

watch(() => route.path, (newPath) => {
  if (newPath === '/') {
    checkAndShowVideo();
  } else {
    if (timer) clearTimeout(timer);
    isVisible.value = false;
    isMuted.value = true; // 💡 離開時順便把音量重置回靜音
  }
});

// 💡 新增：切換音量的方法
const toggleMute = () => {
  isMuted.value = !isMuted.value;
};

const closeVideo = () => {
  isVisible.value = false;
  isMuted.value = true; // 💡 關閉彈窗時順便把音量重置回靜音
};
</script>

<style scoped lang="scss">
@import "@/assets/scss/variables";

.mobile-video-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 9999;
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
  color: rgba($white, 0.5);
  border-radius: 50%;
  width: var(--icon-sm);
  height: var(--icon-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.3s ease;
  
  &:hover {
    color: $white;
  }
}

/* 💡 新增：靜音按鈕專屬樣式 */
.mute-btn {
  position: absolute;
  z-index: 10;
  bottom: 15px;
  right: 15px;
  background: rgba($black, 0.4);
  backdrop-filter: blur(4px);
  color: $white;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba($white, 0.2);
  transition: all 0.3s ease;

  &:hover {
    background: rgba($vieshow-primary, 0.8);
    border-color: $vieshow-primary;
  }
}

.video-content-wrapper {
  position: relative;
  width: 100%;
  max-width: 350px;
  aspect-ratio: 9 / 16;
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
  background: $vieshow-primary;
  filter: blur(25px);
  opacity: 0.6;
}
</style>