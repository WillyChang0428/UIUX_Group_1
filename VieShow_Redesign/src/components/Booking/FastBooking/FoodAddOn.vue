<template>
  <div class="food-addon">

    <!-- 頁籤列：橫向滾動不換行 -->
    <div class="food-addon__tabs-wrap">
      <div class="d-flex gap-2 food-addon__tabs">
        <FilterButton
          v-for="tab in tabs"
          :key="tab.key"
          :label="tab.label"
          :active="activeTab === tab.key"
          @toggle="activeTab = tab.key"
        />
      </div>
    </div>

    <!-- 餐點列表 -->
    <div class="food-addon__list">
      <div
        v-for="(item, index) in currentItems"
        :key="item.id"
        class="food-item d-flex align-items-start justify-content-between"
        :class="[
          index % 2 === 0 ? 'food-item--even' : 'food-item--odd',
          { 'food-item--active': item.quantity > 0 }
        ]"
      >
        <!-- 左：圖片 -->
        <div class="food-item__img-wrap">
          <img :src="item.image" :alt="item.name" class="food-item__img" />
        </div>

        <!-- 中：品名（有數量時變 primary 色）-->
        <div class="food-item__info d-flex flex-column justify-content-between">
          <p
            class="food-item__name mb-0"
            :class="{ 'food-item__name--active': item.quantity > 0 }"
          >{{ item.name }}</p>
          <div class="d-flex flex-column align-items-baseline">
            <span v-if="item.originalPrice" class="food-item__price-original">
              NT {{ item.originalPrice }}
            </span>
            <span class="food-item__price">NT {{ item.price }}</span>
          </div>
        </div>

        <!-- 右：價格 + StepperCounter（每品項上限 9，最少 0）-->
        <div class="food-item__right d-flex flex-column justify-content-end align-items-end">
          

          <StepperCounter
            :model-value="item.quantity"
            :min="0"
            :max="9"
            @update:model-value="(val) => updateQty(item, val)"
          />
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import FilterButton from '@/components/Booking/FastBooking/Button/FilterButton.vue'
import StepperCounter from '@/components/Booking/FastBooking/Button/StepperCounter.vue'

const emit = defineEmits(['update'])

// ── 頁籤 ───────────────────────────────────────────────────────
const tabs = [
  { key: 'popcorn', label: '爆米花' },
  { key: 'drink',   label: '飲料' },
  { key: 'food',    label: '熱食' },
  { key: 'combo',   label: '銀行優惠餐' },
]

const activeTab = ref('popcorn')

// ── 商品資料 ───────────────────────────────────────────────────
const allItems = ref([
  { id: 'p1', tab: 'popcorn', name: '大爆米花', price: 145,
    image: 'https://picsum.photos/seed/popcorn-lg/120/120', quantity: 0 },
  { id: 'p2', tab: 'popcorn', name: '中爆米花', price: 136,
    image: 'https://picsum.photos/seed/popcorn-md/120/120', quantity: 0 },
  { id: 'p3', tab: 'popcorn', name: '小爆米花', price: 128,
    image: 'https://picsum.photos/seed/popcorn-sm/120/120', quantity: 0 },
  { id: 'd1', tab: 'drink', name: '大可樂', price: 77,
    image: 'https://picsum.photos/seed/cola-lg/120/120', quantity: 0 },
  { id: 'd2', tab: 'drink', name: '中可樂', price: 68,
    image: 'https://picsum.photos/seed/cola-md/120/120', quantity: 0 },
  { id: 'd3', tab: 'drink', name: '小可樂', price: 64,
    image: 'https://picsum.photos/seed/cola-sm/120/120', quantity: 0 },
  { id: 'f1', tab: 'food', name: '熱狗', price: 140, originalPrice: 165,
    image: 'https://picsum.photos/seed/hotdog/120/120', quantity: 0 },
  { id: 'f2', tab: 'food', name: '吉拿棒', price: 140,
    image: 'https://picsum.photos/seed/churros/120/120', quantity: 0 },
  { id: 'b1', tab: 'combo', name: '星展中可小爆', price: 49,
    image: 'https://picsum.photos/seed/dbs/120/120', quantity: 0 },
  { id: 'b2', tab: 'combo', name: '台新中可小爆', price: 35,
    image: 'https://picsum.photos/seed/taishin/120/120', quantity: 0 },
])

const currentItems = computed(() =>
  allItems.value.filter(item => item.tab === activeTab.value)
)

// 直接接收 StepperCounter 的新值（不是 delta）
const updateQty = (item, newVal) => {
  item.quantity = newVal
  emit('update', allItems.value.filter(i => i.quantity > 0))
}
</script>

<style lang="scss" scoped>
@import "@/assets/scss/variables";

.food-addon {
  width: 100%;
  font-family: 'Noto Sans TC', 'PingFang TC', sans-serif;
}

// ── 頁籤：橫向滾動 ────────────────────────────────────────────
.food-addon__tabs-wrap {
  overflow-x: auto;
  overflow-y: visible;
  scrollbar-width: none;
  -ms-overflow-style: none;
  padding-bottom: var(--gap-md);
  margin-bottom: var(--gap-sm);
  &::-webkit-scrollbar { display: none; }
}

.food-addon__tabs {
  flex-wrap: nowrap;
  width: max-content;
}

// ── 餐點列表：延伸左右 ────────────────────────────────────────
.food-addon__list {
  display: flex;
  flex-direction: column;
  margin-left: calc(-1 * var(--gap-lg));
  margin-right: calc(-1 * var(--gap-lg));

  @include media-breakpoint-up(md) {
    margin-left: calc(-1 * var(--gap-2xl));
    margin-right: calc(-1 * var(--gap-2xl));
  }
}

// ── 單一餐點列 ─────────────────────────────────────────────────
.food-item {
  height: 80pt;
  display: flex;
  align-items: center;
  gap: var(--gap-sm);
  padding: var(--gap-md) var(--gap-lg);
  transition: background 0.15s ease;

  @include media-breakpoint-up(md) {
    padding: var(--gap-sm) var(--gap-2xl);
    height: 100pt;
  }

  // 交替背景
  &--even { background: transparent; }
  &--odd  { background-color: v.$vieshow-dark-section; }
  // &--active { background: rgba(v.$vieshow-primary, 0.08) !important; }
}

// ── 圖片 ───────────────────────────────────────────────────────
.food-item__img-wrap {
  height: 100%;
  flex-shrink: 0;
  border-radius: var(--app-radius);
  overflow: hidden;
  background-color: rgba(v.$white, 0.05);
}

.food-item__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

// ── 品名 ───────────────────────────────────────────────────────
.food-item__info {
  flex: 1;
  height: 100%;
  display: flex;
  align-items: start;
  min-width: 0;
}

.food-item__name {
  font-size: var(--app-font-size-h6);
  font-weight: 400;
  color: v.$white;
  line-height: 1.5;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: color 0.2s ease;

  // 有數量時變 primary 藍色
  &--active { color: v.$vieshow-primary; }
}

// ── 右側：價格 + 計數器（水平排列）──────────────────────────
.food-item__right {
  height: 100%;
  flex-shrink: 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: var(--gap-sm);
}

.food-item__price-original {
  color: v.$vieshow-secondary;
  text-decoration: line-through;
  font-size: var(--app-font-size-sm);
}

.food-item__price {
  font-size: var(--app-font-size-h6);
  font-weight: 700;
  color: v.$vieshow-danger;
}
</style>