<template>
  <div class="ticket-row" :class="{ 'ticket-row--active': ticket.quantity > 0 }">

    <!-- 左側：票種名稱 + 描述 -->
    <div class="ticket-row__info">
      <div class="ticket-row__title">
        <div class="ticket-row__name-wrap">
          <span class="ticket-row__name">{{ ticket.name }}</span>
          <span v-if="ticket.note" class="ticket-row__note-icon" :title="ticket.note">
            <i class="fa-solid fa-circle-exclamation"></i>
          </span>
        </div>
        <p v-if="ticket.desc" class="ticket-row__desc">{{ ticket.desc }}</p>
      </div>

      <!-- 金額：團體票不顯示 -->
      <span
        v-if="!ticket.needCode"
        class="ticket-row__price"
        :class="{ 'ticket-row__price--free': ticket.price === 0 }"
      >
        NT {{ ticket.price.toLocaleString() }}
      </span>
    </div>

    <!-- 右側 -->
    <div class="ticket-row__right">

      <!-- 團體票：兌換碼輸入框 -->
      <template v-if="ticket.needCode">
        <div class="ticket-row__code-group">
          <div class="ticket-row__code-wrap " :class="{ 'is-error': showError, 'is-redeemed': isRedeemed }">
            <input
              :value="codeInput"
              class="ticket-row__code-input"
              :placeholder="isRedeemed ? `已兌換 ${redeemedCount} 張 ✓` : (ticket.codePlaceholder || '票券前三碼英文字母')"
              :disabled="isRedeemed && redeemedCount >= maxQty"
              maxlength="3"
              @input="handleCodeInput"
            />
            <!-- 兌換成功且達上限：顯示取消 -->
            <button
              v-if="isRedeemed"
              class="ticket-row__code-btn ticket-row__code-btn--cancel"
              @click="handleCancel"
            >取消</button>
            <!-- 未兌換：顯示兌換 -->
            <button
              v-else
              class="ticket-row__code-btn"
              :class="{ 'is-active': isCodeValid }"
              :disabled="!isCodeValid"
              @click="handleRedeem"
            >兌換</button>
          </div>

          <!-- 問題一：固定高度容器，訊息在內切換，不影響外層高度 -->
          <div class="ticket-row__code-msg">
            <p v-if="showError" class="ticket-row__error">
              請輸入 3 碼英文字母
            </p>
            <p v-else-if="isRedeemed" class="ticket-row__success">
              <i class="fa-solid fa-circle-check"></i>
              已成功兌換 {{ redeemedCount }} / {{ maxQty }} 張
            </p>
            <!-- 佔位：讓高度固定 -->
            <p v-else class="ticket-row__msg-placeholder">&nbsp;</p>
          </div>
        </div>
      </template>

      <!-- 一般票：StepperCounter -->
      <template v-else>
        <StepperCounter
          :model-value="ticket.quantity"
          :min="0"
          :max="maxQty"
          @update:model-value="(val) => $emit('update-qty', ticket.id, val - ticket.quantity)"
        />
      </template>

    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import StepperCounter from '@/components/Booking/Button/StepperCounter.vue'

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

const emit = defineEmits(['update-qty'])

// ── 兌換碼輸入 ─────────────────────────────────────────────────
const codeInput = ref('')
const isRedeemed = ref(false)
// 問題二：記錄已兌換張數，上限由 maxQty 控制（最多 4 張）
const redeemedCount = ref(0)

const handleCodeInput = (e) => {
  codeInput.value = e.target.value
    .replace(/[^a-zA-Z]/g, '')
    .toUpperCase()
    .slice(0, 3)
}

const isCodeValid = computed(() => /^[A-Z]{3}$/.test(codeInput.value))

const showError = computed(() =>
  codeInput.value.length > 0 && !isCodeValid.value && !isRedeemed.value
)

// 兌換：每次兌換 +1，最多 maxQty 張
const handleRedeem = () => {
  if (!isCodeValid.value) return
  if (redeemedCount.value >= props.maxQty) return   // 問題二：上限 4 張

  redeemedCount.value++
  isRedeemed.value = true
  codeInput.value = ''                               // 清空輸入讓使用者可繼續輸入下一張
  emit('update-qty', props.ticket.id, 1)
}

