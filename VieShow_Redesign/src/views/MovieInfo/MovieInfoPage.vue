<template>
    <div class="main-wrapper">
        <div v-if="!currentMovie"
            class="loading-screen text-white d-flex justify-content-center align-items-center vh-100">
            <div class="spinner-border text-primary" role="status"></div>
            <span class="ms-3">載入電影資料中...</span>
        </div>

        <div v-else class="movie-info-page">

            <div class="hero-section">

                <iframe v-if="embedUrl" class="trailer-iframe" :src="embedUrl" title="YouTube video player"
                    frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowfullscreen>
                </iframe>

                <div class="hero-gradient-bottom"></div>

                <div class="hero-tools d-flex gap-3">
                    <div class="tool-item"><i class="fa-regular fa-clock"></i><span>時刻表</span></div>
                    <div class="tool-item"><i class="fa-solid fa-share"></i><span>分享</span></div>
                </div>
            </div>

            <div class="container content-section">

                <div class="header-row d-flex justify-content-between align-items-start mb-4">
                    <div class="title-group">
                        <h1 class="title-zh fw-bold mb-1">{{ currentMovie.titleZh }}</h1>
                        <h2 class="title-en text-secondary mb-3">{{ currentMovie.titleEn }}</h2>

                        <div class="rating-badge fw-bold">
                            <img v-if="getRatingIcon(currentMovie.rating)" :src="getRatingIcon(currentMovie.rating)"
                                :alt="currentMovie.rating" class="rating-icon me-2" />
                        </div>
                    </div>

                    <SecondaryButton class="flex-shrink-0" @click="goToBooking">
                        快速訂票
                    </SecondaryButton>
                </div>

                <div class="synopsis-box mb-4">
                    <p class="lh-relaxed text-white">{{ currentMovie.synopsis }}</p>
                </div>

                <ul class="meta-list list-unstyled mb-5">
                    <li><span class="meta-label">上映日期：</span> <span class="meta-value">{{ currentMovie.releaseDate
                            }}</span>
                    </li>
                    <li><span class="meta-label">導　　演：</span> <span class="meta-value">{{ currentMovie.director
                            }}</span>
                    </li>
                    <li><span class="meta-label">演　　員：</span> <span class="meta-value">{{ currentMovie.cast }}</span>
                    </li>
                    <li><span class="meta-label">類　　型：</span> <span class="meta-value">{{ currentMovie.genre }}</span>
                    </li>
                    <li><span class="meta-label">片　　長：</span> <span class="meta-value">{{ currentMovie.duration
                            }}</span>
                    </li>
                </ul>

                <div class="notice-section text-secondary lh-relaxed">
                    <p>【{{ currentMovie.titleZh }}】IMAX、4DX版本預售情報🎟️公開<br>
                        03/11(三)中午12:00起~開放03/18(三)~03/24(二)IMAX、4DX版本部分場次預售。</p>

                    <p class="mt-4">●預購粉絲好康：<br>
                        03/11(三)-03/17(二)期間預購《{{ currentMovie.titleZh
                        }}》IMAX或4DX版本電影票1張，即可至原購票影城臨櫃領取「美國原裝進口電影布章」1份，數量有限，送完為止。</p>

                    <p class="mt-4">※注意：</p>
                    <ul class="ps-3">
                        <li>預購完成後，無論場次先後，即可憑電影票至購票影城櫃台領取贈品(不得跨影城領取)，數量有限，送完為止，先領先贏。</li>
                        <li>使用威秀影城官方APP訂票者，請至影城服務櫃台，持「原訂票手機」出示APP系統「我的票夾」購票畫面予工作人員確認方可兌換贈品。</li>
                        <li>如有退票，需連同贈品一併辦理退票手續，如贈品毀損恕無法辦理退票。</li>
                        <li>團劃、包廳、免費票種(包含忠誠禮、兌點票)均不適用以上活動。</li>
                        <li>威秀影城/MUVIE CINEMAS保有活動最終解釋權。</li>
                    </ul>
                </div>

            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useMovieStore } from '@/store/movieStore';
import SecondaryButton from '@/components/Common/Button/SecondaryButton.vue';
// 💡 顯式引入分級圖片，確保 Vite 打包時能正確解析路徑
import imgG from '@/assets/images/movie_level/普遍級.png';
import imgP from '@/assets/images/movie_level/保護級.png';
import imgPG12 from '@/assets/images/movie_level/輔12級.png';
import imgPG15 from '@/assets/images/movie_level/輔15級.png';
import imgR from '@/assets/images/movie_level/限制級.png';

