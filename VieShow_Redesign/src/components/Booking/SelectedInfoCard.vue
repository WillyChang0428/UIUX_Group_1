<template>
  <div v-if="movieInfo" class="movie-info-bar">
    <div class="glass-card">
      <div>
        <div class="glass-card__inner">
          <div class="poster-wrapper">
            <img
              :src="movieInfo.posterUrl"
              :alt="movieInfo.titleZh"
              class="poster-img"
            />
          </div>

          <div class="movie-details">
            <div class="title-row">
              <span class="title-zh">{{ movieInfo.titleZh }}</span>
              <span class="title-en">{{ movieInfo.titleEn }}</span>
            </div>

            <div class="session-row" v-if="movieInfo.venue || movieInfo.date || movieInfo.time">
              <span v-if="movieInfo.venue" class="highlight-text"><i class="fa-solid fa-location-dot me-1 text-primary"></i>{{ movieInfo.venue }}</span>
              <span v-if="movieInfo.venue && (movieInfo.date || movieInfo.time)" class="sep">｜</span>
              
              <span v-if="movieInfo.date" class="highlight-text">{{ movieInfo.date }}</span>
              <span v-if="movieInfo.date && movieInfo.time" class="sep">｜</span>
              
              <span v-if="movieInfo.time" class="highlight-text fw-bold text-primary">{{ movieInfo.time }}</span>
            </div>

            <div class="meta-row">
              <span v-if="movieInfo.format" class="format-badge">{{ movieInfo.format }}</span>
              <span v-if="movieInfo.format" class="sep">｜</span>
              
              <span>{{ movieInfo.duration }}</span>
              <span class="sep">｜</span>
              <span>{{ movieInfo.rating }}</span>
              <span class="sep">｜</span>
              <span>{{ movieInfo.language }}</span>
            </div>
          </div>

          <div
            v-if="mode === 'preview'"
            class="action-btn d-flex align-items-center justify-content-center"
            @click="goToDetail"
            title="查看電影詳情"
          >
            <i class="fa-solid fa-ellipsis"></i>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useMovieStore } from "@/store/movieStore";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";

// 新增 Props 來接收模式設定
const props = defineProps({
  mode: {
    type: String,
    default: "booking",
  },
});

const router = useRouter();
const movieStore = useMovieStore();

const { selectedInfoCard: movieInfo, selectedMovieId } = storeToRefs(movieStore);

const goToDetail = () => {
  if (selectedMovieId.value) {
    router.push({
      name: "movie-info",
      params: { id: selectedMovieId.value },
    });
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/scss/variables";

.movie-info-bar {
  width: 100%;
  font-family: "Noto Sans TC", "PingFang TC", sans-serif;
  position: relative;
  z-index: 1020 !important; 
  transform: translateZ(0); 
}

.glass-card {
  position: relative;
  width: 100%;
  border-radius: 0;
  overflow: hidden;

  backdrop-filter: blur(24px) saturate(180%) brightness(1.05);
  -webkit-backdrop-filter: blur(24px) saturate(180%) brightness(1.05);
  background: rgba($vieshow-dark, 0.8);
  border-bottom: 1px solid rgba($white, 0.1);
  box-shadow:
    0 8px 32px rgba($black, 0.45),
    0 1px 0 rgba($white, 0.06) inset;

  &::before {
    content: "";
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

  &::after {
    content: "";
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

.glass-card__inner {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: var(--gap-md);
  padding: 12px 24px;
  width: 100%;
  box-sizing: border-box;
}

.poster-wrapper {
  flex-shrink: 0;
  width: 56px;
  height: 78px;
  border-radius: 0;
  overflow: hidden;
  box-shadow:
    0 4px 14px rgba($black, 0.5),
    0 0 0 1px rgba($white, 0.08);
  border-radius: 8px; /* 微調縮圖圓角 */
}

.poster-img {
  border-radius: 8px;
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.movie-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.35rem; /* 微調行距 */
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
  font-size: var(--app-font-size-h5); /* 稍微縮小標題，讓出版面給場次 */
  font-weight: 700;
  color: $light;
  letter-spacing: 0.04em;
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex-shrink: 0;
  max-width: 100%;
}

.title-en {
  font-size: var(--app-font-size-mini);
  font-weight: 500;
  color: rgba($light, 0.7); /* 英文稍微調暗 */
  letter-spacing: 0.12em;
  text-transform: uppercase;
  white-space: nowrap;
  flex-shrink: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 💡 新增：場次資訊行 (視覺重點) */
.session-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  font-size: var(--app-font-size-sm); 
  font-weight: 500;
  color: $white;
  line-height: 1.4;
  letter-spacing: 0.02em;

  .highlight-text {
    color: $white;
  }
  
  .text-primary {
    color: $vieshow-primary !important;
  }

  .sep {
    color: rgba($white, 0.3);
    margin: 0 0.15rem;
  }
}

/* 💡 更新：次要資訊行 (弱化視覺) */
.meta-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  font-size: 0.75rem;
  font-weight: 300;
  color: rgba($white, 0.55); /* 降低對比度，凸顯場次資訊 */
  line-height: 1.4;

  .sep {
    color: rgba($white, 0.25);
    margin: 0 0.15rem;
  }
}

/* 💡 新增：版本專屬小標籤 */
.format-badge {
  border: 1px solid rgba($white, 0.4);
  padding: 0 6px;
  border-radius: 4px;
  font-size: 0.7rem;
  color: rgba($white, 0.85);
  background: rgba($white, 0.05);
}

.action-btn {
  color: $white;
  font-size: 24px;
  cursor: pointer;
  padding: 0 8px;
  margin-left: auto;
  transition: all 0.2s ease;

  &:hover {
    color: $vieshow-primary;
    transform: scale(1.1);
  }
}
</style>