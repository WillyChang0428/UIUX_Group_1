<template>
  <div class="order-summary">
    <h2 class="order-summary__title">付款明細</h2>

    <!-- ① 票種區塊 -->
    <div class="summary-section">
      <div class="summary-section__header">
        <span class="summary-section__label">票種</span>
        <button class="summary-section__edit" @click="$emit('edit-tickets')">
          <i class="fa-solid fa-pen fa-xs"></i>
          修改票種
        </button>
      </div>

      <div class="summary-section__body">
        <div
          v-for="ticket in tickets"
          :key="ticket.id"
          class="summary-row"
        >
          <span class="summary-row__name">{{ ticket.name }}</span>
          <span class="summary-row__qty">{{ ticket.quantity }}</span>
          <span class="summary-row__price text-danger">{{ ticket.subtotal }}</span>
        </div>
      </div>
    </div>

    <!-- 分隔線 -->
    <hr class="summary-divider" />

    <!-- ② 座位區塊 -->
    <div class="summary-section">
      <div class="summary-section__header">
        <span class="summary-section__label">座位</span>
        <button class="summary-section__edit" @click="$emit('edit-seats')">
          <i class="fa-solid fa-pen fa-xs"></i>
          修改座位
        </button>
      </div>

      <div class="summary-section__body">
        <div class="d-flex flex-wrap gap-2">
          <span
            v-for="seat in seats"
            :key="seat"
            class="summary-seat-tag"
          >{{ seat }}</span>
        </div>
      </div>
    </div>

    <!-- 分隔線 -->
    <hr class="summary-divider" />

    <!-- ③ 加購餐點區塊 -->
    <div class="summary-section">
      <div class="summary-section__header">
        <span class="summary-section__label">加購餐點</span>
        <button class="summary-section__edit" @click="$emit('edit-food')">
          <i class="fa-solid fa-pen fa-xs"></i>
          修改餐點
        </button>
      </div>

      <div class="summary-section__body">
        <div
          v-for="food in foods"
          :key="food.id"
          class="summary-row"
        >
          <span class="summary-row__name">{{ food.name }}</span>
          <span class="summary-row__qty">{{ food.quantity }}</span>
          <span class="summary-row__price text-danger">{{ food.subtotal }}</span>
        </div>
      </div>
    </div>

    <!-- 分隔線 -->
    <hr class="summary-divider" />

    <!-- ④ 手續費 + 小計 -->
    <div class="summary-section">
      <div class="summary-row">
        <span class="summary-row__name">線上訂票手續費</span>
        <span class="summary-row__qty">{{ fees.quantity }}</span>
        <span class="summary-row__price text-danger">{{ fees.subtotal }}</span>
      </div>

      <!-- 小計 -->
      <div class="summary-total">
        <span class="summary-total__label">小計</span>
        <span class="summary-total__amount">NT {{ totalFormatted }}</span>
      </div>
    </div>

  </div>
</template>

<script setup>
import { computed } from 'vue'

// ── Props（串接時由父層傳入）──────────────────────────────────
const props = defineProps({
  // 票種列表
  // [{ id, name, quantity, subtotal }]
  tickets: {
    type: Array,
    default: () => [
      { id: 'general',  name: '全票',                       quantity: 2, subtotal: 380 },
      { id: 'discount', name: '優待票',                     quantity: 1, subtotal: 320 },
      { id: 'bank',     name: '星展一般卡假日優惠 PLUS20',  quantity: 1, subtotal: 323 },
    ],
  },
  // 已選座位標籤
  // ['G排7號', 'G排8號', 'H排13號']
  seats: {
    type: Array,
    default: () => ['G排7號', 'G排8號', 'H排13號'],
  },
  // 加購餐點
  // [{ id, name, quantity, subtotal }]
  foods: {
    type: Array,
    default: () => [
      { id: 'popcorn', name: '大爆米花',      quantity: 2, subtotal: 189 },
      { id: 'combo',   name: '星展中可小爆',  quantity: 1, subtotal: 59  },
    ],
  },
  // 手續費
  fees: {
    type: Object,
    default: () => ({ quantity: 1, subtotal: 20 }),
  },
  // 總金額（父層計算好傳入）
  total: {
    type: Number,
    default: 4380,
  },
})

