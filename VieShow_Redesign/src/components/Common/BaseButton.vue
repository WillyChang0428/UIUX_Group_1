<template>
  <button 
    class="base-btn" 
    :class="[variant, { 'disabled': isDisabled }]"
    :disabled="isDisabled"
    @click="$emit('click')"
  >
    <slot>主按鈕</slot>
  </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  // 狀態選擇：default, unable, press, warning, secondary
  status: {
    type: String,
    default: 'default'
  },
  // 是否禁用
  isDisabled: {
    type: Boolean,
    default: false
  }
})

defineEmits(['click'])

// 根據 status 轉化為 CSS class
const variant = computed(() => `btn-${props.status}`)
</script>

<style scoped lang="scss">
.base-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 24px;
  border-radius: 8px; // 根據設計稿調整圓角
  border: none;
  color: white;
  font-weight: 500;
  font-size: v.$font-size-base;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 100px;
  letter-spacing: 0.1em;

  // 1. Default (品牌藍漸層)
  &.btn-default {
    background: v.$vieshow-primary;
  }

  // 2. Unable (禁用灰色)
  &.btn-unable, &:disabled {
    background-color: #C0C0C0; // 或 v.$vieshow-secondary-emp
    cursor: not-allowed;
    opacity: 0.8;
  }

  // 3. Press (深藍色)
  &.btn-press, &:active {
    background: v.$vieshow-primary; // 比品牌藍更深的顏色
    transform: scale(0.96);
  }

  // 4. Warning (警告紅)
  &.btn-warning {
    background-color: #8B1A10; // 深紅色系
  }

  // 5. Second Choice (深灰色)
  &.btn-secondary {
    background-color: #454545;
  }

  // 桌機端 Hover 微光效果
  @include v.hover-focus {
    filter: brightness(1.1);
  }
}
</style>

<!--使用方式：

<BaseButton>立即訂票</BaseButton>

<BaseButton status="warning">取消訂單</BaseButton>

<BaseButton status="unable" is-disabled>尚未開放</BaseButton>

<BaseButton status="secondary">返回列表</BaseButton>
 -->