<template>
  <div class="seat-map" ref="seatMapRef">

    <!-- 工具列 -->
    <div class="seat-map__toolbar">
      <button class="seat-map__tool-btn" @click="$emit('open-panorama')" aria-label="開啟實景環景">
        <i class="bi bi-camera"></i>
      </button>
      <button class="seat-map__tool-btn" @click="togglePreview" aria-label="放大預覽">
        <i :class="isPreviewOpen ? 'bi bi-fullscreen-exit' : 'bi bi-fullscreen'"></i>
      </button>
    </div>

    <!-- 螢幕 -->
    <div class="seat-map__screen-wrap">
      <div class="seat-map__screen-curve"></div>
      <p class="seat-map__screen-label">螢幕</p>
    </div>

    <!-- 座位區：overflow hidden 確保不超出 -->
    <div class="seat-map__grid-wrap">
      <div class="seat-map__grid">
        <div
          v-for="(row, rowIndex) in seatRows"
          :key="row.row"
          class="seat-map__row"
        >
          <template v-for="seat in row.seats" :key="`${row.row}-${seat.col}`">
            <div v-if="AISLE_AFTER.includes(seat.col)" class="seat-aisle"></div>
            <div class="seat-wrap">
              <button
                class="seat"
                :class="getSeatClass(seat)"
                :disabled="!isClickable(seat)"
                @click="handleSeatClick(seat, row.row, rowIndex)"
              >
                <i v-if="seat.status === 'wheelchair'" class="bi bi-person-wheelchair"></i>
                <span v-else-if="seat.status === 'occupied'" class="seat__x">✕</span>
              </button>

              <!-- 問題一：rowIndex < 3（第四排以上）→ tooltip 向下，否則向上 -->
              <Transition name="tooltip-pop">
                <div
                  v-if="tooltip.key === `${row.row}-${seat.col}`"
                  class="seat-tooltip"
                  :class="rowIndex < 3 ? 'seat-tooltip--below' : 'seat-tooltip--above'"
                >
                  <p class="seat-tooltip__text">{{ row.row }} 排</p>
                  <p class="seat-tooltip__text">{{ seat.col }} 號座位</p>
                  <div class="seat-tooltip__arrow"></div>
                </div>
              </Transition>
            </div>
          </template>
        </div>
      </div>
    </div>

    <!-- 圖例 -->
    <div class="seat-map__legend">
      <div class="legend-item">
        <span class="legend-dot legend-dot--available"></span>
        <span>空位</span>
      </div>
      <div class="legend-item">
        <span class="legend-dot legend-dot--selected"></span>
        <span>已選</span>
      </div>
      <div class="legend-item">
        <span class="legend-dot legend-dot--occupied"></span>
        <span>佔位</span>
      </div>
      <div class="legend-item">
        <i class="bi bi-person-wheelchair"></i>
        <span>輪椅位須至影城購買</span>
      </div>
    </div>

    <!-- 問題三：放大預覽 → 透明底，同等大小，可左右拖拉 -->
    <Transition name="fade">
      <div v-if="isPreviewOpen" class="seat-map__preview-overlay">
        <div class="seat-map__preview-inner">

          <!-- 螢幕（同比例） -->
          <div class="seat-map__screen-wrap mb-2">
            <div class="seat-map__screen-curve"></div>
            <p class="seat-map__screen-label">螢幕</p>
          </div>

          <!-- 座位（放大可拖拉）-->
          <div class="seat-map__preview-scroll">
            <div class="seat-map__grid seat-map__grid--lg">
              <div
                v-for="(row, rowIndex) in seatRows"
                :key="`lg-${row.row}`"
                class="seat-map__row"
              >
                <template v-for="seat in row.seats" :key="`lg-${row.row}-${seat.col}`">
                  <div v-if="AISLE_AFTER.includes(seat.col)" class="seat-aisle seat-aisle--lg"></div>
                  <div class="seat-wrap">
                    <button
                      class="seat seat--lg"
                      :class="getSeatClass(seat)"
                      :disabled="!isClickable(seat)"
                      @click="handleSeatClick(seat, row.row, rowIndex)"
                    >
                      <i v-if="seat.status === 'wheelchair'" class="bi bi-person-wheelchair"></i>
                      <span v-else-if="seat.status === 'occupied'" class="seat__x">✕</span>
                    </button>
                    <Transition name="tooltip-pop">
                      <div
                        v-if="tooltip.key === `${row.row}-${seat.col}`"
                        class="seat-tooltip seat-tooltip--lg"
                        :class="rowIndex < 3 ? 'seat-tooltip--below' : 'seat-tooltip--above'"
                      >
                        <p class="seat-tooltip__text">{{ row.row }} 排</p>
                        <p class="seat-tooltip__text">{{ seat.col }} 號座位</p>
                        <div class="seat-tooltip__arrow"></div>
                      </div>
                    </Transition>
                  </div>
                </template>
              </div>
            </div>
          </div>

          <!-- 關閉按鈕 -->
          <button class="seat-map__preview-close" @click="togglePreview">
            <i class="bi bi-fullscreen-exit"></i>
          </button>
        </div>
      </div>
    </Transition>

  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  ticketCount: { type: Number, default: 2 },
})

