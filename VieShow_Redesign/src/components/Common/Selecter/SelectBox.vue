<!-- 使用方式: <SelectBox mode="home" /> 或 <SelectBox mode="page" /> -->

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
                <li @click="handleMovieSelect('all')"><span class="title-zh">全部電影</span></li>
                <li v-for="movie in movieStore.movieList" :key="movie.id" @click="handleMovieSelect(movie)">
                  <span class="title-zh">{{ movie.titleZh }}</span>
                  <span class="title-en ms-2 text-secondary">{{ movie.titleEn }}</span>
                </li>
              </template>
            </FlatSelect>
          </div>
          <div class="d-flex flex-grow-1 gap-3">
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
            <li @click="handleMovieSelect('all')"><span class="title-zh">全部電影</span></li>
            <li v-for="movie in movieStore.movieList" :key="movie.id" @click="handleMovieSelect(movie)">
              <span class="title-zh">{{ movie.titleZh }}</span>
              <span class="title-en ms-2 text-secondary">{{ movie.titleEn }}</span>
            </li>
          </template>
        </FlatSelect>
      </div>
    </template>

  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router"; // 💡 1. 引入 useRouter
import { useMovieStore } from "@/store/movieStore";
import { useCinemaStore } from "@/store/cinema";
import FlatSelect from "./FlatSelect.vue";
import SelectCategory from "./SelectCategory.vue";
import SecondaryButton from "../Button/SecondaryButton.vue";

// 💡 新增 Prop，讓父層決定要顯示哪一種排版 (預設為訂票頁版)
const props = defineProps({
  mode: {
    type: String,
    default: 'page' // 允許的值: 'page' 或 'home'
  }
});

const router = useRouter(); // 💡 2. 初始化 router

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
  if (movieStore.selectedMovieId && movieStore.selectedMovieId !== 'all') {
    const movie = movieStore.movieList.find(m => m.id === movieStore.selectedMovieId);
    if (movie) {
      // 💡 修改處：拔除判斷式，統一顯示「中文 + 英文」
      selectedMovie.value = `${movie.titleZh} ${movie.titleEn}`;
      isMovieSelected.value = true;
    }
  }
});

// 電影選擇處理
const handleMovieSelect = (movie) => {
  if (movie === 'all') {
    clearMovie();
  } else {
    // 💡 修改處：拔除判斷式，統一顯示「中文 + 英文」
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
};

const clearCinema = () => {
  selectedCinema.value = "";
  isCinemaSelected.value = false;
};

// 💡 3. 新增點擊搜尋的處理函式
const handleSearch = () => {
  // 您也可以在這裡加入判斷，例如：必須先選電影或影城才能跳轉
  // if (!isMovieSelected.value) {
  //   alert("請先選擇電影");
  //   return;
  // }
  
  router.push('/fastbooking'); // 執行跳轉至快速訂票頁面
};
</script>

<style scoped lang="scss">
@import "@/assets/scss/variables";

.booking-selector {
  width: 100%;
}

/* ====================================================
   🎨 模式 A：首頁版樣式 (.mode-home) - 圖二、圖三
   ==================================================== */
.mode-home {
  .home-widget {
    background: rgba(v.$vieshow-dark, 0.6);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(v.$white, 0.2);
    border-radius: var(--app-radius-lg); // 12px~24px
    padding: var(--gap-lg) var(--gap-xl); // 對齊您的 SelectBox 設定
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);

    // 電腦版排版 (圖三)
    @include media-breakpoint-up(lg) {
      height: 100px;
      padding: 0 var(--gap-xl);
    }

    .MovieSelecter {
      width: 100%;

      @include media-breakpoint-up(lg) {
        max-width: 450px; // 電腦版固定寬度
      }
    }

    // 搜尋按鈕
    .search-btn {
      @include media-breakpoint-up(lg) {
        width: 100px; // 電腦版固定寬度
      }
    }
  }

  // 確保 FlatSelect 在首頁模式維持其「全圓角框線」的預設外觀
  :deep(.base-select-container .select-header) {
    background: rgba(v.$white, 0.05) !important; // 微微的底色
  }
}

/* ====================================================
   🎨 模式 B：訂票頁版樣式 (.mode-page) - 圖一
   ==================================================== */
.mode-page {
  .page-widget {
    background: rgba(v.$vieshow-dark, 0.6);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(v.$white, 0.15);
    border-radius: 12px;
    padding: 24px 30px;
    box-shadow: 0 34px 55px -28px rgba(v.$vieshow-primary, 0.4);
    transition: all 0.3s ease;

    // 解除死板的深層綁定，直接覆寫基礎樣式
    :deep(.base-select-container) {
      .select-header {
        border-top: none;
        border-left: none;
        border-right: none;
        border-radius: 0;
        background: transparent !important;
        border-bottom: 1px solid rgba(v.$white, 0.3);
        padding: 0 0 12px 0; // 只留底部間距
        min-height: auto;

        &:hover {
          border-bottom-color: v.$vieshow-primary;
        }
      }
    }

    // 選中狀態的藍色變換
    &.has-selection {
      :deep(.base-select-container .select-header) {
        border-bottom-color: v.$vieshow-primary;

        .placeholder {
          color: v.$vieshow-primary !important;
          font-size: var(--app-font-size-h6); // 稍微放大字體對齊圖一
        }

        .icon-wrapper i {
          color: rgba(v.$white, 0.8) !important;
        }
      }
    }
  }
}
</style>