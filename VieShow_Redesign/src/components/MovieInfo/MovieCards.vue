<template>
  <div
    class="movie-card h-100"
    :class="{ 'movie-card--selected': isSelected }"
    @click="handleCardClick"
  >
    <div class="movie-card__poster">
      <img
        :src="movie.posterUrl"
        :alt="movie.titleZh"
        class="movie-card__poster-img"
      />
      <div class="movie-card__poster-overlay" />
    </div>

    <div class="d-flex flex-column flex-grow-1 p-3">
      
      <div class="d-flex flex-column gap-1 mb-3">
        <h3 class="movie-card__title-zh mb-0 text-white fw-bold">{{ movie.titleZh }}</h3>
        <p class="movie-card__title-en mb-0 text-white small">{{ movie.titleEn }}</p>
      </div>

      <p class="movie-card__release text-white small fw-normal mb-4">
        上映日期：{{ movie.releaseDate }}
      </p>

      <SecondaryButton
        class="w-100 mt-auto"
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
import { useMovieStore } from '@/store/movieStore' // 💡 確保路徑是您的實際路徑

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

// 點擊卡片 → 更新 store
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
/* 💡 統一使用 @import 載入變數 */
@import "@/assets/scss/variables";

.movie-card {
  display: flex;
  flex-direction: column;
  width: 100%;
  background: $vieshow-dark;
  border-radius: var(--app-radius-sm); // 💡 對齊變數手冊：手機 4px / 電腦 8px 
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  // 💡 使用變數庫中定義好的 mixin，確保只在有滑鼠的設備觸發 hover [cite: 122]
  @include hover-focus {
    transform: translateY(-4px);
    box-shadow: 0 16px 40px rgba($black, 0.5);
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

// ── 標題 (其餘間距已交由 Bootstrap 類別接管) ────────────────────
.movie-card__title-zh {
  font-size: var(--app-font-size-h5); // 💡 對齊變數手冊：手機 20px / 電腦 22px 自動切換 
  letter-spacing: $letter-spacing-wide;
  line-height: 1.25;
  
  // 💡 加上單行截斷，防止電影名稱過長導致卡片高度破版
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.movie-card__title-en {
  letter-spacing: 0.1em;
  text-transform: uppercase;
  line-height: 1.4;
  
  // 💡 加上單行截斷防破版
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.movie-card__release {
  line-height: 1.5;
}
</style>