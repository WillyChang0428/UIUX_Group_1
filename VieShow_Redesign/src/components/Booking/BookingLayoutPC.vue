
<template>
  <div v-if="movieInfo" class="booking-layout-pc">

    <!-- 手機版：只顯示 slot（電影資訊由 SelectedInfoCard 另外處理）-->
    <div class="d-md-none">
      <slot name="content" />
    </div>

    <!-- 電腦版（md+）：3:7 分欄 -->
    <div class="d-none d-md-flex booking-layout-pc__row">

      <!-- 左側 3/10：電影資訊面板（固定，不隨頁面切換）-->
      <aside class="booking-layout-pc__aside">

        <!-- 海報大圖 -->
        <div class="aside-poster-wrap">
          <img
            :src="movieInfo.posterUrl"
            :alt="movieInfo.titleZh"
            class="aside-poster"
          />
        </div>

        <!-- 電影資訊 -->
        <div class="aside-info d-flex flex-column gap-2 pt-3">

          <!-- 中英文標題 -->
          <div class="aside-title-row">
            <h3 class="aside-title-zh">{{ movieInfo.titleZh }}</h3>
            <span class="aside-title-en">{{ movieInfo.titleEn }}</span>
          </div>

          <!-- meta 資訊：垂直條列 -->
          <ul class="aside-meta list-unstyled d-flex flex-column gap-1 mb-0">
            <li class="aside-meta__item">
              <i class="fa-solid fa-clock aside-meta__icon"></i>
              {{ movieInfo.duration }}
            </li>
            <li class="aside-meta__item">
              <i class="fa-solid fa-shield aside-meta__icon"></i>
              {{ movieInfo.rating }}
            </li>
            <li class="aside-meta__item">
              <i class="fa-solid fa-language aside-meta__icon"></i>
              {{ movieInfo.language }}
            </li>
            <li class="aside-meta__item">
              <i class="fa-solid fa-film aside-meta__icon"></i>
              {{ movieInfo.format }}
            </li>
          </ul>

          <!-- 分隔線 -->
          <hr class="aside-divider my-2" />

          <!-- 場次資訊 -->
          <ul class="aside-meta list-unstyled d-flex flex-column gap-1 mb-0">
            <li class="aside-meta__item">
              <i class="fa-solid fa-location-dot aside-meta__icon"></i>
              {{ movieInfo.venue }}
            </li>
            <li class="aside-meta__item">
              <i class="fa-solid fa-calendar aside-meta__icon"></i>
              {{ movieInfo.date }}
            </li>
            <li class="aside-meta__item">
              <i class="fa-solid fa-circle-play aside-meta__icon"></i>
              {{ movieInfo.time }}
            </li>
          </ul>

        </div>
      </aside>

      <!-- 右側 7/10：訂票流程內容（slot，由各步驟 view 決定放什麼）-->
      <main class="booking-layout-pc__main">
        <slot name="content" />
      </main>

    </div>
  </div>
</template>

<script setup>
import { useMovieStore } from '@/store/movieStore'
import { storeToRefs } from 'pinia'

// 與 SelectedInfoCard 相同的資料來源
const movieStore = useMovieStore()
const { selectedInfoCard: movieInfo } = storeToRefs(movieStore)
</script>

<style lang="scss" scoped>
@import "@/assets/scss/variables";

.booking-layout-pc {
  width: 100%;
  min-height: 100vh;
}

// ── 電腦版雙欄容器 ─────────────────────────────────────────────
.booking-layout-pc__row {
  // 充滿整個視窗高度
  min-height: 100vh;
  align-items: flex-start;
}

// ── 左側：電影資訊面板（3/10）──────────────────────────────────
.booking-layout-pc__aside {
  // 3:7 分欄：30%
  width: 30%;
  flex-shrink: 0;
  // 固定置頂，不隨右側捲動
  position: sticky;
  top: 0;
  // 充滿視窗高度
  min-height: 100vh;
  // 背景深色讓左側有區隔感
  background: rgba(v.$vieshow-dark, 0.85);
  border-right: 1px solid rgba(v.$white, 0.08);
  // 內距
  padding: var(--gap-lg) var(--gap-md);
  display: flex;
  flex-direction: column;
}

// ── 海報大圖 ───────────────────────────────────────────────────
.aside-poster-wrap {
  width: 50%;
  border-radius: var(--app-radius-lg);          // 手機 12px / PC 16px
  overflow: hidden;
  box-shadow:
    0 8px 24px rgba(v.$black, 0.6),
    0 0 0 1px rgba(v.$white, 0.08);
  // 海報比例 2:3
  aspect-ratio: 2 / 3;
}

.aside-poster {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  border-radius: var(--app-radius-lg);
}

// ── 中英文標題 ─────────────────────────────────────────────────
.aside-title-row {
  display: flex;
  flex-direction: column;
  gap: var(--gap-xs);
}

.aside-title-zh {
  margin: 0;
  // h4：手機 24px / PC 26px
  font-size: var(--app-font-size-h4);
  font-weight: 700;
  color: v.$white;
  letter-spacing: 0.04em;
  line-height: 1.3;
}

.aside-title-en {
  // 迷你文：手機 12px / PC 14px
  font-size: var(--app-font-size-mini);
  font-weight: 500;
  color: v.$vieshow-secondary;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

// ── 分隔線 ─────────────────────────────────────────────────────
.aside-divider {
  border: none;
  border-top: 1px solid rgba(v.$white, 0.1);
}

// ── meta 資訊列 ────────────────────────────────────────────────
.aside-meta__item {
  display: flex;
  align-items: center;
  // 輔助文 Sm：手機 14px / PC 16px
  font-size: var(--app-font-size-sm);
  color: v.$light;
  gap: var(--gap-sm);
  line-height: 1.5;
}

.aside-meta__icon {
  // icon-sm：手機 16px / PC 32px（用 em 讓它跟文字比例對齊）
  font-size: 0.9em;
  color: v.$vieshow-secondary;
  flex-shrink: 0;
  width: 16px;
  text-align: center;
}

// ── 右側：訂票流程（7/10）─────────────────────────────────────
.booking-layout-pc__main {
  // 剩餘 70%
  flex: 1;
  min-width: 0;
  padding: var(--gap-lg) var(--gap-lg);
  overflow-y: auto;
}
</style>