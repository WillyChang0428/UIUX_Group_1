<template>
    <div class="selectbox container">
        <div class="insideitem">
            <FlatSelect :isOpen="isMovieOpen" :isSelected="isMovieSelected" :placeholder="selectedMovie || '選擇電影'"
                @toggle="isMovieOpen = !isMovieOpen" @clear="selectedMovie = ''; isMovieSelected = false">
                <template #options>
                    <li v-for="movie in movieStore.movieList" :key="movie.id" @click="handleMovieSelect(movie)">
                        <span class="title-zh">{{ movie.titleZh }}</span>
                        <span class="title-en">{{ movie.titleEn }}</span>
                    </li>
                </template>
            </FlatSelect>
        </div>

        <div class="insideitem d-flex gap-3">
            <FlatSelect :isOpen="isCinemaOpen" :isSelected="isCinemaSelected" :placeholder="selectedCinema || '選擇影城'"
                @toggle="isCinemaOpen = !isCinemaOpen">
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
</template>

<script setup>
import { ref } from 'vue'
import { useCinemaStore } from '@/store/cinema' // 💡 引入 Store
import { useMovieStore } from '@/store/movieStore' // 💡 引入 Store
import FlatSelect from './FlatSelect.vue'
import SelectCategory from './SelectCategory.vue'
import SecondaryButton from '../Button/SecondaryButton.vue'

const cinemaStore = useCinemaStore() // 💡 實例化 Store
const movieStore = useMovieStore() // 💡 實例化 Store

// 電影選單的狀態
const isMovieOpen = ref(false)
const isMovieSelected = ref(false)
const selectedMovie = ref('')

// 影城選單的狀態
const isCinemaOpen = ref(false)
const isCinemaSelected = ref(false)
const selectedCinema = ref('')

// 分別處理選中邏輯
const handleMovieSelect = (movie) => {
    selectedMovie.value = `${movie.titleZh} ${movie.titleEn}`
    isMovieSelected.value = true
    isMovieOpen.value = false
}

const handleCinemaSelect = (name) => {
    selectedCinema.value = name
    isCinemaSelected.value = true
    isCinemaOpen.value = false
}
</script>

<style scoped lang="scss">
.selectbox {
    display: flex;
    width: 100%;
    padding: var(--gap-lg) 30px var(--gap-xl) 30px;
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    border-radius: var(--app-radius-lg);
    border: 2px solid rgba(255, 255, 255, 0.20);
    background: rgba(30, 30, 30, 0.60);

    /* Dark-Glass-Card */
    box-shadow: 0 34px 55px -28px rgba(47, 150, 238, 0.50);

}

.insideitem {
    width: 100%; // 💡 關鍵：強制讓內層項目的寬度撐滿父容器

    // 💡 讓選單組件自動撐開，佔滿左側剩餘空間
    :deep(.base-select-container) {
        flex-grow: 1;
        max-width: 100% !important;
    }

    // 💡 讓按鈕固定寬度（符合文字大小），不要被拉長
    .btn {
        flex-shrink: 0; // 避免按鈕被擠壓
        white-space: nowrap; // 確保文字不換行，撐開按鈕
        width: auto; // 確保寬度是自適應內容
        padding: 12px 24px; // 視需求調整按鈕左右內距
    }
}

.first {
    width: 100%;
}
</style>