const emit = defineEmits(['open-panorama', 'seats-selected'])

// 問題四：走道在欄 2 後、欄 11 後（左邊2欄、右邊2欄，共12欄）
// 座位欄排列：1,2 | 走道 | 3,4,5,6,7,8,9,10,11 | 走道 | 12
// 實際：左2欄 + 走道 + 中間8欄 + 走道 + 右2欄 = 12欄
const AISLE_AFTER = [2, 10]

const ROW_LABELS = ['A','B','C','D','E','F','G','H','I']
const COLS = 12

const OCCUPIED = new Set([
  'D-4','D-5','D-6','D-7',
  'E-1','E-2','E-5','E-6','E-7','E-8','E-10','E-11',
  'F-1','F-2','F-3','F-6','F-7','F-8','F-9','F-11','F-12',
  'G-1','G-2','G-4','G-5','G-6','G-7','G-11',
  'H-1','H-2','H-4','H-8','H-9','H-11','H-12',
  'I-1','I-2','I-3','I-4','I-7','I-8','I-9','I-10','I-11','I-12',
])

const WHEELCHAIR = new Set(['A-4','A-6'])

const generateRows = () =>
  ROW_LABELS.map(rowLabel => ({
    row: rowLabel,
    seats: Array.from({ length: COLS }, (_, i) => {
      const col = i + 1
      const key = `${rowLabel}-${col}`
      let status = 'available'
      if (OCCUPIED.has(key)) status = 'occupied'
      if (WHEELCHAIR.has(key)) status = 'wheelchair'
      return { col, status }
    }),
  }))

const seatRows = ref(generateRows())
const selectedSeats = ref([])
const tooltip = ref({ key: '' })

const isClickable = (seat) =>
  seat.status === 'available' || seat.status === 'selected'

const handleSeatClick = (seat, rowLabel, rowIndex) => {
  const key = `${rowLabel}-${seat.col}`
  if (seat.status === 'selected') {
    seat.status = 'available'
    selectedSeats.value = selectedSeats.value.filter(s => s.key !== key)
    tooltip.value.key = ''
  } else if (seat.status === 'available') {
    if (selectedSeats.value.length >= props.ticketCount) return
    seat.status = 'selected'
    selectedSeats.value.push({ key, row: rowLabel, col: seat.col })
    tooltip.value.key = key
  }
  emit('seats-selected', selectedSeats.value)
}

const getSeatClass = (seat) => ({
  'seat--available':  seat.status === 'available',
  'seat--selected':   seat.status === 'selected',
  'seat--occupied':   seat.status === 'occupied',
  'seat--wheelchair': seat.status === 'wheelchair',
})

