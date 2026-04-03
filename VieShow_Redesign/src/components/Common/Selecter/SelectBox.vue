<template>
  <div class="selectbox container d-flex flex-column flex-md-row align-items-md-center">
    
    <div class="title fw-medium text-white me-md-5 fs-5 flex-shrink-0">
      快速訂票
    </div>

    <div class="selection-wrapper d-flex flex-column flex-md-row gap-3 w-100 align-items-md-end">
      
      <div class="insideitem">
        <FlatSelect
          :isOpen="isMovieOpen"
          :isSelected="isMovieSelected"
          :placeholder="selectedMovie || '選擇電影'"
          @toggle="isMovieOpen = !isMovieOpen"
          @clear="selectedMovie = ''; isMovieSelected = false;"
        >
          <template #options>
            <li v-for="movie in movieStore.movieList" :key="movie.id" @click="handleMovieSelect(movie)">
              <span class="title-zh">{{ movie.titleZh }}</span>
              <span class="title-en">{{ movie.titleEn }}</span>
            </li>
          </template>
        </FlatSelect>
      </div>

      <div class="insideitem d-flex gap-3 align-items-end">
        <FlatSelect
          :isOpen="isCinemaOpen"
          :isSelected="isCinemaSelected"
          :placeholder="selectedCinema || '選擇影城'"
          @toggle="isCinemaOpen = !isCinemaOpen"
        >
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
        
        <SecondaryButton class="btn">搜尋</SecondaryButton>
      </div>
      
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useCinemaStore } from "@/store/cinema"; // 💡 引入 Store
import { useMovieStore } from "@/store/movieStore"; // 💡 引入 Store
import FlatSelect from "./FlatSelect.vue";
import SelectCategory from "./SelectCategory.vue";
import SecondaryButton from "../Button/SecondaryButton.vue";

const cinemaStore = useCinemaStore(); // 💡 實例化 Store
const movieStore = useMovieStore(); // 💡 實例化 Store

// 電影選單的狀態
const isMovieOpen = ref(false);
const isMovieSelected = ref(false);
const selectedMovie = ref("");

// 影城選單的狀態
const isCinemaOpen = ref(false);
const isCinemaSelected = ref(false);
const selectedCinema = ref("");

// 分別處理選中邏輯
const handleMovieSelect = (movie) => {
  selectedMovie.value = `${movie.titleZh} ${movie.titleEn}`;
  isMovieSelected.value = true;
  isMovieOpen.value = false;
};

const handleCinemaSelect = (name) => {
  selectedCinema.value = name;
  isCinemaSelected.value = true;
  isCinemaOpen.value = false;
};
</script>

<style scoped lang="scss">
@import "@/assets/scss/variables"; // 💡 確保引入地基

.selectbox {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: var(--gap-md);
  padding: var(--gap-xl);
  border-radius: var(--app-radius-lg);
  border: v.$border-width solid rgba(v.$white, 0.2);
  background: rgba(v.$vieshow-dark, 0.6);
  backdrop-filter: blur(10px);
  box-shadow: 0 34px 55px -28px rgba(v.$vieshow-primary, 0.5);

  /* 💡 桌機版排版修正 */
  @include media-breakpoint-up(md) {
    flex-direction: row; // 橫向排列
    height: 120px;       // 固定高度符合長條狀視覺
    padding: 0 var(--gap-xl); // 左右內距
  }
}

.selection-wrapper {
  flex-grow: 1;
}

.insideitem {
  width: 100%;
  
  /* 💡 桌機版微調：移除 Base 組件的預設框線感，改為底線感 (對齊圖一) */
  @include media-breakpoint-up(md) {
    :deep(.base-select-container) {
      .select-display {
        border-top: none;
        border-left: none;
        border-right: none;
        border-radius: 0;
        background: transparent;
        border-bottom: 1px solid rgba(v.$white, 0.3); // 輕微底線
        padding-left: 0;
      }
    }
  }

  :deep(.base-select-container) {
    flex-grow: 1;
    max-width: 100% !important;
  }

  .btn {
    flex-shrink: 0;
    white-space: nowrap;
    padding: v.$btn-padding-y-lg v.$btn-padding-x-lg;
    
    @include media-breakpoint-up(md) {
      margin-bottom: 8px; // 微調對齊底線高度
    }
  }
}
</style>
