<template>
  <div class="time-button-group d-inline-flex align-items-center">
    
    <button
      class="time-btn fw-bold d-flex align-items-center justify-content-center"
      :class="[
        isFull ? 'is-unable' : 'is-default',
        { 'is-pressed': isPressed }
      ]"
      :disabled="isFull"
      @click="handleTimeClick"
    >
      {{ time }}
    </button>

    <button
      class="seat-btn d-flex align-items-center justify-content-center"
      :class="[
        isFull ? 'is-unable' : 'is-default',
        { 'is-pressed': isPressed }
      ]"
      :disabled="isFull"
      @click="$emit('preview')"
      aria-label="預覽座位"
    >
      <i class="fa-solid fa-couch"></i>
    </button>

  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  time: {
    type: String,
    required: true,
    default: '13 : 20'
  },
  isFull: {
    type: Boolean,
    default: false // 若為 true，則進入 unable 滿位狀態
  }
});

// 定義發送給父層的事件：book (訂票跳轉), preview (查看座位)
const emit = defineEmits(['book', 'preview']);

// 控制點擊瞬間的藍色狀態
const isPressed = ref(false);

const handleTimeClick = () => {
  if (props.isFull) return;
  
  isPressed.value = true;
  
  // 💡 體驗細節：保留 150 毫秒的藍色停留時間，讓使用者看到「我確實按到了」的反饋，再進行跳轉
  setTimeout(() => {
    isPressed.value = false;
    emit('book'); // 通知父組件進行 router.push 跳轉
  }, 150);
};
</script>

<style scoped lang="scss">
@import "@/assets/scss/variables";

.time-button-group {
  gap: var(--gap-sm); // 兩個按鈕之間的間距 (手機 8px / 桌機 16px)
}

/* ================================
   時刻按鈕樣式
   ================================ */
.time-btn {
  border-radius: var(--app-radius); // 導用全站圓角規範
  font-size: var(--app-font-size-base); // 16px/18px 響應式字體
  padding: 6px 16px; // 依據設計稿比例設定內距
  min-width: 85px; // 確保時間按鈕不會因為數字微差而寬度跳動
  letter-spacing: 1px;
  transition: all 0.2s ease; // 平滑過渡

  /* --- 1. 預設狀態 (Default) --- */
  &.is-default {
    background: transparent;
    border: 1px solid v.$white;
    color: v.$white;

    // 桌機端 Hover 時稍微暗示可點擊 (變成藍框)
    @include hover-focus {
      border-color: v.$vieshow-primary;
      color: v.$vieshow-primary;
    }
  }

  /* --- 2. 點擊瞬間 (Press) --- */
  &.is-pressed {
    background: v.$vieshow-primary !important; // 填滿威秀藍
    border-color: v.$vieshow-primary !important;
    color: v.$white !important;
  }

  /* --- 3. 滿位無法點擊狀態 (Unable) --- */
  &.is-unable {
    background: v.$vieshow-secondary-emp; // 對齊深灰底色 #4A4A4A
    border: 1px solid transparent; // 保持原本邊框的物理體積，避免跑版
    color: v.$vieshow-secondary; // 淺灰文字 #9E9E9E
    cursor: not-allowed;
  }
}

/* ================================
   座位預覽按鈕樣式
   ================================ */
.seat-btn {
  background: transparent;
  border: none;
  padding: 0;
  font-size: 1.2rem; // 讓沙發圖示大一點點
  transition: all 0.2s ease;
  cursor: pointer;

  &.is-default {
    color: v.$vieshow-tertiary; // 預設為淺灰色 #C9C9C9

    @include hover-focus {
      color: v.$vieshow-primary;
    }
  }

  &.is-pressed {
    // 根據設計稿，連動點擊時沙發也是藍色，但稍微深一點
    color: v.$vieshow-primary-dark !important; 
  }

  &.is-unable {
    color: v.$vieshow-secondary-emp; // 滿位時沙發變成很深的灰色
    cursor: not-allowed;
  }
}
</style>