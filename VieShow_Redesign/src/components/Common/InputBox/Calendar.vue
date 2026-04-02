<script setup>
import { defineProps, defineEmits } from 'vue';
import {VueDatePicker} from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import { ref } from 'vue';

const isMenuOpen = ref(false);

const props = defineProps({
  modelValue: { type: [Date, String], default: null },
  label: { type: String, default: '您的生日' },
  placeholder: { type: String, default: '請選擇日期' }
});

const emit = defineEmits(['update:modelValue']);

// 格式化顯示：把 Date 物件轉為 YYYY/MM/DD
const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return `${d.getFullYear()} / ${String(d.getMonth() + 1).padStart(2, '0')} / ${String(d.getDate()).padStart(2, '0')}`;
};
</script>

<template>
  <div class="calendar-wrapper w-100">
    <VueDatePicker
      :model-value="modelValue"
      @update:model-value="val => emit('update:modelValue', val)"
      :time-config="{ enableTimePicker: false }" 
      auto-apply
      :dark="true"
      model-type="yyyy/MM/dd"
      :teleport="false"
      @open="isMenuOpen = true"   
      @closed="isMenuOpen = false"
    >

    <template #trigger>
      <div 
        class="metadata-input-wrapper d-flex align-items-center w-100 border rounded-lg bg-dark-section overflow-hidden" 
        :class="{ 'is-active': isMenuOpen }"
      >
        
        <div class="label-box px-3 h-100 d-flex align-items-center justify-content-center">
          <span class="text-tertiary fs-6 fw-medium text-nowrap">{{ label }}</span>
        </div>

        <div class="flex-grow-1 px-3 text-white d-flex align-items-center justify-content-between">
          <span :class="{ 'text-secondary': !modelValue }">
            {{ modelValue ? formatDate(modelValue) : placeholder }}
          </span>
          <i class="fa-regular fa-calendar-days text-tertiary"></i>
        </div>
      </div>
    </template>
    </VueDatePicker>
  </div>
</template>


<style lang="scss" scoped>
/* 1. 沿用 MetadataInput 的高級感樣式 */
.metadata-input-wrapper {
  height: 48px;
  opacity: 0.7;
  border: 1px solid rgba(v.$light, 0.5) !important;
  transition: all 0.3s ease; // 🌟 確保與 MetadataInput 同步
  cursor: pointer;
  
  &.is-active {
    opacity: 1;
    border-color: v.$light !important;
    box-shadow: 0 0 25px rgba(v.$light, 0.2);

    .label-box::after {
      background-color: rgba(v.$light, 0.5);
    }
  }
}

.label-box {
  min-width: 100px;
  height: 100%;
  position: relative;

  &::after {
    content: "";
    position: absolute;
    right: 0;
    top: 0;
    height: 100%;
    width: 1px;
    background-color: rgba(v.$light, 0.2);
    transition: background-color 0.3s ease;
  }
}

/* 2. 深度自定義 DatePicker 彈出視窗的樣式，對齊 Vueshow 深色主題 */
:deep(.dp__menu) {
  background-color: v.$vieshow-dark-section; // 使用你的深色背景
  border: 1px solid v.$vieshow-secondary-emp;
  border-radius: var(--app-radius);
  font-family: inherit;
}

:deep(.dp__arrow_top) { background-color: v.$vieshow-dark-section; }

/* 選中日期的顏色改為威秀藍 [cite: 116] */
:deep(.dp__active_date), :deep(.dp__today) {
  background: v.$vieshow-primary !important;
  border-radius: 50%;
}

:deep(.dp__cell_inner) {
  color: v.$white;
  &:hover {
    background: rgba(v.$vieshow-primary, 0.2);
    border-radius: 50%;
  }
}
</style>