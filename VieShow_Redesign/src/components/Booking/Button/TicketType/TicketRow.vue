<template>
  <div
    class="ticket-row"
    :class="{ 'ticket-row--active': ticket.quantity > 0 }"
  >
    <div class="ticket-row__info">
      <div class="ticket-row__title">
        <div class="ticket-row__name-wrap">
          <span class="ticket-row__name">{{ ticket.name }}</span>
          <button
            v-if="ticket.note"
            class="ticket-row__note-icon"
            @click="showNoteModal = true"
            aria-label="查看票種說明"
          >
            <i class="fa-solid fa-circle-info"></i>
          </button>
        </div>
        <p v-if="ticket.desc" class="ticket-row__desc">{{ ticket.desc }}</p>
      </div>

      <span
        v-if="!ticket.needCode"
        class="ticket-row__price"
        :class="{ 'ticket-row__price--free': ticket.price === 0 }"
      >
        NT {{ ticket.price.toLocaleString() }}
      </span>
    </div>

    <div class="ticket-row__right group_ticket_section">
      <template v-if="ticket.needCode">
        <div class="ticket-row__code-group pt-1">
          <div class="ticket-row__code-wrap" :class="codeWrapClasses">
            <input
              class="ticket-row__code-input"
              maxlength="3"
              :value="codeInput"
              :placeholder="inputPlaceholder"
              :disabled="isInputDisabled"
              @input="handleCodeInput"
            />

            <button
              v-if="isRedeemed"
              class="ticket-row__code-btn ticket-row__code-btn--cancel"
              @click="handleCancel"
            >
              取消
            </button>
            <button
              v-else
              class="ticket-row__code-btn"
              :class="{ 'is-active': isCodeValid }"
              :disabled="!isCodeValid"
              @click="handleRedeem"
            >
              兌換
            </button>
          </div>

          <div class="ticket-row__code-msg">
            <p v-if="showError" class="ticket-row__error">
              請輸入 3 碼英文字母
            </p>
            <p v-else-if="isRedeemed" class="ticket-row__success">
              <i class="fa-solid fa-circle-check"></i>
              已成功兌換 {{ redeemedCount }} / {{ maxQty }} 張
            </p>
            <p v-else class="ticket-row__msg-placeholder">&nbsp;</p>
          </div>
        </div>
      </template>

      <template v-else>
        <StepperCounter
          :model-value="ticket.quantity"
          :min="0"
          :max="maxQty"
          @update:model-value="
            (val) => $emit('update-qty', ticket.id, val - ticket.quantity)
          "
        />
      </template>
    </div>
  </div>
  <component
    v-if="currentTipComponent"
    :is="currentTipComponent"
    v-model="showNoteModal"
  />

  <BaseModal v-else v-model="showNoteModal" type="base">
    <template #title>{{ ticket.name }} 說明</template>
    <template #content>
      <div class="p-2">
        <p
          class="text-white mb-0"
          style="line-height: 1.6; letter-spacing: 0.05em"
        >
          {{ ticket.note }}
        </p>
      </div>
    </template>
  </BaseModal>
</template>

<script setup>
import { ref, computed } from "vue";
import StepperCounter from "@/components/Booking/Button/StepperCounter.vue";
// 💡 1. 引入您的 Tips 元件 (請根據您的實際路徑微調)
import DiscountTickets from "../../Tips/DiscountTickets.vue";
import FreeVoucher from "../../Tips/FreeVoucher.vue";
import GroupTickets from "../../Tips/GroupTickets.vue";
import LoveTickets from "../../Tips/LoveTickets.vue";

// ── 1. Props & Emits ──────────────────────────────────────────
const props = defineProps({
  ticket: {
    type: Object,
    required: true,
  },
  maxQty: {
    type: Number,
    default: 4,
  },
});

const emit = defineEmits(["update-qty"]);

// ── 2. State (狀態變數) ────────────────────────────────────────
const codeInput = ref("");
const isRedeemed = ref(false);
const redeemedCount = ref(0);
const showNoteModal = ref(false);

// 💡 2. 建立「票種 ID」與「說明元件」的對應表
const tipComponentMap = {
  // 免費兌換券
  free: FreeVoucher,
  // 團體票
  group: GroupTickets,
  // 敬老/愛心票
  elder: LoveTickets,
  //優待票
  discount: DiscountTickets,
};

