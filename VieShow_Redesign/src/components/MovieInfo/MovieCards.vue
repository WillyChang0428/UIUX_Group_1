<template>
  <div class="movie-card" @click="handleCardClick">
    <!-- 海報區 -->
    <div class="movie-card__poster">
      <img
        :src="movie.posterUrl"
        :alt="movie.titleZh"
        class="movie-card__poster-img"
      />
      <!-- 海報底部漸層遮罩 -->
      <div class="movie-card__poster-overlay" />
    </div>

    <!-- 資訊區 -->
    <div class="movie-card__body">
      <!-- 標題 -->
      <div class="movie-card__titles">
        <h3 class="movie-card__title-zh">{{ movie.titleZh }}</h3>
        <p class="movie-card__title-en">{{ movie.titleEn }}</p>
      </div>

      <!-- 上映日期 -->
      <p class="movie-card__release">
        上映日期：{{ movie.releaseDate }}
      </p>

      <!-- 快速訂票按鈕 -->
      <button class="btn btn-primary btn-lg w-100 movie-card__btn" @click.stop="handleBook">
        快速訂票
      </button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  movie: {
    type: Object,
    default: () => ({
      titleZh: '極限返航',
      titleEn: 'PROJECT HAIL MARY',
      posterUrl: 'https://www.unicornpopcorn.com.tw/ForVsWeb/upload/film/film_20260225016.jpg',
      releaseDate: '2026/03/18',
    }),
  },
})

const emit = defineEmits(['click', 'book'])

const handleCardClick = () => {
  emit('click', props.movie)
}

const handleBook = () => {
  emit('book', props.movie)
}
</script>

<style lang="scss" scoped>
@import "@/assets/scss/variables";

.movie-card {
  display: flex;
  flex-direction: column;
  width: 100%;
  background: $vieshow-dark;
  border-radius: $border-radius;          // 16px
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
  padding: map-get($spacers, 1) map-get($spacers, 2) map-get($spacers, 2); // 8px 16px 16px
}

// ── 標題 ───────────────────────────────────────────────────────
.movie-card__titles {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
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
  color: $vieshow-secondary;                    // #9E9E9E
  letter-spacing: 0.1em;
  text-transform: uppercase;
  line-height: 1.4;
}

// ── 上映日期 ───────────────────────────────────────────────────
.movie-card__release {
  margin: 0;
  font-size: $font-size-mini;                   // 0.875rem = 14px
  color: $vieshow-secondary;                    // #9E9E9E
  line-height: 1.5;
}

// ── 快速訂票按鈕 ───────────────────────────────────────────────
// 使用 Bootstrap .btn.btn-primary.btn-lg，只補充必要覆寫
.movie-card__btn {
  margin-top: map-get($spacers, 1);             // 8px
  font-weight: 600;
  letter-spacing: 0.06em;
  border-radius: $border-radius-pill;           // 圓角按鈕
}
</style>