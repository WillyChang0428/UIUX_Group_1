<template>
  <div class="seat-map" ref="seatMapRef">
    <div class="seat-map__toolbar" style="position: relative; z-index: 15">
      <button
        class="seat-map__tool-btn"
        @click="isPanoramaOpen = true"
        aria-label="開啟實景環景"
        :style="{
          opacity: isPreviewOpen ? 0 : 1,
          pointerEvents: isPreviewOpen ? 'none' : 'auto',
          transition: 'opacity 0.2s',
        }"
      >
        <i class="fa-solid fa-camera fs-4"></i>
      </button>

      <button
        class="seat-map__tool-btn"
        @click="togglePreview"
        :aria-label="isPreviewOpen ? '縮回' : '放大預覽'"
      >
        <i
          :class="[
            'fa-solid',
            isPreviewOpen ? 'fa-compress' : 'fa-expand',
            'fs-4',
          ]"
        ></i>
      </button>
    </div>

    <div class="screen-wrapper d-flex flex-column align-items-center mb-2">
      <div class="screen-curve"></div>
      <div class="screen-text fw-Regular">螢幕</div>
    </div>

    <Transition name="fade">
      <div v-if="isPanoramaOpen" class="panorama-overlay">
        <button
          class="panorama-close"
          @click="isPanoramaOpen = false"
          aria-label="關閉實景"
        >
          <i class="fa-solid fa-xmark fs-4"></i>
        </button>
        <div class="panorama-hint">
          <i class="fa-solid fa-arrows-up-down-left-right"></i>
          <span>拖曳移動查看 360° 實景</span>
        </div>
        <div
          class="panorama-viewport"
          @mousedown="onPanStart"
          @mousemove="onPanMove"
          @mouseup="onPanEnd"
          @mouseleave="onPanEnd"
          @touchstart.prevent="onTouchStart"
          @touchmove.prevent="onTouchMove"
          @touchend="onPanEnd"
        >
          <div
            class="panorama-360-bg"
            :style="{
              backgroundImage: `url(${panoramaImage})`,
              backgroundPosition: `${panX}px center`,
            }"
          ></div>
        </div>
      </div>
    </Transition>

    <Transition name="fade">
      <div v-if="isPreviewOpen" class="seat-map__preview-overlay">
        <div class="seat-map__toolbar">
          <div></div>
          <button
            class="seat-map__tool-btn"
            @click="togglePreview"
            aria-label="縮回"
          >
            <i class="fa-solid fa-compress fs-4"></i>
          </button>
        </div>

        <div class="screen-wrapper d-flex flex-column align-items-center">
          <div class="screen-curve"></div>
          <div class="screen-text fw-Regular mb-2">螢幕</div>
        </div>

        <div class="seat-map__preview-scroll">
          <div class="seat-map__grid seat-map__grid--lg">
            <div
              v-for="(row, rowIndex) in seatLayout"
              :key="`lg-${rowIndex}`"
              class="seat-row"
            >
              <template
                v-for="(seatCode, colIndex) in row"
                :key="`lg-${colIndex}`"
              >
                <div
                  v-if="seatCode === 0"
                  class="aisle aisle--main aisle--lg"
                ></div>
                <div
                  v-else-if="seatCode === 5"
                  class="aisle aisle--wheelchair-gap aisle--lg"
                ></div>
                <div v-else class="seat-wrap">
                  <SeatButton
                    size="lg"
                    :state="getSeatState(seatCode, rowIndex, colIndex)"
                    @click="handleSeatClick(rowIndex, colIndex, seatCode)"
                  />
                  <Transition name="tooltip-pop">
                    <div
                      v-if="tooltip.key === `${rowIndex}-${colIndex}`"
                      class="seat-tooltip seat-tooltip--lg"
                      :class="[
                        rowIndex < 3
                          ? 'seat-tooltip--below'
                          : 'seat-tooltip--above',
                        getTooltipClamp(colIndex, row),
                      ]"
                    >
                      <p class="seat-tooltip__text">
                        {{ ROW_LABELS[rowIndex] }} 排
                      </p>
                      <p class="seat-tooltip__text">
                        {{ getDisplayCol(row, colIndex) }} 號座位
                      </p>
                      <div class="seat-tooltip__arrow"></div>
                    </div>
                  </Transition>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <div
      class="seat-map__grid-wrap mb-4"
      :style="{
        opacity: isPreviewOpen ? 0 : 1,
        pointerEvents: isPreviewOpen ? 'none' : 'auto',
        transition: 'opacity 0.2s ease',
      }"
    >
      <div class="seat-map__grid">
        <div
          v-for="(row, rowIndex) in seatLayout"
          :key="rowIndex"
          class="seat-row"
        >
          <template v-for="(seatCode, colIndex) in row" :key="colIndex">
            <div v-if="seatCode === 0" class="aisle aisle--main"></div>
            <div
              v-else-if="seatCode === 5"
              class="aisle aisle--wheelchair-gap"
            ></div>

            <div
              v-else
              class="seat-wrap"
              :data-col-index="colIndex"
              :data-row-index="rowIndex"
            >
              <SeatButton
                size="md"
                :state="getSeatState(seatCode, rowIndex, colIndex)"
                @click="handleSeatClick(rowIndex, colIndex, seatCode)"
              />
              <Transition name="tooltip-pop">
                <div
                  v-if="tooltip.key === `${rowIndex}-${colIndex}`"
                  class="seat-tooltip"
                  :class="[
                    rowIndex < 3
                      ? 'seat-tooltip--below'
                      : 'seat-tooltip--above',
                    getTooltipClamp(colIndex, row),
                  ]"
                >
                  <p class="seat-tooltip__text">
                    {{ ROW_LABELS[rowIndex] }} 排
                  </p>
                  <p class="seat-tooltip__text">
                    {{ getDisplayCol(row, colIndex) }} 號座位
                  </p>
                  <div class="seat-tooltip__arrow"></div>
                </div>
              </Transition>
            </div>
          </template>
        </div>
      </div>
    </div>

    <div
      class="legend-wrapper"
      :style="{
        opacity: isPreviewOpen ? 0 : 1,
        pointerEvents: isPreviewOpen ? 'none' : 'auto',
        transition: 'opacity 0.2s ease',
      }"
    >
      <div class="legend-item">
        <SeatButton size="sm" state="available" class="pointer-events-none" />
        <span>空位</span>
      </div>
      <div class="legend-item">
        <SeatButton size="sm" state="selected" class="pointer-events-none" />
        <span>已選</span>
      </div>
      <div class="legend-item">
        <SeatButton size="sm" state="sold" class="pointer-events-none" />
        <span>佔位</span>
      </div>
      <div class="legend-item">
        <SeatButton size="sm" state="wheelchair" class="pointer-events-none" />
        <span>輪椅位須至影城購買</span>
      </div>
    </div>

    <div
      class="text-center mt-4 mb-2"
      :style="{
        opacity: isPreviewOpen ? 0 : 1,
        transition: 'opacity 0.2s ease',
      }"
    >
      <p v-if="remainingSeats > 0" class="mb-0 fw-bold text-white">
        尚需選 {{ remainingSeats }} 個座位
      </p>
      <p v-else-if="remainingSeats === 0" class="mb-0 fw-bold text-success">
        座位已選滿，請點擊下一步！
      </p>
      <p v-else class="mb-0 fw-bold text-danger">
        您多選了 {{ Math.abs(remainingSeats) }} 個座位，請取消多餘的位子。
      </p>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useBookingStore } from "@/store/bookingStore";
