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

    <div class="desktop-list d-none d-md-block container overflow-hidden">
      <div
        class="movie-track d-flex transition-ease"
        :style="{ transform: `translateX(-${currentPage * 100}%)` }"
      >
        <div
          v-for="(page, pIndex) in moviePages"
          :key="'pc-' + pIndex"
          class="movie-page d-flex flex-shrink-0 w-100"
        >
          <div v-for="movie in page" :key="movie.id" class="movie-card-pc">
            <div class="poster-box rounded-lg shadow-sm mb-3">
              <img
                :src="movie.posterUrl"
                class="w-100 h-100 object-fit-cover rounded-lg"
              />
            </div>
            <div class="text-start text-white px-1">
              <h5 class="fw-bold mb-2 text-truncate">{{ movie.titleZh }}</h5>
              <p class="small mb-1 text-secondary">
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
    <div class="pagination-controls d-none d-md-flex justify-content-center gap-3 mt-4">
      <button class="nav-btn-static prev" @click="prevPage">
        <i class="fa-solid fa-chevron-left"></i>
      </button>
      <button class="nav-btn-static next" @click="nextPage">
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
const currentIndex = ref(0); // 手機版索引
const currentPage = ref(0); // 電腦版頁碼
let autoPlayTimer = null;

// --- 共通邏輯 ---
const currentMovie = computed(
  () => movieStore.movieList[currentIndex.value] || {},
);
const handleBooking = (id) => console.log("Booking:", id);

// --- 手機版 3D 邏輯 ---
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

// 拽拉鎖定邏輯
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
    deltaX > 0
      ? (currentIndex.value =
          (currentIndex.value + 1) % movieStore.movieList.length)
      : (currentIndex.value =
          currentIndex.value === 0
            ? movieStore.movieList.length - 1
            : currentIndex.value - 1);
    isSwiping.value = true;
  }
};
const handleTouchEnd = () => (isSwiping.value = false);

// --- 電腦版分頁邏輯 ---
const moviePages = computed(() => {
  const pages = [];
  for (let i = 0; i < movieStore.movieList.length; i += 4) {
    pages.push(movieStore.movieList.slice(i, i + 4));
  }
  return pages;
});
const nextPage = () => {
  // 💡 邏輯：如果已經是最後一頁，就回到第 0 頁，否則加 1
  currentPage.value = (currentPage.value + 1) % moviePages.value.length;
};
const prevPage = () => {
  // 💡 邏輯：如果是第 0 頁，就跳到最後一頁，否則減 1
  currentPage.value =
    currentPage.value === 0
      ? moviePages.value.length - 1
      : currentPage.value - 1;
};

// 自動播放
onMounted(() => {
  autoPlayTimer = setInterval(() => {
    nextPage();
    currentIndex.value = (currentIndex.value + 1) % movieStore.movieList.length;
  }, 8000);
});
onUnmounted(() => clearInterval(autoPlayTimer));
</script>

<style scoped lang="scss">
.hot-movie-section {
  // 手機版樣式
  .mobile-carousel {
    min-height: 450px; // 給予足夠高度防止坍塌
  }
  .carousel-container {
    height: 400px;
    perspective: 1000px;
    position: relative; // 💡 確保絕對定位的子元素有參考點
  }
  .poster-card {
    width: 260px;
    height: 380px;
    left: 50%; // 💡 關鍵修正：先推到 50%
    margin-left: -130px; // 💡 關鍵修正：推回寬度的一半來達成完美水平置中
    &.is-active {
      box-shadow: 0 0 20px rgba(v.$vieshow-primary, 0.4);
    }
  }

  // 電腦版樣式
  .desktop-list {
    position: relative;
  }

  .movie-track {
    display: flex;
    flex-wrap: nowrap; /* 強制不換行，這是跑馬燈/輪播的關鍵 */
    transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    width: 100%;
  }

  .movie-page {
    /* 每一頁都要佔滿容器寬度 */
    flex: 0 0 100%;
    width: 100%;
    display: flex;
    justify-content: flex-start; /* 改回靠左 */
    gap: var(--gap-md); /* 卡片之間的間距 */
    padding-right: var(--gap-md);
  }

  .movie-card-pc {
    /* 關鍵修正：精確計算 4 張卡片的寬度 */
    /* (100% - (3個間距 * 32px)) / 4 */
    width: calc((100% - (3 * 32px)) / 4);
    flex-shrink: 0;
  }
  .poster-box {
    aspect-ratio: 2 / 3;
    border: 1px solid v.$vieshow-secondary-emp;
    border-radius: var(--app-radius); // 自動偵測 8px/16px [cite: 33]
    &:hover {
      transform: translateY(-8px);
      border-color: v.$vieshow-primary;
    }
  }

  /* 💡 新增控制區容器 */
  .pagination-controls {
    width: 100%;
    padding-bottom: 20px;
  }

  /* 💡 修改按鈕樣式 (重新定義為 nav-btn-static) */
  .nav-btn-static {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid rgba(v.$white, 0.3); /* 加個邊框質感較好 */
    border-radius: 50%;
    background-color: transparent;
    color: v.$white;
    transition: all 0.3s ease;
    cursor: pointer;

    &:hover {
      background: v.$vieshow-primary;
      border-color: v.$vieshow-primary;
      color: v.$white;
      transform: scale(1.1);
    }

    i {
      font-size: 0.9rem;
    }
  }
}
</style>
