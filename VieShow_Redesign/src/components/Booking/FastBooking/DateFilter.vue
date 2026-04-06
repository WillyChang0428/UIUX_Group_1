<template>
  <div class="date-filter-container">
    <div class="filter-scroll-container">
      <div class="filter-buttons-wrapper d-flex">
        <FilterButton
          v-for="dateObj in availableDates"
          :key="dateObj.value"
          :active="selectedDate === dateObj.value"
          class="filter-item date-btn"
          @toggle="selectDate(dateObj.value)"
        >
          <div class="d-flex flex-column align-items-center gap-1">
            <span class="date-text fw-bold">{{ dateObj.displayDate }}</span>
            <span class="day-text">{{ dateObj.displayDay }}</span>
          </div>
        </FilterButton>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import FilterButton from './Button/FilterButton.vue';

// 建立日期陣列與選取狀態
const availableDates = ref([]);
const selectedDate = ref('');

// 💡 產生今日起算 7 天 (今天 + 未來 6 天) 的函數
const generateDates = () => {
  const dates = [];
  const daysMap = ['(日)', '(一)', '(二)', '(三)', '(四)', '(五)', '(六)'];
  
  // 取得當下時間
  const today = new Date();

  for (let i = 0; i < 7; i++) {
    // 透過迴圈逐日往後推算
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + i);

    const month = targetDate.getMonth() + 1;
    const date = targetDate.getDate();
    const dayName = daysMap[targetDate.getDay()];
    
    // 產生唯一值供 v-model / 狀態比對使用 (例如: 2026-04-07)
    const year = targetDate.getFullYear();
    const valueString = `${year}-${String(month).padStart(2, '0')}-${String(date).padStart(2, '0')}`;

    dates.push({
      displayDate: `${month}/${date}`, // 顯示用的日期 (如 3/23)
      displayDay: dayName,             // 顯示用的星期 (如 (一))
      value: valueString               // 實際傳遞給後端的真實日期
    });
  }
  
  return dates;
};

// 元件掛載時初始化資料
onMounted(() => {
  availableDates.value = generateDates();
  // 預設選中今天 (陣列的第一筆資料)
  if (availableDates.value.length > 0) {
    selectedDate.value = availableDates.value[0].value;
  }
});

// 處理選擇邏輯
const selectDate = (val) => {
  selectedDate.value = val;
};
</script>

<style scoped lang="scss">
/* 💡 引入變數地基以調用全域響應式變數 [cite: 239, 264] */
@import "@/assets/scss/variables";

.date-filter-container {
  width: 100%;
  max-width: 100%;

  .filter-label {
    // 💡 輔助文 (Sm) 字體：手機 14px / 電腦 16px [cite: 307]
    font-size: var(--app-font-size-sm); 
    color: v.$vieshow-secondary; // #9E9E9E [cite: 260]
    text-transform: lowercase;
  }

  /* --- 捲動容器設定 --- */
  .filter-scroll-container {
    width: 100%;
    
    // 📱 手機版：開啟原生橫向滑動
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    
    &::-webkit-scrollbar {
      display: none; // 隱藏捲軸
    }

    // 💻 桌機版 (768px 以上)：關閉捲動限制
    @include media-breakpoint-up(md) {
      overflow: visible;
    }
  }

  /* --- 排列與間距設定 --- */
  .filter-buttons-wrapper {
    display: flex;
    padding-bottom: 10px; // 預留手機版的藍色發光陰影空間

    // 📱 手機版：不折行，採用較大間距 var(--gap-md) 提供觸控緩衝 [cite: 293]
    flex-wrap: nowrap;
    gap: var(--gap-md);

    // 💻 桌機版：折行，採用縮小的精緻間距 var(--gap-sm) 
    @include media-breakpoint-up(md) {
      flex-wrap: wrap;
      gap: var(--gap-sm); 
      padding-bottom: 0;
    }
  }

  /* --- 單一按鈕微調 --- */
  .filter-item {
    flex-shrink: 0; // 手機版防止被擠壓
    
    @include media-breakpoint-up(md) {
      flex-shrink: 1; // 桌機版允許自適應
    }
  }

  /* 💡 針對日期按鈕內部的微調 */
  .date-btn {
    min-width: 72px; // 給予一個最小寬度讓按鈕看起來接近正方形，對齊圖一比例
    
    .date-text {
      font-size: 1.1em;
      line-height: 1.2;
    }
    
    .day-text {
      font-size: 0.9em;
      line-height: 1.2;
    }
  }
}
</style>