import SeatButton from "@/components/Booking/Button/SeatButton.vue";
import panoramaImage from "@/assets/images/panorama-cinema.jpg";

const props = defineProps({
  ticketCount: { type: Number, default: 2 },
});

const emit = defineEmits(["open-panorama", "seats-selected"]);

const bookingStore = useBookingStore();

// 💡 修改：改用 props.ticketCount 與本地的 selectedSeats 陣列來計算，反應最即時！
const remainingSeats = computed(() => {
  return props.ticketCount - selectedSeats.value.length;
});

const ROW_LABELS = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];

// 0 = 主走道, 1 = 空位, 2 = 售出, 3 = 輪椅
// 5 = 輪椅間保留空格（不顯示座位，視覺寬度等於一個座位位置）
const seatLayout = ref([
  [1, 1, 0, 3, 5, 3, 1, 1, 1, 0, 1, 1],
  [1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1],
  [1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1],
  [1, 1, 0, 1, 2, 2, 2, 2, 1, 0, 1, 1],
  [2, 2, 0, 1, 1, 2, 1, 2, 1, 0, 1, 1],
  [1, 1, 0, 2, 2, 1, 1, 1, 1, 0, 1, 1],
  [2, 1, 0, 1, 2, 2, 1, 1, 1, 0, 1, 2],
  [1, 2, 0, 1, 1, 1, 1, 2, 1, 0, 2, 1],
  [2, 2, 0, 2, 2, 2, 2, 2, 2, 0, 2, 2],
]);

