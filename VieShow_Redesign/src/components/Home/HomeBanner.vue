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

    <div
      class="banner-pagination-wrapper position-absolute bottom-0 start-50 translate-middle-x mb-5 z-index-20"
    >
      <div class="pagination-circle-window">
        <div class="dots-track-centered">
          <button
            v-for="(_, index) in movieStore.movieList"
            :key="'dot-' + index"
            class="dot-btn-circular"
            :class="{ active: currentIndex === index }"
            :style="getDotStyle(index)"
            @click="goToSlide(index)"
          ></button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useMovieStore } from "@/store/movieStore";
import { useRouter } from "vue-router";
import PrimaryButton from "@/components/Common/Button/PrimaryButton.vue";

const router = useRouter();
const movieStore = useMovieStore();
const currentIndex = ref(0);
let timer = null;

const currentMovie = computed(
  () => movieStore.movieList[currentIndex.value] || {},
);

const goToSlide = (index) => {
  currentIndex.value = index;
  // 💡 重設計時器
  clearInterval(timer);
  startTimer();
};

const getDotStyle = (index) => {
  const total = movieStore.movieList.length;
  // 計算相對距離（考慮環狀邏輯）
  let diff = index - currentIndex.value;

  // 核心環狀算法：確保 diff 永遠在 -total/2 到 total/2 之間
  if (diff > total / 2) diff -= total;
  if (diff < -total / 2) diff += total;

  const dotWidth = 26; // 間距
  const opacity = Math.max(0, 1 - Math.abs(diff) * 0.4); // 離中心越遠越透明
  const scale = Math.max(0.5, 1 - Math.abs(diff) * 0.15); // 離中心越遠越小

  return {
    transform: `translateX(${diff * dotWidth}px) scale(${scale})`,
    opacity: opacity,
    zIndex: 10 - Math.abs(diff),
    position: "absolute", // 必須絕對定位才能重疊並由計算控制位置
  };
};

const startTimer = () => {
  // 對齊組長設定的 5 秒切換
  timer = setInterval(
    () => goToSlide((currentIndex.value + 1) % movieStore.movieList.length),
    5000,
  );
};

onMounted(() => {
  if (movieStore.movieList.length > 0) startTimer();
});

onUnmounted(() => {
  clearInterval(timer);
});

const goBooking = (id) => {
  // 將選取的電影 ID 存入 Pinia
  movieStore.selectMovie(id);

  // 跳轉至快速訂票頁
  router.push("/fastbooking");
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
      rgba(v.$black, 0.5) 50%,
      rgba(v.$black, 0.7) 100%,
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
    font-size: var(--app-font-size-base);
    @include v.media-breakpoint-up(md) {
      max-width: 800px;
    }
  }

  .banner-pagination-wrapper {
    .pagination-circle-window {
      width: 150px; // 顯示範圍
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      // 兩側羽化，更有「轉入後方」的感覺
      mask-image: linear-gradient(
        to right,
        transparent,
        black 30%,
        black 70%,
        transparent
      );
    }

    .dots-track-centered {
      position: relative;
      width: 10px;
      height: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .dot-btn-circular {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      border: none;
      background-color: v.$white;
      cursor: pointer;
      padding: 0;
      transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1); // 帶點彈性的轉動感
      will-change: transform, opacity;

      &.active {
        background-color: v.$white;
        // 藍色核心發光
        box-shadow:
          0 0 15px rgba(v.$vieshow-primary, 1),
          0 0 30px rgba(v.$vieshow-primary, 0.6);
      }
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
