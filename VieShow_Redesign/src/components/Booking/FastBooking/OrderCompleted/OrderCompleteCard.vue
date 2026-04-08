<template>
  <div v-if="movieInfo" class="order-card">

    <!-- ── 共用頂部：完全對齊 SelectedInfoCard 排版 ── -->
    <div class="glass-card">
      <div class="glass-card__inner">

        <!-- 左：海報縮圖（同 SelectedInfoCard .poster-wrapper）-->
        <div class="poster-wrapper">
          <img :src="movieInfo.posterUrl" :alt="movieInfo.titleZh" class="poster-img" />
        </div>

        <!-- 中：電影資訊（同 SelectedInfoCard .movie-details）-->
        <div class="movie-details">
          <!-- 中英文標題 -->
          <div class="title-row">
            <span class="title-zh">{{ movieInfo.titleZh }}</span>
            <span class="title-en">{{ movieInfo.titleEn }}</span>
          </div>
          <!-- meta 資訊 -->
          <div class="meta-row">
            <span>{{ movieInfo.duration }}</span>
            <span class="sep">｜</span>
            <span>{{ movieInfo.rating }}</span>
            <span class="sep">｜</span>
            <span>{{ movieInfo.language }}</span>
            <span class="sep">｜</span>
            <span>{{ movieInfo.format }}</span>
            <span class="sep">｜</span>
            <span>{{ movieInfo.venue }}</span>
            <span class="sep">｜</span>
            <span>{{ movieInfo.date }}</span>
            <span class="sep">｜</span>
            <span>{{ movieInfo.time }}</span>
          </div>
        </div>

        <!-- 右上角：TicketStatusTag -->
        <div class="status-wrap">
          <TicketStatusTag :status="ticketStatus" />
        </div>

      </div>
    </div>

    <!-- ── 模板一：其他票種 ── -->
    <template v-if="variant === 'other'">
      <div class="order-card__body order-card__body--other">

        <p class="order-card__expire-notice">
          有效期限至 {{ movieInfo.expireDate }}<br />
          請於 {{ movieInfo.payDeadline }} 前往臨櫃付款
        </p>

        <hr class="order-card__divider" />

        <p class="order-card__note">如欲加購餐點請至售票口加購</p>

      </div>
    </template>

    <!-- ── 模板二：一般購票流程 ── -->
    <template v-else-if="variant === 'standard'">
      <div class="order-card__body order-card__body--standard">

        <!-- 條碼區 -->
        <div class="order-card__barcode-wrap">
          <img :src="barcodeUrl" alt="訂單條碼" class="order-card__barcode" />
          <p class="order-card__barcode-num">{{ barcodeNumber }}</p>
        </div>

        <!-- 有效期限小字 -->
        <p class="order-card__expire-small">有效期限至 {{ movieInfo.expireDate }}</p>

        <hr class="order-card__divider" />

        <!-- 票種列表 -->
        <div class="order-card__tickets">
          <div
            v-for="ticket in tickets"
            :key="ticket.id"
            class="order-card__ticket-row"
          >
            <span class="order-card__ticket-name">{{ ticket.name }}</span>
            <span class="order-card__ticket-qty">{{ ticket.quantity }}</span>
            <button
              class="order-card__share-btn"
              @click="$emit('share-ticket', ticket.id)"
              aria-label="分享票券"
            >
              <i class="fa-solid fa-share-from-square"></i>
            </button>
          </div>
        </div>

        <hr class="order-card__divider" />

        <!-- 取餐代碼 -->
        <div class="d-flex justify-content-between align-items-center">
          <span class="order-card__pickup-label">取餐代碼</span>
          <span class="order-card__pickup-code">{{ pickupCode }}</span>
        </div>

      </div>
    </template>

  </div>
</template>

<script setup>
import { useMovieStore } from '@/store/movieStore'
import { storeToRefs } from 'pinia'
import TicketStatusTag from '@/components/Booking/TicketStatusTag.vue'

// ── 從 movieStore 取電影資訊（與 SelectedInfoCard 完全相同）────
const movieStore = useMovieStore()
const { selectedInfoCard: movieInfo } = storeToRefs(movieStore)

defineProps({
  // 模板切換：'standard'（一般購票）| 'other'（其他票種）
  variant: {
    type: String,
    default: 'standard',
    validator: (v) => ['standard', 'other'].includes(v),
  },
  // 票券狀態：'active' 有效 | 'pending' 待處理 | 'expired' 已失效
  ticketStatus: {
    type: String,
    default: 'active',
    validator: (v) => ['active', 'pending', 'expired'].includes(v),
  },
  // 票種列表（標準模板用）[{ id, name, quantity }]
  tickets: {
    type: Array,
    default: () => [
      { id: 't1', name: '全票',                      quantity: 1 },
      { id: 't2', name: '全票',                      quantity: 1 },
      { id: 't3', name: '優待票',                    quantity: 1 },
      { id: 't4', name: '星展一般卡假日優惠 PLUS20', quantity: 1 },
    ],
  },
  // 條碼（標準模板用）
  barcodeUrl: {
    type: String,
    default: 'https://barcodeapi.org/api/128/12345678',
  },
  barcodeNumber: {
    type: String,
    default: '12345678',
  },
  // 取餐代碼（標準模板用）
  pickupCode: {
    type: String,
    default: '#FS-3076',
  },
})

defineEmits(['share-ticket'])
</script>

<style lang="scss" scoped>
@import "@/assets/scss/variables";

