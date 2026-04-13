<template>
  <div v-if="isVisible" class="mobile-video-overlay d-md-none">
    <div class="video-modal-container">
      <div class="video-content-wrapper rounded-lg overflow-hidden">
        <button class="close-btn clickable-icon" @click="closeVideo">
          <i class="fa-solid fa-xmark fs-5"></i>
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
import { ref, onMounted, watch } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const isVisible = ref(false);
let timer = null; // 把計時器存起來，方便需要時可以取消

const checkAndShowVideo = () => {
  // 💡 1. 確保目前「真的」是在首頁
  if (route.path !== "/") return;

  // 💡 2. 確保是手機版 (中斷點 768px 以下)
  if (window.innerWidth >= 768) return;

  // 💡 3. 檢查 sessionStorage 是否已經有「播放過」的紀錄
  const hasSeenVideo = sessionStorage.getItem("hasSeenHomeVideo");
  if (hasSeenVideo) return; 

  // 💡 4. 設定計時器彈出影片
  timer = setTimeout(() => {
    // 再做最後一次雙重確認，避免倒數期間使用者已經跳去別頁了！
    if (route.path === "/") {
      isVisible.value = true;
      sessionStorage.setItem("hasSeenHomeVideo", "true");
    }
  }, 4300);
};

// 進入元件時先檢查一次 (應付從其他頁面按「首頁」按鈕回來的情況)
onMounted(() => {
  checkAndShowVideo();
});

// 💡 關鍵：監聽網址變化。應付「直接輸入網址開新分頁」時的延遲解析問題
watch(() => route.path, (newPath) => {
  if (newPath === '/') {
    checkAndShowVideo();
  } else {
    // 如果使用者在 4.3 秒內跳走，立刻取消計時器，以免在別頁彈出！
    if (timer) clearTimeout(timer);
    isVisible.value = false;
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
  color: rgba($white, 0.5);
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
