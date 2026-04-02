<template>
  <div v-if="movieInfo" class="movie-info-bar">
    <div class="glass-card">
      <div class="glass-card__inner">
        <!-- 海報縮圖 -->
        <div class="poster-wrapper">
          <img :src="movieInfo.posterUrl" :alt="movieInfo.titleZh" class="poster-img" />
        </div>
 
        <!-- 電影資訊 -->
        <div class="movie-details">
          <!-- 第一行：中英文標題 -->
          <div class="title-row">
            <span class="title-zh">{{ movieInfo.titleZh }}</span>
            <span class="title-en">{{ movieInfo.titleEn }}</span>
          </div>
 
          <!-- 第二行：所有資訊條列 -->
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
      </div>
    </div>
  </div>
</template>

<script setup>
import { useMovieStore } from '@/store/movieStore'
import { storeToRefs } from 'pinia'
 
const movieStore = useMovieStore()
 
// selectedInfoCard 從 store 取出，重新命名為 movieInfo 供 template 使用
const { selectedInfoCard: movieInfo } = storeToRefs(movieStore)
</script>

<style lang="scss" scoped>
@import "@/assets/scss/variables";

// ── 外層容器：只負責寬度，不加任何視覺樣式 ──────────────────
.movie-info-bar {
  width: 100%;
  font-family: 'Noto Sans TC', 'PingFang TC', sans-serif;
}

// ── 玻璃卡片：所有視覺效果集中在這裡 ───────────────────────
.glass-card {
  position: relative;
  width: 100%;
  border-radius: 0;                              // 無圓角
  overflow: hidden;

  // 毛玻璃核心：backdrop-filter 必須存在
  backdrop-filter: blur(24px) saturate(180%) brightness(1.05);
  -webkit-backdrop-filter: blur(24px) saturate(180%) brightness(1.05);

  // 半透明深色底（讓文字可讀）
  background: rgba($vieshow-dark, 0.6);

  // 下邊框
  border-bottom: 1px solid rgba($white, 0.1);

  // 陰影
  box-shadow:
    0 8px 32px rgba($black, 0.45),
    0 1px 0 rgba($white, 0.06) inset;

  // ── 光源高光層（Light -38deg 80%）──────────────────────────
  //  ::before / ::after 掛在 .glass-card，position: relative 才有效
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      -38deg,
      rgba($white, 0.14) 0%,
      rgba($white, 0.05) 30%,
      transparent 60%
    );
    pointer-events: none;
    z-index: 0;
  }

  // ── 頂部高光線 ─────────────────────────────────────────────
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent,
      rgba($white, 0.22) 30%,
      rgba($white, 0.22) 70%,
      transparent
    );
    pointer-events: none;
    z-index: 1;
  }
}

// ── 內容層：z-index 確保在偽元素之上 ───────────────────────
.glass-card__inner {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: $spacer;
  padding: 12px 24px;
  width: 100%;
  box-sizing: border-box;
}

// ── 海報縮圖 ───────────────────────────────────────────────────
.poster-wrapper {
  flex-shrink: 0;
  width: 56px;
  height: 78px;
  border-radius: 0;
  overflow: hidden;
  box-shadow:
    0 4px 14px rgba($black, 0.5),
    0 0 0 1px rgba($white, 0.08);
    border-radius: 12px;
}

.poster-img {
  border-radius: 12px;
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

// ── 文字區 ─────────────────────────────────────────────────────
.movie-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  min-width: 0;
}

.title-row {
  display: flex;
  align-items: baseline;
  gap: 0.625rem;
  flex-wrap: nowrap;
  min-width: 0;
}

.title-zh {
  font-size: 32px;
  font-weight: 700;
  color: $light;
  letter-spacing: 0.04em;
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.title-en {
  font-size: $font-size-mini-mobile;
  font-weight: 500;
  color: $light;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  white-space: nowrap;
  flex-shrink: 0;
}

.meta-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  font-size: $font-size-mini-mobile;
  font-weight: 200;
  color: $light;
  line-height: 1.4;
  letter-spacing: 0.01em;
}

.sep {
  color: $white;
  margin: 0 0.125rem;
}
</style>