const isPreviewOpen = ref(false)
const togglePreview = () => { isPreviewOpen.value = !isPreviewOpen.value }
</script>

<style lang="scss" scoped>
@import "@/assets/scss/variables";

// 問題二：整體不超出容器，完整顯示
.seat-map {
  display: flex;
  flex-direction: column;
  gap: $spacing-sm-mobile;
  background: transparent;                    // 問題一：無灰底
  padding: $spacing-xs-mobile;
  position: relative;
  width: 100%;
  box-sizing: border-box;
}

// ── 工具列 ─────────────────────────────────────────────────────
.seat-map__toolbar {
  display: flex;
  justify-content: space-between;
}

.seat-map__tool-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid rgba($white, 0.25);
  background: rgba($white, 0.08);
  color: $light;
  font-size: 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s;
  &:hover { background: rgba($white, 0.18); }
}

// ── 螢幕 ───────────────────────────────────────────────────────
.seat-map__screen-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.seat-map__screen-curve {
  width: 75%;
  height: 14px;
  border-top: 3px solid $vieshow-warning;
  border-radius: 50% 50% 0 0 / 100% 100% 0 0;
}

.seat-map__screen-label {
  margin: 0;
  font-size: $font-size-mini-mobile;
  color: $vieshow-warning;
  letter-spacing: 0.2em;
}

// ── 座位區（問題二：fit 容器寬，縮放座位大小）─────────────────
.seat-map__grid-wrap {
  width: 100%;
  overflow: hidden;                           // 不裁切，靠 grid 自動縮放
}

.seat-map__grid {
  display: flex;
  flex-direction: column;
  gap: 3px;
  width: 100%;
}

.seat-map__row {
  display: flex;
  align-items: center;
  justify-content: center;                    // 問題二：置中
  gap: 3px;
  flex-wrap: nowrap;
}

// ── 走道 ───────────────────────────────────────────────────────
.seat-aisle {
  width: 12px;
  flex-shrink: 0;
  &--lg { width: 20px; }
}

// ── 座位 wrap ─────────────────────────────────────────────────
.seat-wrap {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  // 讓 tooltip 不被 overflow:hidden 裁切
  overflow: visible;
}

// ── 座位 ───────────────────────────────────────────────────────
.seat {
  width: 26px;
  height: 26px;
  border-radius: 6px;
  border: 1.5px solid transparent;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0;
  font-size: 10px;
  flex-shrink: 0;
  transition: transform 0.15s ease, background 0.15s ease;

  &--lg {
    width: 44px;
    height: 44px;
    border-radius: 10px;
    font-size: 16px;
  }

  &--available {
    background: rgba($white, 0.18);
    border-color: rgba($white, 0.4);
    &:hover {
      background: rgba($vieshow-primary, 0.35);
      border-color: $vieshow-primary;
      transform: scale(1.12);
    }
  }

  &--selected {
    background: $vieshow-primary;
    border-color: lighten($vieshow-primary, 15%);
    color: $white;
    transform: scale(1.08);
    box-shadow: 0 0 10px rgba($vieshow-primary, 0.7);
  }

  &--occupied {
    background: rgba($white, 0.04);
    border-color: rgba($white, 0.1);
    color: rgba($white, 0.2);
    cursor: not-allowed;
  }

  &--wheelchair {
    background: rgba($white, 0.06);
    border-color: rgba($white, 0.2);
    color: $vieshow-secondary;
    cursor: not-allowed;
    font-size: 12px;
  }

  .seat__x {
    font-size: 8px;
    color: rgba($white, 0.2);
  }
}

