<template>
  <div class="seat-map" ref="seatMapRef">

    <!-- 左上相機(FA)，右上放大(FA) -->
    <div class="seat-map__toolbar">
      <button class="seat-map__tool-btn" @click="isPanoramaOpen = true" aria-label="開啟實景環景">
        <i class="fa-solid fa-camera"></i>
      </button>
      <button class="seat-map__tool-btn" @click="togglePreview" aria-label="放大預覽">
        <i class="fa-solid fa-expand"></i>
      </button>
    </div>

    <!-- 問題三：螢幕，移除分隔線，光暈自然延伸到文字 -->
    <div class="screen-wrapper d-flex flex-column align-items-center mb-2">
      <div class="screen-curve"></div>
      <div class="screen-text fw-bold">螢幕</div>
    </div>

    

    <!-- 圖例 -->
    <div class="legend-wrapper">
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

    <!-- 實景環景 overlay -->
    <Transition name="fade">
      <div v-if="isPanoramaOpen" class="panorama-overlay">
        <!-- 關閉按鈕 -->
        <button class="panorama-close" @click="isPanoramaOpen = false" aria-label="關閉實景">
          <i class="fa-solid fa-xmark"></i>
        </button>
        <!-- 提示文字 -->
        <div class="panorama-hint">
          <i class="fa-solid fa-arrows-up-down-left-right"></i>
          <span>拖曳移動查看實景</span>
        </div>
        <!-- 可拖拉的圖片容器 -->
        <div
          class="panorama-viewport"
          ref="panoramaViewport"
          @mousedown="onPanStart"
          @mousemove="onPanMove"
          @mouseup="onPanEnd"
          @mouseleave="onPanEnd"
          @touchstart.prevent="onTouchStart"
          @touchmove.prevent="onTouchMove"
          @touchend="onPanEnd"
        >
          <img
            class="panorama-img"
            src="@/assets/images/panorama-cinema.jpg"
            alt="影廳實景"
            :style="{ transform: `translate(${panX}px, ${panY}px)` }"
            draggable="false"
          />
        </div>
      </div>
    </Transition>

    <!-- 放大預覽 overlay -->
    <Transition name="fade">
      <div v-if="isPreviewOpen" class="seat-map__preview-overlay">

        <div class="seat-map__toolbar">
          <div></div>
          <button class="seat-map__tool-btn" @click="togglePreview" aria-label="縮回">
            <i class="fa-solid fa-compress"></i>
          </button>
        </div>

        <!-- 問題三：放大版螢幕，同樣移除分隔線 -->
        <div class="screen-wrapper d-flex flex-column align-items-center">
          <div class="screen-curve"></div>
          <div class="screen-text fw-bold mb-2">螢幕</div>
        </div>

        <!-- 放大座位，可左右拖拉 -->
        <div class="seat-map__preview-scroll">
          <div class="seat-map__grid seat-map__grid--lg">
            <div
              v-for="(row, rowIndex) in seatLayout"
              :key="`lg-${rowIndex}`"
              class="seat-row"
            >
              <template v-for="(seatCode, colIndex) in row" :key="`lg-${colIndex}`">
                <!-- 問題二：放大版也拆分走道寬度 -->
                <div v-if="seatCode === 0" class="aisle aisle--main aisle--lg"></div>
                <div v-else-if="seatCode === 5" class="aisle aisle--wheelchair-gap aisle--lg"></div>
                <div v-else class="seat-wrap">
                  <SeatButton
                    size="lg"
                    :state="getSeatState(seatCode, rowIndex, colIndex)"
                    @click="handleSeatClick(rowIndex, colIndex, seatCode)"
                  />
                  <!-- 問題一：放大版 Tooltip 也加箭頭 -->
                  <Transition name="tooltip-pop">
                    <div
                      v-if="tooltip.key === `${rowIndex}-${colIndex}`"
                      class="seat-tooltip seat-tooltip--lg"
                      :class="[
                        rowIndex < 3 ? 'seat-tooltip--below' : 'seat-tooltip--above',
                        getTooltipClamp(colIndex, row)
                      ]"
                    >
                      <p class="seat-tooltip__text">{{ ROW_LABELS[rowIndex] }} 排</p>
                      <p class="seat-tooltip__text">{{ getDisplayCol(row, colIndex) }} 號座位</p>
                      <div class="seat-tooltip__arrow"></div>
                    </div>
                  </Transition>
                </div>
              </template>
            </div>
          </div>
        </div>

        <div class="legend-wrapper mt-4">
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

      </div>
      <div v-else class="seat-map__grid-wrap mb-4">
        <div class="seat-map__grid">
        <div
          v-for="(row, rowIndex) in seatLayout"
          :key="rowIndex"
          class="seat-row"
        >
          <template v-for="(seatCode, colIndex) in row" :key="colIndex">
            <!-- 問題二：走道 vs 輪椅間距 分開 class -->
            <div v-if="seatCode === 0" class="aisle aisle--main"></div>
            <div v-else-if="seatCode === 5" class="aisle aisle--wheelchair-gap"></div>

            <!-- 座位 + Tooltip -->
            <div v-else class="seat-wrap" :data-col-index="colIndex" :data-row-index="rowIndex">
              <SeatButton
                size="md"
                :state="getSeatState(seatCode, rowIndex, colIndex)"
                @click="handleSeatClick(rowIndex, colIndex, seatCode)"
              />

              <!-- 問題一：Tooltip 加回箭頭 -->
              <Transition name="tooltip-pop">
                <div
                  v-if="tooltip.key === `${rowIndex}-${colIndex}`"
                  class="seat-tooltip"
                  :class="[
                    rowIndex < 3 ? 'seat-tooltip--below' : 'seat-tooltip--above',
                    getTooltipClamp(colIndex, row)
                  ]"
                >
                  <p class="seat-tooltip__text">{{ ROW_LABELS[rowIndex] }} 排</p>
                  <p class="seat-tooltip__text">{{ getDisplayCol(row, colIndex) }} 號座位</p>
                  <div class="seat-tooltip__arrow"></div>
                </div>
              </Transition>
            </div>
          </template>
        </div>
      </div>
      </div>
    </Transition>

  </div>