const selectedSeats = ref([]);
const tooltip = ref({ key: "" });

const getSeatState = (code, rowIndex, colIndex) => {
  const key = `${rowIndex}-${colIndex}`;
  if (selectedSeats.value.includes(key)) return "selected";
  if (code === 3) return "wheelchair";
  if (code === 2) return "sold";
  return "available";
};

const getDisplayCol = (row, colIndex) => {
  let count = 0;
  for (let i = 0; i <= colIndex; i++) {
    if (row[i] !== 0 && row[i] !== 5) count++;
  }
  return count;
};

const getTooltipClamp = (colIndex, row) => {
  const validIndices = row.reduce((acc, v, i) => {
    if (v !== 0 && v !== 5) acc.push(i);
    return acc;
  }, []);
  const firstReal = validIndices[0];
  const lastReal = validIndices[validIndices.length - 1];
  if (colIndex <= firstReal + 1) return "seat-tooltip--clamp-left";
  if (colIndex >= lastReal - 1) return "seat-tooltip--clamp-right";
  return "";
};

const handleSeatClick = (rowIndex, colIndex, seatCode) => {
  // 排除無法點擊的座位狀態 (走道、佔位、輪椅、輪椅間距)
  if (seatCode === 0 || seatCode === 2 || seatCode === 3 || seatCode === 5)
    return;

  const key = `${rowIndex}-${colIndex}`;
  const idx = selectedSeats.value.indexOf(key);

  if (idx >= 0) {
    // 💡 邏輯 1：如果已經選過，再次點擊一樣是「取消選取」
    selectedSeats.value.splice(idx, 1);
    tooltip.value.key = "";
  } else {
    // 💡 邏輯 2：如果還沒選過，準備加入新座位
    // 【核心修改】：判斷是否大於等於限制數量，若超過則移除最舊的紀錄 (shift)
    while (selectedSeats.value.length >= props.ticketCount) {
      selectedSeats.value.shift(); // shift() 會移除陣列的第 0 項 (最先被選的座位)
    }

    // 加入最新的座位
    selectedSeats.value.push(key);
    tooltip.value.key = key;
  }

  // 發送更新後的結果給父元件
  emit(
    "seats-selected",
    selectedSeats.value.map((k) => {
      const [r, c] = k.split("-").map(Number);
      return { row: ROW_LABELS[r], col: getDisplayCol(seatLayout.value[r], c) };
    }),
  );
};

const isPreviewOpen = ref(false);
const togglePreview = () => {
  isPreviewOpen.value = !isPreviewOpen.value;
};

// ── 實景環景 (360° 水平無縫版) ───────────────────────────────────────────
const isPanoramaOpen = ref(false);
const panX = ref(0); // 只需要水平位移 (無限)
let isPanning = false;
let startX = 0;
let startPanX = 0;

// 統一取得觸控與滑鼠的座標
const getPointerPos = (e) => {
  return e.touches ? e.touches[0] : e;
};

const onPanStart = (e) => {
  isPanning = true;
  const pointer = getPointerPos(e);
  startX = pointer.clientX;
  startPanX = panX.value;
};

const onPanMove = (e) => {
  if (!isPanning) return;
  const pointer = getPointerPos(e);

  // 水平滑動的靈敏度
  const speedX = 1.5;
  const dx = (pointer.clientX - startX) * speedX;

  // 💡 水平方向：完全不設限，無限旋轉 (移除了 panY 的計算)
  panX.value = startPanX + dx;
};

const onPanEnd = () => {
  isPanning = false;
};

const onTouchStart = onPanStart;
const onTouchMove = onPanMove;
</script>

<style lang="scss" scoped>
@import "@/assets/scss/variables";

.seat-map {
  display: flex;
  flex-direction: column;
  gap: v.$spacing-xs-mobile;
  background: transparent;
  padding: v.$spacing-xs-mobile;
  position: relative;
  width: 100%;
  overflow: hidden; // 放大預覽時蓋住底層，防止透出
}

// ── 工具列 ─────────────────────────────────────────────────────
.seat-map__toolbar {
  display: flex;
  justify-content: space-between;
}

