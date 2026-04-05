<template>
  <section class="home-live-concert overflow-hidden py-4 py-md-5">
    <div class="container position-relative">
      <div class="concert-window overflow-hidden">
        <div
          class="concert-track d-flex transition-ease"
          :style="{ transform: `translateX(-${currentPage * 100}%)` }"
        >
          <div
            v-for="(page, pIndex) in paginatedConcerts"
            :key="pIndex"
            class="concert-page d-flex flex-shrink-0 w-100 gap-3 gap-md-4"
          >
            <div
              v-for="item in page"
              :key="item.id"
              class="concert-card-wrapper position-relative"
            >
              <span
                v-if="item.tag"
                class="badge-tag position-absolute"
                :class="item.tagClass"
              >
                {{ item.tag }}
              </span>

              <div class="poster-box rounded overflow-hidden mb-3">
                <img
                  :src="item.posterUrl"
                  :alt="item.titleZh"
                  class="w-100 h-100 object-fit-cover"
                />
              </div>

              <h5 class="h5 fw-bold text-white mb-3">{{ item.titleZh }}</h5>
              <SecondaryButton class="btn btn-primary w-100 rounded"
                >立即訂票</SecondaryButton
              >
            </div>
          </div>
        </div>
      </div>

      <div class="d-flex justify-content-center mt-4 gap-2">
        <div
          v-for="(_, i) in paginatedConcerts"
          :key="i"
          class="dot"
          :class="{ active: currentPage === i }"
        ></div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useConcertStore } from "@/store/liveConcert.js"; // 假設路徑 [cite: 1]
import SecondaryButton from "@/components/Common/Button/SecondaryButton.vue";

const concertStore = useConcertStore();
const currentPage = ref(0);
const windowWidth = ref(window.innerWidth);
let timer = null;

// 1. 資料處理：排序並加上標籤
const processedConcerts = computed(() => {
  const list = [...concertStore.concertList];
  const hotItem = list.find((i) => i.id === 1);
  const newItem = list.find((i) => i.id === 3);
  const others = list.filter((i) => i.id !== 1 && i.id !== 3);

  const result = [];
  if (hotItem) result.push({ ...hotItem, tag: "HOT", tagClass: "bg-danger" });
  if (newItem)
    result.push({ ...newItem, tag: "NEW", tagClass: "bg-warning text-dark" });

  return [...result, ...others];
});

// 2. 響應式分頁邏輯：手機 2 張, 電腦 3 張 [cite: 12, 129]
const paginatedConcerts = computed(() => {
  const perPage = windowWidth.value >= 768 ? 3 : 2;
  const pages = [];
  for (let i = 0; i < processedConcerts.value.length; i += perPage) {
    pages.push(processedConcerts.value.slice(i, i + perPage));
  }
  return pages;
});

// 3. 自動切換功能 (5秒)
const startTimer = () => {
  timer = setInterval(() => {
    currentPage.value =
      (currentPage.value + 1) % paginatedConcerts.value.length;
  }, 5000);
};

const handleResize = () => {
  windowWidth.value = window.innerWidth;
  currentPage.value = 0; // 視窗縮放時重置頁碼防止跑版
};

onMounted(() => {
  startTimer();
  window.addEventListener("resize", handleResize);
});

onUnmounted(() => {
  clearInterval(timer);
  window.removeEventListener("resize", handleResize);
});
</script>

<style scoped lang="scss">
@import "@/assets/scss/variables";

.home-live-concert {
  .concert-track {
    transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .concert-card-wrapper {
    // 依據響應式計算寬度：(100% - 間距) / 數量 [cite: 131]
    width: calc((100% - var(--gap-md)) / 2);
    @include media-breakpoint-up(md) {
      width: calc((100% - (var(--gap-md) * 2)) / 3);
    }
    h5 {
      -webkit-line-clamp: 2;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  }

  .poster-box {
    aspect-ratio: 2 / 3;
    background: v.$vieshow-dark-section;
    border: 1px solid v.$vieshow-secondary-emp; // 使用變數名 [cite: 161]
    @include media-breakpoint-up(lg) {
      aspect-ratio: 4 / 3;
      max-height: 300px;
    }

    img {
      transition: transform 0.3s ease;
    }
    &:hover img {
      transform: scale(1.05);
    }
  }

  .badge-tag {
    top: 10px;
    left: 10px;
    z-index: 2;
    padding: 4px 12px;
    font-size: var(--app-font-size-mini); // 使用自動縮放變數 [cite: 145]
    font-weight: bold;
    border-radius: var(--app-radius-sm); // 自動縮放圓角 [cite: 148]
  }

  .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: v.$vieshow-secondary-emp;
    transition: all 0.3s;
    &.active {
      background: v.$vieshow-primary;
      width: 20px;
      border-radius: 4px;
    }
  }
}
</style>