</template>

<script setup>
import { ref } from 'vue'
import SeatButton from '@/components/Booking/Button/SeatButton.vue'

const props = defineProps({
  ticketCount: { type: Number, default: 2 },
})

const emit = defineEmits(['open-panorama', 'seats-selected'])

const ROW_LABELS = ['A','B','C','D','E','F','G','H','I']

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
])

const selectedSeats = ref([])
const tooltip = ref({ key: '' })

const getSeatState = (code, rowIndex, colIndex) => {
  const key = `${rowIndex}-${colIndex}`
  if (selectedSeats.value.includes(key)) return 'selected'
  if (code === 3) return 'wheelchair'
  if (code === 2) return 'sold'
  return 'available'
}

const getDisplayCol = (row, colIndex) => {
  let count = 0
  for (let i = 0; i <= colIndex; i++) {
    if (row[i] !== 0 && row[i] !== 5) count++
  }
  return count
}

const getTooltipClamp = (colIndex, row) => {
  const validIndices = row.reduce((acc, v, i) => {
    if (v !== 0 && v !== 5) acc.push(i)
    return acc
  }, [])
  const firstReal = validIndices[0]
  const lastReal = validIndices[validIndices.length - 1]
  if (colIndex <= firstReal + 1) return 'seat-tooltip--clamp-left'
  if (colIndex >= lastReal - 1) return 'seat-tooltip--clamp-right'
  return ''
}

const handleSeatClick = (rowIndex, colIndex, seatCode) => {
  if (seatCode === 0 || seatCode === 2 || seatCode === 3 || seatCode === 5) return
  const key = `${rowIndex}-${colIndex}`
  const idx = selectedSeats.value.indexOf(key)
  if (idx >= 0) {
    selectedSeats.value.splice(idx, 1)
    tooltip.value.key = ''
  } else {
    if (selectedSeats.value.length >= props.ticketCount) return
    selectedSeats.value.push(key)
    tooltip.value.key = key
  }
  emit('seats-selected', selectedSeats.value.map(k => {
    const [r, c] = k.split('-').map(Number)
    return { row: ROW_LABELS[r], col: getDisplayCol(seatLayout.value[r], c) }
  }))
}

