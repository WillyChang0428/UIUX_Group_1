<template>
  <section class="home-news-section py-5">
    <div class="container">
      <div class="row g-4">
        <div v-for="news in latestNews" :key="news.id" class="col-12 col-md-4">
          <div class="news-card h-100 d-flex flex-column">
            <div class="news-poster rounded-lg overflow-hidden mb-3">
              <img
                :src="news.posterUrl"
                :alt="news.title"
                class="w-100 h-100 object-fit-cover"
              />
            </div>

            <div class="news-content d-flex flex-column flex-grow-1">
              <h4 class="h4 fw-bold mb-2 text-truncate-2">{{ news.title }}</h4>
              <p class="small text-secondary mb-4 text-truncate-3">
                {{ news.content }}
              </p>

              <a
                href="#"
                class="details-link mt-auto d-flex align-items-center justify-content-end text-white mb-6"
              >
                <span class="link-text">查看詳情</span>
                <i class="fa-solid fa-chevron-right ms-2 icon-sm"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from "vue";
import { useNewsStore } from "@/store/newsStore"; // 假設您將 news.js 整合進 Pinia [cite: 3, 11]

const newsStore = useNewsStore();

// 邏輯：根據日期由新到舊排序，並取前三個
const latestNews = computed(() => {
  return [...newsStore.newsList]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 3);
});
</script>

<style scoped lang="scss">
/* 抓取全域變數，需加上 v. 前綴  */
@import "@/assets/scss/variables";

.home-news-section {
  background-color: v.$vieshow-dark; // 使用專案定義的深色背景 [cite: 138]

  .news-poster {
    aspect-ratio: 16 / 10; // 根據圖二比例設定
    border: 1px solid v.$vieshow-secondary-emp; // 使用設計稿邊框色 [cite: 131]
    /* 自動縮放圓角：手機 12px / 電腦 24px  */
    border-radius: var(--app-radius-lg) !important;

    img {
      transition: transform 0.3s ease;
    }
  }

  /* 滑鼠懸停效果：依照開發規範建議 [cite: 88, 96] */
  .news-card:hover {
    .news-poster img {
      transform: scale(1.05);
    }
    .details-link {
      text-decoration: none;
      opacity: 0.8;
      .link-text {
        /* 💡 向左微調 5px，你可以根據 Figma 需求調整數值 */
        transform: translateX(-5px);
      }
    }
  }

  .h4 {
    /* 自動縮放字體：手機 24px / 電腦 26px [cite: 113, 145] */
    font-size: var(--app-font-size-h4);
    line-height: var(--lh-h4);
  }

  .text-secondary {
    /* 自動縮放字體：手機 14px / 電腦 16px [cite: 115, 144] */
    font-size: var(--app-font-size-sm);
    color: v.$vieshow-secondary !important;
  }

  /* 限制標題與內文顯示行數，維持卡片整齊 */
  .text-truncate-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    color: v.$white;
  }

  .text-truncate-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .details-link {
    font-size: var(--app-font-size-base);
    transition: all 0.3s ease;
    .link-text {
      display: inline-block; // 必須是 block 或 inline-block 才能套用 transform
      transition: transform 0.3s ease; // 💡 設定文字位移的動畫
    }
  }
}
</style>
