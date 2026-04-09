<!--使用方式：

<SecondaryButton>立即訂票</SecondaryButton>

<SecondaryButton status="warning">取消訂單</SecondaryButton>

<SecondaryButton status="unable" is-disabled>尚未開放</SecondaryButton>

<SecondaryButton status="secondary">返回列表</SecondaryButton>

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

const variant = computed(() => `btn-${props.status}`);
</script>

<style scoped lang="scss">
.btn {
  /* --- 1. 響應式基礎設定 (使用全域 CSS 變數) [cite: 50] --- */

  // 💡 圓角：自動切換手機 8px / 電腦 16px [cite: 4, 147]
  border-radius: var(--app-radius) !important;

  // 💡 內距：對應 Figma Token 之次按鈕尺寸 (10px 16px) [cite: 40, 59]
  padding: v.$btn-padding-y v.$btn-padding-x;

  // 💡 字體：自動切換手機 16px / 電腦 18px [cite: 29, 143]
  font-size: var(--app-font-size-base) !important;
  font-weight: v.$font-weight-medium !important;

  transition: all 0.2s ease;
  border: none;
  color: v.$white;

  /* --- 2. 狀態色彩規範 (使用語意化變數) [cite: 158] --- */

  // Default (品牌藍)
  &.btn-default {
    background: v.$vieshow-primary;
  }

  // 💡 Unable (禁用灰色)
  &:disabled,
  &.disabled {
    background-color: v.$vieshow-secondary-emp !important; // #4A4A4A
    cursor: not-allowed;
    opacity: 0.6;
    pointer-events: none; // 禁止所有事件

    &:active {
      transform: none !important;
    }
  }

  // 💡 Press (按壓感)：實現縮小壓入感與深色反饋
  &:active:not(:disabled) {
    transform: scale(0.98) translateZ(0);
    filter: brightness(0.9);
  }

  // Warning (警告紅)
  &.btn-warning {
    background:
      linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), v.$vieshow-danger;
    box-shadow: inset 0 0 0 1px v.$vieshow-danger;
  }

  // Second Choice (深灰色)
  &.btn-secondary {
    background: v.$vieshow-secondary;
  }

  /* --- 3. 桌機端優化 --- */

  // 💡 使用手冊定義的 Mixin，防止手機端點擊後殘留 hover 色 [cite: 9, 48, 126]
  @include v.hover-focus {
    filter: brightness(1.05);
    box-shadow: v.$box-shadow-sm;
  }
}
</style>
