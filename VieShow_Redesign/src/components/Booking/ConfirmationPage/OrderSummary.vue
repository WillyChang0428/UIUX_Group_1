<template>
    <h2 class="order-summary__title">付款明細</h2>
    <div class="order-summary">
      <div class="summary-section">
        <div class="summary-section__header">
          <span class="summary-section__label text-secondary">票種</span>
          <button class="summary-section__edit" @click="$emit('edit-tickets')">
            <i class="fa-solid fa-pen fa-xs"></i>
            修改票種
          </button>
        </div>

        <div class="summary-section__body">
          <div v-for="ticket in computedTickets" :key="ticket.id" class="summary-row">
            <span class="summary-row__name">{{ ticket.name }}</span>
            <span class="summary-row__qty">x{{ ticket.quantity }}</span>
            <span class="summary-row__price text-danger">NT$ {{ ticket.subtotal.toLocaleString() }}</span>
          </div>
          <span v-if="computedTickets.length === 0" class="text-secondary fs-6">
            尚未選擇票種
          </span>
        </div>
      </div>

      <hr class="summary-divider" />

      <div class="summary-section">
        <div class="summary-section__header">
          <span class="summary-section__label text-secondary">座位</span>
          <button class="summary-section__edit" @click="$emit('edit-seats')">
            <i class="fa-solid fa-pen fa-xs"></i>
            修改座位
          </button>
        </div>

        <div class="summary-section__body">
          <div class="d-flex flex-wrap gap-2">
            <SelectedTag v-for="(seat, index) in bookingStore.seats" :key="`${seat.row}-${seat.num}-${index}`"
              :seat="seat" />
            <span v-if="bookingStore.seats.length === 0" class="text-secondary fs-6">
              尚未選擇座位
            </span>
          </div>
        </div>
      </div>

      <hr class="summary-divider" />

      <div class="summary-section">
        <div class="summary-section__header">
          <span class="summary-section__label text-secondary">加購餐點</span>
          <button class="summary-section__edit" @click="$emit('edit-food')">
            <i class="fa-solid fa-pen fa-xs"></i>
            修改餐點
          </button>
        </div>

        <div class="summary-section__body">
          <div v-for="food in computedFoods" :key="food.id" class="summary-row">
            <span class="summary-row__name">{{ food.name }}</span>
            <span class="summary-row__qty">x{{ food.quantity }}</span>
            <span class="summary-row__price text-danger">NT$ {{ food.subtotal.toLocaleString() }}</span>
          </div>
          <span v-if="computedFoods.length === 0" class="text-secondary fs-6">
            尚未加購餐點
          </span>
        </div>
      </div>

      <hr class="summary-divider" />

      <div class="summary-section">
        <div class="summary-row mb-2">
          <span class="summary-row__name text-secondary">線上訂票手續費</span>
          <span class="summary-row__qty text-secondary">x{{ computedFees.quantity }}</span>
          <span class="summary-row__price text-secondary">NT$ {{ computedFees.subtotal.toLocaleString() }}</span>
        </div>

        <div class="summary-total">
          <span class="summary-total__label">小計</span>
          <span class="summary-total__amount text-primary">NT$ {{ totalFormatted }}</span>
        </div>
      </div>

    </div>
</template>

<script setup>
import { computed } from 'vue';
import SelectedTag from '@/components/Booking/Button/SelectedTag.vue';
import { useBookingStore } from '@/store/bookingStore';

// 觸發外部事件
defineEmits(['edit-tickets', 'edit-seats', 'edit-food']);

const bookingStore = useBookingStore();

// ── 1. 價格與名稱對照表 (Dictionary) ─────────────────────────
// 因為 Store 只有存數量 (0, 1, 2)，所以我們需要在這裡對應中文名稱與單價
const ticketPricing = {
  limited: { comboA: { name: '限定套票A', price: 800 }, comboB: { name: '限定套票B', price: 850 } },
  general: { full: { name: '全票', price: 380 }, concession: { name: '優待票', price: 320 } },
  bank: { bankA: { name: '銀行優惠A', price: 300 }, bankB: { name: '銀行優惠B', price: 290 }, bankC: { name: '銀行優惠C', price: 280 } },
  other: { free: { name: '免費兌換券', price: 0 }, senior: { name: '敬老愛心票', price: 190 }, group: { name: '團體票', price: 250 } }
};

const foodPricing = {
  popcorn: { large: { name: '大爆米花', price: 150 }, medium: { name: '中爆米花', price: 120 }, small: { name: '小爆米花', price: 90 } },
  drink: { large: { name: '大杯飲料', price: 65 }, medium: { name: '中杯飲料', price: 55 }, small: { name: '小杯飲料', price: 45 } },
  hotFood: { hotDog: { name: '熱狗', price: 90 }, churro: { name: '吉拿棒', price: 80 } },
  bankCombo: { dbs: { name: '星展優惠餐', price: 120 }, tsib: { name: '台新優惠餐', price: 110 } }
};


