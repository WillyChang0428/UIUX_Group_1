<template>
  <div class="fast-booking-page py-5">
    <div class="container">
      <div class="selector-wrapper mb-4">
        <SelectBox mode="page" />
      </div>

      <SelectedInfoCard
        mode="preview"
        class="mb-4"
        v-if="movieStore.selectedMovieId"
      />

      <TheaterFilter v-model="currentTheater" class="mb-4" />

      <DateFilter
        v-model="currentDate"
        @change-day="handleDayChange"
        class="mb-5"
      />

      <h3 class="theater-title text-white fw-bold mb-4">
        <i class="fa-solid fa-location-dot"></i>
        {{ currentTheater }}
      </h3>

      <Sessions
        :theaterName="currentTheater"
        :dayOfWeek="currentDayOfWeek"
        @select-session="handleSessionSelect"
        @open-preview="handleSeatPreview"
      />

      <SeatPreview v-model="isPreviewOpen" :theaterName="previewTheater" />
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue"; // 💡 新增引入 watch
import { useRouter } from "vue-router";
import { useMovieStore } from "@/store/movieStore";
import { useCinemaStore } from "@/store/cinema"; // 💡 新增引入 cinemaStore

import SelectBox from "@/components/Common/Selecter/SelectBox.vue";
import SelectedInfoCard from "@/components/Booking/SelectedInfoCard.vue";
import TheaterFilter from "@/components/Booking/FastBooking/TheaterFilter.vue";
import DateFilter from "@/components/Booking/FastBooking/DateFilter.vue";
import Sessions from "@/components/Booking/FastBooking/Sessions.vue";
import SeatPreview from "@/components/Booking/FastBooking/SeatPreview.vue";

const router = useRouter();
const movieStore = useMovieStore();
const cinemaStore = useCinemaStore(); // 💡 實例化 cinemaStore

// 💡 核心資料連動：優先讀取 store 裡面的影城，如果沒選過就預設 '台北信義'
const currentTheater = ref(cinemaStore.selectedCinema || "台北信義");

watch(currentTheater, (newVal) => {
  cinemaStore.setCinema(newVal);
});

const currentDate = ref("");
const currentDayOfWeek = ref("星期一");

const handleDayChange = (dayString) => {
  currentDayOfWeek.value = dayString;
};

const handleSessionSelect = (sessionData) => {
  // 💡 關鍵新增：無論原本有沒有選電影，只要點擊了時刻表，就強制把「這一部」電影設為已選取！
  // 這樣 SelectedInfoCard 就會立刻抓到這部電影的資料並顯示出來。
  movieStore.selectMovie(sessionData.movie.id);

  // 💡 1. 將使用者選好的場次、影城、日期存入 movieStore
  // (這一步一執行，SelectedInfoCard 與 BookingLayoutPC 就會瞬間抓到資料並顯示)
  movieStore.updateSession({
    format: sessionData.format,
    time: sessionData.time,
    // 確保如果 sessionData 沒有帶 venue，就使用目前選中的 currentTheater
    venue: sessionData.venue || currentTheater.value,
    date: currentDate.value,
  });

  // 💡 2. 導向「第三步驟：選擇票種」的頁面
  // (⚠️ 請將 '/booking/ticket' 替換成您實際在 router/index.js 裡設定的票種頁面路徑)
  router.push("/booking/ticket");
};

const isPreviewOpen = ref(false);
const previewTheater = ref("");

const handleSeatPreview = (previewData) => {
  previewTheater.value = currentTheater.value;
  isPreviewOpen.value = true;
};
</script>

<style scoped lang="scss">
@import "@/assets/scss/variables";

.fast-booking-page {
  min-height: 100vh;
  background: $vieshow-gradient-dark; /* 💡 移除 v. 前綴，防止報錯 */

  .selector-wrapper {
    position: relative;
    z-index: 200;
  }

  .theater-title {
    font-size: var(--app-font-size-h4);
    letter-spacing: 2px;
  }
}
</style>
