<script setup>
import { ref } from "vue";
import MovieSwitch from "../../components/MovieInfo/MovieSwitch.vue";
import MovieCards from "../../components/MovieInfo/MovieCards.vue";
import GoOnTop from "../../components/Common/Button/GoOnTop.vue";
import { useMovieStore } from "../../store/movieStore";

const movieStore = useMovieStore();

// 1. 定義變數來管理狀態
const activeTab = ref("now");

// 2. 如果你原本有用變數定義 'now'，也可以保留，或者直接用字串判斷
const now = "now";
const upcoming = "upcoming";
</script>

<template>
  <div class="movie-page">
    <MovieSwitch v-model="activeTab" />

    <div class="movie-flex-container">
      <template v-if="activeTab === now">
        <MovieCards
          v-for="movie in movieStore.movieList"
          :key="movie.id"
          :movie="movie"
          class="flex-item"
        />
      </template>

      <template v-if="activeTab === upcoming">
        <MovieCards
          v-for="movie in movieStore.upComingMovie"
          :key="movie.id"
          :movie="movie"
          class="flex-item"
        />
      </template>
    </div>
  </div>
   <GoOnTop />
</template>

<style lang="scss" scoped>
.movie-page {
  padding: v.$spacing-md-mobile;

  // 桌機版增加內距，讓畫面不會太滿
  @media (min-width: 1024px) {
    padding: v.$spacing-xl-pc; // 假設你有這個變數
    max-width: 1440px;
    margin: 0 auto;
  }
}

.movie-flex-container {
  display: grid;
  // 預設（手機版）：一行 2 張
  grid-template-columns: repeat(2, 1fr);
  gap: v.$spacing-sm-pc;

  // 平板版 (例如 768px 以上)：一行 3 張
  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }

  // 桌機版 (1200px 以上)：一行 4 張
  @media (min-width: 1200px) {
    grid-template-columns: repeat(4, 1fr);
  }

  // 大螢幕 (1440px 以上)：一行 5 張
  @media (min-width: 1440px) {
    grid-template-columns: repeat(5, 1fr);
  }
}

.flex-item {
  width: 100%; // 在 Grid 下，寬度會由 grid-template-columns 自動決定
  max-width: none; // 移除原本的限制
}
</style>