// ── 卡片外框 ───────────────────────────────────────────────────
.order-card {
  border-radius: var(--app-radius-lg);
  overflow: hidden;
  border: 1px solid rgba(v.$white, 0.1);
  background: v.$vieshow-dark-section;
}

// ────────────────────────────────────────────────────────────────
// 頂部：完全複製 SelectedInfoCard 的 .glass-card 樣式
// ────────────────────────────────────────────────────────────────
.glass-card {
  position: relative;
  width: 100%;
  border-radius: 0;
  overflow: hidden;
  backdrop-filter: blur(24px) saturate(180%) brightness(1.05);
  -webkit-backdrop-filter: blur(24px) saturate(180%) brightness(1.05);
  background: rgba(v.$vieshow-dark, 0.6);
  border-bottom: 1px solid rgba(v.$white, 0.1);
  box-shadow:
    0 8px 32px rgba(v.$black, 0.45),
    0 1px 0 rgba(v.$white, 0.06) inset;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(-38deg,
        rgba(v.$white, 0.14) 0%,
        rgba(v.$white, 0.05) 30%,
        transparent 60%);
    pointer-events: none;
    z-index: 0;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg,
        transparent,
        rgba(v.$white, 0.22) 30%,
        rgba(v.$white, 0.22) 70%,
        transparent);
    pointer-events: none;
    z-index: 1;
  }
}

.glass-card__inner {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: var(--gap-md);
  padding: var(--gap-sm) var(--gap-md);
  width: 100%;
  box-sizing: border-box;
}

// ── 海報（同 SelectedInfoCard）────────────────────────────────
.poster-wrapper {
  flex-shrink: 0;
  width: 56px;
  height: 78px;
  overflow: hidden;
  border-radius: var(--app-radius-lg);
  box-shadow:
    0 4px 14px rgba(v.$black, 0.5),
    0 0 0 1px rgba(v.$white, 0.08);
}

.poster-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  border-radius: var(--app-radius-lg);
}

// ── 文字區（同 SelectedInfoCard）─────────────────────────────
.movie-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--gap-xs);
  min-width: 0;
}

.title-row {
  display: flex;
  align-items: baseline;
  gap: var(--gap-sm);
  flex-wrap: nowrap;
  min-width: 0;
}

.title-zh {
  font-size: var(--app-font-size-h6);          // 手機 18px / PC 20px
  font-weight: 700;
  color: v.$light;
  letter-spacing: 0.04em;
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex-shrink: 0;
  max-width: 100%;
}

.title-en {
  font-size: var(--app-font-size-mini);        // 手機 12px / PC 14px
  font-weight: 500;
  color: v.$light;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  white-space: nowrap;
  flex-shrink: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
}

.meta-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  font-size: var(--app-font-size-mini);
  font-weight: 200;
  color: v.$light;
  line-height: 1.4;
  letter-spacing: 0.01em;
}

.sep {
  color: v.$white;
  margin: 0 0.125rem;
}

// ── 右上角 TicketStatusTag ────────────────────────────────────
.status-wrap {
  flex-shrink: 0;
  align-self: flex-start;
}

// ────────────────────────────────────────────────────────────────
// body 共用
// ────────────────────────────────────────────────────────────────
.order-card__body {
  display: flex;
  flex-direction: column;
  gap: var(--gap-sm);
  padding: var(--gap-sm) var(--gap-md);
}

.order-card__divider {
  margin: 0;
  border: none;
  border-top: 1px solid rgba(v.$white, 0.08);
}

// ── 模板一：其他票種 ───────────────────────────────────────────
.order-card__expire-notice {
  margin: 0;
  font-size: var(--app-font-size-h6);
  font-weight: 700;
  color: v.$vieshow-success;
  line-height: 1.6;
}

.order-card__note {
  margin: 0;
  font-size: var(--app-font-size-sm);
  color: v.$vieshow-secondary;
  text-align: center;
  padding: var(--gap-xs) 0;
}

// ── 模板二：一般購票 ───────────────────────────────────────────
.order-card__barcode-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--gap-xs);
  background: v.$white;
  border-radius: var(--app-radius);
  padding: var(--gap-sm) var(--gap-md);
}

.order-card__barcode {
  width: 100%;
  height: auto;
  display: block;
  image-rendering: pixelated;
}

.order-card__barcode-num {
  margin: 0;
  font-size: var(--app-font-size-base);
  font-weight: 700;
  color: v.$vieshow-dark;
  letter-spacing: 0.1em;
}

.order-card__expire-small {
  margin: 0;
  font-size: var(--app-font-size-mini);
  color: v.$vieshow-secondary;
  text-align: center;
}

.order-card__tickets {
  display: flex;
  flex-direction: column;
  gap: var(--gap-xs);
}

.order-card__ticket-row {
  display: flex;
  align-items: center;
  gap: var(--gap-xs);
}

.order-card__ticket-name {
  flex: 1;
  font-size: var(--app-font-size-base);
  color: v.$white;
  min-width: 0;
}

.order-card__ticket-qty {
  font-size: var(--app-font-size-base);
  color: v.$white;
  min-width: var(--gap-md);
  text-align: center;
}

.order-card__share-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: v.$vieshow-secondary;
  font-size: var(--app-font-size-base);
  padding: var(--gap-xs);
  transition: color 0.2s ease;
  display: inline-flex;
  align-items: center;

  @include hover-focus {
    color: v.$white;
  }
}

.order-card__pickup-label {
  font-size: var(--app-font-size-base);
  color: v.$white;
}

.order-card__pickup-code {
  font-size: var(--app-font-size-h6);
  font-weight: 700;
  color: v.$vieshow-primary;
  letter-spacing: 0.05em;
}
</style>