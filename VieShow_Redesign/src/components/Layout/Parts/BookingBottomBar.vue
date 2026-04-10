<template>
  <div class="bottom-bar">
    <div class="container pb-5 pt-4 py-md-2">
      <div class="d-flex align-items-center justify-content-between bottom-bar__inner">

        <div class="d-flex flex-column gap-1 bottom-bar__price-block pe-3 pe-md-4">

          <p
            class="mb-0 text-secondary small bottom-bar__summary"
            :class="{ invisible: !hasSummary }"
          >
            <span class="d-none d-md-inline">{{ summaryText }}</span>
            <span class="d-inline d-md-none">{{ summaryTextShort }}</span>
          </p>

          <p class="mb-0 fw-bold text-white bottom-bar__total">
            NT$ {{ totalPrice.toLocaleString() }}
          </p>
        </div>

        <div class="flex-shrink-0 bottom-bar__btn-wrap">

          <PrimaryButton
            v-if="state === 'empty'"
            status="unable"
            is-disabled
          >
            選擇座位
          </PrimaryButton>

          <PrimaryButton
            v-else-if="state === 'ticket-only'"
            @click="$emit('go-seat')"
          >
            選擇座位
          </PrimaryButton>

          <PrimaryButton
            v-else-if="state === 'seat-selected'"
            @click="$emit('add-combo')"
          >
            加購餐點
          </PrimaryButton>

          <PrimaryButton
            v-else-if="state === 'ticket-and-combo'"
            @click="$emit('confirm')"
          >
            確認訂單
          </PrimaryButton>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
// 💡 改為引入 PrimaryButton 作為主動線按鈕
import PrimaryButton from '@/components/Common/Button/PrimaryButton.vue';

const props = defineProps({
  tickets: {
    type: Array,
    default: () => [],
  },
  combos: {
    type: Array,
    default: () => [],
  },
  seatSelected: {
    type: Boolean,
    default: false,
  },
});

defineEmits(['go-seat', 'add-combo', 'confirm']);

// ── 統計 ───────────────────────────────────────────────────────
const totalTicketQty = computed(() =>
  props.tickets.reduce((sum, t) => sum + t.quantity, 0)
);

const totalComboQty = computed(() =>
  props.combos.reduce((sum, c) => sum + c.quantity, 0)
);

const totalPrice = computed(() => {
  const ticketTotal = props.tickets.reduce((sum, t) => sum + t.price * t.quantity, 0);
  const comboTotal = props.combos.reduce((sum, c) => sum + c.price * c.quantity, 0);
  return ticketTotal + comboTotal;
});

// ── 狀態判斷 ───────────────────────────────────────────────────
const state = computed(() => {
  if (totalTicketQty.value === 0) return 'empty';
  if (totalComboQty.value > 0) return 'ticket-and-combo';
  if (props.seatSelected) return 'seat-selected';
  return 'ticket-only';
});

// ── 摘要文字 ───────────────────────────────────────────────────
const hasSummary = computed(() => totalTicketQty.value > 0);

// md+ 完整版
const summaryText = computed(() => {
  if (!hasSummary.value) return '\u00A0';
  const parts = [`已選擇 ${totalTicketQty.value} 個座位`];
  if (totalComboQty.value > 0) {
    const first = props.combos.find(c => c.quantity > 0);
    if (first) parts.push(`${first.quantity} 份${first.name}`);
  }
  return parts.join('｜');
});

// 手機版截斷
const summaryTextShort = computed(() => {
  if (!hasSummary.value) return '\u00A0';
  const parts = [`已選擇 ${totalTicketQty.value} 個座位`];
  if (totalComboQty.value > 0) {
    const first = props.combos.find(c => c.quantity > 0);
    if (first) {
      const name = first.name.length > 6 ? first.name.slice(0, 6) + '…' : first.name;
      parts.push(`${first.quantity} 份${name}`);
    }
  }
  return parts.join('｜');
});
</script>

<style lang="scss" scoped>
@import "@/assets/scss/variables";

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1030; // 💡 Bootstrap 針對 fixed 元素的標準 z-index
  background: $vieshow-dark;
  border-top: 1px solid rgba($white, 0.1);
  box-shadow: 0 -4px 24px rgba($black, 0.4);
}

.bottom-bar__inner {
  min-height: 48px;
}

// ── 左側金額區 ─────────────────────────────────────────────────
.bottom-bar__price-block {
  flex: 1;
  min-width: 0;
}

.bottom-bar__summary {
  line-height: $line-height-relaxed;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @include media-breakpoint-up(md) {
    // 💡 電腦版自動放大為 16px / 18px (Base)
    font-size: var(--app-font-size-base); 
    white-space: normal;
    overflow: visible;
    text-overflow: unset;
  }
}

.bottom-bar__total {
  // 💡 自動響應：手機版 20px，電腦版 22px
  font-size: var(--app-font-size-h5); 
  line-height: 1.2;
}

/* 💡 注意：我們已經完全移除了原本 .bottom-bar__btn 與 &--disabled 的 CSS！
  因為您的 <PrimaryButton> 已經幫您處理好所有的 Padding、圓角與 disabled 狀態了，
  這能保證全站的按鈕長得一模一樣，不會有漏網之魚！
*/
</style>