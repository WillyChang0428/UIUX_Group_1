// src/store/movieStore.js
// 電影資料共用 Store（Pinia）
// 所有組件從這裡取資料，不需要各自維護

import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useMovieStore = defineStore("movie", () => {
  // ══════════════════════════════════════════════════════════════
  // 電影清單（靜態假資料，期末專案不串 API）
  // ══════════════════════════════════════════════════════════════
  const movieList = ref([
    {
      id: 1,
      titleZh: "極限返航",
      titleEn: "PROJECT HAIL MARY",
      posterUrl:
        "https://www.unicornpopcorn.com.tw/ForVsWeb/upload/film/film_20260225016.jpg",
      releaseDate: "2026/03/18",
      duration: "156分",
      rating: "保護級",
      language: "英語",
      genre: "科幻、冒險",
      synopsis:
        "一名失去記憶的太空人獨自在太空船上醒來，他必須在距離地球數光年之外的浩瀚宇宙中拼湊出自己的過去，並想辦法解開重重謎團，以拯救地球免於一場滅絕浩劫。",
      trailerUrl: "https://www.youtube.com/watch?v=V3IuR9Qlrj8",
    },
    {
      id: 2,
      titleZh: "你的名字",
      titleEn: "YOUR NAME",
      posterUrl:
        "https://www.unicornpopcorn.com.tw/ForVsWeb/upload/film/film_20240906007.jpg",
      releaseDate: "2016/08/26",
      duration: "106分",
      rating: "普遍級",
      language: "日語",
      genre: "動畫、愛情",
      synopsis:
        "居住在鄉下小鎮的女高中生宮水三葉，與居住在東京的男高中生立花瀧，兩人在睡夢中意外互換身體，進而展開一段奇妙的緣分與跨越時空的青春愛情故事。",
      trailerUrl: "https://www.youtube.com/watch?v=ftWe_pVrtho",
    },
    {
      id: 3,
      titleZh: "奧本海默",
      titleEn: "OPPENHEIMER",
      posterUrl:
        "https://www.unicornpopcorn.com.tw/ForVsWeb/upload/film/film_20230617002.jpg",
      releaseDate: "2023/07/21",
      duration: "180分",
      rating: "輔15級",
      language: "英語",
      genre: "傳記、劇情",
      synopsis:
        "深入探討「原子彈之父」羅伯特·奧本海默在二戰期間領導曼哈頓計劃，成功研發出世界上第一顆原子彈的過程，以及他內心面對毀滅性武器的道德掙扎與隨之而來的政治風暴。",
      trailerUrl: "https://www.youtube.com/watch?v=cnc8mDAB7QI",
    },
    {
      id: 4,
      titleZh: "沙丘：第二部",
      titleEn: "DUNE: PART TWO",
      posterUrl:
        "https://www.unicornpopcorn.com.tw/ForVsWeb/upload/film/film_20240126001.jpg",
      releaseDate: "2024/02/29",
      duration: "166分",
      rating: "輔12級",
      language: "英語",
      genre: "科幻、史詩",
      synopsis:
        "保羅·亞崔迪與荃妮及弗瑞曼人聯手，踏上向摧毀他家族的陰謀者復仇的史詩旅程。他必須在畢生摯愛與已知宇宙命運之間做抉擇，努力阻止唯有他能預見的可怕未來。",
      trailerUrl: "https://www.youtube.com/watch?v=hISAsCoaZFA",
    },
  ]);

  // ══════════════════════════════════════════════════════════════
  // 目前選中的電影 ID
  // ══════════════════════════════════════════════════════════════
  const selectedMovieId = ref(movieList.value[0].id);

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
  const selectedMovie = computed(
    () => movieList.value.find((m) => m.id === selectedMovieId.value) || null,
  );

  // ① MovieCards 用：只取卡片需要的欄位
  const movieCardList = computed(() =>
    movieList.value.map((m) => ({
      id: m.id,
      titleZh: m.titleZh,
      titleEn: m.titleEn,
      posterUrl: m.posterUrl,
      releaseDate: m.releaseDate,
    })),
  );

  // ② SelectedInfoCard 用：選中電影 + 場次資訊合併
  const selectedInfoCard = computed(() => {
    if (!selectedMovie.value) return null;
    return {
      // 電影基本資訊
      titleZh: selectedMovie.value.titleZh,
      titleEn: selectedMovie.value.titleEn,
      posterUrl: selectedMovie.value.posterUrl,
      duration: selectedMovie.value.duration,
      rating: selectedMovie.value.rating,
      language: selectedMovie.value.language,
      genre: selectedMovie.value.genre,
      synopsis: selectedMovie.value.synopsis,
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
  const selectMovie = (movieId) => {
    selectedMovieId.value = movieId;
  };

  // 更新場次（Sessions.vue 選完場次後呼叫）
  const updateSession = (sessionData) => {
    selectedSession.value = { ...selectedSession.value, ...sessionData };
  };

  return {
    // State
    movieList,
    selectedMovieId,
    selectedSession,
    // Computed
    selectedMovie,
    movieCardList,
    selectedInfoCard,
    // Actions
    selectMovie,
    updateSession,
  };
});