// ── 2. 動態計算明細 (Computed) ──────────────────────────────
// 將 Store 內數量 > 0 的票種抓出來，加上名稱與小計
const computedTickets = computed(() => {
  const result = [];
  const storeTickets = bookingStore.tickets;
  for (const cat in storeTickets) {
    for (const type in storeTickets[cat]) {
      const qty = storeTickets[cat][type];
      if (qty > 0) {
        const info = ticketPricing[cat][type];
        result.push({
          id: `${cat}-${type}`,
          name: info.name,
          quantity: qty,
          subtotal: qty * info.price
        });
      }
    }
  }
  return result;
});

// 將 Store 內數量 > 0 的餐點抓出來，加上名稱與小計
const computedFoods = computed(() => {
  const result = [];
  const storeFoods = bookingStore.foods;
  for (const cat in storeFoods) {
    for (const type in storeFoods[cat]) {
      const qty = storeFoods[cat][type];
      if (qty > 0) {
        const info = foodPricing[cat][type];
        result.push({
          id: `${cat}-${type}`,
          name: info.name,
          quantity: qty,
          subtotal: qty * info.price
        });
      }
    }
  }
  return result;
});

// 💡 核心需求：手續費計算 (總票數 * 20)
const computedFees = computed(() => {
  const totalQty = bookingStore.totalTicketCount;
  return {
    quantity: totalQty,
    subtotal: totalQty * 20
  };
});

// 計算總金額 (票種總和 + 餐點總和 + 手續費)
const totalFormatted = computed(() => {
  const ticketsTotal = computedTickets.value.reduce((sum, item) => sum + item.subtotal, 0);
  const foodsTotal = computedFoods.value.reduce((sum, item) => sum + item.subtotal, 0);
  const finalTotal = ticketsTotal + foodsTotal + computedFees.value.subtotal;

  return finalTotal.toLocaleString(); // 加上千分位逗號
});
</script>

<style lang="scss" scoped>
/* 💡 依據您的要求：使用 @import 並在下方徹底拔除所有 v. 命名空間前綴 */
@import "@/assets/scss/variables";

.order-summary {
  border: 1px solid rgba($white, 0.15);
  border-radius: var(--app-radius-lg);
  background-color: rgba($vieshow-dark, 0.4);
  padding: var(--gap-md);
  display: flex;
  flex-direction: column;
  gap: var(--gap-sm);

  @include media-breakpoint-up(md) {
    padding: var(--gap-lg);
    gap: var(--gap-md);
  }
}

.order-summary__title {
  margin: 0;
  font-size: var(--app-font-size-h5);
  font-weight: $font-weight-bold;
  color: $white;
}

.summary-divider {
  margin: 0;
  border: none;
  border-top: 1px solid rgba($white, 0.1);
}

.summary-section {
  display: flex;
  flex-direction: column;
  gap: var(--gap-xs);
}

.summary-section__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--gap-xs);
}

.summary-section__label {
  font-size: var(--app-font-size-base);
  font-weight: $font-weight-bold;
}

.summary-section__edit {
  display: inline-flex;
  align-items: center;
  gap: var(--gap-xs);
  background: none;
  border: none;
  cursor: pointer;
  color: $vieshow-primary;
  font-size: var(--app-font-size-sm);
  padding: 0;
  transition: opacity 0.2s ease;

  @include hover-focus {
    opacity: 0.7;
  }
}

.summary-row {
  display: flex;
  align-items: baseline;
  gap: var(--gap-xs);
  padding: 4px 0;
}

.summary-row__name {
  flex: 1;
  font-size: var(--app-font-size-base);
  color: $white;
  min-width: 0;
}

.summary-row__qty {
  font-size: var(--app-font-size-base);
  color: $white;
  min-width: var(--gap-lg);
  text-align: center;
}

.summary-row__price {
  font-size: var(--app-font-size-base);
  font-weight: $font-weight-bold;
  text-align: right;
  min-width: var(--gap-3xl);
}

.summary-total {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  padding-top: var(--gap-sm);
  margin-top: var(--gap-xs);
  border-top: 1px solid rgba($white, 0.1);
}

.summary-total__label {
  font-size: var(--app-font-size-h5);
  font-weight: $font-weight-bold;
  color: $white;
}

.summary-total__amount {
  font-size: var(--app-font-size-h5);
  font-weight: $font-weight-bold;
}
</style>