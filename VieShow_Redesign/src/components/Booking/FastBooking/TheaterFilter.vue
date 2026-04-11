<template>
  <div class="theater-filter-container">
    <div class="d-flex align-items-center mb-3">
      <AreaSelector v-model="selectedRegionId" @change="handleRegionChange" />
    </div>

    <div class="filter-scroll-container">
      <div class="filter-buttons-wrapper d-flex">
        <FilterButton
          v-for="theater in currentRegionTheaters"
          :key="theater"
          :label="theater"
          class="filter-item"
          

          :active="modelValue === theater"
          
          @click="selectTheater(theater)"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useCinemaStore } from "@/store/cinema";
import FilterButton from "./Button/FilterButton.vue";
import AreaSelector from "./AreaSelector.vue"; 
// 💡 修正致命錯誤：將兩次宣告合併為一次，並賦值給 props 與 emit 變數以供後續使用
const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
});

// 💡 補上這一行！讓子組件可以發送事件給父層 (FastBooking)
const emit = defineEmits(["update:modelValue"]);

const cinemaStore = useCinemaStore();

// 💡 1. 預設選中區域：改為優先從 Store 讀取，否則預設雙北
const selectedRegionId = ref(cinemaStore.selectedRegion || "north");

// 💡 2. 核心魔法：監聽父層傳來的影城名稱，自動反推並切換「區域頁籤」
watch(() => props.modelValue, (newVal) => {
  if (!newVal) return;
  // 找出這個影城屬於哪個區域
  const region = cinemaStore.cinemaList.find(r => r.theaters.includes(newVal));
  if (region) {
    selectedRegionId.value = region.id; // 讓畫面上的 AreaSelector 跳過去
    cinemaStore.selectedRegion = region.id; // 同步回 Store
  }
}, { immediate: true });

// 計算屬性：自動過濾出「當前選中區域」的影城清單
const currentRegionTheaters = computed(() => {
  const region = cinemaStore.cinemaList.find(
    (r) => r.id === selectedRegionId.value,
  );
  return region ? region.theaters : [];
});

// 處理影城點擊，發送給父層更新 (觸發 v-model)
const selectTheater = (name) => {
  emit("update:modelValue", name);
};

// 當使用者切換區域 (例如從雙北切到桃竹苗) 時，自動選中該區域的第一個影城
const handleRegionChange = () => {
  if (currentRegionTheaters.value.length > 0) {
    emit("update:modelValue", currentRegionTheaters.value[0]);
  } else {
    emit("update:modelValue", "");
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