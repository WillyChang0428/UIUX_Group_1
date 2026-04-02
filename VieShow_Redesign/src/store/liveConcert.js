// src/store/movieStore.js
// 電影資料共用 Store（Pinia）
// 所有組件從這裡取資料，不需要各自維護

import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useConcertStore = defineStore("concert", () => {
  // ══════════════════════════════════════════════════════════════
  // 電影清單（靜態假資料，期末專案不串 API）
  // ══════════════════════════════════════════════════════════════
  const concertList = ref([
    {
      id: 1,
      titleZh: "NCT WISH 1st CONCERT TOUR INTO THE WISH : Our WISH ENCORE IN CINEMAS現場直播",
      titleEn: "NCT WISH 1st CONCERT TOUR INTO THE WISH : Our WISH ENCORE IN CINEMAS",
      posterUrl:
        "https://www.unicornpopcorn.com.tw/ForVsWeb/upload/film/film_20260330001.jpg",
      releaseDate: "2026/04/19",
      genre: "Live Concert",
      director: "NCT WISH"
    },
    {
      id: 2,
      titleZh: "BTS WORLD TOUR ‘ARIRANG’ IN JAPAN現場直播",
      titleEn: "BTS WORLD TOUR ‘ARIRANG’ IN JAPAN LIVE VIEWING",
      posterUrl:
        "https://www.unicornpopcorn.com.tw/ForVsWeb/upload/film/film_20260223029.jpg",
      releaseDate: "2026/04/18",
      genre: "Live Concert",
      director: "BTS"
    },
    {
      id: 3,
      titleZh: "SUPER JUNIOR 20th Anniversary TOUR 《SUPER SHOW 10》 SJ-CORE in CINEMAS 現場直播",
      titleEn: "SUPER JUNIOR 20TH ANNIVERSARY TOUR 《SUPER SHOW 10》 SJ-CORE IN CINEMAS",
      posterUrl:
        "https://www.unicornpopcorn.com.tw/ForVsWeb/upload/film/film_20260326001.jpg",
      releaseDate: "2026/04/04",
      genre: "Live Concert",
      director: "SUPER JUNIOR"
    },
    {
      id: 4,
      titleZh: "羽生結弦“REALIVE”an ICE STORY project特別直播",
      titleEn: "YUZURU HANYU “REALIVE” AN ICE STORY PROJECT SPECIAL VIEWING",
      posterUrl:
        "https://www.unicornpopcorn.com.tw/ForVsWeb/upload/film/film_20260401007.jpg",
      releaseDate: "2026/04/14",
      genre: "Live Concert",
      director: "羽生結弦"
    },
    {
      id: 5,
      titleZh: "D5-ENSEMBLE STARS!! DREAM LIVE TOUR 10TH 𝄪ALL STARS!! 現場直播",
      titleEn: "D5-ENSEMBLE STARS!! DREAM LIVE TOUR 10TH 𝄪ALL STARS!! LIVE VIEWING",
      posterUrl:
        "https://www.unicornpopcorn.com.tw/ForVsWeb/upload/film/film_20260324001.jpg",
      releaseDate: "2026/04/24",
      genre: "Live Concert",
      director: "DREAM LIVE"
    },
    {
      id: 6,
      titleZh: "寶塚歌劇　星組東京寳塚劇場公演『戀愛天動説』 － The Wand'rin' Stars－『DYNAMIC NOVA』 現場直播",
      titleEn: "TAKARAZUKA REVUE STAR TROUPE TOKYO TAKARAZUKA THEATER LAST PERFORMANCE “THE WAND’RIN’ STARS” “DYNAMIC NOVA” LIVE VIEWING",
      posterUrl:
        "https://www.unicornpopcorn.com.tw/ForVsWeb/upload/film/film_20260313001.jpg",
      releaseDate: "2026/04/12",
      genre: "Live Concert",
      director: "寶塚歌劇"
    },
  ]);

  // ══════════════════════════════════════════════════════════════
  // 目前選中的電影 ID
  // ══════════════════════════════════════════════════════════════
  const selectedConcertId = ref(concertList.value[0].id);

  // ══════════════════════════════════════════════════════════════
  // 訂票場次資訊（使用者選完場次後會更新）
  // ══════════════════════════════════════════════════════════════
  const selectedSession = ref({
    format: "4DX",
    venue: "台北信義威秀",
    date: "2026年4月28日(二)",
    time: "19:30",
  });

  // ══════════════════════════════════════════════════════════════
  // Computed：各組件直接取用，不需要自己組裝資料
  // ══════════════════════════════════════════════════════════════

  // 目前選中的電影完整資料
  const selectedConcert = computed(
    () => concertList.value.find((c) => c.id === selectedConcertId.value) || null,
  );

  // ① MovieCards 用：只取卡片需要的欄位
  const concertCardList = computed(() =>
    concertList.value.map((c) => ({
      id: c.id,
      titleZh: c.titleZh,
      titleEn: c.titleEn,
      posterUrl: c.posterUrl,
      releaseDate: c.releaseDate,
    })),
  );

  // ② SelectedInfoCard 用：選中電影 + 場次資訊合併
  const selectedInfoCard = computed(() => {
    if (!selectedConcert.value) return null;
    return {
      // 電影基本資訊
      titleZh: selectedConcert.value.titleZh,
      titleEn: selectedConcert.value.titleEn,
      posterUrl: selectedConcert.value.posterUrl,
      releaseDate: selectedConcert.value.releaseDate,
      genre: selectedConcert.value.genre,
      director: selectedConcert.value.director,
      // 場次資訊
      format: selectedSession.value.format,
      venue: selectedSession.value.venue,
      date: selectedSession.value.date,
      time: selectedSession.value.time,
    };
  });

  // ══════════════════════════════════════════════════════════════
  // Actions：組件呼叫這些方法來更新資料
  // ══════════════════════════════════════════════════════════════

  // 選擇電影（MovieCards 點擊時呼叫）
  const selectConcert = (concertId) => {
    selectedConcertId.value = concertId;
  };

  // 更新場次（Sessions.vue 選完場次後呼叫）
  const updateSession = (sessionData) => {
    selectedSession.value = { ...selectedSession.value, ...sessionData };
  };

  return {
    // State
    concertList,
    selectedConcertId,
    selectedSession,
    // Computed
    selectedConcert,
    concertCardList,
    selectedInfoCard,
    // Actions
    selectConcert,
    updateSession,
  };
});
