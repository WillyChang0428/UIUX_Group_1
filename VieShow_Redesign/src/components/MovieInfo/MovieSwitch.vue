<template>
  <div class="switch d-flex justify-content-center align-items-center">
    <div class="container p-0">
      <div
        class="toggle-container d-flex justify-content-center align-items-center gap-3 w-100"
      >
        <button
          type="button"
          class="toggle-btn flex-fill"
          :class="{ active: modelValue === 'now' }"
          @click="$emit('update:modelValue', 'now')"
        >
          熱售中
        </button>

        <button
          type="button"
          class="toggle-btn flex-fill"
          :class="{ active: modelValue === 'upcoming' }"
          @click="$emit('update:modelValue', 'upcoming')"
        >
          即將上映
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
// 定義 props 以接收 v-model 的值
defineProps({
  modelValue: {
    type: String,
    default: "now",
  },
});

// 定義 emit 以更新父組件的值
defineEmits(["update:modelValue"]);
</script>

<style lang="scss" scoped>
// 引用變數 (視你的專案路徑而定)
@import "@/assets/scss/variables";

.switch {
  // background: v.$vieshow-gradient-dark;
  padding: v.$spacing-lg-mobile 0;
  height: 104px;
}

.toggle-btn {
  // --- 關鍵修改：強迫兩顆按鈕平分寬度 ---
  flex: 1 1 0px !important; // 強制分配比例 1:1，無視內容長度
  width: 0; // 配合 flex-basis: 0 使用
  border: none;
  border-radius: v.$border-radius-lg-mobile;
  color: v.$light;
  background: rgba(v.$light, 0.1);
  cursor: pointer;
  height: v.$spacing-2xl-mobile; // 統一高度
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  font-size: v.$h6-font-size-mobile;
  transition: all 0.3s ease;
  white-space: nowrap;
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