const isPreviewOpen = ref(false)
const togglePreview = () => { isPreviewOpen.value = !isPreviewOpen.value }

// ── 實景環景 ───────────────────────────────────────────────────
const isPanoramaOpen = ref(false)
const panoramaViewport = ref(null)
const panX = ref(-200)             // 初始偏移讓圖片置中顯示
const panY = ref(0)
let isPanning = false
let startX = 0
let startY = 0
let startPanX = 0
let startPanY = 0

const CLAMP_X = 400               // 水平最大拖移量
const CLAMP_Y = 150               // 垂直最大拖移量

const onPanStart = (e) => {
  isPanning = true
  startX = e.clientX
  startY = e.clientY
  startPanX = panX.value
  startPanY = panY.value
}

const onPanMove = (e) => {
  if (!isPanning) return
  const dx = e.clientX - startX
  const dy = e.clientY - startY
  panX.value = Math.max(-CLAMP_X, Math.min(CLAMP_X, startPanX + dx))
  panY.value = Math.max(-CLAMP_Y, Math.min(CLAMP_Y, startPanY + dy))
}

const onPanEnd = () => { isPanning = false }

const onTouchStart = (e) => {
  const touch = e.touches[0]
  isPanning = true
  startX = touch.clientX
  startY = touch.clientY
  startPanX = panX.value
  startPanY = panY.value
}

const onTouchMove = (e) => {
  if (!isPanning) return
  const touch = e.touches[0]
  const dx = touch.clientX - startX
  const dy = touch.clientY - startY
  panX.value = Math.max(-CLAMP_X, Math.min(CLAMP_X, startPanX + dx))
  panY.value = Math.max(-CLAMP_Y, Math.min(CLAMP_Y, startPanY + dy))
}
</script>

<style lang="scss" scoped>
@import "@/assets/scss/variables";

