<!-- 使用方式:
有詳情版本：<SelectedInfoCard mode="preview" />
無詳情版本：<SelectedInfoCard /> 
-->

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

        <div v-if="mode === 'preview'" class="action-btn d-flex align-items-center justify-content-center"
          @click="goToMovieInfo" title="查看電影詳情">
          <i class="fa-solid fa-ellipsis"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useMovieStore } from '@/store/movieStore'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'

// 💡 新增 Props 來接收模式設定
const props = defineProps({
  mode: {
    type: String,
    default: 'booking', // 預設為 'booking' (完整資訊)，可傳入 'preview' (預覽模式)
  }
})

const router = useRouter()
const movieStore = useMovieStore()


// 💡 多解構出 selectedMovieId 供跳轉使用
const { selectedInfoCard: movieInfo, selectedMovieId } = storeToRefs(movieStore)

// 💡 處理點擊 ... 按鈕的跳轉邏輯
const goToMovieInfo = () => {
  if (selectedMovieId.value) {
    router.push(`/movie/${selectedMovieId.value}`)
  }
}
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
  border-radius: 0; // 無圓角
  overflow: hidden;

  // 毛玻璃核心：backdrop-filter 必須存在
  backdrop-filter: blur(24px) saturate(180%) brightness(1.05);
  -webkit-backdrop-filter: blur(24px) saturate(180%) brightness(1.05);

  // 半透明深色底（讓文字可讀）
  background: rgba(v.$vieshow-dark, 0.6);

  // 下邊框 
  border-bottom: 1px solid rgba(v.$white, 0.1);

  // 陰影 
  box-shadow:
    0 8px 32px rgba(v.$black, 0.45),
    0 1px 0 rgba(v.$white, 0.06) inset;

  // ── 光源高光層（Light -38deg 80%）──────────────────────────
  //  ::before / ::after 掛在 .glass-card，position: relative 才有效
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

  // ── 頂部高光線 ─────────────────────────────────────────────
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

// ── 內容層：z-index 確保在偽元素之上 ───────────────────────
.glass-card__inner {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  // 💡 使用指南的變數 [cite: 123, 126]
  gap: var(--gap-md);
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
    0 4px 14px rgba(v.$black, 0.5),
    0 0 0 1px rgba(v.$white, 0.08);
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
  min-width: 0; // 💡 Flex 子層裁切必備
}

.title-zh {
  font-size: 32px;
  font-weight: 700;
  color: v.$light;
  letter-spacing: 0.04em;
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  // 💡 核心修正 1：中文優先，絕對不被壓縮
  flex-shrink: 0;
  max-width: 100%; // 確保即使中文超級長，也不會超出父容器
}

.title-en {
  font-size: var(--app-font-size-mini);
  font-weight: 500;
  color: v.$light;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  white-space: nowrap;

  // 💡 核心修正 2：允許英文被壓縮，空間不夠時顯示刪節號 (...)
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

// ── 💡 新增：右側動作按鈕 (預覽模式專屬) ─────────────────────────────────
.action-btn {
  color: v.$white;
  font-size: 24px;
  cursor: pointer;
  padding: 0 8px;
  margin-left: auto; // 讓它在 flex 容器中自動推到最右邊，對齊該行文字
  transition: all 0.2s ease;

  &:hover {
    color: v.$vieshow-primary;
    transform: scale(1.1);
  }
}
</style>