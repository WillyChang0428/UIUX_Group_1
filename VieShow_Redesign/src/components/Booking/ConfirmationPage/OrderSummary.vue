<template>
  <h2 class="order-summary__title">付款明細</h2>
  <div class="order-summary">
    
    <div class="summary-section">
      <div class="summary-section__header">
        <span class="summary-section__label text-secondary">票種</span>
        <button class="summary-section__edit" @click="router.push('/booking/ticket')">
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
        <button class="summary-section__edit" @click="router.push('/booking/seat')">
          <i class="fa-solid fa-pen fa-xs"></i>
          修改座位
        </button>
      </div>

      <div class="summary-section__body">
        <div class="d-flex flex-wrap gap-2">
          <SelectedTag 
            v-for="(seat, index) in bookingStore.selectedSeats" 
            :key="`${seat?.rowLabel}-${seat?.colLabel}-${index}`"
            :seat="seat" 
          >
            {{ seat.rowLabel }}排 {{ seat.colLabel }}號
          </SelectedTag>
          
          <span v-if="bookingStore.selectedSeats.length === 0" class="text-secondary fs-6">
            尚未選擇座位
          </span>
        </div>
      </div>
    </div>

    <hr class="summary-divider" />

    <div class="summary-section">
      <div class="summary-section__header">
        <span class="summary-section__label text-secondary">加購餐點</span>
        <button class="summary-section__edit" @click="router.push('/booking/food')">
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
import { useRouter } from 'vue-router'; // 💡 引入 Vue Router
import SelectedTag from '@/components/Booking/Button/SelectedTag.vue';
import { useBookingStore } from '@/store/bookingStore';

// 💡 實體化 router
const router = useRouter();
const bookingStore = useBookingStore();

// ── 動態計算明細 (Computed) ──────────────────────────────

const computedTickets = computed(() => {
  const allTickets = [...bookingStore.tickets, ...bookingStore.combos];
  return allTickets.map(item => ({
    id: item?.id || Math.random(),
    name: item?.name || '未知項目',
    quantity: item?.quantity || 0,
    subtotal: (item?.price || 0) * (item?.quantity || 0)
  }));
});

const computedFoods = computed(() => {
  return bookingStore.foodAddOns.map(item => ({
    id: item?.id || Math.random(),
    name: item?.name || '未知餐點',
    quantity: item?.quantity || 0,
    subtotal: (item?.price || 0) * (item?.quantity || 0)
  }));
});

const computedFees = computed(() => {
  const totalQty = bookingStore.totalTicketCount || 0;
  return {
    quantity: totalQty,
    subtotal: totalQty * 20
  };
});

const totalFormatted = computed(() => {
  const absoluteTotal = bookingStore.finalTotal + computedFees.value.subtotal;
  return absoluteTotal.toLocaleString(); 
});
</script>

<style lang="scss" scoped>
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