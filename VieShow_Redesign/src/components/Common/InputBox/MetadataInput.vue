<script setup>
const props = defineProps({
  modelValue: { type: [String, Number], default: '' },
  label: { type: String, default: '標籤' }, // 左側文字
  type: { type: String, default: 'text' },
  placeholder: { type: String, default: '' }
});

const emit = defineEmits(['update:modelValue']);
</script>

<template>
  <div class="metadata-input-group d-flex align-items-center w-100">
    <div class="label-box px-3 d-flex align-items-center justify-content-center">
      <span class="label-text">{{ label }}</span>
    </div>

    <input
      :type="type"
      :value="modelValue"
      @input="e => emit('update:modelValue', e.target.value)"
      :placeholder="placeholder"
      class="flex-grow-1 custom-input px-3"
    />
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/scss/variables";

.metadata-input-group {
  // 1. 外框與圓角 [cite: 124-125]
  border: 1px solid v.$vieshow-secondary-emp;
  border-radius: v.$border-radius-lg; // 16px
  background-color: v.$vieshow-dark-section; // #2C2C2C
  overflow: hidden; // 確保內層元件不超出圓角
  height: 48px; // 根據設計稿高度
  transition: border-color 0.2s;

  &:focus-within {
    border-color: v.$vieshow-primary; // Focus 時變藍色 [cite: 116]
  }
}

.label-box {
  min-width: 100px;
  height: 100%;
  border-right: 1px solid v.$vieshow-secondary-emp; // 分隔線
  background-color: transparent;
}

.label-text {
  color: v.$vieshow-tertiary; // #C9C9C9 [cite: 117]
  font-size: v.$font-size-base; // 18px [cite: 126]
  white-space: nowrap;
}

.custom-input {
  background: transparent;
  border: none;
  color: v.$white;
  height: 100%;
  font-size: v.$font-size-base;

  &:focus {
    outline: none;
  }

  &::placeholder {
    color: v.$vieshow-secondary;
  }
}
</style>