<!-- 使用方式：
  <StepperCounter
    v-model="quantity"
    :min="0"
    :max="4"
  />

  Props:
    modelValue (Number) - 目前數量，搭配 v-model 使用
    min        (Number) - 最小值，預設 0
    max        (Number) - 最大值，預設 4

  狀態一（票種）：max=4，不能少於 0
  狀態二（餐點）：max=9，不能少於 0
-->

<template>
  <div class="stepper">
    <!-- 減少按鈕 -->
    <button
      class="stepper__btn"
      :disabled="modelValue <= min"
      @click="decrement"
    >−</button>

    <!-- 數量顯示 -->
    <span
      class="stepper__count"
      :class="{ 'stepper__count--active': modelValue > 0 }"
    >{{ modelValue }}</span>

    <!-- 增加按鈕 -->
    <button
      class="stepper__btn"
      :class="{ 'stepper__btn--active': modelValue > 0 }"
      :disabled="modelValue >= max"
      @click="increment"
    >+</button>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: { type: Number, default: 0 },
  min:        { type: Number, default: 0 },
  max:        { type: Number, default: 4 },
})

const emit = defineEmits(['update:modelValue'])

const decrement = () => {
  if (props.modelValue <= props.min) return
  emit('update:modelValue', props.modelValue - 1)
}

const increment = () => {
  if (props.modelValue >= props.max) return
  emit('update:modelValue', props.modelValue + 1)
}
</script>

<style lang="scss" scoped>
@import "@/assets/scss/variables";

// ── 計數器容器 ─────────────────────────────────────────────────
.stepper {
  display: flex;
  align-items: center;
  // 手冊規範：gap 用 CSS 變數，手機 4px / PC 8px
  gap: var(--gap-md);
  flex-shrink: 0;
}

// ── 按鈕 ───────────────────────────────────────────────────────
// 手冊 icon 尺寸系統：
//   icon-sm → 手機 16px / PC 32px（太小，不適合按鈕）
//   icon-md → 手機 24px / PC 48px（按鈕本體）
// 按鈕寬高用 CSS 變數自動縮放
.stepper__btn {
  // 手機版 28px（接近 icon-md 24px）/ PC 版 40px
  width: 28px;
  height: 28px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;                        // 永遠圓形
  border: 1.5px solid rgba(v.$white, 0.3);
  background: transparent;
  color: v.$white;
  cursor: pointer;
  // 圖示文字大小：手機 base(16px) / PC h6(18px~20px) 自動切換
  font-size: var(--app-font-size-base);
  font-weight: 400;
  line-height: 1;
  padding: 0;
  transition: border-color 0.2s ease,
              border-width 0.1s ease,
              color 0.2s ease,
              opacity 0.2s ease;

  // PC 版放大按鈕
  @include media-breakpoint-up(md) {
    width: 36px;
    height: 36px;
    font-size: var(--app-font-size-h6);      // PC 18px~20px
  }

  // 桌機 hover（手冊 hover-focus mixin）
  @include hover-focus {
    border-color: v.$white;
  }

  // 按下瞬間：白框加粗（border-bold = 2px）
  &:active:not(:disabled) {
    border-color: v.$white;
    border-width: 2px;                       // 手冊 border-bold
  }

  // + 按鈕：有數量時變白（表示可繼續加）
  &--active {
    border-color: v.$white;
    color: v.$white;

    &:active:not(:disabled) {
      border-width: 2px;
    }
  }

  // 無法操作：半透明
  &:disabled {
    opacity: 0.25;
    cursor: not-allowed;
  }
}

// ── 數量文字 ───────────────────────────────────────────────────
.stepper__count {
  // 手冊：min-width 用間距變數，手機 16px / PC 32px
  min-width: var(--gap-md);
  text-align: center;
  // 手冊字體：Base 手機 16px / PC 18px 自動縮放
  font-size: var(--app-font-size-h4);
  font-weight: 700;
  color: v.$vieshow-secondary;              // 預設灰色
  transition: color 0.2s ease;

  // 有數量：變白
  &--active {
    color: v.$white;
  }
}
</style>