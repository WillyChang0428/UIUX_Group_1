<template>
  <BaseModal v-model="isVisible" type="base">
    
    <template #title>{{ theaterName }} - {{ hallNumber }}廳</template>
    
    <template #content>
      <div class="seat-preview-body">
        
        <div class="screen-wrapper d-flex flex-column align-items-center mb-4">
          <div class="screen-curve"></div>
          <div class="screen-text fw-bold">螢幕</div>
        </div>

        <div class="seat-map-container pointer-events-none d-flex flex-column align-items-center">
          <div 
            v-for="(row, rIndex) in seatLayout" 
            :key="rIndex" 
            class="seat-row d-flex"
          >
            <template v-for="(seatCode, cIndex) in row" :key="cIndex">
              <div v-if="seatCode === 0" class="aisle"></div>
              <SeatButton 
                v-else 
                size="sm" 
                :state="getSeatState(seatCode)" 
              />
            </template>
          </div>
        </div>

        <div class="legend-wrapper d-flex justify-content-center align-items-center mt-5">
          <div class="legend-item">
            <SeatButton size="sm" state="available" class="pointer-events-none" />
            <span>空位</span>
          </div>
          <div class="legend-item">
            <SeatButton size="sm" state="sold" class="pointer-events-none" />
            <span>佔位</span>
          </div>
          <div class="legend-item">
            <SeatButton size="sm" state="wheelchair" class="pointer-events-none" />
            <span>輪椅位</span>
          </div>
        </div>

      </div>
    </template>
  </BaseModal>
</template>

<script setup>
import { ref, watch } from 'vue';
import BaseModal from '@/components/Common/Button/BaseModal.vue';
import SeatButton from '@/components/Booking/Button/SeatButton.vue';

// 接收父組件的 v-model 狀態
const isVisible = defineModel({ type: Boolean, default: false });

const props = defineProps({
  theaterName: {
    type: String,
    default: '台北信義' // 預設影城
  }
});

const hallNumber = ref(1);

// 💡 當視窗打開時，隨機生成 1~12 的影廳數字
watch(isVisible, (newVal) => {
  if (newVal) {
    hallNumber.value = Math.floor(Math.random() * 12) + 1;
  }
});

/* 💡 模擬圖二的座位矩陣
  代碼意義：0 = 走道, 1 = 空位(available), 2 = 佔位(sold), 3 = 輪椅(wheelchair)
*/
const seatLayout = [
  [1, 1, 0, 1, 3, 3, 1, 1, 1, 0, 1, 1],
  [1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1],
  [1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1],
  [1, 1, 0, 1, 1, 2, 2, 2, 1, 0, 1, 1],
  [2, 2, 0, 1, 1, 1, 2, 1, 2, 0, 1, 1],
  [1, 1, 0, 1, 2, 2, 1, 1, 1, 0, 1, 1],
  [2, 1, 0, 2, 1, 2, 1, 1, 1, 0, 1, 1],
  [1, 2, 0, 1, 2, 1, 1, 1, 2, 0, 1, 1],
  [2, 2, 0, 2, 2, 2, 2, 2, 2, 0, 2, 2]
];

// 將數字代碼轉換為 SeatButton 需要的 state 字串
const getSeatState = (code) => {
  if (code === 3) return 'wheelchair';
  if (code === 2) return 'sold';
  return 'available';
};
</script>

<style scoped lang="scss">
@import "@/assets/scss/variables";

.seat-preview-body {
  padding: var(--gap-md) 0;

  // --- 1. 螢幕曲線設計 ---
  .screen-wrapper {
    position: relative;
    
    .screen-curve {
      width: 80%;
      height: 20px;
      // 💡 利用 Vieshow Warning (黃色) 繪製螢幕發光線條 [cite: 54]
      border-top: 4px solid v.$vieshow-warning;
      border-radius: 50% / 100% 100% 0 0;
      filter: drop-shadow(0px 3px 3px rgba(v.$vieshow-warning, 0.4));
    }

    .screen-text {
      color: v.$vieshow-warning;
      margin-top: 8px;
      letter-spacing: 2px;
      font-size: var(--app-font-size-base);
    }
  }

  // --- 2. 座位圖排版 ---
  .pointer-events-none {
    pointer-events: none; // 這是預覽圖，防止使用者點擊
  }

  .seat-row {
    gap: 4px; // 座位間的水平間距
    margin-bottom: 6px; // 排與排的垂直間距
  }

  .aisle {
    width: 20px; // 走道寬度
  }

  // --- 3. 圖例說明 ---
  .legend-wrapper {
    gap: var(--gap-lg); // 圖例間的間距

    .legend-item {
      display: flex;
      align-items: center;
      gap: 8px; // Icon 與文字的間距
      color: v.$white;
      font-size: var(--app-font-size-sm);
    }
  }
}
</style>