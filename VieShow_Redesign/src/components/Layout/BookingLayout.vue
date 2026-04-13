<template>
  <div class="default-layout">
    <div class="d-none d-md-block">
      <Header />
    </div>
    <BookingStepHeader :step="currentStep" />

    <div class="selectedinfocard d-xl-none">
      <SelectedInfoCard v-if="movieStore.selectedMovieId" />
    </div>

    <main class="main-wrapper">
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
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useMovieStore } from "@/store/movieStore";
import { useRoute } from "vue-router";
import BookingStepHeader from "./Parts/BookingStepHeader.vue";
import BookingBottomBar from "./Parts/BookingBottomBar.vue";
import Header from "./Parts/Header/Header.vue";
import SelectedInfoCard from "../Booking/SelectedInfoCard.vue";
import BookingLayoutPC from "../Booking/BookingLayoutPC.vue";

const route = useRoute();

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

// 💡 根據現在的路由「路徑」，動態計算目前的 step 是多少
const currentStep = computed(() => {
  // 💡 改用 route.path 來比對斜線網址
  switch (route.path) {
    case "/booking/ticket":
      return 1;
    case "/booking/seat":
      return 2;
    case "/booking/food":
      return 3;
    case "/booking/paying":
      return 4;
    default:
      return 1;
  }
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

.main-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  @include media-breakpoint-up(md) {
    padding-top: v.$web-top-padding-pc-other;
    padding-bottom: v.$web-bottom-padding-pc-other;
  }
}

.selectedinfocard {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;
  margin-top: v.$web-top-padding-mobile;
  @include media-breakpoint-up(md) {
    margin-top: v.$web-top-padding-pc-other;
  }
}
</style>
