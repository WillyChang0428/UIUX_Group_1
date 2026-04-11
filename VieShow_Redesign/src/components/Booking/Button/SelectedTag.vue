<template>
  <div class="selected-tag d-inline-flex align-items-center justify-content-center">
    <span>{{ seat.rowLabel }}排{{ seat.colLabel }}號</span>
  </div>
</template>

<script setup>
defineProps({
  // 接收來自 bookingStore.selectedSeats 的單一座位物件
  seat: {
    type: Object,
    required: true,
  }
});
</script>

<style scoped lang="scss">
@import "@/assets/scss/variables";


.selected-tag {
  // 💡 內距：上下使用較小的 xs (4px/8px)，左右使用 sm (8px/16px) 以呈現膠囊形狀
  padding: var(--gap-xs) var(--gap-md); 
  
  // 💡 邊框：使用品牌主色 v.$vieshow-primary (#2F96EE) 
  border: 2px solid v.$vieshow-primary; 
  
  // 💡 圓角：使用膠囊型圓角 (999px)
  border-radius: v.$border-radius-pill; 
  
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.60) 0%, rgba(0, 0, 0, 0.60) 100%), v.$vieshow-primary;
  
  // 💡 文字：白色，並自動套用響應式基礎字體大小 (手機 16px / 電腦 18px)
  color: v.$white;
  font-size: var(--app-font-size-base); 
  letter-spacing: 1px; // 稍微拉開字距增加質感
  white-space: nowrap; // 避免標籤內的文字斷行
  
  // 增加微過渡動畫，若未來需加上點擊取消功能會更流暢
  transition: all 0.3s ease;
}
</style>