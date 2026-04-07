<template>
  <div class="fast-booking-page main-wrapper">
    <div class="container">

      <div class="selector-wrapper mb-4">
        <SelectBox mode="page" />
      </div>

      <SelectedInfoCard class="mb-4" v-if="movieStore.selectedMovieId" />

      <TheaterFilter v-model="currentTheater" class="mb-4" />

      <DateFilter v-model="currentDate" @change-day="handleDayChange" class="mb-5" />

      <h3 class="theater-title text-white fw-bold mb-4">
        {{ currentTheater }}
      </h3>

      <Sessions :theaterName="currentTheater" :dayOfWeek="currentDayOfWeek" @select-session="handleSessionSelect"
        @open-preview="handleSeatPreview" />

      <SeatPreview v-model="isPreviewOpen" :theaterName="previewTheater" />

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useMovieStore } from '@/store/movieStore';
import SelectBox from '@/components/Common/Selecter/SelectBox.vue';
import SelectedInfoCard from '@/components/Booking/SelectedInfoCard.vue';
import TheaterFilter from '@/components/Booking/FastBooking/TheaterFilter.vue';
import DateFilter from '@/components/Booking/FastBooking/DateFilter.vue';
import Sessions from '@/components/Booking/FastBooking/Sessions.vue';
import SeatPreview from '@/components/Booking/FastBooking/SeatPreview.vue';

const router = useRouter();
const movieStore = useMovieStore();

// 💡 父層統一管理的核心篩選狀態
const currentTheater = ref('台北信義');
const currentDate = ref('');
const currentDayOfWeek = ref('星期一'); // 預設傳給 Sessions 的星期

// 接收 DateFilter 傳來的完整星期字串 (如 '星期一')
const handleDayChange = (dayString) => {
  currentDayOfWeek.value = dayString;
};

// 處理最終的訂票跳轉
const handleSessionSelect = (sessionData) => {
  movieStore.updateSession({
    format: sessionData.format,
    time: sessionData.time,
    venue: sessionData.venue,
    date: currentDate.value
  });

  // 導向選位頁面 (請依據您的路由設定調整)
  router.push({ name: 'booking-seats' });
};

// 控制彈窗開關與影城名稱
const isPreviewOpen = ref(false);
const previewTheater = ref('');

// 當使用者點擊 Sessions.vue 裡面的小沙發 Icon 時觸發
const handleSeatPreview = (previewData) => {
  // 將影城名稱存入，並打開彈窗
  previewTheater.value = currentTheater.value;
  isPreviewOpen.value = true;
};
</script>

<style scoped lang="scss">
@import "@/assets/scss/variables";

.fast-booking-page {
  min-height: 100vh;
  background: v.$vieshow-gradient-dark;

  /* 💡 修正處：設定相對定位與高層級，強制下拉選單浮在最上層 */
  .selector-wrapper {
    position: relative;
    z-index: 1050; // Bootstrap 處理下拉選單通常使用 1000 以上的層級，這裡設為 1050 確保萬無一失
  }

  .theater-title {
    font-size: var(--app-font-size-h4);
    letter-spacing: 2px;
  }
}
</style>
