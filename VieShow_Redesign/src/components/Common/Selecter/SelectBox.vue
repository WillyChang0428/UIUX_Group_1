<template>
  <div class="selectbox container">
    <div class="insideitem">
      <FlatSelect
        :isOpen="isMovieOpen"
        :isSelected="isMovieSelected"
        :placeholder="selectedMovie || '選擇電影'"
        @toggle="isMovieOpen = !isMovieOpen"
        @clear="
          selectedMovie = '';
          isMovieSelected = false;
        "
      >
        <template #options>
          <li
            v-for="movie in movieStore.movieList"
            :key="movie.id"
            @click="handleMovieSelect(movie)"
          >
            <span class="title-zh">{{ movie.titleZh }}</span>
            <span class="title-en">{{ movie.titleEn }}</span>
          </li>
        </template>
      </FlatSelect>
    </div>

    <div class="insideitem d-flex gap-3">
      <FlatSelect
        :isOpen="isCinemaOpen"
        :isSelected="isCinemaSelected"
        :placeholder="selectedCinema || '選擇影城'"
        @toggle="isCinemaOpen = !isCinemaOpen"
      >
        <template #options>
          <template v-if="cinemaStore.cinemaList?.length">
            <SelectCategory
              v-for="region in cinemaStore.cinemaList"
              :key="region.id"
              :label="region.label"
            >
              <li
                v-for="theater in region.theaters"
                :key="theater"
                @click="handleCinemaSelect(theater)"
              >
                {{ theater }}
              </li>
            </SelectCategory>
          </template>
        </template>
      </FlatSelect>
      <SecondaryButton class="btn">搜尋</SecondaryButton>
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
.selectbox {
  // 💡 移除手寫 flex，改用 Bootstrap Class 或語意化變數
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;

  // 💡 間距：呼叫響應式變數 (手機 16px / 電腦 32px)
  gap: var(--gap-md);

  // 💡 內距：使用響應式變數，並對齊手冊規範的 30px (約 2xl 等級) [cite: 133]
  padding:var(--gap-xl);

  // 💡 圓角：使用 Normal 等級圓角 (手機 8px / 電腦 16px) [cite: 148]
  border-radius: var(--app-radius-lg);

  // 💡 邊框與背景：改用變數手冊定義之語意化名稱 [cite: 161]
  border: v.$border-width solid rgba(v.$white, 0.2);
  background: rgba(v.$vieshow-dark, 0.6);
  backdrop-filter: blur(10px); // 維持玻璃質感

  /* Dark-Glass-Card 陰影維持特殊 CSS 寫法 [cite: 127] */
  box-shadow: 0 34px 55px -28px rgba(v.$vieshow-primary, 0.5);
}

.insideitem {
  width: 100%;

  // 💡 選單寬度撐開邏輯：維持 deep 穿透以覆蓋 Base 組件限制 [cite: 125]
  :deep(.base-select-container) {
    flex-grow: 1;
    max-width: 100% !important;
  }

  // 💡 按鈕寬度：移除手寫 padding，改用變數手冊定義之按鈕變數 [cite: 115, 116]
  .btn {
    flex-shrink: 0;
    white-space: nowrap;
    width: auto;

    // 使用等級三 SCSS 變數對齊設計稿 [cite: 35]
    padding: v.$btn-padding-y-lg v.$btn-padding-x-lg;
  }
}
</style>
