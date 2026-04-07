<template>
  <div class="movie-detail-page">
    <div class="video-container">
      <iframe
        src="https://www.youtube.com/embed/UwCGLccqKjg"
        title="YouTube video player"
        frameborder="0"
        allow="
          accelerometer;
          autoplay;
          clipboard-write;
          encrypted-media;
          gyroscope;
          picture-in-picture;
        "
        allowfullscreen
      >
      </iframe>
    </div>

    <div class="container movie-info-wrapper py-4">
      <div class="d-flex justify-content-between align-items-start mb-3">
        <div class="title-group">
          <h2 class="movie-title mb-1">極限返航</h2>
          <p class="movie-subtitle mb-2">PROJECT HAIL MARY</p>
          <span class="badge rounded-pill bg-info text-white px-3"
            >護 | 6+</span
          >
        </div>

        <MiniButton @click="handleBooking"> 快速訂票 </MiniButton>
      </div>

      <div class="movie-description mb-4">
        <p>
          科學家萊恩倫格拉斯在一艘距離地球幾光年的太空船上醒來，卻對自己的身分和來到這裡的原因一無所知。
        </p>
      </div>

      <div class="movie-specs mb-4">
        <div class="row g-1">
          <div class="col-auto">上映日期：</div>
          <div class="col">2026/03/18</div>
        </div>
        <div class="row g-1">
          <div class="col-auto">導　　演：</div>
          <div class="col">非爾洛德、克里斯多福米勒</div>
        </div>
        <div class="row g-1">
          <div class="col-auto">演　　員：</div>
          <div class="col">萊恩葛斯林、利昂納德伯斯、桑德拉惠勒</div>
        </div>
        <div class="row g-1">
          <div class="col-auto">類　　型：</div>
          <div class="col">奇幻/科幻、劇情</div>
        </div>
        <div class="row g-1">
          <div class="col-auto">片　　長：</div>
          <div class="col">2 時 37 分</div>
        </div>
      </div>

      <div class="movie-notes p-3 rounded bg-dark-section">
        <p class="text-primary mb-2">【#極限返航】IMAX、4DX版本預售情報公開</p>
        <p class="mb-3">
          03/11(三)中午12:00起~開放03/18(三)-03/24(二)IMAX、4DX版本部分場次預售。
        </p>
        <p class="text-white mb-2">● 預購粉絲好康：</p>
        <p class="mb-3">
          03/11(三)-03/17(二)期間預購《極限返航》IMAX或4DX版本電影票1張，即可至原購票影城服務櫃檯領取「美國原裝進口電影布章」1份，數量有限，送完為止。
        </p>
        <div class="notice-section text-secondary">
          <p class="mb-1">※注意：</p>
          <ul class="mb-0">
            <li>
              預購完成後，無論場次先後，即可憑電影票至購票影城櫃檯領取贈品(不得跨影城領取)，數量有限，送完為止，先領先贏。
            </li>
            <li>
              使用威秀影城官方APP訂票者，請至影城服務櫃台，持「原訂票手機」出示APP系統「我的票夾」購票畫面予工作人員確認方可兌換贈品。贈品領取後如需退票，須持原贈品至原購票影城辦理退款，恕無法辦理線上退票。※威秀影城工作人員於必要時，得要求您配合操作手機，或於您的手機進行相關查驗作業，敬請配合。
            </li>
            <li>
              如有退票，需連同贈品一併辦理退票手續，如贈品毀損恕無法辦理退票。
            </li>
            <li>團劃、包廳、免費票種(包含忠誠禮、兌點票)均不適用以上活動。</li>
            <li>預售相關詳情與場次時間，以影城現場告示為準。</li>
            <li>威秀影城/MUVIE CINEMAS保有活動最終解釋權。</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
// 1. 匯入 useRouter
import { useRouter } from "vue-router";

// 實例化 router
const router = useRouter();

// 定義點擊按鈕後的行為
const handleBooking = () => {
  // 導航到下一個頁面，請確保你的 router/index.js 裡有對應的 path
  // 例如： { path: '/booking', component: BookingView }
  router.push("/booking");
};

// 1. 匯入你的按鈕元件
import MiniButton from "@/components/Common/Button/MiniButton.vue";
</script>

<style lang="scss" scoped>
@import "@/assets/scss/variables";

.movie-detail-page {
  background: $vieshow-gradient-dark;
  color: $white;
  min-height: 100vh;
  font-family: $font-family-base;
}

.video-container {
  width: 100%;
  height: 230px;
  background-color: $black;
  iframe {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.movie-info-wrapper {
  font-size: $font-size-sm-mobile;
  line-height: $line-height-relaxed;
  letter-spacing: $letter-spacing-wide;

  .movie-title {
    // font-size: v.$h2-font-size-mobile;
    font-weight: bold;
    letter-spacing: 0.05em;
  }

  .movie-subtitle {
    font-size: v.$font-size-base-mobile;
  }

  // .btn-booking {
  //   font-size: 14px;
  //   padding: $btn-padding-y-sm $btn-padding-x-sm;
  //   border-radius: $border-radius-sm;
  //   background: $vieshow-gradient-primary;
  //   border: none;
  //   &.shadow-primary {
  //     box-shadow: 0 6px 12px -2px rgba(0, 123, 255, 0.85) !important;
  //   }
  // }

  .movie-description {
    font-weight: 500;
  }

  .movie-specs {
    .text-secondary {
      color: $vieshow-secondary !important;
    }
  }

  .movie-notes {
    background-color: transparent !important; // 確保不要改背景顏色
    padding: 0 !important; // 如果背景透明，通常不需要內距，你可以視情況調整

    // 設定「預購粉絲好康」及其內容為 Medium 字重
    .benefit-title,
    .benefit-content {
      font-weight: 500; // 對應 Figma 的 Medium
      color: $white;
    }

    .text-primary {
      color: $vieshow-primary !important;
      font-weight: 500; // 建議標題也統一使用 Medium 視覺較一致
    }
  }
  .notice-section {
    font-size: 14px !important;
    color: $vieshow-secondary;

    ul {
      // 1. 強制恢復點點，並確保它是實心圓點
      list-style-type: disc !important;

      // 2. 這是最關鍵的一行：將點點放在容器內部，這樣 padding 即使是 0 也能看到
      list-style-position: inside !important;

      // 3. 調整縮排，讓第二行文字不會縮到點點下方，對齊更漂亮
      padding-left: 0 !important;
      margin-left: 0 !important;

      li {
        margin-bottom: 8px; // 增加間距，更符合 Figma 的視覺感

        // 確保點點顏色跟文字一致
        &::marker {
          color: $vieshow-secondary;
          font-size: 12px; // 點點可以稍微縮小一點點
        }
      }
    }
  }
}

@media (min-width: map-get($grid-breakpoints, md)) {
  .movie-info-wrapper {
    font-size: $font-size-sm-pc;
  }
  .video-container {
    height: 450px;
  }
}
</style>
