<template>
  <div class="hot-movie-section position-relative w-100 overflow-hidden py-5">
    <div class="mobile-carousel d-block d-md-none w-100">
      <div
        class="carousel-container d-flex align-items-center justify-content-center w-100"
        @touchstart="handleTouchStart"
        @touchmove="handleTouchMove"
        @touchend="handleTouchEnd"
      >
        <div
          v-for="(movie, index) in movieStore.movieList"
          :key="'mb-' + movie.id"
          class="poster-card rounded-lg shadow-lg position-absolute"
          :class="getCardClass(index)"
          :style="getCardStyle(index)"
        >
          <img
            :src="movie.posterUrl"
            :alt="movie.titleZh"
            class="w-100 h-100 object-fit-cover rounded-lg"
          />
        </div>
      </div>

      <div class="movie-info text-center mt-5 text-white w-100 px-3">
        <Transition name="fade-up" mode="out-in">
          <div :key="currentMovie.id" class="w-100">
            <h2 class="fw-bold mb-2">{{ currentMovie.titleZh }}</h2>
            <p class="small mb-1 text-secondary">
              導演：{{ currentMovie.director }}
            </p>
            <p class="small mb-4 text-secondary text-truncate px-4">
              演員：{{ currentMovie.cast }}
            </p>
            <SecondaryButton @click="handleBooking(currentMovie.id)"
              >立即訂票</SecondaryButton
            >
          </div>
        </Transition>
      </div>
    </div>

    <div class="desktop-list d-none d-md-block container">
      <div class="movie-window overflow-hidden">
        <div
          class="movie-track d-flex transition-ease"
          :style="{ transform: `translateX(-${desktopIndex * 25}%)` }"
        >
          <div
            v-for="movie in movieStore.movieList"
            :key="'pc-' + movie.id"
            class="movie-card-pc"
          >
            <div class="card-hover-wrapper d-flex flex-column h-100">
              <div class="poster-box rounded-lg shadow-sm mb-3">
                <img
                  :src="movie.posterUrl"
                  class="w-100 h-100 object-fit-cover"
                />
              </div>
              <div class="text-content text-start text-white px-1">
                <h5 class="fw-bold mb-2 text-truncate">{{ movie.titleZh }}</h5>
                <p class="small mb-1 text-secondary text-truncate">
                  導演：{{ movie.director }}
                </p>
                <p class="small mb-4 text-secondary text-truncate">
                  演員：{{ movie.cast }}
                </p>
                <SecondaryButton @click="handleBooking(movie.id)" class="btn-sm"
                  >立即訂票</SecondaryButton
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      class="pagination-controls d-none d-md-flex justify-content-center gap-3 mt-4"
    >
      <button class="nav-btn-static" @click="prevSlide">
        <i class="fa-solid fa-chevron-left"></i>
      </button>
      <button class="nav-btn-static" @click="nextSlide">
        <i class="fa-solid fa-chevron-right"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useMovieStore } from "@/store/movieStore";
import SecondaryButton from "@/components/Common/Button/SecondaryButton.vue";

const movieStore = useMovieStore();
const currentIndex = ref(0);
const desktopIndex = ref(0);
let autoPlayTimer = null;

const currentMovie = computed(
  () => movieStore.movieList[currentIndex.value] || {},
);
const handleBooking = (id) => console.log("Booking:", id);

const resetTimer = () => {
  if (autoPlayTimer) clearInterval(autoPlayTimer);
  autoPlayTimer = setInterval(() => {
    nextSlide();
  }, 8000);
};

// 手機版 3D 邏輯保持不變
const getCardClass = (index) => ({ "is-active": index === currentIndex.value });
const getCardStyle = (index) => {
  const total = movieStore.movieList.length;
  const diff = (index - currentIndex.value + total) % total;
  let offset = diff > total / 2 ? diff - total : diff;
  const absOffset = Math.abs(offset);
  return {
    transform: `translateX(${offset * 120}px) scale(${1 - absOffset * 0.15})`,
    opacity: 1 - absOffset * 0.7,
    zIndex: 10 - absOffset,
    transition: "all 0.5s ease",
  };
};