.seat-map {
  display: flex;
  flex-direction: column;
  gap: $spacing-xs-mobile;
  background: transparent;
  padding: $spacing-xs-mobile;
  position: relative;
  width: 100%;
  overflow: hidden;                           // 放大預覽時蓋住底層，防止透出
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

// ── 問題三：螢幕，移除分隔線 ──────────────────────────────────
// 使用 flex + 無 border 的方式，讓光暈自然往下延伸到文字
// 問題二：曲線加 filter，文字不加 filter（用 isolation 隔離）

.screen-curve {
  width: 80%;
  height: 16px;
  border-top: 3px solid $vieshow-warning;
  border-radius: 50% / 100% 100% 0 0;
  // 光暈只在曲線上
  filter: drop-shadow(0px 0px 8px rgba($vieshow-warning, 0.7))
          drop-shadow(0px 4px 14px rgba($vieshow-warning, 0.4));
  display: block;
  line-height: 0;
  font-size: 0;
}

.screen-text {
  color: $vieshow-warning;
  margin-top: 4px;
  margin-bottom: 0;
  letter-spacing: 2px;
  font-size: $font-size-mini-mobile;
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
    width: 20px;                              // 較寬，明顯走道感
  }

  // 輪椅間空格（保留一個座位的位置，視覺等於一個座位寬）
  // md SeatButton = 30px
  &--wheelchair-gap {
    width: 30px;                              // 與 md 座位同寬，視覺保留一個空位
  }

  // 放大版
  &--lg {
    &.aisle--main { width: 28px; }
    &.aisle--wheelchair-gap { width: 50px; } // 與 lg SeatButton(50px) 同寬
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
  background: #0D2A4A;
  border: 2.5px solid $vieshow-primary;
  border-radius: $border-radius-mobile;
  padding: $spacing-sm-mobile $spacing-md-mobile;
  text-align: center;
  white-space: nowrap;
  pointer-events: none;
  z-index: 30;

  // 向上顯示（第4排以後）→ 箭頭在下方
  &--above {
    bottom: calc(100% + 10px);
    top: auto;

    .seat-tooltip__arrow {
      top: 100%;
      border-left: 9px solid transparent;
      border-right: 9px solid transparent;
      border-top: 9px solid $vieshow-primary;

      &::after {
        content: '';
        position: absolute;
        top: -11px;
        left: 50%;
        transform: translateX(-50%);
        border-left: 7px solid transparent;
        border-right: 7px solid transparent;
        border-top: 8px solid #0D2A4A;
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
      border-bottom: 9px solid $vieshow-primary;

      &::after {
        content: '';
        position: absolute;
        bottom: -11px;
        left: 50%;
        transform: translateX(-50%);
        border-left: 7px solid transparent;
        border-right: 7px solid transparent;
        border-bottom: 8px solid #0D2A4A;
      }
    }
  }

  // 邊界防裁切
  &--clamp-left {
    left: 0;
    transform: translateX(0);
    .seat-tooltip__arrow { left: 15px; transform: translateX(0); }
  }

  &--clamp-right {
    left: auto;
    right: 0;
    transform: translateX(0);
    .seat-tooltip__arrow { left: auto; right: 15px; transform: translateX(0); }
  }

  &--lg {
    padding: $spacing-sm-mobile $spacing-lg-mobile;
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

  .seat-tooltip--lg & { font-size: $h4-font-size-mobile; }
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
  gap: $spacing-sm-mobile;
  border-top: 1px solid rgba($white, 0.08);
  padding-top: $spacing-lg-mobile;
  margin-top: $spacing-xs-mobile;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  color: $light;
  font-size: $font-size-mini-mobile;
}

.pointer-events-none { pointer-events: none; }

// ── 放大預覽：absolute 填滿 .seat-map，overflow hidden 蓋住底層 ──
.seat-map__preview-overlay {
  position: absolute;
  inset: 0;
  background: $vieshow-gradient-dark;
  z-index: 10;
  display: flex;
  flex-direction: column;
  gap: $spacing-xs-mobile;
  padding: $spacing-xs-mobile;
  overflow: hidden;                           // 確保底層完全被蓋住
}

.seat-map__preview-scroll {
  overflow: auto;                             // 上下左右都可滾動
  scrollbar-width: thin;
  scrollbar-color: rgba($white, 0.2) transparent;
  cursor: grab;
  flex: 1;
  // 讓 touch 裝置也能拖拉
  -webkit-overflow-scrolling: touch;

  &:active { cursor: grabbing; }

  .seat-map__grid--lg {
    width: max-content;
    min-width: 100%;
    margin: 0 auto;
    padding: $spacing-sm-mobile;
    .seat-row { gap: 6px; }
  }
}

// ── 實景環景 overlay ───────────────────────────────────────────
.panorama-overlay {
  position: absolute;
  inset: 0;
  background: $black;
  z-index: 20;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
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

  &:active { cursor: grabbing; }
}

.panorama-img {
  // 寬度遠大於容器，營造環景可拖動感
  width: 100%;
  min-width: 600px;
  height: auto;
  object-fit: cover;
  transition: transform 0.05s linear;
  pointer-events: none;
}

.panorama-close {
  position: absolute;
  top: $spacing-sm-mobile;
  right: $spacing-sm-mobile;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid rgba($white, 0.3);
  background: rgba($black, 0.6);
  color: $light;
  font-size: 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 21;
  transition: background 0.2s;
  &:hover { background: rgba($black, 0.85); }
}

.panorama-hint {
  position: absolute;
  bottom: $spacing-md-mobile;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba($black, 0.55);
  border-radius: $border-radius-pill;
  padding: $spacing-xs-mobile $spacing-sm-mobile;
  color: rgba($white, 0.75);
  font-size: $font-size-mini-mobile;
  z-index: 21;
  pointer-events: none;
  white-space: nowrap;
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