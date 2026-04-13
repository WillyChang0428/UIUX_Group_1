<template>
  <div class="seat-map" ref="seatMapRef">
    <div class="seat-map__toolbar" style="position: relative">
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

    <ScreenCurve />

    <PanoramaViewer v-model="isPanoramaOpen" :image="panoramaImage" />

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

        <ScreenCurve />

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
      :style="{
        opacity: isPreviewOpen ? 0 : 1,
        pointerEvents: isPreviewOpen ? 'none' : 'auto',
        transition: 'opacity 0.2s ease',
      }"
    >
      <SeatLegend />
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

// 💡 引入剛剛切分好的子元件
import ScreenCurve from "./ScreenCurve.vue";
import SeatLegend from "./SeatLegend.vue";
import PanoramaViewer from "./PanoramaViewer.vue";

const props = defineProps({
  ticketCount: { type: Number, default: 2 },
});
const emit = defineEmits(["seats-selected"]);
const bookingStore = useBookingStore();

// ── 狀態與邏輯區 ──
const isPreviewOpen = ref(false);
const isPanoramaOpen = ref(false);
const selectedSeats = ref([]);
const tooltip = ref({ key: "" });
const ROW_LABELS = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];

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

const remainingSeats = computed(
  () => props.ticketCount - selectedSeats.value.length,
);
const togglePreview = () => (isPreviewOpen.value = !isPreviewOpen.value);

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
  if (seatCode === 0 || seatCode === 2 || seatCode === 3 || seatCode === 5)
    return;

  const key = `${rowIndex}-${colIndex}`;
  const idx = selectedSeats.value.indexOf(key);

  if (idx >= 0) {
    selectedSeats.value.splice(idx, 1);
    tooltip.value.key = "";
  } else {
    while (selectedSeats.value.length >= props.ticketCount) {
      selectedSeats.value.shift();
    }
    selectedSeats.value.push(key);
    tooltip.value.key = key;
  }

  // 發送更新後的結果給父元件，確保格式包含 rowLabel 和 colLabel 讓付款明細使用
  emit(
    "seats-selected",
    selectedSeats.value.map((k) => {
      const [r, c] = k.split("-").map(Number);
      return {
        row: r,
        col: c,
        rowLabel: ROW_LABELS[r],
        colLabel: getDisplayCol(seatLayout.value[r], c),
      };
    }),
  );
};
</script>

<style lang="scss" scoped>
@import "@/assets/scss/variables";

.seat-map {
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: transparent;
  padding: 8px;
  position: relative;
  width: 100%;
  overflow: hidden;
}

.seat-map__toolbar {
  display: flex;
  justify-content: space-between;
}

.seat-map__tool-btn {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  border: 1px solid rgba($white, 0.25);
  background: rgba($white, 0.08);
  color: $light;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: rgba($white, 0.18);
  }
}

.seat-map__grid-wrap {
  width: 100%;
  overflow: visible;
}
.seat-map__grid {
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 5px;
  overflow: auto;
  scrollbar-width: thin;
  scrollbar-color: rgba($white, 0.2) transparent;
  cursor: grab;
  flex: 1;
  -webkit-overflow-scrolling: touch;
  @include media-breakpoint-up(md) {
    align-items: center;
  }
}
.seat-row {
  display: flex;
  align-items: center;
  gap: 4px;
}

.aisle {
  flex-shrink: 0;
  &--main {
    width: 20px;
  }
  &--wheelchair-gap {
    width: 30px;
  }
  &--lg {
    &.aisle--main {
      width: 28px;
    }
    &.aisle--wheelchair-gap {
      width: 50px;
    }
  }
}

.seat-wrap {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

// ── Tooltip 樣式 ──
.seat-tooltip {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  background: #0d2a4a;
  border: 2.5px solid $vieshow-primary;
  border-radius: 8px;
  padding: 8px 16px;
  text-align: center;
  white-space: nowrap;
  pointer-events: none;
  z-index: 100;

  &--above {
    bottom: calc(100% + 10px);
    top: auto;
    .seat-tooltip__arrow {
      top: 100%;
      border-left: 9px solid transparent;
      border-right: 9px solid transparent;
      border-top: 9px solid $vieshow-primary;
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

  &--below {
    top: calc(100% + 10px);
    bottom: auto;
    .seat-tooltip__arrow {
      bottom: 100%;
      border-left: 9px solid transparent;
      border-right: 9px solid transparent;
      border-bottom: 9px solid $vieshow-primary;
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
    padding: 8px 24px;
    border-radius: 12px;
    border-width: 3px;
  }
}

.seat-tooltip__text {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  color: $light;
  line-height: 1.4;
  .seat-tooltip--lg & {
    font-size: 24px;
  }
}

.seat-tooltip__arrow {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
}

// ── 放大預覽遮罩 ──
.seat-map__preview-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 8px;
  overflow: hidden;
}

.seat-map__preview-scroll {
  overflow: auto;
  scrollbar-width: thin;
  scrollbar-color: rgba($white, 0.2) transparent;
  cursor: grab;
  flex: 1;
  -webkit-overflow-scrolling: touch;
  &:active {
    cursor: grabbing;
  }
  .seat-map__grid--lg {
    width: max-content;
    min-width: 100%;
    margin: 0 auto;
    padding: 8px;
    .seat-row {
      gap: 6px;
    }
  }
}

// ── Transitions ──
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