// 滑動邏輯
let touchStartX = 0;
const isSwiping = ref(false);
const handleTouchStart = (e) => {
  touchStartX = e.touches[0].clientX;
  isSwiping.value = false;
};
const handleTouchMove = (e) => {
  if (isSwiping.value) return;
  const deltaX = touchStartX - e.touches[0].clientX;
  if (Math.abs(deltaX) > 50) {
    deltaX > 0 ? nextSlide() : prevSlide();
    isSwiping.value = true;
  }
};
const handleTouchEnd = () => (isSwiping.value = false);

// 切換邏輯
const nextSlide = () => {
  const total = movieStore.movieList.length;
  currentIndex.value = (currentIndex.value + 1) % total;
  if (desktopIndex.value >= total - 4) desktopIndex.value = 0;
  else desktopIndex.value++;
  resetTimer();
};

const prevSlide = () => {
  const total = movieStore.movieList.length;
  currentIndex.value =
    currentIndex.value === 0 ? total - 1 : currentIndex.value - 1;
  if (desktopIndex.value === 0) desktopIndex.value = total - 4;
  else desktopIndex.value--;
  resetTimer();
};

onMounted(() => {
  resetTimer();
});
onUnmounted(() => {
  if (autoPlayTimer) clearInterval(autoPlayTimer);
});
</script>

<style scoped lang="scss">
.hot-movie-section {
  // 手機版 (省略重複部分)
  .mobile-carousel {
    min-height: 450px;
  }
  .carousel-container {
    height: 400px;
    perspective: 1000px;
    position: relative;
  }
  .poster-card {
    width: 260px;
    height: 380px;
    left: 50%;
    margin-left: -130px;
    &.is-active {
      box-shadow: 0 0 20px rgba(v.$vieshow-primary, 0.4);
    }
  }

  // 桌機版關鍵樣式
  .movie-window {
    padding: 20px 0; // 💡 預留空間給放大後的卡片，避免邊緣被切掉
    overflow: hidden; // 確保容器裁切溢出內容
    width: 100%;
  }

  .movie-track {
    display: flex;
    flex-wrap: nowrap;
    width: 100%;
    align-items: stretch; // 💡 確保所有卡片容器高度一致
    // 💡 關鍵：確保過渡屬性被正確編譯且優先級足夠
    transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1) !important;
    will-change: transform; // 優化效能
  }

  .movie-card-pc {
    flex: 0 0 25%; // 固定四張
    max-width: 25%; // 💡 強制限制最大寬度，防止被內容撐開
    padding: 0 calc(var(--gap-md) / 2); // [cite: 131]
    box-sizing: border-box;
    transition: transform 0.4s ease; // 平滑過渡
  }

  /* 💡 Hover 整體放大效果 */
  .card-hover-wrapper {
    transition: transform 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);

    &:hover {
      transform: scale(1.05); // 💡 整體微微放大 5%

      .poster-box {
        border-color: v.$vieshow-primary;
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.5);
      }
    }
  }

  .poster-box {
    aspect-ratio: 2 / 3; // 💡 強制比例一致
    width: 100%;
    overflow: hidden;
    border-radius: var(--app-radius);
    border: 1px solid v.$vieshow-secondary-emp;
    transition: border-color 0.3s ease;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .text-content {
    h5 {
      font-size: var(--app-font-size-h5);
    }
    p {
      font-size: var(--app-font-size-base);
    }
  }

  .nav-btn-static {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 1px solid rgba(v.$white, 0.3);
    background: transparent;
    color: v.$white;
    transition: all 0.3s ease;

    &:hover {
      background: v.$vieshow-primary;
      border-color: v.$vieshow-primary;
    }
  }
}
</style>
