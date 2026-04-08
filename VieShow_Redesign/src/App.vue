<script setup>
import { ref } from "vue";
import FilterButton from "@/components/Booking/FastBooking/Button/FilterButton.vue";

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

<style lang="scss">
@import "@/assets/scss/variables";

:root {
  font-family: v.$font-family-base;
}

body {
  background: v.$vieshow-gradient-dark;
}
</style>