<template>
  <div class="app-wrapper">
    <!-- 選片資訊 Bar（頁面頂部） -->
    <MovieInfoBar :movie="selectedMovie" />

    <!-- 頁面主體 -->
    <main class="main-wrapper">
      <div class="container">
        <div class="row g-3">
          <div
            v-for="movie in movieList"
            :key="movie.id"
            class="col-6 col-md-4 col-lg-3"
          >
            <MovieCards
              :movie="movie"
              @click="onSelectMovie"
              @book="onBookMovie"
            />
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import MovieCards from './components/MovieInfo/MovieCards.vue'

const selectedMovie = ref({
  titleZh: '極限返航',
  titleEn: 'PROJECT HAIL MARY',
  posterUrl: 'https://www.unicornpopcorn.com.tw/ForVsWeb/upload/film/film_20260225016.jpg',
  duration: '156分',
  rating: '保護級',
  language: '英語',
  format: '4DX',
  venue: '台北信義威秀',
  date: '2026年4月28日(二)',
  time: '19:30',
})

const movieList = ref([
  {
    id: 1,
    titleZh: '極限返航',
    titleEn: 'PROJECT HAIL MARY',
    posterUrl: 'https://www.unicornpopcorn.com.tw/ForVsWeb/upload/film/film_20260225016.jpg',
    releaseDate: '2026/03/18',
  },
  {
    id: 2,
    titleZh: '極限返航',
    titleEn: 'PROJECT HAIL MARY',
    posterUrl: 'https://www.unicornpopcorn.com.tw/ForVsWeb/upload/film/film_20260225016.jpg',
    releaseDate: '2026/03/18',
  },
  {
    id: 3,
    titleZh: '極限返航',
    titleEn: 'PROJECT HAIL MARY',
    posterUrl: 'https://www.unicornpopcorn.com.tw/ForVsWeb/upload/film/film_20260225016.jpg',
    releaseDate: '2026/03/18',
  },
  {
    id: 4,
    titleZh: '極限返航',
    titleEn: 'PROJECT HAIL MARY',
    posterUrl: 'https://www.unicornpopcorn.com.tw/ForVsWeb/upload/film/film_20260225016.jpg',
    releaseDate: '2026/03/18',
  },
])

const onSelectMovie = (movie) => {
  selectedMovie.value = {
    ...selectedMovie.value,
    titleZh: movie.titleZh,
    titleEn: movie.titleEn,
    posterUrl: movie.posterUrl,
  }
}

const onBookMovie = (movie) => {
  console.log('訂票：', movie.titleZh)
}
</script>

<style lang="scss" scoped>
@import "@/assets/scss/variables";

.app-wrapper {
  min-height: 100vh;
  background: $vieshow-gradient-dark;
}

.main-wrapper {
  padding-top: $web-top-padding-mobile;
  padding-bottom: $web-bottom-padding-mobile;

  @media (min-width: map-get($grid-breakpoints, md)) {
    padding-top: $web-top-padding-pc;
    padding-bottom: $web-bottom-padding-pc;
  }
}
</style>