const route = useRoute();
const router = useRouter();
const movieStore = useMovieStore();

const currentMovie = computed(() => {
    //   const movieId = Number(route.params.id);
    const movieId = 1;
    return movieStore.movieList.find(m => m.id === movieId);
});

// 💡 將一般 YouTube 網址轉換為 iFrame 專用的 Embed 網址
const embedUrl = computed(() => {
    if (!currentMovie.value || !currentMovie.value.trailerUrl) return '';

    // 擷取 v= 後面的影片 ID (例: https://www.youtube.com/watch?v=V3IuR9Qlrj8 -> V3IuR9Qlrj8)
    const url = currentMovie.value.trailerUrl;
    const videoIdMatch = url.match(/[?&]v=([^&]+)/);

    if (videoIdMatch && videoIdMatch[1]) {
        // 加上 rel=0 參數，避免影片播完後推薦其他頻道的無關影片
        return `https://www.youtube.com/embed/${videoIdMatch[1]}?rel=0`;
    }
    return '';
});

// 💡 建立對應字典
const ratingIconMap = {
    '普遍級': imgG,
    '保護級': imgP,
    '輔12級': imgPG12,
    '輔15級': imgPG15,
    '限制級': imgR
};

// 💡 取得圖片路徑的函數
const getRatingIcon = (rating) => {
    return ratingIconMap[rating] || '';
};

const goToBooking = () => {
    movieStore.selectMovie(currentMovie.value.id);
    router.push({ name: 'fast-booking' });
};
</script>

<style scoped lang="scss">
@import "@/assets/scss/variables";

.movie-info-page {
    background-color: #0F1115;
    min-height: 100vh;
    padding-bottom: var(--gap-4xl);
}

/* ==========================================
   1. 預告片區塊 (Hero Trailer Section)
   ========================================== */
.hero-section {
    position: relative;
    width: 100%;
    height: 55vh;
    min-height: 400px;
    background-color: v.$black; // 預設黑底，避免載入時閃爍

    // 💡 滿版 iFrame 設定
    .trailer-iframe {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 1;
    }

    // 💡 底部漸層遮罩：利用 pointer-events: none 確保滑鼠可以穿透點擊到影片
    .hero-gradient-bottom {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 35%; // 只遮蓋影片下方 35% 的高度
        background: linear-gradient(to bottom, rgba(15, 17, 21, 0) 0%, rgba(15, 17, 21, 1) 100%);
        z-index: 2;
        pointer-events: none;
    }

    // 右上角工具列
    .hero-tools {
        position: absolute;
        top: var(--gap-md);
        right: var(--gap-md);
        z-index: 3; // 確保浮在影片與漸層最上層

        .tool-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            color: v.$white;
            font-size: var(--app-font-size-mini);
            cursor: pointer;
            opacity: 0.8;
            transition: opacity 0.2s ease;
            text-shadow: 0 2px 4px rgba(v.$black, 0.8); // 加上文字陰影，確保在白色影片畫面中也清晰可見

            i {
                font-size: 20px;
                margin-bottom: 4px;
            }

            &:hover {
                opacity: 1;
            }
        }
    }
}

/* ==========================================
   2. 內容區塊 (Content Section)
   ========================================== */
.content-section {
    position: relative;
    z-index: 3;
    margin-top: -20px; // 稍微往上推，與漸層結合

    .title-zh {
        color: v.$white;
        font-size: var(--app-font-size-h2);
        letter-spacing: 2px;
    }

    .title-en {
        font-size: var(--app-font-size-sm);
        letter-spacing: 1px;
        text-transform: uppercase;
    }

    .rating-badge {
        display: inline-block;

        .rating-icon {
            height: var(--app-font-size-h2);
            width: auto;
            object-fit: contain;
        }
    }


    .synopsis-box p {
        font-size: var(--app-font-size-base);
        text-align: justify;
    }

    .meta-list {
        li {
            display: flex;
            margin-bottom: 8px;
            font-size: var(--app-font-size-base);
            color: v.$white;

            .meta-label {
                width: fit-content;
                color: v.$vieshow-secondary;
                flex-shrink: 0;
            }

            .meta-value {
                flex-grow: 1;
            }
        }
    }

    .notice-section {
        font-size: var(--app-font-size-sm);

        ul li {
            list-style-type: disc;
            margin-bottom: 6px;
        }
    }
}
</style>