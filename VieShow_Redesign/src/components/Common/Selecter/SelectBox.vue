<template>
  <div class="booking-selector w-100" :class="`mode-${mode}`">
    <template v-if="mode === 'home'">
      <div class="home-widget d-flex flex-column flex-lg-row align-items-lg-center">
        <div class="title fw-medium text-white me-lg-4 fs-5 flex-shrink-0 mb-3 mb-lg-0">
          快速訂票
        </div>

        <div class="selection-wrapper d-flex flex-column flex-lg-row gap-3 w-100">
          <div class="MovieSelecter">
            <FlatSelect class="flex-grow-1" :isOpen="isMovieOpen" :isSelected="isMovieSelected"
              :placeholder="selectedMovie || '選擇電影'" @toggle="isMovieOpen = !isMovieOpen" @clear="clearMovie">
              <template #options>
                <li @click="handleMovieSelect('all')">
                  <span class="title-zh">全部電影</span>
                </li>
                <li v-for="movie in movieStore.movieList" :key="movie.id" @click="handleMovieSelect(movie)">
                  <span class="title-zh">{{ movie.titleZh }}</span>
                  <span class="title-en ms-2 text-secondary">{{
                    movie.titleEn
                  }}</span>
                </li>
              </template>
            </FlatSelect>
          </div>
          <div class="CinemaGroup d-flex gap-3 w-100">
            <div class="CinemaSelecter d-flex gap-3 w-100">
              <FlatSelect class="flex-grow-1" :isOpen="isCinemaOpen" :isSelected="isCinemaSelected"
                :placeholder="selectedCinema || '選擇影城'" @toggle="isCinemaOpen = !isCinemaOpen" @clear="clearCinema">
                <template #options>
                  <template v-if="cinemaStore.cinemaList?.length">
                    <SelectCategory v-for="region in cinemaStore.cinemaList" :key="region.id" :label="region.label">
                      <li v-for="theater in region.theaters" :key="theater" @click="handleCinemaSelect(theater)">
                        {{ theater }}
                      </li>
                    </SelectCategory>
                  </template>
                </template>
              </FlatSelect>
            </div>
            <SecondaryButton class="search-btn" @click="handleSearch">搜尋</SecondaryButton>
          </div>
        </div>
      </div>
    </template>

    <template v-else>
      <div class="page-widget" :class="{ 'has-selection': isMovieSelected }">
        <FlatSelect :isOpen="isMovieOpen" :isSelected="isMovieSelected" :placeholder="selectedMovie || '選擇電影'"
          @toggle="isMovieOpen = !isMovieOpen" @clear="clearMovie">
          <template #options>
            <li @click="handleMovieSelect('all')">
              <span class="title-zh">全部電影</span>
            </li>
            <li v-for="movie in movieStore.movieList" :key="movie.id" @click="handleMovieSelect(movie)">
              <span class="title-zh">{{ movie.titleZh }}</span>
              <span class="title-en ms-2 text-secondary">{{
                movie.titleEn
              }}</span>
            </li>
          </template>
        </FlatSelect>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useMovieStore } from "@/store/movieStore";
import { useCinemaStore } from "@/store/cinema";
import FlatSelect from "./FlatSelect.vue";
import SelectCategory from "./SelectCategory.vue";
import SecondaryButton from "../Button/SecondaryButton.vue";

const props = defineProps({
  mode: {
    type: String,
    default: "page", // 允許的值: 'page' 或 'home'
  },
});

const router = useRouter();

const movieStore = useMovieStore();
const cinemaStore = useCinemaStore();

// --- 電影狀態 ---
const isMovieOpen = ref(false);
const isMovieSelected = ref(false);
const selectedMovie = ref("");

// --- 影城狀態 ---
const isCinemaOpen = ref(false);
const isCinemaSelected = ref(false);
const selectedCinema = ref("");

// 初始化同步 Pinia
onMounted(() => {
  // 💡 關鍵優化 1：如果是「首頁」的搜尋框，就不自動帶入舊資料，確保回到首頁時永遠是乾淨空白的！
  if (props.mode === "home") return;

  // 1. 同步電影資料 (僅限訂票頁)
  if (movieStore.selectedMovieId && movieStore.selectedMovieId !== "all") {
    const movie = movieStore.movieList.find(
      (m) => m.id === movieStore.selectedMovieId,
    );
    if (movie) {
      selectedMovie.value = `${movie.titleZh} ${movie.titleEn}`;
      isMovieSelected.value = true;
    }
  }

  // 2. 同步影城資料 (僅限訂票頁)
  if (cinemaStore.selectedCinema) {
    selectedCinema.value = cinemaStore.selectedCinema;
    isCinemaSelected.value = true;
  }
});

