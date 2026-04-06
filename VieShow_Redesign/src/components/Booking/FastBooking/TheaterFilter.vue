<template>
  <div class="theater-filter-container">
    <div class="d-flex align-items-center mb-3">
      <AreaSelector 
        v-model="selectedRegionId" 
        @change="handleRegionChange"
      />
    </div>

    <div class="filter-scroll-container">
      <div class="filter-buttons-wrapper d-flex">
        <FilterButton
          v-for="theater in currentRegionTheaters"
          :key="theater"
          :label="theater"
          :active="selectedTheater === theater"
          class="filter-item"
          @toggle="selectTheater(theater)"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useCinemaStore } from '@/store/cinema';
import FilterButton from './Button/FilterButton.vue';
import AreaSelector from './AreaSelector.vue'; // 💡 引入新組件

const cinemaStore = useCinemaStore();

// 💡 預設選中區域：'north' (雙北)
const selectedRegionId = ref('north');

// 💡 計算屬性：自動過濾出「當前選中區域」的影城清單
const currentRegionTheaters = computed(() => {
  const region = cinemaStore.cinemaList.find(r => r.id === selectedRegionId.value);
  return region ? region.theaters : [];
});

// 預設選中的影城
const selectedTheater = ref('台北信義');

// 處理影城點擊
const selectTheater = (name) => {
  selectedTheater.value = name;
};

// 💡 當使用者切換區域時，自動將預設影城切換為該區域的第一個影城
const handleRegionChange = () => {
  if (currentRegionTheaters.value.length > 0) {
    selectedTheater.value = currentRegionTheaters.value[0];
  } else {
    selectedTheater.value = '';
  }
};
</script>

<style scoped lang="scss">
@import "@/assets/scss/variables";

.theater-filter-container {
  width: 100%;
  max-width: 100%;

  /* --- 捲動容器設定 --- */
  .filter-scroll-container {
    width: 100%;
    
    // 📱 預設 (手機版)：開啟橫向捲動
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    
    &::-webkit-scrollbar {
      display: none;
    }

    // 💻 桌機版 (md 768px 以上)：關閉捲動
    @include media-breakpoint-up(md) {
      overflow: visible;
    }
  }

  /* --- 按鈕群組排列設定 --- */
  .filter-buttons-wrapper {
    display: flex;
    padding-bottom: 10px;

    // 📱 預設 (手機版)：不折行，間距較大
    flex-wrap: nowrap;
    gap: var(--gap-md);

    // 💻 桌機版 (md 768px 以上)：恢復折行，縮小間距
    @include media-breakpoint-up(md) {
      flex-wrap: wrap;
      gap: var(--gap-sm); 
      padding-bottom: 0;
    }
  }

  /* --- 單一按鈕防變形設定 --- */
  .filter-item {
    flex-shrink: 0; 
    white-space: nowrap;
    
    @include media-breakpoint-up(md) {
      flex-shrink: 1;
    }
  }
}
</style>