<!--使用方式：

<PrimaryButton>立即訂票</PrimaryButton>

<PrimaryButton status="warning">取消訂單</PrimaryButton>

<PrimaryButton status="unable" is-disabled>尚未開放</PrimaryButton>

<PrimaryButton status="secondary">返回列表</PrimaryButton>

 -->

<template>
  <button
    class="btn d-inline-flex align-items-center justify-content-center text-nowrap"
    :class="[variant, { disabled: isDisabled }]"
    :disabled="isDisabled"
    @click="$emit('click')"
  >
    <span class="ls-wide">
      <slot>主按鈕</slot>
    </span>
  </button>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  // 💡 狀態對應：default (主色), warning (警告), secondary (次要)
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

// 💡 轉化為符合 Bootstrap 命名規範的變體類別
const variant = computed(() => `btn-${props.status}`);
</script>

<style scoped lang="scss">
.btn {
  /* --- 1. 響應式基礎設定 (呼叫 :root 變數) --- */

  // 💡 圓角：自動切換手機 8px / 電腦 16px [cite: 31, 148]
  border-radius: var(--app-radius) !important;

  // 💡 內距：使用手冊規範的主按鈕大型 Padding (12px 24px) [cite: 41, 101]
  padding: v.$btn-padding-y-lg v.$btn-padding-x-lg;

  // 💡 字體大小：自動切換手機 18px / 電腦 20px (H6 基準) [cite: 29, 32]
  font-size: var(--app-font-size-h6) !important;
  font-weight: v.$font-weight-semibold !important;

  transition: all 0.2s ease;
  border: none;
  color: v.$white;

  /* --- 2. 狀態色彩規範 (使用語意化變數) --- */

  // Default (品牌藍漸層) [cite: 22, 160]
  &.btn-default {
    background: v.$vieshow-primary;
  }

  // Warning (警告紅) [cite: 24, 162]
  &.btn-warning {
    background:
      linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), v.$vieshow-danger;
    box-shadow: inset 0 0 0 1px v.$vieshow-danger;
  }

  // Secondary (深灰色) [cite: 23]
  &.btn-secondary {
    background: v.$vieshow-secondary;
  }

  /* --- 3. 交互行為與防呆 --- */

  // 💡 禁用狀態 [cite: 127]
  &:disabled,
  &.disabled {
    background: v.$vieshow-secondary-emp !important; // #4A4A4A [cite: 161]
    opacity: 0.6;
    cursor: not-allowed;
    pointer-events: none; // 禁止點擊事件觸發 [cite: 15]
    transform: none !important;
  }

  // 💡 Press (按壓感)：實現縮小壓入感與深色反饋
  &:active:not(:disabled) {
    transform: scale(0.98) translateZ(0);
    filter: brightness(0.9);
  }

  // 💡 桌機端 Hover：使用預防針 Mixin，避免手機殘留
  @include v.hover-focus {
    filter: brightness(1.05);
    box-shadow: v.$box-shadow; // 品牌標準陰影 [cite: 80]
  }
}
</style>
