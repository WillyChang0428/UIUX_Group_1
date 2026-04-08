<script setup>
import { ref } from "vue";
import MovieSwitch from "../../components/MovieInfo/MovieSwitch.vue";
import MovieCards from "../../components/MovieInfo/MovieCards.vue";
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
</template>

<style lang="scss" scoped>
/* 這裡維持你原本的 Flexbox 樣式即可，那樣寫已經可以達成一行兩個了 */
.movie-page {
  // 注意：確保 v 變數有被正確引入，否則會報錯
  padding: v.$spacing-md-mobile;
}

.movie-flex-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start; // 改為 flex-start 配合 gap 比較穩定
  gap: v.$spacing-md-mobile;
}

.flex-item {
  /* 兩張卡片：50% 減去 gap 的一半 */
  flex: 0 0 calc(50% - 8px);
  max-width: calc(50% - 8px);
}
</style>