defineEmits(['edit-tickets', 'edit-seats', 'edit-food'])

// 總金額格式化（加千分位逗號）
const totalFormatted = computed(() =>
  props.total.toLocaleString()
)
</script>

<style lang="scss" scoped>
@import "@/assets/scss/variables";

// ── 整體容器 ───────────────────────────────────────────────────
.order-summary {
  border-radius: 2px solid var(--app-radius-lg) $light;
  padding: var(--gap-md);
  display: flex;
  flex-direction: column;
  gap: var(--gap-sm);

  @include media-breakpoint-up(md) {
    padding: var(--gap-lg);
    gap: var(--gap-md);
  }
}

// ── 主標題「付款明細」──────────────────────────────────────────
.order-summary__title {
  margin: 0;
  font-size: var(--app-font-size-h5);          // 手機 20px / PC 22px
  font-weight: 700;
  color: v.$white;
}

// ── 分隔線 ─────────────────────────────────────────────────────
.summary-divider {
  margin: 0;
  border: none;
  border-top: 1px solid rgba(v.$white, 0.08);  // border-thin
}

// ── 區塊（票種/座位/餐點）─────────────────────────────────────
.summary-section {
  display: flex;
  flex-direction: column;
  gap: var(--gap-xs);
}

// 區塊 header：標籤 + 修改按鈕
.summary-section__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--gap-xs);
}

.summary-section__label {
  font-size: var(--app-font-size-sm);          // 手機 14px / PC 16px
  font-weight: 600;
  color: v.$vieshow-secondary;
}

// 修改按鈕（pencil icon + 文字）
.summary-section__edit {
  display: inline-flex;
  align-items: center;
  gap: var(--gap-xs);
  background: none;
  border: none;
  cursor: pointer;
  color: v.$vieshow-secondary;
  font-size: var(--app-font-size-mini);        // 手機 12px / PC 14px
  padding: 0;
  transition: color 0.2s ease;

  @include hover-focus {
    color: v.$white;
  }
}

// ── 明細列（名稱 + 數量 + 小計）──────────────────────────────
.summary-row {
  display: flex;
  align-items: baseline;
  gap: var(--gap-xs);
}

.summary-row__name {
  flex: 1;
  font-size: var(--app-font-size-base);        // 手機 16px / PC 18px
  color: v.$white;
  min-width: 0;
}

.summary-row__qty {
  font-size: var(--app-font-size-base);
  color: v.$white;
  min-width: var(--gap-md);                   // 至少一個數字的寬度
  text-align: center;
}

.summary-row__price {
  font-size: var(--app-font-size-base);
  font-weight: 700;
  text-align: right;
  min-width: var(--gap-2xl);                  // 對齊價格欄位
}

// ── 座位標籤 ───────────────────────────────────────────────────
.summary-seat-tag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--gap-xs) var(--gap-sm);
  border-radius: var(--app-radius);
  background: v.$vieshow-primary;
  color: v.$white;
  font-size: var(--app-font-size-sm);          // 手機 14px / PC 16px
  font-weight: 600;
}

// ── 小計列 ─────────────────────────────────────────────────────
.summary-total {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  padding-top: var(--gap-sm);
  margin-top: var(--gap-xs);
  border-top: 1px solid rgba(v.$white, 0.08);
}

.summary-total__label {
  font-size: var(--app-font-size-base);
  color: v.$white;
}

.summary-total__amount {
  // 大標題等級，突顯總金額
  font-size: var(--app-font-size-h4);          // 手機 24px / PC 26px
  font-weight: 700;
  color: v.$white;
}
</style>