// 💡 3. 計算目前這張票應該顯示哪個元件
const currentTipComponent = computed(() => {
  const id = props.ticket.id;

  // 1. 如果有直接對應的 ID (free, group, elder)，直接回傳
  if (tipComponentMap[id]) {
    return tipComponentMap[id];
  }
  // 2. 如果是優待票 (concession)，如果您希望它也用 DiscountTickets，可以加這行
  if (id === "concession") {
    return DiscountTickets;
  }
  // 找不到專屬元件，回傳 null (畫面就會自動去觸發純文字的 BaseModal)
  return null;
});

// ── 3. Computed (畫面與邏輯判斷) ───────────────────────────────
const isCodeValid = computed(() => /^[A-Z]{3}$/.test(codeInput.value));

const showError = computed(
  () => codeInput.value.length > 0 && !isCodeValid.value && !isRedeemed.value,
);

const codeWrapClasses = computed(() => ({
  "is-error": showError.value,
  "is-redeemed": isRedeemed.value,
}));

const inputPlaceholder = computed(() => {
  if (isRedeemed.value) {
    return `已兌換 ${redeemedCount.value} 張 ✓`;
  }
  return props.ticket.codePlaceholder || "票券前三碼英文字母";
});

const isInputDisabled = computed(() => {
  return isRedeemed.value && redeemedCount.value >= props.maxQty;
});

// ── 4. Methods (互動事件) ──────────────────────────────────────
const handleCodeInput = (e) => {
  // 過濾非英文字母、轉大寫、限制 3 碼
  codeInput.value = e.target.value
    .replace(/[^a-zA-Z]/g, "")
    .toUpperCase()
    .slice(0, 3);
};

const handleRedeem = () => {
  if (!isCodeValid.value) return;
  if (redeemedCount.value >= props.maxQty) return; // 防呆：不能超過配額

  redeemedCount.value++;
  isRedeemed.value = true;
  codeInput.value = ""; // 清空輸入，讓使用者可繼續輸入下一張

  emit("update-qty", props.ticket.id, 1);
};

const handleCancel = () => {
  const count = redeemedCount.value;

  // 還原所有狀態
  redeemedCount.value = 0;
  isRedeemed.value = false;
  codeInput.value = "";

  // 扣除已兌換的總張數
  emit("update-qty", props.ticket.id, -count);
};
</script>

<style lang="scss" scoped>
@import "@/assets/scss/variables";

.ticket-row {
  height: fit-content;
  min-height: 90px;
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
  font-size: $font-size-sm-mobile;
  color: $vieshow-secondary;
  cursor: pointer;
  background: transparent;
  border: none;
  padding: 0;
  display: inline-flex;
  align-items: center;
  transition: color 0.2s ease;

  &:hover {
    color: $white;
  }
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

.group_ticket_section {
  height: 100%;
  align-items: flex-start !important;
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

  &--free {
    color: $vieshow-secondary;
  }
}

// ── 團體票兌換區 ───────────────────────────────────────────────
.ticket-row__code-group {
  display: flex;
  height: 100%;
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

  &.is-error {
    border-color: $vieshow-danger;
  }
  &.is-redeemed {
    border-color: $vieshow-success;
  }
}

.ticket-row__code-input {
  max-width: 300px;
  height: 40px;
  padding: 0 $spacing-sm-mobile;
  background: rgba($white, 0.05);
  border: none;
  color: $light;
  font-size: var(--app-font-size-mini);
  outline: none;
  letter-spacing: 0.05em;

  &:disabled {
    color: $vieshow-success;
    cursor: default;
  }

  &::placeholder {
    color: $vieshow-secondary;
    font-size: var(--app-font-size-mini);
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
  transition:
    background 0.2s ease,
    color 0.2s ease;

  &.is-active {
    background: $vieshow-primary;
    color: $white;
    cursor: pointer;
    &:hover {
      background: $vieshow-primary-dark;
    }
  }

  &--cancel {
    background: rgba($vieshow-danger, 0.15);
    color: $vieshow-danger;
    cursor: pointer;
    &:hover {
      background: rgba($vieshow-danger, 0.3);
    }
  }
}

// ── 訊息容器 (固定高度防止跳動) ──────────────────────────────────
.ticket-row__code-msg {
  height: var(--app-font-size-mini);
  display: flex;
  align-items: center;
  justify-content: flex-end;
  min-height: 16px;
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
  color: transparent;
  pointer-events: none;
  user-select: none;
}
</style>
