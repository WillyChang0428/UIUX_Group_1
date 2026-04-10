<template>
  <div class="ticket-selector">

    <!-- ① 一般票種 ──────────────────────────────────────────── -->
    <section class="ticket-section">
      <h2 class="ticket-section__title">一般票種</h2>

      <div class="ticket-section__list">
        <TicketRow
          v-for="ticket in generalTickets"
          :key="ticket.id"
          :ticket="ticket"
          :max-qty="remainingQty(ticket)"
          @update-qty="handleUpdateQty"
        />
      </div>

      <!-- 銀行優惠展開按鈕 -->
      <button class="bank-toggle" @click="showBank = !showBank">
        <i class="fa-solid fa-arrow-down"></i>
        <fs-6>查看銀行優惠</fs-6>
        <i class="fa-solid fa-arrow-down"></i>
      </button>

      <!-- 銀行優惠票種（展開） -->
      <Transition name="slide-down">
        <div v-if="showBank" class="ticket-section__list ticket-section__list--bank">
          <TicketRow
            v-for="ticket in bankTickets"
            :key="ticket.id"
            :ticket="ticket"
            :max-qty="remainingQty(ticket)"
            @update-qty="handleUpdateQty"
          />
        </div>
      </Transition>
    </section>

    <!-- ② 其他票種 ──────────────────────────────────────────── -->
    <section class="ticket-section">
      <h2 class="ticket-section__title">
        其他票種
        <span class="ticket-section__subtitle">＊以下票種無法與一般票種同時購買</span>
      </h2>

      <div class="ticket-section__list">
        <TicketRow
          v-for="ticket in otherTickets"
          :key="ticket.id"
          :ticket="ticket"
          :max-qty="remainingQty(ticket)"
          @update-qty="handleUpdateQty"
        />
      </div>
    </section>

    <!-- ③ 底部提示 ───────────────────────────────────────────── -->
    <div class="ticket-notice">
      <p>請選擇欲購票的電影票張數和類型，系統將自動為您保留座位，每筆交易最多可購買 4 張電影票。</p>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import TicketRow from '@/components/Booking/FastBooking/TicketType/TicketRow.vue'

// ── 銀行優惠展開狀態 ───────────────────────────────────────────
const showBank = ref(false)

// ── 票種假資料 ─────────────────────────────────────────────────
const generalTickets = ref([
  {
    id: 'general',
    name: '全票',
    desc: '一般成人無限制',
    price: 380,
    quantity: 0,
  },
  {
    id: 'concession',
    name: '優待票',
    desc: '學生/軍警/孩童',
    note: '需出示相關證件',
    price: 320,
    quantity: 0,
  },
])

const bankTickets = ref([
  {
    id: 'bank-esun',
    name: '玉山銀行無摺取款假日優惠',
    desc: 'PLUS20｜適用影廳：2D/3D/IMAX/TITAN',
    price: 323,
    quantity: 0,
  },
  {
    id: 'bank-esun2',
    name: '玉山一般卡假日優惠 PLUS20',
    desc: '玉山優惠卡假日優惠｜適用影廳：2D/3D/IMAX/TITAN',
    price: 323,
    quantity: 0,
  },
  {
    id: 'bank-esun3',
    name: '玉山實體生活卡假日優惠',
    desc: 'PLUS20｜玉山卡假日優惠名卡假日優惠 PLUS20｜適用影廳：2D/3D/IMAX/TITAN',
    price: 323,
    quantity: 0,
  },
])

const otherTickets = ref([
  {
    id: 'free',
    name: '免費兌換券',
    desc: '持有電影兌換票券',
    note: '限電影兌換券使用',
    price: 0,
    quantity: 0,
  },
  {
    id: 'elder',
    name: '敬老/愛心票',
    desc: '年滿65歲以上並持有身心障礙手冊',
    note: '需出示相關證件',
    price: 320,
    quantity: 0,
  },
  {
    id: 'group',
    name: '團體票',
    desc: '持有當體電影優惠票',
    note: '需提前申請',
    price: 320,
    quantity: 0,
    needCode: true,
    codePlaceholder: '票券前三碼英文字母',
  },
])

// ── 總張數限制（最多 4 張）────────────────────────────────────
const totalQty = computed(() => {
  const all = [...generalTickets.value, ...bankTickets.value, ...otherTickets.value]
  return all.reduce((sum, t) => sum + t.quantity, 0)
})

// 每張票的最大可加數量 = 4 - 已選總數 + 自己目前數量
const remainingQty = (ticket) => {
  return Math.min(4, ticket.quantity + (4 - totalQty.value))
}

// ── 加減數量 ───────────────────────────────────────────────────
const handleUpdateQty = (id, delta) => {
  const all = [...generalTickets.value, ...bankTickets.value, ...otherTickets.value]
  const ticket = all.find(t => t.id === id)
  if (!ticket) return

  const next = ticket.quantity + delta
  if (next < 0) return
  if (totalQty.value + delta > 4 && delta > 0) return   // 總數不超過 4

  ticket.quantity = next
}
</script>

<style lang="scss" scoped>
@import "@/assets/scss/variables";

.ticket-selector {
  display: flex;
  flex-direction: column;
  gap: $spacing-md-mobile;                     // 16px
}

// ── 區塊 ───────────────────────────────────────────────────────
.ticket-section {
  display: flex;
  flex-direction: column;
}

.ticket-section__title {
  margin: 0 0 $spacing-xs-mobile;
  font-size: $h5-font-size-mobile;             // 18px
  font-weight: 700;
  color: $light;
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 6px;
}

.ticket-section__subtitle {
  font-size: var(--app-font-size-sm);           // 12px
  font-weight: 400;
  color: $vieshow-warning;
}

.ticket-section__list {
  display: flex;
  flex-direction: column;

  &--bank {
    margin-bottom: $spacing-xs-mobile;
  }
}

// ── 銀行優惠展開按鈕 ───────────────────────────────────────────
.bank-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  width: 100%;
  padding: $spacing-xs-mobile;
  background: transparent;
  border: none;
  color: $vieshow-secondary;
  font-size: $font-size-sm-mobile;             // 14px
  cursor: pointer;
  transition: color 0.2s ease;

  &:hover {
    color: $light;
  }

  i {
    font-size: 12px;
  }
}

// ── 展開動畫 ───────────────────────────────────────────────────
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
  max-height: 600px;
}

.slide-down-enter-from,
.slide-down-leave-to {
  max-height: 0;
  opacity: 0;
}

// ── 底部提示 ───────────────────────────────────────────────────
.ticket-notice {
  padding: $spacing-sm-mobile;
  background: rgba($white, 0.04);
  border-radius: $border-radius-mobile;

  p {
    margin: 0;
    font-size: var(--app-font-size-base);         // 12px
    color: $vieshow-secondary;
    line-height: $line-height-relaxed;
    text-align: center;
  }
}
</style>