<template>
  <div class="combo-slider">
    <!-- 區塊標題 -->
    <h3 class="combo-slider__title mb-3">限定套票</h3>

    <!-- Swiper 水平滑動容器 -->
      <div
        class="combo-slider__track-wrapper mb-4"
        ref="sliderRef"
        @mousedown="onMouseDown"
        @mouseleave="onMouseLeave"
        @mouseup="onMouseUp"
        @mousemove="onMouseMove"
      >
        <div class="combo-slider__track">
          <ComboCard
            v-for="item in comboList"
            :key="item.id"
            :item="item"
            @update-qty="handleUpdateQty"
          />
        </div>
      </div>
    </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useBookingStore } from "@/store/bookingStore";
import ComboCard from "@/components/Booking/Button/TicketType/ComboCard.vue";

const bookingStore = useBookingStore();

// ── 💡 新增：滑鼠拖曳滑動邏輯 ──────────────────────────────────
const sliderRef = ref(null);
let isDown = false;
let startX = 0;
let scrollLeft = 0;

const onMouseDown = (e) => {
  isDown = true;
  // 記錄按下去那一刻的 X 座標與目前的捲動距離
  startX = e.pageX - sliderRef.value.offsetLeft;
  scrollLeft = sliderRef.value.scrollLeft;
};

const onMouseLeave = () => {
  isDown = false; // 滑鼠移出範圍時取消拖曳狀態
};

const onMouseUp = () => {
  isDown = false; // 放開滑鼠時取消拖曳狀態
};

const onMouseMove = (e) => {
  if (!isDown) return; // 如果沒有按住，就不執行
  e.preventDefault(); // 防止反白選取文字等預設行為
  const x = e.pageX - sliderRef.value.offsetLeft;
  const walk = (x - startX) * 1.5; // 1.5 是滑動速度倍率，可自行調整
  sliderRef.value.scrollLeft = scrollLeft - walk;
};

// ── 套票假資料 ─────────────────────────────────────────────────
const comboList = ref([
  {
    id: 1,
    name: "超級瑪利歐銀河電影版獨家星際奇遇收藏套票",
    description:
      "1張電影票、1份袋著走爆米花、1組獨家銀河遠征A3工藝海報組(海報4/22起開放領取至5/21)",
    price: 540,
    image:
      "https://www.unicornpopcorn.com.tw/ForVieShowTicket/TicketTypeImage/%E8%B6%85%E7%B4%9A%E7%91%AA%E5%88%A9%E6%AD%90%E9%8A%80%E6%B2%B3%E9%9B%BB%E5%BD%B1%E7%89%88%E7%8D%A8%E5%AE%B6%E6%98%9F%E9%9A%9B%E5%A5%87%E9%81%87%E6%94%B6%E8%97%8F%E5%A5%97%E7%A5%A8.png",
    ticketCount: 1, // 💡 新增：此套票包含 1 張電影票
    quantity: 0,
  },
  {
    id: 2,
    name: "超級瑪利歐雙人電影套票D",
    description:
      "2張電影票+1份中爆米花+2杯大杯飲料+1個超級瑪利歐 絨毛鑰匙圈盲盒+1份吉拿棒(3/27起開放領取)",
    price: 1079,
    image:
      "https://www.unicornpopcorn.com.tw/ForVieShowTicket/TicketTypeImage/%E8%B6%85%E7%B4%9A%E7%91%AA%E5%88%A9%E6%AD%90%E9%9B%99%E4%BA%BA%E9%9B%BB%E5%BD%B1%E5%A5%97%E7%A5%A8D.png",
    ticketCount: 2, // 💡 新增：此套票包含 2 張電影票
    quantity: 0,
  },
  {
    id: 3,
    name: "麥可傑克森雙人電影套票",
    description:
      "2張電影票+1個麥可傑克森 帽子造型爆米花桶 (另附中爆米花)+2杯中杯飲料(4/22起開放領取)",
    price: 1099,
    image:
      "https://www.unicornpopcorn.com.tw/ForVieShowTicket/TicketTypeImage/%E9%BA%A5%E5%8F%AF%E5%82%91%E5%85%8B%E6%A3%AE%E9%9B%99%E4%BA%BA%E9%9B%BB%E5%BD%B1%E5%A5%97%E7%A5%A8.png",
    ticketCount: 2, // 💡 新增：此套票包含 2 張電影票
    quantity: 0,
  },
  {
    id: 4,
    name: "史努比小籠包雙人電影套票C",
    description:
      "2張電影票+1份中爆米花+2杯中杯飲料+1個史努比小籠包抱枕毯(02/27起開放領取)",
    price: 1399,
    image:
      "https://www.unicornpopcorn.com.tw/ForVieShowTicket/TicketTypeImage/%E5%8F%B2%E5%8A%AA%E6%AF%94%E5%B0%8F%E7%B1%A0%E5%8C%85%E9%9B%99%E4%BA%BA%E9%9B%BB%E5%BD%B1%E5%A5%97%E7%A5%A8C.png",
    ticketCount: 2, // 💡 新增：此套票包含 1 張電影票
    quantity: 0,
  },
]);

// ── 💡 加減數量與全域配額檢查 ──────────────────────────────────
const handleUpdateQty = (id, delta) => {
  const item = comboList.value.find((c) => c.id === id);
  if (!item) return;

  const next = item.quantity + delta;
  if (next < 0) return; // 數量不能扣成負數

  // 💡 如果是按下「+」增加數量，就要跟大腦的總數做比對
  if (delta > 0) {
    // 算出這次點擊會增加幾張「實體票」 (例如雙人套票 delta 1 * ticketCount 2 = 2)
    const ticketsToAdd = delta * item.ticketCount;

    // 把「大腦裡現有的總票數」加上「這次想買的票數」，看會不會超過 4
    if (bookingStore.totalTicketCount + ticketsToAdd > 4) {
      alert(
        `座位最多只能選 4 個。此套票包含 ${item.ticketCount} 張票，剩餘配額不足！`,
      );
      return; // 🛑 超過就擋下來，不執行後面的加總
    }
  }

  // 檢查通過，更新數量！
  item.quantity = next;
};

// 深度監聽陣列，只要數量改變，就把有選購的套票存入 Pinia
watch(
  comboList,
  (newVal) => {
    const selectedCombos = newVal.filter((c) => c.quantity > 0);
    bookingStore.updateCombos(selectedCombos);
  },
  { deep: true },
);
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
  font-size: $h5-font-size-mobile; // 20px
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
  &::-webkit-scrollbar {
    display: none;
  }
  // 讓卡片陰影/邊框不被截斷
  padding: 4px 2px 12px;
  margin: -4px -2px -12px;
}

.combo-slider__track {
  display: flex;
  gap: $spacing-sm-mobile; // 16px 間距
  width: max-content; // 讓軌道依卡片數量延展
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
