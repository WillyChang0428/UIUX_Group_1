<template>
  <div class="booking-layout-pc container">
    <div class="d-xl-none">
      <slot name="content" />
    </div>

    <div class="d-none d-xl-flex booking-layout-pc__row">
      <aside v-if="movieInfo" class="booking-layout-pc__aside">
        <div class="aside-poster-wrap">
          <img
            :src="movieInfo.posterUrl"
            :alt="movieInfo.titleZh"
            class="aside-poster"
          />
        </div>

        <div class="aside-info d-flex flex-column gap-2 pt-3">
          <div class="aside-title-row">
            <h3 class="aside-title-zh">{{ movieInfo.titleZh }}</h3>
            <span class="aside-title-en">{{ movieInfo.titleEn }}</span>
          </div>

          <div class="aside-meta-wrapper">
            <ul class="aside-meta list-unstyled d-flex flex-column gap-2 mb-0">
              <li class="aside-meta__item">
                <i class="fa-solid fa-clock aside-meta__icon"></i>
                {{ movieInfo.duration }}
              </li>
              <li class="aside-meta__item">
                <i class="fa-solid fa-shield aside-meta__icon"></i>
                {{ movieInfo.rating }}
              </li>
              <li class="aside-meta__item">
                <i class="fa-solid fa-language aside-meta__icon"></i>
                {{ movieInfo.language }}
              </li>
              <li class="aside-meta__item">
                <i class="fa-solid fa-film aside-meta__icon"></i>
                {{ movieInfo.format }}
              </li>
            </ul>

            <div class="aside-divider-vertical"></div>

            <ul class="aside-meta list-unstyled d-flex flex-column gap-2 mb-0">
              <li class="aside-meta__item">
                <i class="fa-solid fa-location-dot aside-meta__icon"></i>
                {{ movieInfo.venue }}
              </li>
              <li class="aside-meta__item">
                <i class="fa-solid fa-calendar aside-meta__icon"></i>
                {{ movieInfo.date }}
              </li>
              <li class="aside-meta__item">
                <i class="fa-solid fa-circle-play aside-meta__icon"></i>
                {{ movieInfo.time }}
              </li>
            </ul>
          </div>
        </div>
      </aside>

      <main class="booking-layout-pc__main">
        <slot name="content" />
      </main>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue"; // 💡 記得引入 computed
import { useMovieStore } from "@/store/movieStore";

const movieStore = useMovieStore();

// 💡 修正 3：改用 computed 搭配預設假資料，切版重整時不怕畫面變空白！
const movieInfo = computed(() => {
  return (
    movieStore.selectedInfoCard || {
      // 當 Pinia 沒資料時，預設顯示這組假資料供切版預覽
      titleZh: "沙丘：第二部",
      titleEn: "DUNE: PART TWO",
      duration: "166 分鐘",
      rating: "保護級",
      language: "英文",
      format: "IMAX 2D",
      venue: "台北京站威秀影城",
      date: "2026/04/15",
      time: "19:30",
      posterUrl: "https://picsum.photos/seed/dune/200/300",
    }
  );
});
</script>

<style lang="scss" scoped>
@import "@/assets/scss/variables";

.booking-layout-pc {
  width: 100%;
  min-height: 100vh;
}

// ── 電腦版雙欄容器 ─────────────────────────────────────────────
.booking-layout-pc__row {
  min-height: 100vh;
  // 💡 讓 sticky 正常運作的關鍵：確保 flex 項目不會自動等高
  align-items: flex-start;
}

// ── 左側：電影資訊面板（3/10）──────────────────────────────────
.booking-layout-pc__aside {
  // 💡 為了維持電腦版左 3 右 7 的排版，這裡設為 30% (它會完美佔滿這 30% 的所有寬度)
  width: 30%;
  flex-shrink: 0;

  // 💡 固定的關鍵 1：使用 sticky 黏性定位
  position: sticky;
  // 💡 固定的關鍵 2：距離頂部留 120px，才不會被您 fixed-top 的 Header 蓋住！
  top: 190px;

  // 💡 大小設定：高度精準 500px
  height: fit-content;

  // 💡 溢出保護：萬一電影資訊太多超過 500px，允許在卡片內滑動，絕對不破版
  overflow-y: auto;

  background: rgba(v.$white, 0.02);
  border-radius: var(--app-radius);
  padding: var(--gap-lg) var(--gap-md);
  display: flex;
  flex-direction: column;

  // 💎 隱藏/美化內部捲軸 (讓外觀保持高級感)
  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(v.$white, 0.1);
    border-radius: 4px;
  }
}

// ── 海報大圖 ───────────────────────────────────────────────────
// ── 海報大圖 ───────────────────────────────────────────────────
.aside-poster-wrap {
  width: 50%; // 您希望滿寬，保持 100% 沒問題
  // 💡 1. 刪除 height: 100%;

  // 💡 2. 加上這行神之屬性：禁止被 Flexbox 壓縮！
  flex-shrink: 0;

  border-radius: var(--app-radius-lg);
  overflow: hidden;
  box-shadow:
    0 8px 24px rgba(v.$black, 0.6),
    0 0 0 1px rgba(v.$white, 0.08);
  aspect-ratio: 2 / 3;
}

.aside-poster {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  border-radius: var(--app-radius-lg);
}

// ── 中英文標題 ─────────────────────────────────────────────────
.aside-title-row {
  display: flex;
  flex-direction: column;
  gap: var(--gap-xs);
}

.aside-title-zh {
  margin: 0;
  font-size: var(--app-font-size-h4);
  font-weight: 700;
  color: v.$white;
  letter-spacing: 0.04em;
  line-height: 1.3;
}

.aside-title-en {
  font-size: var(--app-font-size-mini);
  font-weight: 500;
  color: v.$vieshow-secondary;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

// ── 左右雙欄 meta 資訊包裝 ──────────────────────────────────────
.aside-meta-wrapper {
  display: flex;
  align-items: stretch; // 讓中間的垂直線能自動撐滿高度
  gap: var(--gap-md);
  margin-top: var(--gap-sm);

  .aside-meta {
    flex: 1; // 左右兩欄均分各佔 50%
    min-width: 0; // 💡 終極防呆：防止影城名稱太長把版面撐破
  }
}

// ── 垂直分隔線 ──────────────────────────────────────────────────
.aside-divider-vertical {
  width: 1px;
  background: rgba($white, 0.1);
  flex-shrink: 0;
}

// ── meta 資訊列 (微調) ──────────────────────────────────────────
.aside-meta__item {
  display: flex;
  align-items: flex-start; // 💡 避免文字換行時 icon 跑掉
  font-size: var(--app-font-size-sm);
  color: $light;
  gap: var(--gap-sm);
  line-height: 1.4;
}

.aside-meta__icon {
  font-size: 0.9em;
  color: $vieshow-secondary;
  flex-shrink: 0;
  width: 16px;
  text-align: center;
  margin-top: 3px; // 💡 稍微往下推，對齊文字第一行
}

// ── 右側：訂票流程（7/10）─────────────────────────────────────
.booking-layout-pc__main {
  // 剩餘 70% 空間
  flex: 1;
  min-width: 0;
  padding: var(--gap-lg) var(--gap-lg);
  // 右側不需要設定 height，讓它自然撐開頁面高度
}
</style>