.seat-map__tool-btn {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  border: 1px solid rgba(v.$white, 0.25);
  background: rgba(v.$white, 0.08);
  color: v.$light;
  font-size: 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: rgba(v.$white, 0.18);
  }
}

// ── 問題三：螢幕，移除分隔線 ──────────────────────────────────
// 使用 flex + 無 border 的方式，讓光暈自然往下延伸到文字
// 問題二：曲線加 filter，文字不加 filter（用 isolation 隔離）

.screen-curve {
  width: 80%;

  // 💡 1. 將高度加倍 (原本 16px -> 32px)，讓它成為一個完整的對稱橢圓
  height: 32px;

  // 💡 2. 四周都給邊框，但設為透明 (這能消除任何數學上的平滑直線邊緣)
  border: 3px solid transparent;

  // 💡 3. 只讓上方的邊框顯示顏色，這樣左右兩端就會有非常漂亮、銳利的漸隱收尾
  border-top-color: v.$vieshow-warning;

  // 💡 4. 使用完美的對稱橢圓
  border-radius: 50%;

  // 💡 5. 利用負間距把下半部多出來的透明高度扣掉，確保下方的「螢幕」文字位置不變
  margin-bottom: -16px;

  // 光暈維持原本的高級多層次設定
  filter: drop-shadow(0px 0px 3px rgba(v.$vieshow-warning, 0.9))
    drop-shadow(0px 4px 12px rgba(v.$vieshow-warning, 0.6))
    drop-shadow(0px 8px 24px rgba(v.$vieshow-warning, 0.3));

  display: block;
  line-height: 0;
  font-size: 0;
}

.screen-text {
  color: v.$vieshow-warning;
  margin-top: 4px;
  margin-bottom: 0;
  letter-spacing: 2px;
  font-size: var(--app-font-size-base);
  line-height: 1.2;
  // 問題二：不加任何光暈，純文字
}

// ── 座位格線 ───────────────────────────────────────────────────
.seat-map__grid-wrap {
  width: 100%;
  overflow: visible;
}

.seat-map__grid {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}

.seat-row {
  display: flex;
  align-items: center;
  gap: 4px;
}

// ── 問題二：走道寬度拆分 ───────────────────────────────────────
.aisle {
  flex-shrink: 0;

  // 主走道（左右兩側）
  &--main {
    width: 20px; // 較寬，明顯走道感
  }

  // 輪椅間空格（保留一個座位的位置，視覺等於一個座位寬）
  // md SeatButton = 30px
  &--wheelchair-gap {
    width: 30px; // 與 md 座位同寬，視覺保留一個空位
  }

  // 放大版
  &--lg {
    &.aisle--main {
      width: 28px;
    }
    &.aisle--wheelchair-gap {
      width: 50px;
    } // 與 lg SeatButton(50px) 同寬
  }
}

// ── 座位 wrap ─────────────────────────────────────────────────
.seat-wrap {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

// ── 問題一：Tooltip 加回箭頭 ──────────────────────────────────
.seat-tooltip {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  background: #0d2a4a;
  border: 2.5px solid v.$vieshow-primary;
  border-radius: v.$border-radius-mobile;
  padding: v.$spacing-sm-mobile v.$spacing-md-mobile;
  text-align: center;
  white-space: nowrap;
  pointer-events: none;
  z-index: 19;

  // 向上顯示（第4排以後）→ 箭頭在下方
  &--above {
    bottom: calc(100% + 10px);
    top: auto;

    .seat-tooltip__arrow {
      top: 100%;
      border-left: 9px solid transparent;
      border-right: 9px solid transparent;
      border-top: 9px solid v.$vieshow-primary;

      &::after {
        content: "";
        position: absolute;
        top: -11px;
        left: 50%;
        transform: translateX(-50%);
        border-left: 7px solid transparent;
        border-right: 7px solid transparent;
        border-top: 8px solid #0d2a4a;
      }
    }
  }

  // 向下顯示（前3排）→ 箭頭在上方
  &--below {
    top: calc(100% + 10px);
    bottom: auto;

    .seat-tooltip__arrow {
      bottom: 100%;
      border-left: 9px solid transparent;
      border-right: 9px solid transparent;
      border-bottom: 9px solid v.$vieshow-primary;

      &::after {
        content: "";
        position: absolute;
        bottom: -11px;
        left: 50%;
        transform: translateX(-50%);
        border-left: 7px solid transparent;
        border-right: 7px solid transparent;
        border-bottom: 8px solid #0d2a4a;
      }
    }
  }

  // 邊界防裁切
  &--clamp-left {
    left: 0;
    transform: translateX(0);
    .seat-tooltip__arrow {
      left: 15px;
      transform: translateX(0);
    }
  }

  &--clamp-right {
    left: auto;
    right: 0;
    transform: translateX(0);
    .seat-tooltip__arrow {
      left: auto;
      right: 15px;
      transform: translateX(0);
    }
  }

  &--lg {
    padding: v.$spacing-sm-mobile v.$spacing-lg-mobile;
    border-radius: v.$border-radius-lg-mobile;
    border-width: 3px;
  }
}

.seat-tooltip__text {
  margin: 0;
  font-size: v.$h5-font-size-mobile;
  font-weight: 700;
  color: v.$light;
  line-height: 1.4;

  .seat-tooltip--lg & {
    font-size: v.$h4-font-size-mobile;
  }
}

// 箭頭共用樣式
.seat-tooltip__arrow {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
}

// ── 圖例 ───────────────────────────────────────────────────────
.legend-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: var(--gap-sm);
  border-top: 1px solid rgba(v.$white, 0.08);
  padding-top: v.$spacing-lg-mobile;
  margin-top: v.$spacing-xs-mobile;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  color: v.$light;
  font-size: var(--app-font-size-sm);
}

