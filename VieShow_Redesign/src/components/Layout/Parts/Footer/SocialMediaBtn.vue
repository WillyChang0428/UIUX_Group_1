<template>
  <div class="d-flex gap-3">
    <button
      v-for="platform in socialPlatforms"
      :key="platform.id"
      class="social-btn clickable-icon"
      :class="{ 'is-active': activePlatform === platform.id }"
      @click="toggleActive(platform.id)"
    >
      <i :class="[platform.icon, 'icon-lg']"></i>
    </button>
  </div>
</template>

<script setup>
import { ref } from "vue";

// 💡 定義社群平台資料
const socialPlatforms = [
  { id: "instagram", icon: "fa-brands fa-instagram" },
  { id: "facebook", icon: "fa-brands fa-facebook-f" },
  { id: "youtube", icon: "fa-brands fa-youtube" },
];

// 💡 紀錄目前點選的平台
const activePlatform = ref(null);

const toggleActive = (id) => {
  activePlatform.value = id;
};
</script>

<style scoped lang="scss">
.social-btn {
  /* --- 1. 預設狀態 (灰色) --- */
  // 💡 使用手冊規範之二級文字顏色 [cite: 5, 161]
  color: v.$vieshow-secondary; 
  background: transparent;
  border: none;
  padding: 0; // 對齊 Reset 規範 [cite: 1]
  transition: color 0.2s ease , transform 0.1s ease;
  cursor: pointer;

  /* --- 2. Hover 狀態 (微亮感) --- */
  // 💡 使用手冊定義之預防針，確保桌機端體驗 [cite: 30-31]
  @include v.hover-focus {
    color: v.$vieshow-tertiary; // 變換為較亮的淺灰色 [cite: 5]
    filter: brightness(1.2); 
  }

  /* --- 3. 點擊瞬間 (藍色 - Press Moment) --- */
  // 💡 只有在滑鼠按下 (Active) 的那一刻才會變藍 [cite: 159-160]
  &:active {
    color: v.$vieshow-primary !important; // 強制切換為威秀藍 [cite: 5, 160]
    
    // 💡 增加物理縮小感與發光感
    transform: scale(0.9);
    
    // 💡 縮短反應時間，讓點擊感更清脆
    transition: none; 
  }

}
</style>
