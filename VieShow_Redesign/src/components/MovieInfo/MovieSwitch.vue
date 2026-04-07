<template>
  <div class="switch d-flex w-100 d-flex justify-content-center">
    <div class="container d-flex p-0 d-flex justify-content-center">
      <div
        class="toggle-container d-flex justify-content-center align-items-center gap-3 w-100"
      >
        <button
          type="button"
          class="btn toggle-btn flex-fill"
          :class="{ active: activeTab === 'now' }"
          @click="activeTab = 'now'"
        >
          熱售中
        </button>

        <button
          type="button"
          class="btn toggle-btn flex-fill"
          :class="{ active: activeTab === 'upcoming' }"
          @click="activeTab = 'upcoming'"
        >
          即將上映
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

// 定義目前選中的 Tab，預設為 'now' (熱售中)
const activeTab = ref("now");
</script>

<style lang="scss" scoped>
// 引用變數 (視你的專案路徑而定)
@import "@/assets/scss/variables";

.switch {
  background: v.$vieshow-gradient-dark;
  padding: v.$spacing-lg-mobile;
  height: 104px;
}

.toggle-btn {
  border: none;
  border-radius: v.$border-radius-lg-mobile;
  color: v.$light;
  background: rgba(v.$light, 0.1);
  cursor: pointer;
  // padding: v.$btn-padding-x-lg v.$btn-padding-y-lg;
  font-size: v.$h6-font-size-mobile;
  transition: all 0.3s ease; // 平滑的轉換效果

  // 當 Vue 綁定的 .active 成立時的樣式
  &.active {
    background: v.$light !important;
    color: v.$vieshow-primary !important;
    box-shadow: 0 8px 15px -2px rgba(0, 123, 255, 0.85) !important; // 選中時的發光/陰影感
  }

  // 滑鼠懸停效果 (未選中時)
  // &:hover:not(.active) {
  //   // // color: rgba(v.$light, 0.8);
  //   // background-color: rgba(255, 255, 255, 0.05);
  // }
}
</style>
