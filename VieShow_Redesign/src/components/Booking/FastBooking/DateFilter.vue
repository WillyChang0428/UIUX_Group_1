<template>
  <div class="date-filter-container">
    <div class="filter-scroll-container">
      <div class="filter-buttons-wrapper d-flex">
        <FilterButton
          v-for="dateObj in availableDates"
          :key="dateObj.value"
          :active="modelValue === dateObj.value"
          class="filter-item date-btn"
          @toggle="selectDate(dateObj)"
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
import FilterButton from './Button/FilterButton.vue'; // 請確認您的路徑是否正確

// 💡 接收父層傳來的 v-model
const props = defineProps(['modelValue']);
const emit = defineEmits(['update:modelValue', 'change-day']);

const availableDates = ref([]);

const generateDates = () => {
  const dates = [];
  const daysMap = ['(日)', '(一)', '(二)', '(三)', '(四)', '(五)', '(六)'];
  const fullDaysMap = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']; // 完整星期供 Sessions 使用
  
  const today = new Date();

  for (let i = 0; i < 7; i++) {
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + i);

    const month = targetDate.getMonth() + 1;
    const date = targetDate.getDate();
    const dayName = daysMap[targetDate.getDay()];
    const fullDayName = fullDaysMap[targetDate.getDay()];
    
    const year = targetDate.getFullYear();
    const valueString = `${year}-${String(month).padStart(2, '0')}-${String(date).padStart(2, '0')}`;

    dates.push({
      displayDate: `${month}/${date}`, 
      displayDay: dayName,             
      value: valueString,
      fullDayName: fullDayName // 存入完整星期
    });
  }
  return dates;
};

onMounted(() => {
  availableDates.value = generateDates();
  // 預設選中今天 (陣列的第一筆資料)
  if (availableDates.value.length > 0) {
    selectDate(availableDates.value[0]);
  }
});

const selectDate = (dateObj) => {
  // 💡 同時發送更新的日期數值，以及完整的「星期X」字串給父層
  emit('update:modelValue', dateObj.value);
  emit('change-day', dateObj.fullDayName);
};
</script>

<style scoped lang="scss">
@import "@/assets/scss/variables";

.date-filter-container {
  width: 100%;
  max-width: 100%;

  .filter-label {
    font-size: var(--app-font-size-sm); 
    color: v.$vieshow-secondary;
    text-transform: lowercase;
  }

  /* --- 捲動容器設定 --- */
  .filter-scroll-container {
    width: 100%;
    
    // 手機版開啟原生橫向滑動
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    
    &::-webkit-scrollbar {
      display: none; 
    }

    @include media-breakpoint-up(md) {
      overflow: visible;
    }
  }

  /* --- 排列與間距設定 --- */
  .filter-buttons-wrapper {
    display: flex;
    padding-bottom: 10px;

    flex-wrap: nowrap;
    gap: var(--gap-md);

    @include media-breakpoint-up(md) {
      flex-wrap: wrap;
      gap: var(--gap-sm); 
      padding-bottom: 0;
    }
  }

  /* --- 單一按鈕微調 --- */
  .filter-item {
    flex-shrink: 0;
    
    @include media-breakpoint-up(md) {
      flex-shrink: 1;
    }
  }

  /* 針對日期按鈕內部的微調 */
  .date-btn {
    min-width: 72px; 
    
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