<!-- ## 三、BottomBar（底部固定 Bar）

### 檔案位置
src/components/Booking/FastBooking/BottomBar.vue

### 使用方式
<BottomBar
  :tickets="ticketList"
  :combos="comboList"
  :seat-selected="isSeatSelected"
  @go-seat="handleGoSeat"
  @add-combo="handleAddCombo"
  @confirm="handleConfirm"
/>

### Props

| Prop | 型別 | 說明 |
|---|---|---|
| tickets | Array | 票種列表，每筆需有 { id, name, price, quantity } |
| combos | Array | 套餐列表，每筆需有 { id, name, price, quantity } |
| seatSelected | Boolean | 是否已完成選座，預設 false |

### Emits

| 事件 | 說明 |
|---|---|
| go-seat | 點擊「選擇座位」時觸發 |
| add-combo | 點擊「加購餐點」時觸發 |
| confirm | 點擊「確認訂單」時觸發 |

### 四個狀態
- 狀態一：未選票 → 灰色「選擇座位」不可按
- 狀態二：有票無套餐 → 藍色「選擇座位」
- 狀態三：seatSelected = true → 藍色「加購餐點」
- 狀態四：有票＋有套餐 → 藍色「確認訂單」 -->

<template>
  <div class="bottom-bar border-top">
    <div class="container">
      <div class="d-flex align-items-center justify-content-between bottom-bar__inner">

        <!-- 左側：金額資訊 -->
        <div class="d-flex flex-column gap-1 bottom-bar__price-block">

          <!-- 摘要文字：用 visibility 佔位，避免金額跳動 -->
          <p
            class="mb-0 text-secondary bottom-bar__summary"
            :class="{ invisible: !hasSummary }"
          >
            <!-- 手機版截斷，md+ 完整展開 -->
            <span class="d-none d-md-inline">{{ summaryText }}</span>
            <span class="d-inline d-md-none">{{ summaryTextShort }}</span>
          </p>

          <!-- 總金額 -->
          <p class="mb-0 fw-bold text-white bottom-bar__total">
            NT$ {{ totalPrice.toLocaleString() }}
          </p>
        </div>

        <!-- 右側：單一按鈕 -->
        <div class="flex-shrink-0 bottom-bar__btn-wrap">

          <!-- 問題一：預設灰底白字「選擇座位」，選票後啟用 -->
          <!-- 問題二：使用 SecondaryButton，disabled 時加 --disabled modifier -->
          <SecondaryButton
            v-if="state === 'empty'"
            class="bottom-bar__btn bottom-bar__btn--disabled"
            disabled
          >
            選擇座位
          </SecondaryButton>

          <SecondaryButton
            v-else-if="state === 'ticket-only'"
            class="bottom-bar__btn"
            @click="$emit('go-seat')"
          >
            選擇座位
          </SecondaryButton>

          <SecondaryButton
            v-else-if="state === 'seat-selected'"
            class="bottom-bar__btn"
            @click="$emit('add-combo')"
          >
            加購餐點
          </SecondaryButton>

          <SecondaryButton
            v-else-if="state === 'ticket-and-combo'"
            class="bottom-bar__btn"
            @click="$emit('confirm')"
          >
            確認訂單
          </SecondaryButton>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import SecondaryButton from '@/components/Common/Button/SecondaryButton.vue'

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
})

defineEmits(['go-seat', 'add-combo', 'confirm'])

// ── 統計 ───────────────────────────────────────────────────────
const totalTicketQty = computed(() =>
  props.tickets.reduce((sum, t) => sum + t.quantity, 0)
)

const totalComboQty = computed(() =>
  props.combos.reduce((sum, c) => sum + c.quantity, 0)
)

const totalPrice = computed(() => {
  const ticketTotal = props.tickets.reduce((sum, t) => sum + t.price * t.quantity, 0)
  const comboTotal = props.combos.reduce((sum, c) => sum + c.price * c.quantity, 0)
  return ticketTotal + comboTotal
})

// ── 狀態判斷 ───────────────────────────────────────────────────
const state = computed(() => {
  if (totalTicketQty.value === 0) return 'empty'
  if (totalComboQty.value > 0) return 'ticket-and-combo'
  if (props.seatSelected) return 'seat-selected'
  return 'ticket-only'
})

// ── 摘要文字 ───────────────────────────────────────────────────
const hasSummary = computed(() => totalTicketQty.value > 0)

// md+ 完整版
const summaryText = computed(() => {
  if (!hasSummary.value) return '\u00A0'
  const parts = [`已選擇 ${totalTicketQty.value} 個座位`]
  if (totalComboQty.value > 0) {
    const first = props.combos.find(c => c.quantity > 0)
    if (first) parts.push(`${first.quantity} 份${first.name}`)
  }
  return parts.join('｜')
})

// 手機版截斷
const summaryTextShort = computed(() => {
  if (!hasSummary.value) return '\u00A0'
  const parts = [`已選擇 ${totalTicketQty.value} 個座位`]
  if (totalComboQty.value > 0) {
    const first = props.combos.find(c => c.quantity > 0)
    if (first) {
      const name = first.name.length > 6 ? first.name.slice(0, 6) + '…' : first.name
      parts.push(`${first.quantity} 份${name}`)
    }
  }
  return parts.join('｜')
})
</script>

<style lang="scss" scoped>
@import "@/assets/scss/variables";

.container {
  padding-top: $container-padding-mobile;
  padding-bottom: $web-bottom-padding-mobile;
}

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: $vieshow-dark;
  border-top-color: rgba($white, 0.1) !important;
  box-shadow: 0 -4px 24px rgba($black, 0.4);
}

.bottom-bar__inner {
  min-height: 64px;
}

// ── 左側金額區 ─────────────────────────────────────────────────
.bottom-bar__price-block {
  flex: 1;
  min-width: 0;
  // 問題三：右側預留 gap，讓文字不會緊貼按鈕
  padding-right: $spacing-md-mobile;          // 16px

  @include media-breakpoint-up(md) {
    padding-right: $spacing-lg-mobile;        // 24px
  }
}

// 問題三：摘要文字放大，手機版也清楚可讀
.bottom-bar__summary {
  font-size: $font-size-sm-mobile;            // 14px（原本 mini 12px，改大一級）
  line-height: 1.4;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @include media-breakpoint-up(md) {
    font-size: $font-size-sm-pc;              // 16px
    white-space: normal;
    overflow: visible;
    text-overflow: unset;
  }
}

.bottom-bar__total {
  font-size: $h5-font-size-mobile;            // 20px
  line-height: 1.2;

  @include media-breakpoint-up(md) {
    font-size: $h5-font-size-pc;              // 22px
  }
}

// ── 按鈕區 ─────────────────────────────────────────────────────
.bottom-bar__btn-wrap {
  flex-shrink: 0;
}

// 問題一 + 二：對應 Figma 規格 padding 24/12，radius 12
.bottom-bar__btn {
  padding: $btn-padding-y-sm $btn-padding-x-lg !important;   // 12px 24px
  border-radius: $border-radius-lg-mobile !important;        // 12px
  font-size: $font-size-sm-mobile;
  font-weight: 600;
  white-space: nowrap;

  // 問題一：disabled 灰底白字
  &--disabled {
    background: rgba($white, 0.12) !important;
    border-color: transparent !important;
    color: $vieshow-secondary !important;
    cursor: not-allowed !important;
    pointer-events: none;
    opacity: 1 !important;                   // 避免 Bootstrap disabled 降低 opacity
  }
}
</style>