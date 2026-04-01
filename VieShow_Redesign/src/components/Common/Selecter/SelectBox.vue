<template>
    <div class="selectbox container">
        <div class="insideitem">
            <FlatSelect :isOpen="isMovieOpen" :isSelected="isMovieSelected" :placeholder="selectedMovie || '選擇電影'"
                @toggle="isMovieOpen = !isMovieOpen" @clear="selectedMovie = ''; isMovieSelected = false">
                <template #options>
                    <li @click="handleMovieSelect('極限返航')">極限返航</li>
                </template>
            </FlatSelect>
        </div>

        <div class="insideitem">
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
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useCinemaStore } from '@/store/cinema' // 💡 引入 Store
import FlatSelect from './FlatSelect.vue'
import SelectCategory from './SelectCategory.vue'

const cinemaStore = useCinemaStore() // 💡 實例化 Store

const isOpen = ref(false)
const isSelected = ref(false)
const selectedValue = ref('')

// 電影選單的狀態
const isMovieOpen = ref(false)
const isMovieSelected = ref(false)
const selectedMovie = ref('')

// 影城選單的狀態
const isCinemaOpen = ref(false)
const isCinemaSelected = ref(false)
const selectedCinema = ref('')

// 分別處理選中邏輯
const handleMovieSelect = (name) => {
    selectedMovie.value = name
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
    gap: 10px;
    border-radius: var(--app-radius-lg);
    border: 2px solid rgba(255, 255, 255, 0.20);
    background: rgba(30, 30, 30, 0.60);

    /* Dark-Glass-Card */
    box-shadow: 0 34px 55px -28px rgba(47, 150, 238, 0.50);
}

.first {
    width: 100%;
}
</style>