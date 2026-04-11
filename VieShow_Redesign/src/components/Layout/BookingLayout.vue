<template>
  <div class="default-layout">
    <div class="d-none d-md-block">
      <Header />
    </div>
    <BookingStepHeader />
    
    <div class="selectedinfocard d-xl-none">
      <SelectedInfoCard v-if="movieStore.selectedMovieId" />
    </div>

    <main class="other-wrapper">
      <BookingLayoutPC>
        <template #content>
          <router-view v-slot="{ Component }">
            <keep-alive>
              <component :is="Component" />
            </keep-alive>
          </router-view>
        </template>
      </BookingLayoutPC>
    </main>

    <BookingBottomBar />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useMovieStore } from "@/store/movieStore";
import BookingStepHeader from "./Parts/BookingStepHeader.vue";
import BookingBottomBar from "./Parts/BookingBottomBar.vue";
import Header from "./Parts/Header/Header.vue";
import SelectedInfoCard from "../Booking/SelectedInfoCard.vue";
import BookingLayoutPC from "../Booking/BookingLayoutPC.vue";


const movieStore = useMovieStore();

// ── 判斷是否為桌機的響應式變數 ──────────────────────────────
const isDesktop = ref(false); // Mobile First，預設先給 false

// 檢查視窗寬度是否大於等於 Bootstrap 的 md 斷點 (768px)
const checkScreenSize = () => {
  isDesktop.value = window.innerWidth >= 768;
};

// 進入畫面時，執行初始檢查並掛載 resize 監聽器
onMounted(() => {
  checkScreenSize();
  window.addEventListener("resize", checkScreenSize);
});

// 離開畫面時，務必移除監聽器，避免消耗記憶體效能
onUnmounted(() => {
  window.removeEventListener("resize", checkScreenSize);
});
</script>

<style lang="scss" scoped>
@import "@/assets/scss/variables";

.default-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: $vieshow-gradient-dark;
}

/* 確保 main 區域能夠自動撐開高度 */
main {
  flex: 1;
}

.selectedinfocard {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  margin-top: 117px;
  @include media-breakpoint-up(md) {
    margin-top: 164px;
  }
}
</style>
