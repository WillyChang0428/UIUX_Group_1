<template>
  <div class="home-banner position-relative overflow-hidden w-100">
    <div class="banner-track h-100 d-flex transition-ease">
      <div
        v-for="(movie, index) in movieStore.movieList"
        :key="movie.id"
        class="banner-item flex-shrink-0 w-100 h-100 position-relative"
        :style="{ transform: `translateX(-${currentIndex * 100}%)` }"
      >
        <img
          :src="movie.posterUrl"
          :alt="movie.titleZh"
          class="d-block d-md-none w-100 h-100 object-fit-cover"
        />

        <div
          class="video-container d-none d-md-block w-100 h-100 position-absolute top-0 start-0"
        >
          <iframe
            v-if="movie.trailerUrl"
            class="w-100 h-100 object-fit-cover"
            :src="`https://www.youtube.com/embed/${getYouTubeID(movie.trailerUrl)}?autoplay=1&mute=1&controls=0&loop=1&playlist=${getYouTubeID(movie.trailerUrl)}&rel=0`"
            frameborder="0"
            allow="autoplay; encrypted-media"
          ></iframe>
          <div
            class="banner-overlay position-absolute top-0 start-0 w-100 h-100"
          ></div>
        </div>

        <div
          class="banner-overlay position-absolute top-0 start-0 w-100 h-100"
        ></div>
      </div>
    </div>

    <div
      class="container position-absolute top-50 start-50 translate-middle z-index-10"
    >
      <div class="row">
        <div class="col-12 col-md-8 col-lg-6 text-white banner-content">
          <Transition name="fade-slide" mode="out-in">
            <div :key="currentMovie.id">
              <p class="small mb-2 text-spaced ls-wide opacity-75">
                【{{ currentMovie.genre }}】 {{ currentMovie.language }}
              </p>
              <h1 class="display-4 fw-bold mb-3 ls-wide text-uppercase">
                {{ currentMovie.titleZh }}
              </h1>
              <p class="synopsis-text lh-relaxed mb-4 opacity-90">
                {{ currentMovie.synopsis }}
              </p>
              <PrimaryButton
                status="default"
                @click="goBooking(currentMovie.id)"
              >
                立即訂票
              </PrimaryButton>
            </div>
          </Transition>
        </div>
      </div>
    </div>

    <div class="d-none d-md-block">
      <button
        class="nav-btn prev position-absolute top-50 start-0 translate-middle-y ms-4 clickable-icon"
        @click="prevSlide"
      >
        <i class="fa-solid fa-chevron-left"></i>
      </button>
      <button
        class="nav-btn next position-absolute top-50 end-0 translate-middle-y me-4 clickable-icon"
        @click="nextSlide"
      >
        <i class="fa-solid fa-chevron-right"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useMovieStore } from "@/store/movieStore";
import PrimaryButton from "@/components/Common/Button/PrimaryButton.vue";

const movieStore = useMovieStore();
const currentIndex = ref(0);
let timer = null;

const currentMovie = computed(
  () => movieStore.movieList[currentIndex.value] || {},
);

const nextSlide = () => {
  currentIndex.value = (currentIndex.value + 1) % movieStore.movieList.length;
};

const prevSlide = () => {
  currentIndex.value =
    currentIndex.value === 0
      ? movieStore.movieList.length - 1
      : currentIndex.value - 1;
};

const startTimer = () => {
  // 對齊組長設定的 5 秒切換
  timer = setInterval(nextSlide, 5000);
};

onMounted(() => {
  if (movieStore.movieList.length > 0) startTimer();
});

onUnmounted(() => {
  clearInterval(timer);
});

const goBooking = (id) => {
  console.log(`跳轉至電影 ID: ${id} 訂票頁`);
};

// 💡 自動提取 YouTube ID 的工具函式
const getYouTubeID = (url) => {
  if (!url) return "";
  // 支援多種 YouTube 網址格式 (watch?v=, be/, embed/)
  const regExp =
    /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : "";
};
</script>

<style scoped lang="scss">
.home-banner {
  // 💡 確保容器是相對定位，讓影片能絕對定位填滿
  position: relative;
  height: 600px;
  @include v.media-breakpoint-up(md) {
    height: 800px;
  }

  // 🎞️ 影片容器層級管理
  .video-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0; // 最底層
    pointer-events: none; // 滑鼠點擊穿透

    /* ✨ ✨ ✨ 核心滿版修正 ✨ ✨ ✨ */
    iframe {
      position: absolute;
      // 💡 1. 強制放大：設定一個夠大的寬高比例 (例如 16:9)
      // 這能解決在不同螢幕解析度下的 Letterboxing 問題
      width: 100%;

      // 💡 2. 物理裁切：確保影片至少填滿容器，並裁切多餘部分
      min-width: 100%;
      min-height: 100%;

      // 💡 3. 完美置中：利用 50% + translate 讓放大後的影片完美卡在中間
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);

    }
  }

  .banner-track {
    transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .banner-overlay {
    // 💡 強化遮罩效果：30% 黑色背景 + 底部加深 [cite: 3, 126]
    background: linear-gradient(
      180deg,
      rgba(v.$black, 0.3) 0%,
      rgba(v.$black, 0.6) 60%,
      v.$black 100%
    );
    z-index: 1;
  }

  .synopsis-text {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    max-width: 450px;
    font-size: var(--app-font-size-base); // 16px / 18px [cite: 60, 144]
  }

  .nav-btn {
    color: rgba(v.$white, 0.5);
    transition: all 0.3s ease;
    z-index: 20; // 確保在遮罩之上

    &:hover {
      color: v.$white;
      filter: drop-shadow(0 0 8px rgba(v.$vieshow-primary, 0.8));
    }

    i {
      // 💡 圖示大小對齊地基 [cite: 156]
      font-size: var(--app-font-size-h4);
    }
  }
}

// 文字切換動畫
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.5s ease;
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateX(20px);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}
</style>
