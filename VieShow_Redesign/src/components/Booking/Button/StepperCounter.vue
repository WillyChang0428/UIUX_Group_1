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

  特殊邏輯：
    數量為 1 時，減少按鈕顯示垃圾桶 icon（fa-trash），提示使用者即將清除
    數量為 0 時，減少按鈕 disabled
    數量 > 1 時，顯示一般 − 符號
-->

<template>
  <div class="stepper">

    <!-- 減少按鈕：數量為 1 時顯示垃圾桶，否則顯示 − -->
    <button
      class="stepper__btn"
      :class="{ 'stepper__btn--trash': modelValue === 1 }"
      :disabled="modelValue <= min"
      @click="decrement"
      :aria-label="modelValue === 1 ? '清除' : '減少數量'"
    >
      <i v-if="modelValue === 1" class="fa-solid fa-trash"></i>
      <span v-else>−</span>
    </button>

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
      aria-label="增加數量"
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
  gap: var(--gap-md);
  flex-shrink: 0;
}

// ── 按鈕 ───────────────────────────────────────────────────────
.stepper__btn {
  width: 28px;
  height: 28px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  border: 1.5px solid rgba(v.$white, 0.3);
  background: transparent;
  color: v.$white;
  cursor: pointer;
  font-size: var(--app-font-size-base);
  font-weight: 400;
  line-height: 1;
  padding: 0;
  transition: border-color 0.2s ease,
              border-width 0.1s ease,
              color 0.2s ease,
              opacity 0.2s ease;

  @include media-breakpoint-up(md) {
    width: 36px;
    height: 36px;
    font-size: var(--app-font-size-h6);
  }

  @include hover-focus {
    border-color: v.$white;
  }

  // 按下瞬間：白框加粗
  &:active:not(:disabled) {
    border-color: v.$white;
    border-width: 2px;
  }

  // + 按鈕：有數量時變白
  &--active {
    border-color: v.$white;
    color: v.$white;

    &:active:not(:disabled) {
      border-width: 2px;
    }
  }

  // 垃圾桶狀態（數量為 1 時）：變 danger 紅色提示
  &--trash {
    border-color: rgba(v.$vieshow-danger, 0.6);
    color: v.$vieshow-danger;
    font-size: var(--app-font-size-mini);      // icon 小一點比較好看

    @include hover-focus {
      border-color: v.$vieshow-danger;
      color: v.$vieshow-danger;
    }

    &:active:not(:disabled) {
      border-color: v.$vieshow-danger;
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
  min-width: var(--gap-md);
  text-align: center;
  font-size: var(--app-font-size-h4);
  font-weight: 700;
  color: v.$vieshow-secondary;
  transition: color 0.2s ease;

  &--active {
    color: v.$white;
  }
}
</style>