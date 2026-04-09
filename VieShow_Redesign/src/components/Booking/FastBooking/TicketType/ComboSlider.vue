<template>
  <div class="combo-slider">
    <!-- 區塊標題 -->
    <h3 class="combo-slider__title mb-3">限定套票</h3>

    <!-- Swiper 水平滑動容器 -->
    <div class="combo-slider__track-wrapper">
      <div class="combo-slider__track">
        <ComboCard
          v-for="item in comboList"
          :key="item.id"
          :item="item"
          @update-qty="handleUpdateQty"
        />
      </div>
    </div>

    <!-- 已選購摘要（有選購才顯示） -->
    <div v-if="totalCount > 0" class="combo-slider__summary">
      <span class="summary__label">已選 {{ totalCount }} 項</span>
      <span class="summary__total">小計 NT {{ totalPrice }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import ComboCard from '@/components/Booking/FastBooking/TicketType/ComboCard.vue'

// ── 套票假資料 ─────────────────────────────────────────────────
const comboList = ref([
  {
    id: 1,
    name: '咒術迴戰2025雙人電影套票',
    description: '2張電影票+1份中爆米花+1杯中杯飲料+1個咒術迴戰擺玉，玉折Topper杯飲料+1份吉拿棒+1咒術迴戰小卡組',
    price: 1139,
    image: 'https://picsum.photos/seed/combo1/400/400',
    quantity: 0,
  },
  {
    id: 2,
    name: '沙丘2025獨享全餐',
    description: '1張電影票+1份大爆米花+1杯大杯飲料+沙丘限定貼紙組',
    price: 699,
    image: 'https://picsum.photos/seed/combo2/400/400',
    quantity: 0,
  },
  {
    id: 3,
    name: '極限返航冒險套組',
    description: '2張電影票+2份小爆米花+2杯中杯飲料+限定航行主題馬克杯',
    price: 980,
    image: 'https://picsum.photos/seed/combo3/400/400',
    quantity: 0,
  },
  {
    id: 4,
    name: 'VIP豪華獨享包',
    description: '1張VIP座位票+1份大爆米花+1杯特調飲料+限定周邊一件',
    price: 890,
    image: 'https://picsum.photos/seed/combo4/400/400',
    quantity: 0,
  },
])

// ── 加減數量（限 0~4）─────────────────────────────────────────
const handleUpdateQty = (id, delta) => {
  const item = comboList.value.find(c => c.id === id)
  if (!item) return
  const next = item.quantity + delta
  if (next < 0 || next > 4) return
  item.quantity = next
}

// ── 統計 ───────────────────────────────────────────────────────
const totalCount = computed(() =>
  comboList.value.reduce((sum, c) => sum + c.quantity, 0)
)

const totalPrice = computed(() =>
  comboList.value.reduce((sum, c) => sum + c.price * c.quantity, 0).toLocaleString()
)
</script>

<style lang="scss" scoped>
@import "@/assets/scss/variables";

.combo-slider {
  display: flex;
  flex-direction: column;
  gap: $spacing-sm-mobile;
}

// ── 標題 ───────────────────────────────────────────────────────
.combo-slider__title {
  margin: 0;
  font-size: $h5-font-size-mobile;             // 20px
  font-weight: 700;
  color: $light;
  letter-spacing: 0.04em;
}

// ── 滑動軌道 ───────────────────────────────────────────────────
.combo-slider__track-wrapper {
  overflow-x: auto;
  overflow-y: visible;
  // 隱藏 scrollbar 但保留滑動功能
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar { display: none; }
  // 讓卡片陰影/邊框不被截斷
  padding: 4px 2px 12px;
  margin: -4px -2px -12px;
}

.combo-slider__track {
  display: flex;
  gap: $spacing-sm-mobile;                     // 16px 間距
  width: max-content;                          // 讓軌道依卡片數量延展
}

// ── 已選摘要 ───────────────────────────────────────────────────
.combo-slider__summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: $spacing-xs-mobile $spacing-sm-mobile;
  background: rgba($vieshow-primary, 0.1);
  border: 1px solid rgba($vieshow-primary, 0.3);
  border-radius: $border-radius-mobile;
}

.summary__label {
  font-size: $font-size-sm-mobile;
  color: $vieshow-tertiary;
}

.summary__total {
  font-size: $font-size-sm-mobile;
  font-weight: 700;
  color: $vieshow-primary;
}
</style>