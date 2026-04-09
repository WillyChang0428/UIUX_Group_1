<!-- 使用方式:
<script setup>
import { ref } from "vue";
import FilterButton from "@/components/Booking/FastBooking/FilterButton.vue";

// 💡 建立響應式變數來追蹤選取狀態 [cite: 143]
const isActive = ref(false);

// 💡 處理點擊切換邏輯
const handleToggle = () => {
  isActive.value = !isActive.value;
};
</script>

<template>
  <FilterButton 
    label="台北信義" 
    :active="isActive" 
    @toggle="handleToggle" 
  />
</template> -->

<template>
  <button class="filter-btn d-inline-flex align-items-center justify-content-center" :class="{ 'is-active': active }"
    @click="$emit('toggle')">
    <slot>{{ label }}</slot>
  </button>
</template>

<script setup>
defineProps({
  label: {
    type: String,
    default: "標籤文字",
  },
  active: {
    type: Boolean,
    default: false,
  },
});

defineEmits(["toggle"]);
</script>

<style lang="scss">
/* 💡 引入變數地基，確保能使用 v.$ 語法抓取變數 [cite: 62, 140] */
@import "@/assets/scss/variables";

.filter-btn {
  /* --- 1. 基礎尺寸與排版 --- */
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;

  // 💡 文字大小與行高：按照手冊規範使用自動縮放變數 [cite: 81, 91]
  // 手機版自動對應 16px (16pt)，電腦版自動放大為 18px
  font-size: var(--app-font-size-base);
  line-height: v.$line-height-relaxed; // 對應手冊中的小字行高規範

  // 💡 內距設定：對應手冊等級 (8px/16px 與 12px/24px) [cite: 66, 68]
  // padding-y 使用 var(--gap-sm) (8px/16px) [cite: 67]
  // padding-x 使用 var(--gap-md) (16px/32px) 或依設計稿微調 [cite: 68]
  padding: var(--gap-sm) var(--gap-md);

  /* --- 2. 預設狀態 (Default) [cite: 97, 114] --- */
  background-color: v.$vieshow-dark-section; // 語意化名稱：#2C2C2C
  color: v.$white;
  /* 呼叫全域變數：自動縮放圓角 (手機 8px / 電腦 16px)  */
  border-radius: var(--app-radius);

  /* --- 3. 選中狀態 (Choosed) --- */
  &.is-active {
    background-color: v.$white;
    color: v.$vieshow-primary; // 語意化名稱：威秀藍 #2F96EE
    font-weight: v.$font-weight-bold; // 700 [cite: 48]

    /* 💡 使用品牌色變數製作陰影發光感 [cite: 59] */
    box-shadow: 0 var(--gap-sm) 15px rgba(v.$vieshow-primary, 0.5) !important;
  }

  /* 💡 桌機版 Hover 預防針：僅在支援滑鼠的裝置觸發 [cite: 130, 131] */
  @include v.hover-focus {
    opacity: 0.8;
  }
}
</style>
