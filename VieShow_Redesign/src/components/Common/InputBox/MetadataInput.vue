<template>
  <div class="metadata-input-wrapper d-flex align-items-center w-100 border border-secondary-emphasis rounded-lg bg-dark-section overflow-hidden">
    
    <div class="label-box px-3 d-flex align-items-center justify-content-center border-end border-secondary-emphasis">
      <span class="text-tertiary fs-6 fw-medium text-nowrap">{{ label }}</span>
    </div>

    <input
      :type="type"
      :value="modelValue"
      @input="e => emit('update:modelValue', e.target.value)"
      :placeholder="placeholder"
      class="flex-grow-1 bg-transparent border-0 text-white px-3 shadow-none h-100"
    />
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: { type: [String, Number], default: '' },
  label: { type: String, default: '標籤' },
  type: { type: String, default: 'text' },
  placeholder: { type: String, default: '' }
});

const emit = defineEmits(['update:modelValue']);
</script>

<style lang="scss" scoped>
// 這裡我們只寫 BS 沒辦法直接用 Class 達成的「特殊邏輯」
.metadata-input-wrapper {
  height: 48px; // 這是特定的設計稿高度
  transition: border-color 0.2s;

  // 4. 利用 focus-within 達成：當內層 input 被點擊，外層框變藍色 [cite: 116]
  &:focus-within {
    border-color: var(--bs-primary) !important; 
  }
}

.label-box {
  min-width: 100px; // 確保標籤寬度一致
}

// 針對 Placeholder 的顏色微調，BS 預設較淺
input::placeholder {
  color: var(--bs-secondary) !important;
  opacity: 0.7;
}
</style>