// 取消全部兌換：還原狀態，通知父層扣除已兌換的張數
const handleCancel = () => {
  const count = redeemedCount.value
  redeemedCount.value = 0
  isRedeemed.value = false
  codeInput.value = ''
  emit('update-qty', props.ticket.id, -count)
}
</script>

<style lang="scss" scoped>
@import "@/assets/scss/variables";

.ticket-row {
  height: 90pt;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: $spacing-sm-mobile;
  padding: var(--gap-md) 0;
  border-bottom: 1px solid rgba($white, 0.06);

  @include media-breakpoint-up(md) {
    padding: var(--gap-sm) 0;
    height: 110pt;
  }

  &:last-child { border-bottom: none; }

  &--active {
    .ticket-row__name { color: $vieshow-primary; }
  }
}

// ── 左側資訊 ───────────────────────────────────────────────────
.ticket-row__info {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  flex: 1;
  min-width: 0;
}

.ticket-row__title {
  display: flex;
  flex-direction: column;
}

.ticket-row__name-wrap {
  display: flex;
  align-items: center;
  gap: 4px;
}

.ticket-row__name {
  font-size: var(--app-font-size-h6);
  font-weight: 400;
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
  font-size: var(--app-font-size-sm);
  color: $vieshow-secondary;
  line-height: 1.4;
}

// ── 右側 ───────────────────────────────────────────────────────
.ticket-row__right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: flex-end;
  height: 100%;
  gap: $spacing-sm-mobile;
  flex-shrink: 0;
}

// ── 價格 ───────────────────────────────────────────────────────
.ticket-row__price {
  display: flex;
  justify-content: start;
  font-size: var(--app-font-size-h6);
  font-weight: 700;
  color: $vieshow-danger;
  min-width: 56px;
  text-align: right;

  &--free { color: $vieshow-secondary; }
}

// ── 團體票兌換區 ───────────────────────────────────────────────
.ticket-row__code-group {
  display: flex;
  flex-direction: column;
  gap: var(--gap-xs);
  align-items: flex-end;
}

.ticket-row__code-wrap {
  display: flex;
  align-items: center;
  border: 1px solid rgba($white, 0.15);
  border-radius: $border-radius-mobile;
  overflow: hidden;
  transition: border-color 0.2s ease;

  &.is-error    { border-color: $vieshow-danger; }
  &.is-redeemed { border-color: $vieshow-success; }
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

  &:disabled {
    color: $vieshow-success;
    cursor: default;
  }

  &::placeholder {
    color: $vieshow-secondary;
    font-size: $font-size-mini-mobile;
  }
}

.ticket-row__code-btn {
  height: 40px;
  padding: 0 $spacing-sm-mobile;
  background: rgba($white, 0.1);
  border: none;
  border-left: 1px solid rgba($white, 0.1);
  color: $vieshow-secondary;
  font-size: $font-size-sm-mobile;
  font-weight: 600;
  cursor: not-allowed;
  white-space: nowrap;
  transition: background 0.2s ease, color 0.2s ease;

  &.is-active {
    background: $vieshow-primary;
    color: $white;
    cursor: pointer;
    &:hover { background: $vieshow-primary-dark; }
  }

  &--cancel {
    background: rgba($vieshow-danger, 0.15);
    color: $vieshow-danger;
    cursor: pointer;
    &:hover { background: rgba($vieshow-danger, 0.3); }
  }
}

// ── 問題一：固定高度訊息容器，防止跳動 ───────────────────────
// 高度固定為一行迷你文字的高度，內容切換不影響外層
.ticket-row__code-msg {
  height: var(--app-font-size-mini);       // 固定一行高
  display: flex;
  align-items: center;
  justify-content: flex-end;
  min-height: 16px;                        // 至少 16px 確保不塌縮
}

.ticket-row__error,
.ticket-row__success,
.ticket-row__msg-placeholder {
  margin: 0;
  font-size: $font-size-mini-mobile;
  line-height: 1;
  white-space: nowrap;
}

.ticket-row__error {
  color: $vieshow-danger;
}

.ticket-row__success {
  color: $vieshow-success;
  display: flex;
  align-items: center;
  gap: var(--gap-xs);
}

.ticket-row__msg-placeholder {
  // 透明佔位，撐住高度
  color: transparent;
  pointer-events: none;
  user-select: none;
}
</style>