// 電影選擇處理
const handleMovieSelect = (movie) => {
  if (movie === "all") {
    clearMovie();
  } else {
    selectedMovie.value = `${movie.titleZh} ${movie.titleEn}`;
    isMovieSelected.value = true;
    movieStore.selectMovie(movie.id);
  }
  isMovieOpen.value = false;
};

const clearMovie = () => {
  selectedMovie.value = "";
  isMovieSelected.value = false;
  movieStore.selectedMovieId = "all";
};

// 影城選擇處理
const handleCinemaSelect = (name) => {
  selectedCinema.value = name;
  isCinemaSelected.value = true;
  isCinemaOpen.value = false;

  // 💡 改用 Action，這樣才會順便觸發「自動辨識區域」的功能
  cinemaStore.setCinema(name);
};

const clearCinema = () => {
  selectedCinema.value = "";
  isCinemaSelected.value = false;

  // 💡 清除 Store 資料
  cinemaStore.clearCinema();
};

// 點擊搜尋
const handleSearch = () => {
  // 1. 先執行跳轉，把目前 Store 裡的資料帶去快速訂票頁
  router.push("/fastbooking");

  // 💡 關鍵優化 2：單純清空首頁視覺上的文字欄位
  // ⚠️ 絕對不要呼叫 clearMovie()，否則會連 Pinia 一起洗掉，讓下一頁變成空白！
  selectedMovie.value = "";
  isMovieSelected.value = false;
  selectedCinema.value = "";
  isCinemaSelected.value = false;
};
</script>

<style scoped lang="scss">
@import "@/assets/scss/variables";

.booking-selector {
  width: 100%;

  /* 💡 核心修正 1：確保「所有」外層與內層的 flex 子元素都不會被文字撐開 */
  .selection-wrapper>div,
  .CinemaGroup>div {
    min-width: 0;
  }

  :deep(.base-select-container) {
    min-width: 0;
    width: 100%;

    .select-header {
      .placeholder {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        flex: 1;
        min-width: 0;
        text-align: left;
      }
    }
  }
}

.mode-home {
  .home-widget {
    background: rgba($vieshow-dark, 0.6);
    backdrop-filter: blur(10px);
    border: 1px solid rgba($white, 0.2);
    border-radius: var(--app-radius-lg);
    padding: var(--gap-lg) var(--gap-xl);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);

    @include media-breakpoint-up(lg) {
      height: 100px;
      padding: 0 var(--gap-xl);
    }

    .selection-wrapper {
      gap: 16px;
    }

    /* 電影選單分配空間 */
    .MovieSelecter {
      width: 100%;

      @include media-breakpoint-up(lg) {
        flex: 2 1 0%;
        /* 佔 2 份空間 */
        min-width: 0;
      }
    }

    /* 影城與按鈕的群組分配空間 */
    .CinemaGroup {
      width: 100%;

      @include media-breakpoint-up(lg) {
        flex: 3 1 0%;
        /* 佔 3 份空間 */
        min-width: 0;
      }
    }

    /* 按鈕絕對不壓縮 */
    .search-btn {
      flex-shrink: 0;
      white-space: nowrap;
      /* 確保「搜尋」兩個字不換行 */
      padding: 0 20px;
      /* 給手機版適當的左右內距 */

      @include media-breakpoint-up(lg) {
        width: 100px;
        padding: 0;
      }
    }
  }

  :deep(.base-select-container .select-header) {
    background: rgba($white, 0.05) !important;
  }
}

.mode-page {
  .page-widget {
    background: rgba($vieshow-dark, 0.6);
    backdrop-filter: blur(10px);
    border: 1px solid rgba($white, 0.15);
    border-radius: 12px;
    padding: 24px 30px;
    box-shadow: 0 34px 55px -28px rgba($vieshow-primary, 0.4);
    transition: all 0.3s ease;

    :deep(.base-select-container) {
      .select-header {
        border-top: none;
        border-left: none;
        border-right: none;
        border-radius: 0;
        background: transparent !important;
        border-bottom: 1px solid rgba($white, 0.3);
        padding: 0 0 12px 0;
        min-height: auto;

        &:hover {
          border-bottom-color: $vieshow-primary;
        }
      }
    }

    &.has-selection {
      :deep(.base-select-container .select-header) {
        border-bottom-color: $vieshow-primary;

        .placeholder {
          color: $vieshow-primary !important;
          font-size: var(--app-font-size-h6);
        }

        .icon-wrapper i {
          color: rgba($white, 0.8) !important;
        }
      }
    }
  }
}
</style>
