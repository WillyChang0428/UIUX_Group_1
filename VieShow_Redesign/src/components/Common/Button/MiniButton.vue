<!--使用方式：

<MiniButton>立即訂票</MiniButton>

<MiniButton status="warning">取消訂單</MiniButton>

<MiniButton status="unable" is-disabled>尚未開放</MiniButton>

<MiniButton status="secondary">返回列表</MiniButton>

 -->

<template>
  <button
    class="btn d-inline-flex align-items-center justify-content-center text-nowrap"
    :class="[variant, { disabled: isDisabled }]"
    :disabled="isDisabled"
    @click="$emit('click')"
  >
    <span class="ls-wide">
      <slot>次按鈕</slot>
    </span>
  </button>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  // 狀態選擇：default, warning, secondary [cite: 160-162]
  status: {
    type: String,
    default: "default",
  },
  isDisabled: {
    type: Boolean,
    default: false,
  },
});

defineEmits(["click"]);

// 根據 status 轉化為符合 Bootstrap 命名規範的變體類別
const variant = computed(() => `btn-${props.status}`);
</script>

<style scoped lang="scss">
.btn {
  /* --- 1. 響應式基礎設定 (呼叫 :root 全域變數) [cite: 2, 6, 52] --- */

  // 💡 圓角：自動切換 手機 8px / 電腦 16px [cite: 4, 31, 148]
  border-radius: var(--app-radius) !important;

  // 💡 內距：對應 Figma Token 之小型 Padding [cite: 40-42, 101]
  padding: v.$btn-padding-y-sm v.$btn-padding-x-sm;

  font-size: var(--app-font-size-sm) !important;
  font-weight: v.$font-weight-medium !important;

  transition: all 0.2s ease;
  border: none;
  color: v.$white;

  /* --- 2. 狀態色彩規範 (使用語意化變數) [cite: 23, 159] --- */

  // Default (品牌藍) [cite: 22, 160]
  &.btn-default {
    background: v.$vieshow-primary;
  }

  // 💡 禁用狀態：使用二級強調灰與防呆邏輯 [cite: 23, 127, 161]
  &:disabled,
  &.disabled {
    background-color: v.$vieshow-secondary-emp !important;
    cursor: not-allowed;
    opacity: 0.6;
    pointer-events: none; // 禁止所有滑鼠事件 [cite: 15, 127]

    &:active {
      transform: none !important;
    }
  }

  // 💡 Press (按壓感)：實現縮小壓入感與深色反饋 [cite: 127]
  &:active:not(:disabled) {
    transform: scale(0.98) translateZ(0);
    filter: brightness(0.9);
  }

  // Warning (警告紅) [cite: 24, 162]
  &.btn-warning {
    background:
      linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), v.$vieshow-danger;
    box-shadow: inset 0 0 0 1px v.$vieshow-danger;
  }

  // Secondary (深灰色) [cite: 23, 161]
  &.btn-secondary {
    background: v.$vieshow-secondary;
  }

  /* --- 3. 互動細節 --- */

  // 💡 桌機端 Hover：使用預防針 Mixin，避免手機殘留背景色
  @include v.hover-focus {
    filter: brightness(1.05);
    box-shadow: v.$box-shadow-sm;
  }
}
</style>