// ── Tooltip ────────────────────────────────────────────────────
.seat-tooltip {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  background: #0D2A4A;
  border: 2.5px solid $vieshow-primary;
  border-radius: $border-radius-mobile;
  padding: $spacing-sm-mobile $spacing-md-mobile;
  text-align: center;
  white-space: nowrap;
  pointer-events: none;
  z-index: 30;

  // 問題一：預設向上（第四排以後）
  &--above {
    bottom: calc(100% + 12px);
    top: auto;

    .seat-tooltip__arrow {
      top: 100%;
      bottom: auto;
      border-top: 10px solid $vieshow-primary;
      border-bottom: none;

      &::after {
        top: -3px;
        bottom: auto;
        border-top: 9px solid #0D2A4A;
        border-bottom: none;
      }
    }
  }

  // 問題一：向下（第四排以上，靠近螢幕）
  &--below {
    top: calc(100% + 12px);
    bottom: auto;

    .seat-tooltip__arrow {
      bottom: 100%;
      top: auto;
      border-bottom: 10px solid $vieshow-primary;
      border-top: none;

      &::after {
        bottom: -3px;
        top: auto;
        border-bottom: 9px solid #0D2A4A;
        border-top: none;
      }
    }
  }

  &--lg {
    padding: $spacing-md-mobile $spacing-lg-mobile;
    border-radius: $border-radius-lg-mobile;
    border-width: 3px;
  }
}

.seat-tooltip__text {
  margin: 0;
  font-size: $h5-font-size-mobile;
  font-weight: 700;
  color: $light;
  line-height: 1.4;

  .seat-tooltip--lg & {
    font-size: $h4-font-size-mobile;
  }
}

.seat-tooltip__arrow {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;

  &::after {
    content: '';
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 9px solid transparent;
    border-right: 9px solid transparent;
  }
}

// ── 圖例 ───────────────────────────────────────────────────────
.seat-map__legend {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: $spacing-sm-mobile;
  padding-top: $spacing-xs-mobile;
  border-top: 1px solid rgba($white, 0.08);
  font-size: $font-size-mini-mobile;
  color: $vieshow-secondary;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.legend-dot {
  width: 18px;
  height: 18px;
  border-radius: 4px;
  flex-shrink: 0;
  &--available { background: rgba($white, 0.18); border: 1.5px solid rgba($white, 0.4); }
  &--selected  { background: $vieshow-primary; }
  &--occupied  { background: rgba($white, 0.04); border: 1.5px solid rgba($white, 0.1); }
}

// ── 問題三：放大預覽，透明底，同大小，可拖拉 ──────────────────
.seat-map__preview-overlay {
  position: absolute;
  inset: 0;                                   // 問題三：覆蓋在原本位置上
  background: $vieshow-dark;                  // 同底色，無灰底無邊框
  z-index: 50;
  display: flex;
  flex-direction: column;
  border-radius: inherit;
}

.seat-map__preview-inner {
  display: flex;
  flex-direction: column;
  gap: $spacing-sm-mobile;
  padding: $spacing-xs-mobile;
  height: 100%;
  position: relative;
}

// 座位可左右拖拉
.seat-map__preview-scroll {
  overflow-x: auto;
  overflow-y: visible;
  scrollbar-width: thin;
  scrollbar-color: rgba($white, 0.2) transparent;
  cursor: grab;
  &:active { cursor: grabbing; }
  flex: 1;
  display: flex;
  align-items: flex-start;
}

.seat-map__grid--lg {
  gap: 5px;
  margin: 0 auto;

  .seat-map__row {
    gap: 5px;
    justify-content: flex-start;             // 放大版靠左，讓拖拉有意義
  }
}

.seat-map__preview-close {
  position: absolute;
  top: $spacing-xs-mobile;
  right: $spacing-xs-mobile;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid rgba($white, 0.2);
  background: rgba($white, 0.08);
  color: $light;
  font-size: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  &:hover { background: rgba($white, 0.18); }
}

// ── Transitions ────────────────────────────────────────────────
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.tooltip-pop-enter-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.tooltip-pop-leave-active { transition: opacity 0.15s ease; }
.tooltip-pop-enter-from {
  opacity: 0;
  transform: translateX(-50%) translateY(6px);
}
.tooltip-pop-leave-to { opacity: 0; }
</style>