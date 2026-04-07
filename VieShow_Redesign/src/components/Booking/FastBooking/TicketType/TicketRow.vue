<template>
  <div class="ticket-row" :class="{ 'ticket-row--active': ticket.quantity > 0 }">
    <!-- 左側：票種名稱 + 描述 -->
    <div class="ticket-row__info">
      <div class="ticket-row__name-wrap">
        <span class="ticket-row__name">{{ ticket.name }}</span>
        <span v-if="ticket.note" class="ticket-row__note-icon" :title="ticket.note">ⓘ</span>
      </div>
      <p v-if="ticket.desc" class="ticket-row__desc">{{ ticket.desc }}</p>
    </div>

    <!-- 右側：團體票顯示兌換框，其他票顯示價格 + 加減器 -->
    <div class="ticket-row__right">

      <!-- 團體票：輸入框 + 兌換按鈕，不顯示加減器 -->
      <template v-if="ticket.needCode">
        <div class="ticket-row__code-group">
          <div class="ticket-row__code-wrap" :class="{ 'is-error': showError }">
            <input
              :value="codeInput"
              class="ticket-row__code-input"
              :placeholder="ticket.codePlaceholder || '票券前三碼英文字母'"
              maxlength="3"
              @input="handleCodeInput"
            />
            <button
              class="ticket-row__code-btn"
              :class="{ 'is-active': isCodeValid }"
              :disabled="!isCodeValid"
              @click="handleRedeem"
            >兌換</button>
          </div>
          <!-- 錯誤提示 -->
          <p v-if="showError" class="ticket-row__error">
            請輸入 3 碼英文字母
          </p>
        </div>
      </template>

      <!-- 一般票：價格 + 加減器 -->
      <template v-else>
        <span class="ticket-row__price" :class="{ 'ticket-row__price--free': ticket.price === 0 }">
          NT {{ ticket.price.toLocaleString() }}
        </span>
        <div class="ticket-row__stepper">
          <button
            class="stepper__btn"
            :disabled="ticket.quantity <= 0"
            @click="$emit('update-qty', ticket.id, -1)"
          >−</button>
          <span class="stepper__count" :class="{ 'stepper__count--active': ticket.quantity > 0 }">
            {{ ticket.quantity }}
          </span>
          <button
            class="stepper__btn"
            :disabled="ticket.quantity >= maxQty"
            @click="$emit('update-qty', ticket.id, 1)"
          >+</button>
        </div>
      </template>

    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  ticket: {
    type: Object,
    required: true,
  },
  maxQty: {
    type: Number,
    default: 4,
  },
})

defineEmits(['update-qty'])

const codeInput = ref('')

// 只允許英文字母，自動轉大寫，超過 3 碼截斷
const handleCodeInput = (e) => {
  codeInput.value = e.target.value
    .replace(/[^a-zA-Z]/g, '')
    .toUpperCase()
    .slice(0, 3)
}

// 驗證：剛好 3 碼大寫英文字母
const isCodeValid = computed(() => /^[A-Z]{3}$/.test(codeInput.value))

// 有輸入但不符合規則才顯示錯誤
const showError = computed(() =>
  codeInput.value.length > 0 && !isCodeValid.value
)

const handleRedeem = () => {
  if (!isCodeValid.value) return
  console.log('兌換碼：', codeInput.value)
  // 之後接兌換邏輯
}
</script>

<style lang="scss" scoped>
@import "@/assets/scss/variables";

.ticket-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: $spacing-sm-mobile;
  padding: $spacing-sm-mobile 0;
  border-bottom: 1px solid rgba($white, 0.06);

  &:last-child {
    border-bottom: none;
  }

  &--active {
    .ticket-row__name {
      color: $vieshow-primary;
    }
  }
}

// ── 左側資訊 ───────────────────────────────────────────────────
.ticket-row__info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
  min-width: 0;
}

.ticket-row__name-wrap {
  display: flex;
  align-items: center;
  gap: 4px;
}

.ticket-row__name {
  font-size: $font-size-base-mobile;
  font-weight: 600;
  color: $light;
  transition: color 0.2s ease;
}

.ticket-row__note-icon {
  font-size: $font-size-mini-mobile;
  color: $vieshow-secondary;
  cursor: help;
}

.ticket-row__desc {
  margin: 0;
  font-size: $font-size-mini-mobile;
  color: $vieshow-secondary;
  line-height: 1.4;
}

// ── 右側 ───────────────────────────────────────────────────────
.ticket-row__right {
  display: flex;
  align-items: center;
  gap: $spacing-sm-mobile;
  flex-shrink: 0;
}

// ── 團體票兌換區 ───────────────────────────────────────────────
.ticket-row__code-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: flex-end;
}

.ticket-row__code-wrap {
  display: flex;
  align-items: center;
  gap: 0;
  border: 1px solid rgba($white, 0.15);
  border-radius: $border-radius-mobile;
  overflow: hidden;
  transition: border-color 0.2s ease;

  &.is-error {
    border-color: $vieshow-danger;
  }
}

.ticket-row__code-input {
  width: 140px;
  height: 40px;
  padding: 0 $spacing-sm-mobile;
  background: rgba($white, 0.05);
  border: none;
  color: $light;
  font-size: $font-size-sm-mobile;
  outline: none;
  letter-spacing: 0.05em;

  &::placeholder {
    color: $vieshow-secondary;
    font-size: $font-size-mini-mobile;
  }
}

.ticket-row__code-btn {
  height: 40px;
  padding: 0 $spacing-sm-mobile;
  background: rgba($white, 0.1);         // default：灰色不可按
  border: none;
  border-left: 1px solid rgba($white, 0.1);
  color: $vieshow-secondary;
  font-size: $font-size-sm-mobile;
  font-weight: 600;
  cursor: not-allowed;
  white-space: nowrap;
  transition: background 0.2s ease, color 0.2s ease;

  // 驗證通過：藍色可按
  &.is-active {
    background: $vieshow-primary;
    color: $white;
    cursor: pointer;

    &:hover {
      background: $vieshow-primary-dark;
    }
  }
}

.ticket-row__error {
  margin: 0;
  font-size: $font-size-mini-mobile;
  color: $vieshow-danger;
}

// ── 價格 ───────────────────────────────────────────────────────
.ticket-row__price {
  font-size: $font-size-sm-mobile;
  font-weight: 700;
  color: $vieshow-danger;
  min-width: 56px;
  text-align: right;

  &--free {
    color: $vieshow-secondary;
  }
}

// ── 加減器 ─────────────────────────────────────────────────────
.ticket-row__stepper {
  display: flex;
  align-items: center;
  gap: 6px;
}

.stepper__btn {
  width: 28px;
  height: 28px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  border: 1.5px solid rgba($white, 0.3);
  background: transparent;
  color: $light;
  cursor: pointer;
  font-size: 18px;
  font-weight: 400;
  line-height: 1;
  padding: 0;
  transition: border-color 0.2s ease, opacity 0.2s ease;

  &:hover:not(:disabled) {
    border-color: $white;
  }

  &:disabled {
    opacity: 0.25;
    cursor: not-allowed;
  }
}

.stepper__count {
  min-width: 20px;
  text-align: center;
  font-size: $font-size-base-mobile;
  font-weight: 700;
  color: $vieshow-secondary;
  transition: color 0.2s ease;

  &--active {
    color: $light;
  }
}
</style>