<template>
  <div
    class="movie-card"
    :class="{ 'movie-card--selected': isSelected }"
    @click="handleCardClick"
  >
    <!-- 海報區 -->
    <div class="movie-card__poster">
      <img
        :src="movie.posterUrl"
        :alt="movie.titleZh"
        class="movie-card__poster-img"
      />
      <div class="movie-card__poster-overlay" />
    </div>
 
    <!-- 資訊區 -->
    <div class="movie-card__body">
      <div class="movie-card__titles">
        <h3 class="movie-card__title-zh">{{ movie.titleZh }}</h3>
        <p class="movie-card__title-en">{{ movie.titleEn }}</p>
      </div>
      <p class="movie-card__release">上映日期：{{ movie.releaseDate }}</p>
      <SecondaryButton
        class="btn btn-primary btn-lg w-100 movie-card__btn"
        @click.stop="handleBook"
      >
        快速訂票
      </SecondaryButton>
    </div>
  </div>
</template>

<script setup>
import SecondaryButton from '@/components/Common/Button/SecondaryButton.vue'
import { computed } from 'vue'
import { useMovieStore } from '@/store/movieStore'
 
const props = defineProps({
  movie: {
    type: Object,
    required: true,
  },
})
 
const emit = defineEmits(['book'])
const movieStore = useMovieStore()
 
// 是否為目前選中的電影
const isSelected = computed(() =>
  movieStore.selectedMovieId === props.movie.id
)
 
// 點擊卡片 → 更新 store，SelectedInfoCard 自動同步
const handleCardClick = () => {
  movieStore.selectMovie(props.movie.id)
}
 
// 點擊快速訂票
const handleBook = () => {
  movieStore.selectMovie(props.movie.id)
  emit('book', props.movie)
}
</script>

<style lang="scss" scoped>
@import "@/assets/scss/variables";

.movie-card {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 427px;
  background: $vieshow-dark;
  border-radius: $border-radius-sm;          // 16px
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 16px 40px rgba($black, 0.5);
    }
  }
}

// ── 海報區 ─────────────────────────────────────────────────────
.movie-card__poster {
  position: relative;
  width: 100%;
  aspect-ratio: 2 / 3;                   // 電影海報標準比例
  overflow: hidden;
}

.movie-card__poster-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center top;
  display: block;
  transition: transform 0.35s ease;

  .movie-card:hover & {
    transform: scale(1.03);
  }
}

// 底部漸層遮罩（讓資訊區與海報自然過渡）
.movie-card__poster-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 80px;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    $vieshow-dark 100%
  );
  pointer-events: none;
}

// ── 資訊區 ─────────────────────────────────────────────────────
.movie-card__body {
  display: flex;
  flex-direction: column;
  gap: map-get($spacers, 1);             // 8px
  padding: map-get($spacers, 3) map-get($spacers, 3) map-get($spacers, 3); // 8px 16px 16px
}

// ── 標題 ───────────────────────────────────────────────────────
.movie-card__titles {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-bottom: 10px;
}

.movie-card__title-zh {
  margin: 0;
  font-size: map-get($display-font-sizes, 6);   // 1.375rem = 22px
  font-weight: 700;
  color: $light;
  letter-spacing: 0.04em;
  line-height: 1.25;
}

.movie-card__title-en {
  margin: 0;
  font-size: $font-size-mini;                   // 0.875rem = 14px
  font-weight: 400;
  color: $light;                    // #9E9E9E
  letter-spacing: 0.1em;
  text-transform: uppercase;
  line-height: 1.4;
}

// ── 上映日期 ───────────────────────────────────────────────────
.movie-card__release {
  margin: 0;
  font-size: $font-size-mini;  
  font-weight: 200px;                 // 0.875rem = 14px
  color: $light;                    // #9E9E9E
  line-height: 1.5;
  margin-bottom: 30px;
}

// ── 快速訂票按鈕 ───────────────────────────────────────────────
// 使用 Bootstrap .btn.btn-primary.btn-lg，只補充必要覆寫
.movie-card__btn {
  margin-top: map-get($spacers, 1);             // 8px
  font-weight: 600;
  letter-spacing: 0.06em;
}
</style>