.pointer-events-none {
  pointer-events: none;
}

// ── 放大預覽：absolute 填滿 .seat-map，overflow hidden 蓋住底層 ──
.seat-map__preview-overlay {
  position: absolute;
  inset: 0;
  z-index: 10;
  display: flex;
  flex-direction: column;
  gap: v.$spacing-xs-mobile;
  padding: v.$spacing-xs-mobile;
  overflow: hidden; // 確保底層完全被蓋住
}

.seat-map__preview-scroll {
  overflow: auto; // 上下左右都可滾動
  scrollbar-width: thin;
  scrollbar-color: rgba(v.$white, 0.2) transparent;
  cursor: grab;
  flex: 1;
  // 讓 touch 裝置也能拖拉
  -webkit-overflow-scrolling: touch;

  &:active {
    cursor: grabbing;
  }

  .seat-map__grid--lg {
    width: max-content;
    min-width: 100%;
    margin: 0 auto;
    padding: v.$spacing-sm-mobile;
    .seat-row {
      gap: 6px;
    }
  }
}

// ── 實景環景 overlay ───────────────────────────────────────────
.panorama-overlay {
  position: absolute;
  inset: 0;
  background: v.$black;
  z-index: 20;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.panorama-360-bg {
  width: 100%;
  height: 100%;
  // 💡 關鍵：高度設為 100%，讓它完美貼合容器上下邊緣，絕對不會漏出黑邊
  background-size: auto 100%;
  background-repeat: repeat-x;
  will-change: background-position;
  transition: background-position 0.05s linear;
}

.panorama-viewport {
  width: 100%;
  height: 100%;
  overflow: hidden;
  cursor: grab;
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;

  &:active {
    cursor: grabbing;
    // 💡 拖曳當下取消過渡動畫，達到「完美跟手」的即時效果
    .panorama-360-bg {
      transition: none;
    }
  }
}

.panorama-close {
  position: absolute;
  top: v.$spacing-sm-mobile;
  right: v.$spacing-sm-mobile;
  width: 45px;
  height: 45px;
  border-radius: 50%;
  border: 1px solid rgba(v.$white, 0.3);
  background: rgba(v.$black, 0.6);
  color: v.$light;
  font-size: 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 21;
  transition: background 0.2s;
  &:hover {
    background: rgba(v.$black, 0.85);
  }
}

.panorama-hint {
  position: absolute;
  bottom: v.$spacing-md-mobile;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(v.$black, 0.55);
  border-radius: v.$border-radius-pill;
  padding: v.$spacing-xs-mobile v.$spacing-sm-mobile;
  color: rgba(v.$white, 0.75);
  font-size: var(--app-font-size-mini);
  z-index: 21;
  pointer-events: none;
  white-space: nowrap;
}

// ── Transitions ────────────────────────────────────────────────
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.tooltip-pop-enter-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}
.tooltip-pop-leave-active {
  transition: opacity 0.15s ease;
}
.tooltip-pop-enter-from {
  opacity: 0;
  transform: translateX(-50%) translateY(6px);
}
.tooltip-pop-leave-to {
  opacity: 0;
}
</style>
